"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, User, Mail, Phone, MapPin, FolderOpen,
  FileText, MessageSquare, Edit, Building2, Hash
} from "lucide-react";
import { formatarCPF, formatarCNPJ, formatarTelefone, formatarData, formatarDataHora } from "@/shared/utils/formatters";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Cliente = {
  id: string;
  tipo: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  nome: string;
  cpfCnpj: string | null;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  observacoes: string | null;
  portalAtivo: boolean;
  createdAt: string;
  processos: {
    id: string;
    numero: string;
    areaJuridica: string;
    status: string;
    fase: string;
    tribunal: string | null;
  }[];
  documentos: {
    id: string;
    titulo: string;
    tipo: string;
    createdAt: string;
  }[];
  mensagens: {
    id: string;
    conteudo: string;
    lida: boolean;
    createdAt: string;
    remetente: string;
  }[];
};

const TABS = ["Processos", "Documentos", "Mensagens"] as const;
type Tab = typeof TABS[number];

export default function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Processos");

  useEffect(() => {
    fetch(`/api/v1/clientes/${id}`)
      .then(r => r.json())
      .then(data => setCliente(data))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDoc = () => {
    if (!cliente?.cpfCnpj) return null;
    const n = cliente.cpfCnpj.replace(/\D/g, "");
    return cliente.tipo === "PESSOA_JURIDICA" ? formatarCNPJ(n) : formatarCPF(n);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-3.5 w-32 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20 text-gray-400">
        <User size={40} className="mx-auto mb-3 opacity-30" />
        <p>Cliente não encontrado</p>
        <Link href="/clientes" className="text-[#c9a84c] text-sm mt-2 inline-block">← Voltar</Link>
      </div>
    );
  }

  const initials = cliente.nome.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/clientes" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/clientes" className="hover:text-[#c9a84c]">Clientes</Link>
            <span>/</span>
            <span className="text-gray-600">{cliente.nome}</span>
          </div>
        </div>
        <Link
          href={`/clientes/${id}/editar`}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-white transition-colors"
        >
          <Edit size={13} />
          Editar
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Sidebar de informações */}
        <div className="space-y-4">
          {/* Card principal */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                <span className="text-[#c9a84c] text-lg font-bold">{initials}</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-snug">{cliente.nome}</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    cliente.tipo === "PESSOA_JURIDICA" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {cliente.tipo === "PESSOA_JURIDICA" ? "PJ" : "PF"}
                  </span>
                  {cliente.portalAtivo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">Portal</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {formatDoc() && (
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Hash size={14} className="text-gray-400 shrink-0" />
                  <span className="font-mono text-xs">{formatDoc()}</span>
                </div>
              )}
              {cliente.email && (
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <a href={`mailto:${cliente.email}`} className="text-xs hover:text-[#c9a84c] truncate">{cliente.email}</a>
                </div>
              )}
              {cliente.telefone && (
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  <span className="text-xs">{formatarTelefone(cliente.telefone)}</span>
                </div>
              )}
              {cliente.whatsapp && cliente.whatsapp !== cliente.telefone && (
                <div className="flex items-center gap-2.5 text-gray-600">
                  <MessageSquare size={14} className="text-gray-400 shrink-0" />
                  <span className="text-xs">{formatarTelefone(cliente.whatsapp)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          {(cliente.endereco || cliente.cidade) && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <MapPin size={12} />
                Endereço
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                {cliente.endereco && <p>{cliente.endereco}</p>}
                {(cliente.cidade || cliente.estado) && (
                  <p>{cliente.cidade}{cliente.estado ? ` — ${cliente.estado}` : ""}</p>
                )}
                {cliente.cep && <p className="font-mono text-gray-400">CEP: {cliente.cep}</p>}
              </div>
            </div>
          )}

          {/* Observações */}
          {cliente.observacoes && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Observações</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{cliente.observacoes}</p>
            </div>
          )}

          <p className="text-[10px] text-gray-300 px-1">Cadastrado em {formatarData(cliente.createdAt)}</p>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {TABS.map((t) => {
                const count = t === "Processos" ? cliente.processos.length
                  : t === "Documentos" ? cliente.documentos.length
                  : cliente.mensagens.filter(m => !m.lida).length;

                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
                      tab === t
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        tab === t ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-5">
              {/* Processos */}
              {tab === "Processos" && (
                <div className="space-y-2">
                  {cliente.processos.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <FolderOpen size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhum processo vinculado</p>
                      <Link href="/processos/novo" className="text-[#c9a84c] text-xs mt-1 inline-block hover:underline">
                        Cadastrar processo →
                      </Link>
                    </div>
                  ) : (
                    cliente.processos.map(p => (
                      <Link
                        key={p.id}
                        href={`/processos/${p.id}`}
                        className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-[#c9a84c]/30 hover:bg-[#c9a84c]/5 transition-all group"
                      >
                        <div>
                          <p className="text-xs font-mono font-semibold text-gray-700 group-hover:text-[#c9a84c] transition-colors">{p.numero}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{p.areaJuridica.replace("_", " ")}{p.tribunal ? ` · ${p.tribunal}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={p.status} />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {/* Documentos */}
              {tab === "Documentos" && (
                <div className="space-y-2">
                  {cliente.documentos.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <FileText size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhum documento</p>
                    </div>
                  ) : (
                    cliente.documentos.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <FileText size={14} className="text-gray-400 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-gray-800">{d.titulo}</p>
                            <p className="text-[10px] text-gray-400">{d.tipo} · {formatarData(d.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Mensagens Portal */}
              {tab === "Mensagens" && (
                <div className="space-y-2">
                  {cliente.mensagens.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhuma mensagem do portal</p>
                    </div>
                  ) : (
                    cliente.mensagens.map(m => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-lg border text-xs leading-relaxed ${
                          !m.lida ? "border-blue-100 bg-blue-50/50" : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold text-[10px] ${m.remetente === "CLIENTE" ? "text-blue-600" : "text-gray-500"}`}>
                            {m.remetente === "CLIENTE" ? "Cliente" : "Escritório"}
                          </span>
                          <span className="text-[10px] text-gray-400">{formatarDataHora(m.createdAt)}</span>
                        </div>
                        <p className="text-gray-700">{m.conteudo}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
