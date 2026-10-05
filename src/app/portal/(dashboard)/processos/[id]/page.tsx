"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, AlertTriangle, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { formatarData } from "@/shared/utils/formatters";

type Intimacao = {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  prazo: string | null;
  urgencia: string;
  status: string;
  fonte: string | null;
  sistemaOrigem: string | null;
};

type Processo = {
  id: string; numero: string; areaJuridica: string; status: string; fase: string;
  tribunal: string | null; vara: string | null; comarca: string | null; assunto: string | null;
  observacoes: string | null;
  movimentacoes: { id: string; descricao: string; data: string; tipo: string | null }[];
  documentos: { id: string; nome: string; tipo: string | null; url: string; criadoEm: string }[];
  prazos: { id: string; titulo: string; dataVencimento: string }[];
  intimacoes: Intimacao[];
};

const URGENCIA_COLORS: Record<string, string> = {
  CRITICA: "bg-red-100 text-red-700 border-red-200",
  ALTA:    "bg-orange-100 text-orange-700 border-orange-200",
  NORMAL:  "bg-blue-50 text-blue-700 border-blue-200",
  BAIXA:   "bg-gray-100 text-gray-500 border-gray-200",
};

const URGENCIA_LABELS: Record<string, string> = {
  CRITICA: "Crítica", ALTA: "Alta", NORMAL: "Normal", BAIXA: "Baixa",
};

function IntimacaoCard({ item }: { item: Intimacao }) {
  const [expandido, setExpandido] = useState(false);
  const hoje = new Date();
  const diasPrazo = item.prazo
    ? Math.ceil((new Date(item.prazo).getTime() - hoje.getTime()) / 86400000)
    : null;

  return (
    <div className={`border rounded-xl overflow-hidden ${
      item.urgencia === "CRITICA" ? "border-red-200" :
      item.urgencia === "ALTA"    ? "border-orange-200" :
      "border-gray-100"
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">{item.titulo}</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${
            URGENCIA_COLORS[item.urgencia] ?? URGENCIA_COLORS.NORMAL
          }`}>
            {URGENCIA_LABELS[item.urgencia] ?? item.urgencia}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 mb-3">
          <span>{formatarData(item.dataPublicacao)}</span>
          {item.sistemaOrigem && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{item.sistemaOrigem}</span>}
          {diasPrazo !== null && (
            <span className={`font-semibold ${
              diasPrazo < 0 ? "text-red-600" :
              diasPrazo <= 3 ? "text-orange-600" :
              "text-amber-600"
            }`}>
              Prazo: {diasPrazo < 0 ? `vencido há ${Math.abs(diasPrazo)}d` : diasPrazo === 0 ? "hoje" : `${diasPrazo}d restantes`}
              {" · "}{formatarData(item.prazo!)}
            </span>
          )}
        </div>

        <button
          onClick={() => setExpandido(e => !e)}
          className="flex items-center gap-1 text-[11px] text-[#c9a84c] font-medium hover:underline"
        >
          {expandido ? <><ChevronUp size={12} /> Ocultar publicação</> : <><ChevronDown size={12} /> Ver publicação completa</>}
        </button>
      </div>

      {expandido && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{item.conteudo.slice(0, 2000)}</p>
          {item.conteudo.length > 2000 && (
            <p className="text-[10px] text-gray-400 mt-2">[Texto truncado — {item.conteudo.length} caracteres no total]</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PortalProcessoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [processo, setProcesso] = useState<Processo | null>(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"movimentacoes" | "publicacoes" | "documentos">("movimentacoes");

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
  const intimacoesCriticas = processo.intimacoes.filter(i => i.urgencia === "CRITICA" || i.urgencia === "ALTA");

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

      {/* Info do processo */}
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

      {/* Resumo do processo (observações do advogado) */}
      {processo.observacoes && (
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-5">
          <p className="text-xs font-bold text-[#8a7035] mb-2 uppercase tracking-wide">Resumo do Andamento</p>
          <p className="text-sm text-gray-700 leading-relaxed">{processo.observacoes}</p>
        </div>
      )}

      {/* Alerta de publicações urgentes */}
      {intimacoesCriticas.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-700 mb-1">
              {intimacoesCriticas.length} publicaç{intimacoesCriticas.length !== 1 ? "ões" : "ão"} com prazo urgente
            </p>
            <p className="text-[11px] text-red-600">
              {intimacoesCriticas.slice(0, 2).map(i => i.titulo).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Prazos pendentes */}
      {processo.prazos.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-amber-600" />
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
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {([
            { key: "movimentacoes", label: `Movimentações (${processo.movimentacoes.length})` },
            { key: "publicacoes",   label: `Publicações (${processo.intimacoes.length})` },
            { key: "documentos",    label: `Documentos (${processo.documentos.length})` },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                tab === t.key
                  ? "border-[#c9a84c] text-[#c9a84c]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Movimentações */}
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

          {/* Publicações */}
          {tab === "publicacoes" && (
            processo.intimacoes.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={28} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm text-gray-400">Nenhuma publicação recebida para este processo</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processo.intimacoes.map(item => (
                  <IntimacaoCard key={item.id} item={item} />
                ))}
              </div>
            )
          )}

          {/* Documentos */}
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
