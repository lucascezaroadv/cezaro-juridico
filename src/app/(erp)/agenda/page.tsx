"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { formatarData, formatarDataHora } from "@/shared/utils/formatters";
import Link from "next/link";

type Prazo = {
  id: string;
  titulo: string;
  descricao: string | null;
  dataVencimento: string;
  tipo: string;
  status: string;
  processo: { id: string; numero: string; areaJuridica: string } | null;
};

const TIPO_LABELS: Record<string, string> = {
  PROCESSUAL: "Processual",
  CONTRATUAL: "Contratual",
  INTERNO: "Interno",
  ADMINISTRATIVO: "Administrativo",
};

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700 border-amber-100",
  CUMPRIDO: "bg-green-50 text-green-700 border-green-100",
  PERDIDO: "bg-red-50 text-red-700 border-red-100",
  PRORROGADO: "bg-blue-50 text-blue-700 border-blue-100",
};

export default function AgendaPage() {
  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE");
  const [view, setView] = useState<"lista" | "proximos">("proximos");

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFiltro) params.set("status", statusFiltro);
      if (view === "proximos") params.set("upcoming", "30");
      const res = await fetch(`/api/v1/prazos?${params}`);
      const data = await res.json();
      setPrazos(data.prazos ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [statusFiltro, view]);

  useEffect(() => { buscar(); }, [buscar]);

  const hoje = new Date();
  const vencidos = prazos.filter(p => new Date(p.dataVencimento) < hoje && p.status === "PENDENTE");
  const proximos = prazos.filter(p => {
    const d = new Date(p.dataVencimento);
    const diff = Math.ceil((d.getTime() - hoje.getTime()) / 86400000);
    return diff >= 0 && diff <= 7 && p.status === "PENDENTE";
  });

  const getDiasRestantes = (data: string) => {
    const d = new Date(data);
    return Math.ceil((d.getTime() - hoje.getTime()) / 86400000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-[#c9a84c]" />
            Agenda & Prazos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} prazo{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Alert banners */}
      {vencidos.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">{vencidos.length} prazo{vencidos.length !== 1 ? "s" : ""} vencido{vencidos.length !== 1 ? "s" : ""}!</p>
            <p className="text-xs text-red-600 mt-0.5">
              {vencidos.slice(0, 3).map(p => p.titulo).join(", ")}
              {vencidos.length > 3 ? ` e mais ${vencidos.length - 3}...` : ""}
            </p>
          </div>
        </div>
      )}

      {proximos.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-700">{proximos.length} prazo{proximos.length !== 1 ? "s" : ""} nos próximos 7 dias</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {proximos.slice(0, 3).map(p => `${p.titulo} (${getDiasRestantes(p.dataVencimento)}d)`).join(", ")}
              {proximos.length > 3 ? ` e mais ${proximos.length - 3}...` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: "PENDENTE", label: "Pendentes" },
            { value: "CUMPRIDO", label: "Cumpridos" },
            { value: "", label: "Todos" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFiltro(opt.value)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                statusFiltro === opt.value ? "bg-[#060d1a] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex rounded-lg border border-gray-200 overflow-hidden ml-auto">
          {(["proximos", "lista"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                view === v ? "bg-[#060d1a] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {v === "proximos" ? "Próximos 30 dias" : "Todos"}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de prazos */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
              <div className="h-2.5 w-3/4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : prazos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
          <Calendar size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum prazo encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {prazos.map((prazo) => {
            const dias = getDiasRestantes(prazo.dataVencimento);
            const vencido = dias < 0 && prazo.status === "PENDENTE";
            const urgente = dias >= 0 && dias <= 3 && prazo.status === "PENDENTE";

            return (
              <div
                key={prazo.id}
                className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-all hover:shadow-sm ${
                  vencido ? "border-red-200 bg-red-50/30" :
                  urgente ? "border-orange-200 bg-orange-50/30" :
                  "border-gray-100"
                }`}
              >
                {/* Data destacada */}
                <div className={`text-center rounded-xl p-2.5 min-w-[52px] border ${
                  vencido ? "bg-red-100 border-red-200" :
                  urgente ? "bg-orange-100 border-orange-200" :
                  "bg-gray-50 border-gray-100"
                }`}>
                  <p className={`text-xs font-bold ${vencido ? "text-red-700" : urgente ? "text-orange-700" : "text-gray-600"}`}>
                    {new Date(prazo.dataVencimento).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")}
                  </p>
                  {prazo.status === "PENDENTE" && (
                    <p className={`text-[9px] font-bold mt-0.5 ${vencido ? "text-red-600" : urgente ? "text-orange-600" : "text-gray-400"}`}>
                      {vencido ? `${Math.abs(dias)}d atrás` : dias === 0 ? "hoje" : `${dias}d`}
                    </p>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{prazo.titulo}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${STATUS_COLORS[prazo.status] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}>
                      {prazo.status}
                    </span>
                  </div>

                  {prazo.descricao && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{prazo.descricao}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded font-medium text-gray-600">{TIPO_LABELS[prazo.tipo] ?? prazo.tipo}</span>
                    {prazo.processo && (
                      <Link href={`/processos/${prazo.processo.id}`} className="font-mono hover:text-[#c9a84c] transition-colors">
                        {prazo.processo.numero}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
