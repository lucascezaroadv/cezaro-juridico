"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";

type Processo = {
  id: string;
  numero: string;
  areaJuridica: string;
  status: string;
  fase: string;
  tribunal: string | null;
  assunto: string | null;
  atualizadoEm: string;
  _count: { movimentacoes: number; documentos: number };
};

const AREA_LABELS: Record<string, string> = {
  TRABALHISTA: "Trabalhista", EMPRESARIAL: "Empresarial", EXECUCAO_CREDITO: "Execução de Crédito",
  LGPD: "LGPD", CONSULTORIA: "Consultoria", CONTRATOS: "Contratos", COMPLIANCE: "Compliance",
  CIVIL: "Civil", TRIBUTARIO: "Tributário", PREVIDENCIARIO: "Previdenciário", OUTRO: "Outro",
};

const STATUS_COLORS: Record<string, string> = {
  ATIVO: "bg-green-100 text-green-700",
  SUSPENSO: "bg-amber-100 text-amber-700",
  ARQUIVADO: "bg-gray-100 text-gray-500",
  ENCERRADO: "bg-blue-100 text-blue-700",
  ACORDO: "bg-purple-100 text-purple-700",
};

export default function PortalProcessosPage() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/processos")
      .then(r => r.json())
      .then(d => setProcessos(d.processos ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FolderOpen size={20} className="text-[#c9a84c]" />
          Meus Processos
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{processos.length} processo{processos.length !== 1 ? "s" : ""} vinculado{processos.length !== 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded mb-3" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : processos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-20 text-center text-gray-400">
          <FolderOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum processo encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {processos.map(p => (
            <Link
              key={p.id}
              href={`/portal/processos/${p.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-[#c9a84c]/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-mono font-bold text-gray-800 group-hover:text-[#c9a84c] transition-colors">{p.numero}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{AREA_LABELS[p.areaJuridica] ?? p.areaJuridica}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {p.status}
                  </span>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-[#c9a84c] transition-colors" />
                </div>
              </div>

              {p.assunto && <p className="text-xs text-gray-500 mb-3 leading-relaxed">{p.assunto}</p>}

              <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                {p.tribunal && <span>{p.tribunal}</span>}
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">{p.fase?.replace(/_/g, " ")}</span>
                <span className="ml-auto">{p._count.movimentacoes} movimentaç{p._count.movimentacoes !== 1 ? "ões" : "ão"}</span>
                {p._count.documentos > 0 && <span>{p._count.documentos} doc{p._count.documentos !== 1 ? "s" : ""}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
