"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Search, RefreshCw, ExternalLink, Plus } from "lucide-react";
import { formatarData } from "@/shared/utils/formatters";
import Link from "next/link";

type Documento = {
  id: string; nome: string; tipo: string | null; url: string;
  categoria: string | null; descricao: string | null; mimeType: string | null;
  tamanho: number | null; criadoEm: string;
  processo: { id: string; numero: string } | null;
  cliente: { id: string; nome: string } | null;
};

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/v1/documentos?${params}`);
      const data = await res.json();
      setDocumentos(data.documentos ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => { buscar(); }, [buscar]);

  const formatTamanho = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText size={20} className="text-[#c9a84c]" />
            Gestão Documental
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} documento{total !== 1 ? "s" : ""}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} />
          Enviar Documento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Buscar por nome, tipo ou categoria..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : documentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum documento encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {documentos.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors ${i > 0 ? "border-t border-gray-50" : ""}`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <FileText size={14} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{d.nome}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                  {d.categoria && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">{d.categoria}</span>}
                  {d.cliente && <Link href={`/clientes/${d.cliente.id}`} className="hover:text-[#c9a84c]">{d.cliente.nome}</Link>}
                  {d.processo && <Link href={`/processos/${d.processo.id}`} className="font-mono hover:text-[#c9a84c]">{d.processo.numero}</Link>}
                  <span>{formatarData(d.criadoEm)}</span>
                  {d.tamanho && <span className="text-gray-300">{formatTamanho(d.tamanho)}</span>}
                </div>
              </div>
              <a href={d.url} target="_blank" rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-[#c9a84c] hover:bg-gray-100 rounded-lg transition-colors"
                title="Abrir documento"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Página {page} de {pages}</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white disabled:opacity-30 border border-gray-200 text-sm font-bold">←</button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white disabled:opacity-30 border border-gray-200 text-sm font-bold">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
