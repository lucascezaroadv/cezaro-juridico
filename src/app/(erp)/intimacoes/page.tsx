"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, AlertTriangle, RefreshCw, Eye, Plus } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatarDataHora, formatarData } from "@/shared/utils/formatters";
import Link from "next/link";

type Intimacao = {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  prazo: string | null;
  urgencia: string;
  status: string;
  fonte: string | null;
  resumoIA: string | null;
  sugestaoIA: string | null;
  processo: { id: string; numero: string; areaJuridica: string } | null;
  _count: { tarefas: number };
};

const urgenciaOrder = ["CRITICA", "ALTA", "NORMAL", "BAIXA"];

export default function IntimacoesPage() {
  const [intimacoes, setIntimacoes] = useState<Intimacao[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE");
  const [urgenciaFiltro, setUrgenciaFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [selecionada, setSelecionada] = useState<Intimacao | null>(null);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFiltro) params.set("status", statusFiltro);
      if (urgenciaFiltro) params.set("urgencia", urgenciaFiltro);
      const res = await fetch(`/api/v1/intimacoes?${params}`);
      const data = await res.json();
      setIntimacoes(data.intimacoes ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [statusFiltro, urgenciaFiltro]);

  useEffect(() => { buscar(); }, [buscar]);

  const marcarLida = async (id: string) => {
    await fetch(`/api/v1/intimacoes/${id}/lida`, { method: "PATCH" });
    buscar();
  };

  const [gerando, setGerando] = useState(false);

  const gerarAnalise = async (id: string) => {
    setGerando(true);
    try {
      const res = await fetch("/api/ia/resumir-intimacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intimacaoId: id }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Erro ao gerar análise"); return; }
      // Refresh and re-select with new data
      await buscar();
      setSelecionada(prev => prev ? { ...prev, resumoIA: data.resumoIA, sugestaoIA: data.sugestaoIA } : prev);
    } finally {
      setGerando(false);
    }
  };

  const criticas = intimacoes.filter(i => i.urgencia === "CRITICA").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={20} className="text-[#c9a84c]" />
            Central de Intimações
            {criticas > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                <AlertTriangle size={11} />
                {criticas} crítica{criticas !== 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} intimaç{total !== 1 ? "ões" : "ão"}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} />
          Nova Intimação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[
            { value: "PENDENTE", label: "Pendentes" },
            { value: "LIDA", label: "Lidas" },
            { value: "PROCESSADA", label: "Processadas" },
            { value: "", label: "Todas" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFiltro(opt.value)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                statusFiltro === opt.value
                  ? "bg-[#060d1a] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={urgenciaFiltro}
          onChange={(e) => setUrgenciaFiltro(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#c9a84c] text-gray-700"
        >
          <option value="">Toda urgência</option>
          <option value="CRITICA">Crítica</option>
          <option value="ALTA">Alta</option>
          <option value="NORMAL">Normal</option>
          <option value="BAIXA">Baixa</option>
        </select>

        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Lista */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-3 w-3/4 bg-gray-200 rounded mb-3" />
                <div className="h-2.5 w-full bg-gray-100 rounded mb-2" />
                <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
              </div>
            ))
          ) : intimacoes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma intimação encontrada</p>
            </div>
          ) : (
            intimacoes.map((int) => {
              const prazoVence = int.prazo ? new Date(int.prazo) : null;
              const hoje = new Date();
              const diasPrazo = prazoVence ? Math.ceil((prazoVence.getTime() - hoje.getTime()) / 86400000) : null;

              return (
                <button
                  key={int.id}
                  onClick={() => setSelecionada(int)}
                  className={`w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${
                    selecionada?.id === int.id
                      ? "border-[#c9a84c]/50 bg-[#c9a84c]/5"
                      : int.urgencia === "CRITICA"
                      ? "border-red-200 hover:border-red-300"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={`text-xs font-semibold leading-snug flex-1 ${
                      int.status === "PENDENTE" ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {int.titulo}
                    </p>
                    <StatusBadge status={int.urgencia} />
                  </div>

                  {int.processo && (
                    <p className="text-xs font-mono text-gray-400 mb-2 truncate">{int.processo.numero}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{formatarDataHora(int.dataPublicacao)}</span>
                    {diasPrazo !== null && (
                      <span className={`text-[10px] font-bold ${
                        diasPrazo <= 0 ? "text-red-600" : diasPrazo <= 3 ? "text-orange-600" : "text-gray-500"
                      }`}>
                        {diasPrazo <= 0 ? "Prazo vencido" : `Prazo: ${diasPrazo}d`}
                      </span>
                    )}
                  </div>

                  {int.resumoIA && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-[10px] text-blue-700 leading-relaxed">
                      <span className="font-bold">IA: </span>{int.resumoIA}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Detalhe */}
        <div className="lg:col-span-3">
          {!selecionada ? (
            <div className="bg-white rounded-xl border border-gray-100 h-full min-h-64 flex items-center justify-center text-center p-10">
              <div>
                <Bell size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">Selecione uma intimação para visualizar os detalhes</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Header do detalhe */}
              <div className={`p-5 border-b ${
                selecionada.urgencia === "CRITICA" ? "bg-red-50 border-red-100" :
                selecionada.urgencia === "ALTA" ? "bg-orange-50 border-orange-100" : "border-gray-100"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2">{selecionada.titulo}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={selecionada.urgencia} />
                      <StatusBadge status={selecionada.status} />
                      <span className="text-xs text-gray-400">{formatarDataHora(selecionada.dataPublicacao)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selecionada.status === "PENDENTE" && (
                      <button
                        onClick={() => marcarLida(selecionada.id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Marcar como lida"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {selecionada.processo && (
                  <Link
                    href={`/processos/${selecionada.processo.id}`}
                    className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-[#c9a84c]/50 transition-colors"
                  >
                    Processo: {selecionada.processo.numero}
                  </Link>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-4">
                {selecionada.prazo && (
                  <div className={`p-3 rounded-lg border text-sm font-medium ${
                    new Date(selecionada.prazo) <= new Date()
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    ⏰ Prazo: {formatarData(selecionada.prazo)}
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Conteúdo Original</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                    {selecionada.conteudo}
                  </p>
                </div>

                {/* Análise IA */}
                <div className="bg-[#060d1a] rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                    <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-wide">Análise da IA Jurídica</span>
                  </div>

                  {selecionada.resumoIA ? (
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide mb-1.5">Resumo</p>
                      <p className="text-sm text-white/80 leading-relaxed">{selecionada.resumoIA}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">Resumo ainda não gerado.</p>
                  )}

                  {selecionada.sugestaoIA ? (
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide mb-1.5">Providências Sugeridas</p>
                      <p className="text-sm text-white/80 leading-relaxed">{selecionada.sugestaoIA}</p>
                    </div>
                  ) : null}

                  <button
                    onClick={() => gerarAnalise(selecionada.id)}
                    disabled={gerando}
                    className="w-full py-2 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] text-xs font-bold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {gerando && <span className="w-3 h-3 border-2 border-[#060d1a]/30 border-t-[#060d1a] rounded-full animate-spin" />}
                    {gerando ? "Analisando..." : "Gerar Análise com IA"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
