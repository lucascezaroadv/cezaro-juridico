"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, MessageSquare, FileText, ArrowRight, CheckCircle, Clock } from "lucide-react";

type Me = {
  nome: string;
  email: string | null;
  _count: { processos: number; mensagens: number; documentos: number };
};

type Processo = {
  id: string;
  numero: string;
  areaJuridica: string;
  status: string;
  tribunal: string | null;
  updatedAt: string;
};

const AREA_LABELS: Record<string, string> = {
  TRABALHISTA: "Trabalhista", EMPRESARIAL: "Empresarial", EXECUCAO_CREDITO: "Execução de Crédito",
  LGPD: "LGPD", CONSULTORIA: "Consultoria", CONTRATOS: "Contratos", COMPLIANCE: "Compliance",
  CIVIL: "Civil", TRIBUTARIO: "Tributário", PREVIDENCIARIO: "Previdenciário", OUTRO: "Outro",
};

export default function PortalDashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/portal/me").then(r => r.json()),
      fetch("/api/portal/processos").then(r => r.json()),
    ]).then(([meData, pData]) => {
      setMe(meData);
      setProcessos((pData.processos ?? []).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{saudacao}, {me?.nome?.split(" ")[0]}!</h1>
        <p className="text-sm text-gray-500 mt-0.5">Acompanhe seus processos e comunicações com o escritório</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/portal/processos" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#c9a84c]/30 hover:shadow-sm transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <FolderOpen size={18} className="text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">Processos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{me?._count.processos ?? 0}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">em andamento</p>
        </Link>

        <Link href="/portal/mensagens" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#c9a84c]/30 hover:shadow-sm transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              (me?._count.mensagens ?? 0) > 0 ? "bg-amber-50 group-hover:bg-amber-100" : "bg-gray-50 group-hover:bg-gray-100"
            }`}>
              <MessageSquare size={18} className={(me?._count.mensagens ?? 0) > 0 ? "text-amber-600" : "text-gray-500"} />
            </div>
            <span className="text-xs font-semibold text-gray-500">Mensagens</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{me?._count.mensagens ?? 0}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{(me?._count.mensagens ?? 0) > 0 ? "não lidas" : "sem novas"}</p>
        </Link>

        <Link href="/portal/documentos" className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#c9a84c]/30 hover:shadow-sm transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <FileText size={18} className="text-green-600" />
            </div>
            <span className="text-xs font-semibold text-gray-500">Documentos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{me?._count.documentos ?? 0}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">disponíveis</p>
        </Link>
      </div>

      {/* Processos recentes */}
      {processos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800">Processos Recentes</h2>
            <Link href="/portal/processos" className="text-xs text-[#c9a84c] hover:underline flex items-center gap-0.5">
              Ver todos <ArrowRight size={11} />
            </Link>
          </div>
          {processos.map((p, i) => (
            <Link
              key={p.id}
              href={`/portal/processos/${p.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition-colors ${i > 0 ? "border-t border-gray-50" : ""}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === "ATIVO" ? "bg-green-400" : p.status === "ARQUIVADO" ? "bg-gray-300" : "bg-amber-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-semibold text-gray-700">{p.numero}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{AREA_LABELS[p.areaJuridica] ?? p.areaJuridica}{p.tribunal ? ` · ${p.tribunal}` : ""}</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                {p.status === "ATIVO" ? <CheckCircle size={11} className="text-green-500" /> : <Clock size={11} />}
                {p.status}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="bg-[#060d1a] rounded-xl p-5 flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquare size={16} className="text-[#c9a84c]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">Precisa de informações?</p>
          <p className="text-xs text-white/50 leading-relaxed">
            Use a aba Mensagens para se comunicar diretamente com nossa equipe. Respondemos em até 24h úteis.
          </p>
          <Link href="/portal/mensagens" className="inline-flex items-center gap-1 text-xs text-[#c9a84c] mt-2 hover:underline">
            Enviar mensagem <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
