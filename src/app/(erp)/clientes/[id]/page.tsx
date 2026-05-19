"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, MapPin, FolderOpen, FileText,
  MessageSquare, Edit, Hash, Plus, Search, ExternalLink,
  MessageCircle, Building2, User, Globe, ChevronRight,
  Shield, Clock, TrendingUp, AlertCircle,
} from "lucide-react";
import { formatarCPF, formatarCNPJ, formatarTelefone, formatarData, formatarDataHora } from "@/shared/utils/formatters";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AREA_JURIDICA_LABELS } from "@/shared/types";

// ── Types ─────────────────────────────────────────────────────────────────────

type Processo = {
  id: string; numero: string; areaJuridica: string; status: string;
  fase: string; tribunal: string | null; vara: string | null;
  assunto: string | null; poloAtivo: string | null; poloPassivo: string | null;
  valorCausa: number | null; criadoEm: string;
  advogado: { nome: string } | null;
};

type Documento = {
  id: string; titulo: string; tipo: string; categoria: string | null;
  tamanho: number | null; criadoEm: string;
};

type Mensagem = {
  id: string; conteudo: string; lida: boolean; criadoEm: string; remetente: string;
};

type Cliente = {
  id: string; tipo: "PESSOA_FISICA" | "PESSOA_JURIDICA"; nome: string;
  cpfCnpj: string | null; email: string | null; telefone: string | null;
  whatsapp: string | null; endereco: string | null; cidade: string | null;
  estado: string | null; cep: string | null; observacoes: string | null;
  portalAtivo: boolean; criadoEm: string;
  processos: Processo[];
  documentos: Documento[];
  mensagens: Mensagem[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const FASE_LABELS: Record<string, string> = {
  CONHECIMENTO: "Conhecimento", RECURSAL: "Recursal",
  EXECUCAO: "Execução", CUMPRIMENTO_SENTENCA: "Cumpr. Sentença", ARQUIVADO: "Arquivado",
};

const AREA_COLORS: Record<string, string> = {
  TRABALHISTA: "bg-blue-100 text-blue-700", CIVIL: "bg-purple-100 text-purple-700",
  EMPRESARIAL: "bg-indigo-100 text-indigo-700", EXECUCAO_CREDITO: "bg-red-100 text-red-700",
  LGPD: "bg-cyan-100 text-cyan-700", CONSULTORIA: "bg-green-100 text-green-700",
  CONTRATOS: "bg-amber-100 text-amber-700", COMPLIANCE: "bg-yellow-100 text-yellow-700",
};

function formatDoc(cliente: Cliente) {
  if (!cliente.cpfCnpj) return null;
  const n = cliente.cpfCnpj.replace(/\D/g, "");
  return cliente.tipo === "PESSOA_JURIDICA" ? formatarCNPJ(n) : formatarCPF(n);
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS = ["Processos", "Documentos", "Mensagens", "Visão Geral"] as const;
type Tab = typeof TABS[number];

export default function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Processos");
  const [buscaProcesso, setBuscaProcesso] = useState("");

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/clientes/${id}`);
      if (res.ok) setCliente(await res.json());
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { carregar(); }, [carregar]);

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded" />
      <div className="bg-white rounded-xl border border-gray-100 p-6 h-40" />
    </div>
  );

  if (!cliente) return (
    <div className="max-w-5xl mx-auto text-center py-20 text-gray-400">
      <User size={40} className="mx-auto mb-3 opacity-30" />
      <p>Cliente não encontrado</p>
      <Link href="/clientes" className="text-[#c9a84c] text-sm mt-2 inline-block">← Voltar</Link>
    </div>
  );

  const initials = cliente.nome.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
  const doc = formatDoc(cliente);
  const processosFiltrados = cliente.processos.filter(p =>
    !buscaProcesso || p.numero.includes(buscaProcesso) ||
    p.assunto?.toLowerCase().includes(buscaProcesso.toLowerCase()) ||
    (AREA_JURIDICA_LABELS as Record<string, string>)[p.areaJuridica]?.toLowerCase().includes(buscaProcesso.toLowerCase())
  );
  const naoLidas = cliente.mensagens.filter(m => !m.lida && m.remetente === "CLIENTE").length;
  const processosAtivos = cliente.processos.filter(p => p.status === "ATIVO").length;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Breadcrumb + ações */}
      <div className="flex items-center gap-3">
        <Link href="/clientes" className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/clientes" className="hover:text-[#c9a84c]">Clientes</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">{cliente.nome}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/processos/novo?clienteId=${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#c9a84c] text-[#060d1a] text-xs font-bold rounded-lg hover:bg-[#d4b85a] transition-colors"
          >
            <Plus size={13} />
            Novo Processo
          </Link>
          <Link
            href={`/clientes/${id}/editar`}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-white transition-colors"
          >
            <Edit size={13} />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Card principal */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full bg-[#060d1a] flex items-center justify-center shrink-0">
                <span className="text-[#c9a84c] text-xl font-bold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-bold text-gray-900 leading-snug truncate">{cliente.nome}</h1>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    cliente.tipo === "PESSOA_JURIDICA" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {cliente.tipo === "PESSOA_JURIDICA" ? <><Building2 size={8} className="inline mr-0.5" />PJ</> : <><User size={8} className="inline mr-0.5" />PF</>}
                  </span>
                  {cliente.portalAtivo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold flex items-center gap-0.5">
                      <Globe size={8} />Portal
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {doc && (
                <div className="flex items-center gap-2.5">
                  <Hash size={13} className="text-gray-300 shrink-0" />
                  <span className="font-mono text-xs text-gray-600">{doc}</span>
                </div>
              )}
              {cliente.email && (
                <div className="flex items-center gap-2.5">
                  <Mail size={13} className="text-gray-300 shrink-0" />
                  <a href={`mailto:${cliente.email}`} className="text-xs text-gray-600 hover:text-[#c9a84c] truncate transition-colors">{cliente.email}</a>
                </div>
              )}
              {cliente.telefone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={13} className="text-gray-300 shrink-0" />
                  <a href={`tel:${cliente.telefone}`} className="text-xs text-gray-600 hover:text-[#c9a84c] transition-colors">{formatarTelefone(cliente.telefone)}</a>
                </div>
              )}
              {cliente.whatsapp && (
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={13} className="text-gray-300 shrink-0" />
                  <a
                    href={`https://wa.me/55${cliente.whatsapp.replace(/\D/g, "")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {formatarTelefone(cliente.whatsapp)}
                  </a>
                </div>
              )}
              {(cliente.endereco || cliente.cidade) && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-gray-300 shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600">
                    {cliente.endereco && <p>{cliente.endereco}</p>}
                    {(cliente.cidade || cliente.estado) && (
                      <p>{cliente.cidade}{cliente.estado ? ` — ${cliente.estado}` : ""}</p>
                    )}
                    {cliente.cep && <p className="font-mono text-gray-400">CEP {cliente.cep}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Ações rápidas */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              {cliente.whatsapp && (
                <a
                  href={`https://wa.me/55${cliente.whatsapp.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(cliente.nome.split(" ")[0])}, tudo bem?`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <MessageCircle size={12} />
                  Abrir WhatsApp
                </a>
              )}
              {cliente.email && (
                <a
                  href={`mailto:${cliente.email}`}
                  className="flex items-center gap-2 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  <Mail size={12} />
                  Enviar e-mail
                </a>
              )}
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FolderOpen, label: "Processos", value: cliente.processos.length, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: TrendingUp, label: "Ativos", value: processosAtivos, color: "text-green-600", bg: "bg-green-50" },
              { icon: FileText, label: "Docs", value: cliente.documentos.length, color: "text-purple-600", bg: "bg-purple-50" },
              { icon: AlertCircle, label: "Msg n/lidas", value: naoLidas, color: "text-red-600", bg: "bg-red-50" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-xl p-3 text-center`}>
                <k.icon size={16} className={`${k.color} mx-auto mb-1`} />
                <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
                <p className="text-[10px] text-gray-500">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Observações */}
          {cliente.observacoes && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Observações</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{cliente.observacoes}</p>
            </div>
          )}

          <p className="text-[10px] text-gray-300 px-1 flex items-center gap-1">
            <Clock size={10} />
            Cadastrado em {formatarData(cliente.criadoEm)}
          </p>
        </div>

        {/* ── Conteúdo principal ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {TABS.map(t => {
                const badge = t === "Processos" ? cliente.processos.length
                  : t === "Documentos" ? cliente.documentos.length
                  : t === "Mensagens" ? naoLidas
                  : null;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-3 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-colors ${
                      tab === t ? "border-[#c9a84c] text-[#c9a84c]" : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}
                    {badge != null && badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "bg-gray-100 text-gray-500"}`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-5">

              {/* ── Processos ──────────────────────────────────────────────── */}
              {tab === "Processos" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={buscaProcesso}
                        onChange={e => setBuscaProcesso(e.target.value)}
                        placeholder="Buscar por número, assunto ou área..."
                        className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <Link
                      href={`/processos/novo?clienteId=${id}`}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#060d1a] text-white text-xs font-semibold rounded-lg hover:bg-[#0d1b2a] transition-colors whitespace-nowrap"
                    >
                      <Plus size={12} />
                      Adicionar
                    </Link>
                  </div>

                  {processosFiltrados.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <FolderOpen size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">{buscaProcesso ? "Nenhum processo encontrado" : "Nenhum processo vinculado"}</p>
                      {!buscaProcesso && (
                        <Link href={`/processos/novo?clienteId=${id}`} className="text-[#c9a84c] text-xs mt-1 inline-block hover:underline">
                          Cadastrar primeiro processo →
                        </Link>
                      )}
                    </div>
                  ) : (
                    processosFiltrados.map(p => (
                      <Link
                        key={p.id}
                        href={`/processos/${p.id}`}
                        className="block p-4 rounded-xl border border-gray-100 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/3 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-mono text-xs font-bold text-gray-800 group-hover:text-[#c9a84c] transition-colors">
                                {p.numero}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${AREA_COLORS[p.areaJuridica] ?? "bg-gray-100 text-gray-600"}`}>
                                {(AREA_JURIDICA_LABELS as Record<string, string>)[p.areaJuridica] ?? p.areaJuridica}
                              </span>
                            </div>
                            {p.assunto && <p className="text-xs text-gray-500 truncate">{p.assunto}</p>}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {p.tribunal && <span className="text-[10px] text-gray-400">{p.tribunal}</span>}
                              {p.vara && <span className="text-[10px] text-gray-400">{p.vara}</span>}
                              {p.advogado && <span className="text-[10px] text-gray-400">Dr(a). {p.advogado.nome}</span>}
                              <span className="text-[10px] text-gray-300">{formatarData(p.criadoEm)}</span>
                            </div>
                            {/* Partes */}
                            {(p.poloAtivo || p.poloPassivo) && (
                              <div className="flex gap-3 mt-2 flex-wrap">
                                {p.poloAtivo && (
                                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                                    ▶ {p.poloAtivo.split(" | ")[0]}{p.poloAtivo.includes(" | ") ? " +…" : ""}
                                  </span>
                                )}
                                {p.poloPassivo && (
                                  <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                                    ◀ {p.poloPassivo.split(" | ")[0]}{p.poloPassivo.includes(" | ") ? " +…" : ""}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <StatusBadge status={p.status} />
                            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                              {FASE_LABELS[p.fase] ?? p.fase}
                            </span>
                            <ExternalLink size={11} className="text-gray-300 group-hover:text-[#c9a84c] transition-colors mt-1" />
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}

              {/* ── Documentos ─────────────────────────────────────────────── */}
              {tab === "Documentos" && (
                <div className="space-y-2">
                  {cliente.documentos.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <FileText size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhum documento vinculado</p>
                    </div>
                  ) : (
                    cliente.documentos.map(d => (
                      <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{d.titulo}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {d.tipo}{d.categoria ? ` · ${d.categoria}` : ""}{d.tamanho ? ` · ${formatBytes(d.tamanho)}` : ""}
                            {" · "}{formatarData(d.criadoEm)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Mensagens ──────────────────────────────────────────────── */}
              {tab === "Mensagens" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">{cliente.mensagens.length} mensagem(ns) do portal</p>
                    <Link href={`/clientes/${id}`} className="text-xs text-[#c9a84c] hover:underline">Ver portal completo</Link>
                  </div>
                  {cliente.mensagens.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhuma mensagem</p>
                    </div>
                  ) : (
                    cliente.mensagens.map(m => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border text-xs ${
                          m.remetente === "CLIENTE" && !m.lida
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            m.remetente === "CLIENTE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                          }`}>
                            {m.remetente === "CLIENTE" ? "Cliente" : "Escritório"}
                          </span>
                          <span className="text-[10px] text-gray-400">{formatarDataHora(m.criadoEm)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-1">{m.conteudo}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Visão Geral ────────────────────────────────────────────── */}
              {tab === "Visão Geral" && (
                <div className="space-y-5">
                  {/* Resumo por área */}
                  {cliente.processos.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Processos por Área</h3>
                      <div className="space-y-2">
                        {Object.entries(
                          cliente.processos.reduce<Record<string, number>>((acc, p) => {
                            acc[p.areaJuridica] = (acc[p.areaJuridica] ?? 0) + 1;
                            return acc;
                          }, {})
                        ).map(([area, count]) => (
                          <div key={area} className="flex items-center gap-3">
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${AREA_COLORS[area] ?? "bg-gray-100 text-gray-600"}`}>
                              {(AREA_JURIDICA_LABELS as Record<string, string>)[area] ?? area}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                              <div
                                className="bg-[#c9a84c] h-1.5 rounded-full"
                                style={{ width: `${(count / cliente.processos.length) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-600">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Portal */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Shield size={13} className="text-[#c9a84c]" />
                        Acesso ao Portal
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${cliente.portalAtivo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                        {cliente.portalAtivo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {cliente.portalAtivo
                        ? "Este cliente tem acesso ao portal para acompanhar processos e trocar mensagens."
                        : "Ative o portal para que o cliente possa acompanhar seus processos online."}
                    </p>
                    <Link
                      href={`/clientes/${id}/editar`}
                      className="text-xs text-[#c9a84c] hover:underline font-medium"
                    >
                      Configurar acesso →
                    </Link>
                  </div>

                  {/* Histórico de processos */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Últimos Processos</h3>
                    {cliente.processos.slice(0, 3).map(p => (
                      <Link key={p.id} href={`/processos/${p.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#060d1a] flex items-center justify-center shrink-0">
                          <FolderOpen size={12} className="text-[#c9a84c]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono font-semibold text-gray-700 truncate group-hover:text-[#c9a84c]">{p.numero}</p>
                          <p className="text-[10px] text-gray-400">{(AREA_JURIDICA_LABELS as Record<string, string>)[p.areaJuridica]}</p>
                        </div>
                        <StatusBadge status={p.status} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
