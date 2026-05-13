"use client";

import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { formatarData } from "@/shared/utils/formatters";

type Documento = {
  id: string; nome: string; tipo: string | null; url: string;
  categoria: string | null; descricao: string | null; criadoEm: string;
};

export default function PortalDocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/me")
      .then(r => r.json())
      .then(me => {
        if (me?.id) return fetch(`/api/v1/clientes/${me.id}`).then(r => r.json());
        return null;
      })
      .then(data => setDocumentos(data?.documentos ?? []))
      .finally(() => setLoading(false));
  }, []);

  const byCategoria = documentos.reduce<Record<string, Documento[]>>((acc, d) => {
    const cat = d.categoria ?? "Outros";
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-[#c9a84c]" />
          Documentos
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{documentos.length} documento{documentos.length !== 1 ? "s" : ""} disponível{documentos.length !== 1 ? "is" : ""}</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : documentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-20 text-center text-gray-400">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum documento disponível</p>
        </div>
      ) : (
        Object.entries(byCategoria).map(([cat, docs]) => (
          <div key={cat} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">{cat}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {docs.map(d => (
                <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition-colors group"
                >
                  <FileText size={16} className="text-gray-400 shrink-0 group-hover:text-[#c9a84c] transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{d.nome}</p>
                    {d.descricao && <p className="text-xs text-gray-400 mt-0.5 truncate">{d.descricao}</p>}
                    <p className="text-[10px] text-gray-300 mt-0.5">{d.tipo ?? ""} · {formatarData(d.criadoEm)}</p>
                  </div>
                  <Download size={14} className="text-gray-300 group-hover:text-[#c9a84c] transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
