"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, AlertTriangle } from "lucide-react";
import { formatarData, formatarDataHora } from "@/shared/utils/formatters";

type Processo = {
  id: string; numero: string; areaJuridica: string; status: string; fase: string;
  tribunal: string | null; vara: string | null; comarca: string | null; assunto: string | null;
  movimentacoes: { id: string; descricao: string; data: string; tipo: string | null }[];
  documentos: { id: string; nome: string; tipo: string | null; url: string; criadoEm: string }[];
  prazos: { id: string; titulo: string; dataVencimento: string }[];
};

export default function PortalProcessoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"movimentacoes" | "documentos">("movimentacoes");

  useEffect(() => {
    fetch(`/api/portal/processos/${id}`)
      .then(r => r.json())
      .then(setProcesso)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-5 w-48 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-100 rounded-xl" />
    </div>
  );

  if (!processo) return (
    <div className="text-center py-20 text-gray-400">
      <p>Processo não encontrado</p>
      <Link href="/portal/processos" className="text-[#c9a84c] text-sm mt-2 inline-block">← Voltar</Link>
    </div>
  );

  const hoje = new Date();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/portal/processos" className="p-2 text-gray-500 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-xs text-gray-400">Processos</p>
          <h1 className="text-base font-bold text-gray-900 font-mono">{processo.numero}</h1>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${processo.status === "ATIVO" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            {processo.status}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {processo.fase?.replace(/_/g, " ")}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600">
          {processo.tribunal && <div><span className="text-gray-400 block mb-0.5">Tribunal</span>{processo.tribunal}</div>}
          {processo.vara && <div><span className="text-gray-400 block mb-0.5">Vara</span>{processo.vara}</div>}
          {processo.comarca && <div><span className="text-gray-400 block mb-0.5">Comarca</span>{processo.comarca}</div>}
          {processo.assunto && <div className="sm:col-span-2"><span className="text-gray-400 block mb-0.5">Assunto</span>{processo.assunto}</div>}
        </div>
      </div>

      {/* Prazos próximos */}
      {processo.prazos.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-700">Prazos Pendentes</span>
          </div>
          <div className="space-y-2">
            {processo.prazos.map(p => {
              const dias = Math.ceil((new Date(p.dataVencimento).getTime() - hoje.getTime()) / 86400000);
              return (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span className="text-amber-800">{p.titulo}</span>
                  <span className={`font-bold ${dias <= 0 ? "text-red-600" : dias <= 3 ? "text-orange-600" : "text-amber-700"}`}>
                    {dias <= 0 ? "Vencido" : `${dias}d`} · {formatarData(p.dataVencimento)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(["movimentacoes", "documentos"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
                tab === t ? "border-[#c9a84c] text-[#c9a84c]" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "movimentacoes" ? `Movimentações (${processo.movimentacoes.length})` : `Documentos (${processo.documentos.length})`}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "movimentacoes" && (
            processo.movimentacoes.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Sem movimentações registradas</p>
            ) : (
              <div className="space-y-0">
                {processo.movimentacoes.map((m, i) => (
                  <div key={m.id} className="flex gap-4 pb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c9a84c] shrink-0 mt-1" />
                      {i < processo.movimentacoes.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <p className="text-xs text-gray-400 mb-0.5">{formatarData(m.data)}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{m.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "documentos" && (
            processo.documentos.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Sem documentos disponíveis</p>
            ) : (
              <div className="space-y-2">
                {processo.documentos.map(d => (
                  <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-[#c9a84c]/30 hover:bg-[#c9a84c]/5 transition-all group"
                  >
                    <FileText size={16} className="text-gray-400 shrink-0 group-hover:text-[#c9a84c]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{d.nome}</p>
                      <p className="text-[10px] text-gray-400">{d.tipo ?? "Documento"} · {formatarData(d.criadoEm)}</p>
                    </div>
                    <span className="text-[10px] text-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity">Baixar</span>
                  </a>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
