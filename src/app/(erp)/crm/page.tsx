"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Plus, Phone, Mail, ChevronRight, DollarSign, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { formatarMoeda } from "@/shared/utils/formatters";

type Lead = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  etapa: string;
  origem: string | null;
  areaJuridica: string | null;
  ticketPotencial: number | null;
  observacoes: string | null;
  criadoEm: string;
  responsavel: { id: string; nome: string } | null;
  propostas: { id: string; honorarios: number | null; status: string }[];
};

const ETAPAS = [
  { key: "RECEBIDO", label: "Recebido", color: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  { key: "QUALIFICACAO", label: "Qualificação", color: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  { key: "ATENDIMENTO_INICIAL", label: "Atendimento", color: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-500" },
  { key: "REUNIAO", label: "Reunião", color: "bg-purple-50 text-purple-700", dot: "bg-purple-500" },
  { key: "PROPOSTA_ENVIADA", label: "Proposta Enviada", color: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  { key: "NEGOCIACAO", label: "Negociação", color: "bg-orange-50 text-orange-700", dot: "bg-orange-500" },
  { key: "FECHADO", label: "Fechado", color: "bg-green-50 text-green-700", dot: "bg-green-500" },
  { key: "PERDIDO", label: "Perdido", color: "bg-red-50 text-red-700", dot: "bg-red-500" },
];

const novoLeadSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  origem: z.enum(["INDICACAO", "SITE", "INSTAGRAM", "LINKEDIN", "GOOGLE", "WHATSAPP", "OUTRO"]).optional(),
  areaJuridica: z.enum(["TRABALHISTA", "EMPRESARIAL", "EXECUCAO_CREDITO", "LGPD", "CONSULTORIA", "CONTRATOS", "COMPLIANCE", "CIVIL", "TRIBUTARIO", "PREVIDENCIARIO", "OUTRO"]).optional(),
  ticketPotencial: z.number().optional(),
  observacoes: z.string().optional(),
});

type NovoLeadForm = z.infer<typeof novoLeadSchema>;

export default function CRMPage() {
  const [grouped, setGrouped] = useState<Record<string, Lead[]>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [movendo, setMovendo] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NovoLeadForm>({
    resolver: zodResolver(novoLeadSchema),
  });

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/leads");
      const data = await res.json();
      setGrouped(data.grouped ?? {});
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const moverEtapa = async (id: string, novaEtapa: string) => {
    setMovendo(id);
    try {
      await fetch(`/api/v1/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etapa: novaEtapa }),
      });
      await buscar();
    } finally {
      setMovendo(null);
    }
  };

  const criarLead = async (data: NovoLeadForm) => {
    setSalvando(true);
    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("Erro ao criar lead");
        return;
      }
      toast.success("Lead criado com sucesso!");
      reset();
      setModal(false);
      buscar();
    } finally {
      setSalvando(false);
    }
  };

  const totalValor = Object.values(grouped).flat()
    .reduce((sum, l) => sum + (l.ticketPotencial ?? 0), 0);

  const ganhos = (grouped["FECHADO"] ?? [])
    .reduce((sum, l) => sum + (l.ticketPotencial ?? 0), 0);

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      err ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]"
    }`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#c9a84c]" />
            Funil CRM
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} lead{total !== 1 ? "s" : ""} · Pipeline: {formatarMoeda(totalValor)} · Ganho: {formatarMoeda(ganhos)}</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo Lead
        </button>
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => {
          const cards = grouped[etapa.key] ?? [];
          const valorEtapa = cards.reduce((s, l) => s + (l.ticketPotencial ?? 0), 0);

          return (
            <div key={etapa.key} className="flex-shrink-0 w-64">
              {/* Column header */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl border-b ${etapa.color} border-current/10`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${etapa.dot}`} />
                  <span className="text-xs font-bold">{etapa.label}</span>
                </div>
                <span className="text-[10px] font-semibold opacity-70">{cards.length}</span>
              </div>

              {valorEtapa > 0 && (
                <div className="px-3 py-1 bg-white border-x border-current/5 text-[10px] text-gray-400 flex items-center gap-1">
                  <DollarSign size={10} />
                  {formatarMoeda(valorEtapa)}
                </div>
              )}

              {/* Cards */}
              <div className="bg-gray-50 rounded-b-xl border border-gray-100 min-h-24 p-2 space-y-2">
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                      <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
                    </div>
                  ))
                ) : cards.length === 0 ? (
                  <div className="py-6 text-center text-[10px] text-gray-300">Vazio</div>
                ) : (
                  cards.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      etapas={ETAPAS}
                      onMove={moverEtapa}
                      moving={movendo === lead.id}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal novo lead */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Novo Lead</h2>
              <button onClick={() => setModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(criarLead)} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome <span className="text-red-500">*</span></label>
                  <input {...register("nome")} placeholder="Nome completo ou empresa" className={inputCls(errors.nome?.message)} />
                  {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail</label>
                  <input type="email" {...register("email")} placeholder="email@exemplo.com" className={inputCls(errors.email?.message)} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telefone</label>
                  <input {...register("telefone")} placeholder="(00) 00000-0000" className={inputCls()} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">WhatsApp</label>
                  <input {...register("whatsapp")} placeholder="(00) 00000-0000" className={inputCls()} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Origem</label>
                  <select {...register("origem")} className={inputCls()}>
                    <option value="">Selecionar</option>
                    <option value="INDICACAO">Indicação</option>
                    <option value="SITE">Site</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="GOOGLE">Google</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Área Jurídica</label>
                  <select {...register("areaJuridica")} className={inputCls()}>
                    <option value="">Selecionar</option>
                    <option value="TRABALHISTA">Direito do Trabalho</option>
                    <option value="EMPRESARIAL">Direito Empresarial</option>
                    <option value="EXECUCAO_CREDITO">Execução e Recuperação de Crédito</option>
                    <option value="LGPD">LGPD</option>
                    <option value="CONSULTORIA">Consultoria Preventiva</option>
                    <option value="CONTRATOS">Contratos</option>
                    <option value="COMPLIANCE">Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Ticket Potencial (R$)</label>
                  <input type="number" step="0.01" {...register("ticketPotencial", { valueAsNumber: true })} placeholder="0,00" className={inputCls()} />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Observações</label>
                  <textarea {...register("observacoes")} rows={3} placeholder="Detalhes sobre o lead..." className={`${inputCls()} resize-none`} />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-[#060d1a] text-white text-sm font-medium rounded-lg hover:bg-[#0d1b2a] transition-colors disabled:opacity-60">
                  {salvando ? <Loader2 size={14} className="animate-spin" /> : null}
                  {salvando ? "Salvando..." : "Criar Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, etapas, onMove, moving }: {
  lead: Lead;
  etapas: typeof ETAPAS;
  onMove: (id: string, etapa: string) => void;
  moving: boolean;
}) {
  const [open, setOpen] = useState(false);
  const etapaAtual = etapas.findIndex(e => e.key === lead.etapa);

  return (
    <div className={`bg-white rounded-lg border border-gray-100 p-3 transition-all hover:shadow-sm hover:border-gray-200 ${moving ? "opacity-50 pointer-events-none" : ""}`}>
      <p className="text-xs font-semibold text-gray-900 leading-snug mb-1.5">{lead.nome}</p>


      <div className="flex flex-col gap-1 mb-2">
        {lead.telefone && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Phone size={9} />
            <span>{lead.telefone}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Mail size={9} />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {lead.ticketPotencial != null && lead.ticketPotencial > 0 && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#c9a84c] mb-2">
          <DollarSign size={9} />
          {formatarMoeda(lead.ticketPotencial)}
        </div>
      )}

      {lead.areaJuridica && (
        <span className="inline-block text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium mb-2">
          {lead.areaJuridica.replace("_", " ")}
        </span>
      )}

      {/* Move buttons */}
      <div className="flex gap-1 mt-2 pt-2 border-t border-gray-50">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 text-[9px] font-medium text-gray-400 hover:text-gray-600 py-1 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-0.5"
        >
          Mover <ChevronRight size={9} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="mt-1 space-y-0.5">
          {etapas.filter(e => e.key !== lead.etapa).map(e => (
            <button
              key={e.key}
              onClick={() => { onMove(lead.id, e.key); setOpen(false); }}
              className="w-full text-left text-[10px] px-2 py-1 rounded hover:bg-gray-50 text-gray-600 flex items-center gap-1.5 transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.dot}`} />
              {e.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
