"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, RefreshCw, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatarData } from "@/shared/utils/formatters";
import Link from "next/link";

type Diligencia = {
  id: string;
  tipo: string;
  resultado: string;
  observacoes: string | null;
  data: string;
  processo: { id: string; numero: string; areaJuridica: string };
};

type Stat = { resultado: string; _count: { _all: number } };

const TIPO_LABELS: Record<string, string> = {
  SISBAJUD: "SISBAJUD", RENAJUD: "RENAJUD", INFOJUD: "INFOJUD",
  PENHORA: "Penhora", LEILAO: "Leilão", CITACAO: "Citação",
  INTIMACAO_EXECUTADO: "Intim. Executado", OUTROS: "Outros",
};

const RESULTADO_COLORS: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700 border-amber-100",
  POSITIVO: "bg-green-50 text-green-700 border-green-100",
  NEGATIVO: "bg-red-50 text-red-700 border-red-100",
  PARCIAL: "bg-blue-50 text-blue-700 border-blue-100",
};

export default function ExecucaoPage() {
  const [diligencias, setDiligencias] = useState<Diligencia[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resultadoFiltro, setResultadoFiltro] = useState("");

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (resultadoFiltro) params.set("resultado", resultadoFiltro);
      const res = await fetch(`/api/v1/diligencias?${params}`);
      const data = await res.json();
      setDiligencias(data.diligencias ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? []);
    } finally {
      setLoading(false);
    }
  }, [resultadoFiltro]);

  useEffect(() => { buscar(); }, [buscar]);

  const pendentes = stats.find(s => s.resultado === "PENDENTE")?._count._all ?? 0;
  const positivos = stats.find(s => s.resultado === "POSITIVO")?._count._all ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-[#c9a84c]" />
            Execução e Recuperação
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} diligência{total !== 1 ? "s" : ""} · {pendentes} pendentes · {positivos} positivos</p>
        </div>
        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats rápidos */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["PENDENTE", "POSITIVO", "NEGATIVO", "PARCIAL"].map(res => {
            const count = stats.find(s => s.resultado === res)?._count._all ?? 0;
            return (
              <div key={res} className={`rounded-xl border p-4 ${RESULTADO_COLORS[res] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide mt-0.5">{res}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
          {[
            { value: "", label: "Todas" },
            { value: "PENDENTE", label: "Pendentes" },
            { value: "POSITIVO", label: "Positivos" },
            { value: "NEGATIVO", label: "Negativos" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setResultadoFiltro(opt.value)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                resultadoFiltro === opt.value ? "bg-[#060d1a] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : diligencias.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
          <Zap size={28} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma diligência encontrada</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {diligencias.map((d, i) => (
            <div key={d.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${i > 0 ? "border-t border-gray-50" : ""}`}>
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${RESULTADO_COLORS[d.resultado] ?? ""}`}>
                  {d.resultado}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-800">{TIPO_LABELS[d.tipo] ?? d.tipo}</span>
                  <span className="text-[10px] text-gray-400">{formatarData(d.data)}</span>
                </div>
                {d.observacoes && <p className="text-xs text-gray-500 leading-relaxed">{d.observacoes}</p>}
                <Link
                  href={`/processos/${d.processo.id}`}
                  className="inline-flex items-center gap-1 text-[10px] text-[#c9a84c] hover:underline mt-1"
                >
                  <span className="font-mono">{d.processo.numero}</span>
                  <ChevronRight size={9} />
                </Link>
              </div>
              <StatusBadge status={d.processo.areaJuridica} />
            </div>
          ))}
        </div>
      )}

      {/* IA suggestion */}
      <div className="bg-[#060d1a] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
          <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-wide">Módulo IA — Estratégia de Execução</span>
        </div>
        <p className="text-xs text-white/50 mb-4">
          A IA jurídica pode analisar os processos de execução e sugerir as diligências mais promissoras com base no perfil do devedor e histórico processual.
        </p>
        <button className="px-4 py-2 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] text-xs font-bold rounded-lg transition-colors">
          Gerar Estratégia com IA
        </button>
      </div>
    </div>
  );
}
