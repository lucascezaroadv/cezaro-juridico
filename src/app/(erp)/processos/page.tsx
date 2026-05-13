"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Plus, Filter, FolderOpen,
  ChevronLeft, ChevronRight, RefreshCw
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AREA_JURIDICA_LABELS, FASE_LABELS, type AreaJuridica, type FaseProcessual, type StatusProcesso } from "@/shared/types";
import { formatarData, formatarMoeda } from "@/shared/utils/formatters";

type Processo = {
  id: string;
  numero: string;
  areaJuridica: AreaJuridica;
  fase: FaseProcessual;
  status: StatusProcesso;
  assunto: string | null;
  valorCausa: number | null;
  dataDistribuicao: string | null;
  atualizadoEm: string;
  cliente: { id: string; nome: string };
  advogado: { id: string; nome: string } | null;
  _count: { tarefas: number; prazos: number };
};

export default function ProcessosPage() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set("q", q);
      if (statusFiltro) params.set("status", statusFiltro);
      if (areaFiltro) params.set("area", areaFiltro);
      const res = await fetch(`/api/v1/processos?${params}`);
      const data = await res.json();
      setProcessos(data.processos ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, q, statusFiltro, areaFiltro]);

  useEffect(() => { buscar(); }, [buscar]);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen size={20} className="text-[#c9a84c]" />
            Processos
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} processo{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/processos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo Processo
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Buscar por número, cliente ou assunto..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <select
          value={statusFiltro}
          onChange={(e) => { setStatusFiltro(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#c9a84c] text-gray-700"
        >
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativo</option>
          <option value="SUSPENSO">Suspenso</option>
          <option value="ENCERRADO">Encerrado</option>
          <option value="ARQUIVADO">Arquivado</option>
        </select>

        <select
          value={areaFiltro}
          onChange={(e) => { setAreaFiltro(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#c9a84c] text-gray-700"
        >
          <option value="">Todas as áreas</option>
          {Object.entries(AREA_JURIDICA_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <button
          onClick={buscar}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Atualizar"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Processo</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Área</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fase</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valor da Causa</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Advogado</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : processos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-400">
                    <FolderOpen size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Nenhum processo encontrado</p>
                    <p className="text-xs mt-1">Cadastre o primeiro processo clicando em &ldquo;Novo Processo&rdquo;</p>
                  </td>
                </tr>
              ) : (
                processos.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                    onClick={() => window.location.href = `/processos/${p.id}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-xs font-semibold text-gray-800 group-hover:text-[#060d1a]">
                        {p.numero}
                      </div>
                      {p.assunto && (
                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-48">{p.assunto}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/clientes/${p.cliente.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-gray-800 hover:text-[#c9a84c] transition-colors"
                      >
                        {p.cliente.nome}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-600">
                        {AREA_JURIDICA_LABELS[p.areaJuridica]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.fase} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {p.valorCausa ? formatarMoeda(p.valorCausa) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {p.advogado?.nome ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {formatarData(p.atualizadoEm)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
            <span className="text-xs text-gray-500">
              Página {page} de {pages} — {total} registros
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
