"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, Users, Phone, Mail, FolderOpen, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { formatarCPF, formatarCNPJ, formatarTelefone } from "@/shared/utils/formatters";

type Cliente = {
  id: string;
  tipo: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  nome: string;
  cpfCnpj: string | null;
  email: string | null;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  portalAtivo: boolean;
  _count: { processos: number };
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/v1/clientes?${params}`);
      const data = await res.json();
      setClientes(data.clientes ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, q]);

  useEffect(() => { buscar(); }, [buscar]);

  const formatDoc = (c: Cliente) => {
    if (!c.cpfCnpj) return "—";
    const n = c.cpfCnpj.replace(/\D/g, "");
    return c.tipo === "PESSOA_JURIDICA" ? formatarCNPJ(n) : formatarCPF(n);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={20} className="text-[#c9a84c]" />
            Clientes
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} cliente{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/clientes/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo Cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 w-32 bg-gray-200 rounded" />
                  <div className="h-2.5 w-20 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-gray-100 rounded w-full" />
                <div className="h-2.5 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : clientes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-20 text-center text-gray-400">
          <Users size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Nenhum cliente encontrado</p>
          <Link href="/clientes/novo" className="text-[#c9a84c] text-xs mt-2 inline-block hover:underline">
            Cadastrar primeiro cliente →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientes.map((c) => (
            <Link
              key={c.id}
              href={`/clientes/${c.id}`}
              className="bg-white rounded-xl border border-gray-100 hover:border-[#c9a84c]/30 hover:shadow-sm p-5 transition-all group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors">
                  <span className="text-[#c9a84c] text-sm font-bold">
                    {c.nome.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.nome}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      c.tipo === "PESSOA_JURIDICA" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {c.tipo === "PESSOA_JURIDICA" ? "PJ" : "PF"}
                    </span>
                    {c.portalAtivo && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                        Portal ativo
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                {c.cpfCnpj && <div className="font-mono text-gray-600">{formatDoc(c)}</div>}
                {c.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={11} />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                {c.telefone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={11} />
                    {formatarTelefone(c.telefone)}
                  </div>
                )}
                {c.cidade && <div className="text-gray-400">{c.cidade}{c.estado ? ` — ${c.estado}` : ""}</div>}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-400">
                <FolderOpen size={12} />
                <span>{c._count.processos} processo{c._count.processos !== 1 ? "s" : ""}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Página {page} de {pages}</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white disabled:opacity-30 transition-colors border border-gray-200">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg text-gray-500 hover:bg-white disabled:opacity-30 transition-colors border border-gray-200">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
