"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, MessageCircle, DollarSign,
  Tag, AlertCircle, FileText, ChevronRight,
  Clock, CheckCircle, XCircle, Loader2, Plus, Send,
} from "lucide-react";

const ETAPA_LABELS: Record<string, string> = {
  RECEBIDO: "Recebido",
  QUALIFICACAO: "Qualificação",
  ATENDIMENTO_INICIAL: "Atendimento Inicial",
  REUNIAO: "Reunião",
  PROPOSTA_ENVIADA: "Proposta Enviada",
  NEGOCIACAO: "Negociação",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
};

const ETAPA_COLORS: Record<string, string> = {
  RECEBIDO: "bg-gray-100 text-gray-700",
  QUALIFICACAO: "bg-blue-100 text-blue-700",
  ATENDIMENTO_INICIAL: "bg-purple-100 text-purple-700",
  REUNIAO: "bg-indigo-100 text-indigo-700",
  PROPOSTA_ENVIADA: "bg-amber-100 text-amber-700",
  NEGOCIACAO: "bg-orange-100 text-orange-700",
  FECHADO: "bg-green-100 text-green-700",
  PERDIDO: "bg-red-100 text-red-700",
};

const ORIGEM_LABELS: Record<string, string> = {
  SITE: "Site", WHATSAPP: "WhatsApp", INDICACAO: "Indicação",
  INSTAGRAM: "Instagram", GOOGLE: "Google", LINKEDIN: "LinkedIn", OUTRO: "Outro",
};

const STATUS_PROPOSTA: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  CRIADA: { label: "Criada", color: "text-gray-500", icon: FileText },
  ENVIADA: { label: "Enviada", color: "text-blue-500", icon: Send },
  VISUALIZADA: { label: "Visualizada", color: "text-purple-500", icon: CheckCircle },
  ACEITA: { label: "Aceita", color: "text-green-600", icon: CheckCircle },
  RECUSADA: { label: "Recusada", color: "text-red-500", icon: XCircle },
};

type Proposta = {
  id: string; titulo: string; honorarios: number | null;
  percentualExito: number | null; parcelamento: number | null;
  status: string; criadoEm: string;
};

type Comentario = {
  id: string; conteudo: string; criadoEm: string;
  autor: { nome: string };
};

type Lead = {
  id: string; nome: string; email: string | null; telefone: string | null;
  whatsapp: string | null; origem: string; areaJuridica: string | null;
  urgencia: string; ticketPotencial: number | null; etapa: string;
  status: string; observacoes: string | null; criadoEm: string;
  responsavel: { nome: string } | null;
  cliente: { id: string; nome: string } | null;
  propostas: Proposta[];
  comentarios: Comentario[];
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [movendo, setMovendo] = useState(false);

  const fetchLead = async () => {
    const res = await fetch(`/api/v1/leads/${id}`);
    if (res.ok) setLead(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchLead(); }, [id]);

  const moverEtapa = async (etapa: string) => {
    setMovendo(true);
    await fetch(`/api/v1/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etapa }),
    });
    await fetchLead();
    setMovendo(false);
  };

  const enviarComentario = async () => {
    if (!comentario.trim()) return;
    setEnviando(true);
    await fetch(`/api/v1/leads/${id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conteudo: comentario }),
    });
    setComentario("");
    await fetchLead();
    setEnviando(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-[#c9a84c]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-center text-gray-500">
        Lead não encontrado.{" "}
        <Link href="/crm" className="text-[#c9a84c] hover:underline">Voltar ao CRM</Link>
      </div>
    );
  }

  const etapas = Object.keys(ETAPA_LABELS);
  const etapaIdx = etapas.indexOf(lead.etapa);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/crm" className="mt-1 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{lead.nome}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ETAPA_COLORS[lead.etapa] ?? "bg-gray-100 text-gray-600"}`}>
              {ETAPA_LABELS[lead.etapa] ?? lead.etapa}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Lead desde {new Date(lead.criadoEm).toLocaleDateString("pt-BR")}
            {lead.responsavel && ` · Responsável: ${lead.responsavel.nome}`}
          </p>
        </div>
      </div>

      {/* Pipeline progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          Funil de Vendas {movendo && <Loader2 size={10} className="animate-spin inline ml-1" />}
        </h2>
        <div className="flex items-center gap-1 flex-wrap">
          {etapas.map((e, i) => (
            <button
              key={e}
              onClick={() => moverEtapa(e)}
              disabled={movendo || e === lead.etapa}
              className={`flex-1 min-w-[80px] py-2 px-2 text-[10px] font-semibold rounded-lg transition-colors text-center
                ${e === lead.etapa
                  ? "bg-[#060d1a] text-white"
                  : i < etapaIdx
                    ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                } disabled:cursor-not-allowed`}
            >
              {ETAPA_LABELS[e]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Dados do lead */}
        <div className="md:col-span-2 space-y-6">
          {/* Informações */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Informações do Lead</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {lead.telefone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Telefone</p>
                    <a href={`tel:${lead.telefone}`} className="text-sm text-gray-800 hover:text-[#c9a84c]">{lead.telefone}</a>
                  </div>
                </div>
              )}
              {lead.whatsapp && (
                <div className="flex items-center gap-3">
                  <MessageCircle size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">WhatsApp</p>
                    <a
                      href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-800 hover:text-green-600"
                    >
                      {lead.whatsapp}
                    </a>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">E-mail</p>
                    <a href={`mailto:${lead.email}`} className="text-sm text-gray-800 hover:text-[#c9a84c] break-all">{lead.email}</a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Tag size={14} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Origem</p>
                  <p className="text-sm text-gray-800">{ORIGEM_LABELS[lead.origem] ?? lead.origem}</p>
                </div>
              </div>
              {lead.areaJuridica && (
                <div className="flex items-center gap-3">
                  <FileText size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Área Jurídica</p>
                    <p className="text-sm text-gray-800">{lead.areaJuridica.replace(/_/g, " ")}</p>
                  </div>
                </div>
              )}
              {lead.ticketPotencial != null && (
                <div className="flex items-center gap-3">
                  <DollarSign size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Ticket Potencial</p>
                    <p className="text-sm font-semibold text-[#c9a84c]">
                      {lead.ticketPotencial.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <AlertCircle size={14} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Urgência</p>
                  <p className="text-sm text-gray-800">{lead.urgencia}</p>
                </div>
              </div>
            </div>
            {lead.observacoes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Observações</p>
                <p className="text-sm text-gray-600 leading-relaxed">{lead.observacoes}</p>
              </div>
            )}
            {lead.cliente && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Cliente Vinculado</p>
                  <p className="text-sm font-medium text-gray-800">{lead.cliente.nome}</p>
                </div>
                <Link href={`/clientes/${lead.cliente.id}`} className="text-xs text-[#c9a84c] hover:underline flex items-center gap-1">
                  Ver cliente <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Propostas */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Propostas ({lead.propostas.length})</h2>
            {lead.propostas.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Nenhuma proposta criada ainda.</p>
            ) : (
              <div className="space-y-3">
                {lead.propostas.map(p => {
                  const s = STATUS_PROPOSTA[p.status] ?? STATUS_PROPOSTA.CRIADA;
                  const Icon = s.icon;
                  return (
                    <div key={p.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{p.titulo}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            {p.honorarios != null && (
                              <span className="text-xs text-[#c9a84c] font-semibold">
                                {p.honorarios.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </span>
                            )}
                            {p.percentualExito != null && (
                              <span className="text-xs text-gray-500">{p.percentualExito}% êxito</span>
                            )}
                            {p.parcelamento != null && (
                              <span className="text-xs text-gray-500">{p.parcelamento}x</span>
                            )}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium ${s.color}`}>
                          <Icon size={12} />
                          {s.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Comentários */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              Comentários ({lead.comentarios.length})
            </h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {lead.comentarios.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">Nenhum comentário ainda.</p>
              )}
              {lead.comentarios.map(c => (
                <div key={c.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">{c.autor?.nome ?? "Usuário"}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.conteudo}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarComentario(); } }}
                placeholder="Adicionar comentário... (Enter para enviar)"
                rows={2}
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 resize-none"
              />
              <button
                onClick={enviarComentario}
                disabled={enviando || !comentario.trim()}
                className="px-3 py-2 bg-[#060d1a] text-white rounded-xl hover:bg-[#0d1b2a] disabled:opacity-40 transition-colors"
              >
                {enviando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Ações rápidas */}
          <div className="bg-[#060d1a] rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wide">Ações Rápidas</h3>
            {lead.whatsapp && (
              <a
                href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}?text=Olá ${encodeURIComponent(lead.nome)}, tudo bem?`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 w-full py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <MessageCircle size={13} />
                Abrir WhatsApp
              </a>
            )}
            {lead.telefone && (
              <a
                href={`tel:${lead.telefone}`}
                className="flex items-center gap-2 w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors"
              >
                <Phone size={13} />
                Ligar
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-2 w-full py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors"
              >
                <Mail size={13} />
                Enviar e-mail
              </a>
            )}
          </div>

          {/* Linha do tempo */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Linha do Tempo</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#c9a84c]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={10} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Lead recebido</p>
                  <p className="text-[10px] text-gray-400">{new Date(lead.criadoEm).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              {lead.propostas.map(p => (
                <div key={p.id} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={10} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Proposta criada</p>
                    <p className="text-[10px] text-gray-400">{p.titulo}</p>
                    <p className="text-[10px] text-gray-400">{new Date(p.criadoEm).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ChevronRight size={10} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Etapa atual</p>
                  <p className="text-[10px] text-gray-400">{ETAPA_LABELS[lead.etapa]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
