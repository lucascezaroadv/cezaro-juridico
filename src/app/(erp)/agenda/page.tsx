"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, AlertTriangle, RefreshCw, Plus, Check,
  Trash2, X, ChevronDown, Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Prazo = {
  id: string;
  titulo: string;
  descricao: string | null;
  dataVencimento: string;
  tipo: string;
  status: string;
  processo: { id: string; numero: string; areaJuridica: string } | null;
};

type Processo = { id: string; numero: string; assunto: string | null };

const TIPO_LABELS: Record<string, string> = {
  PROCESSUAL:    "Processual",
  CONTRATUAL:    "Contratual",
  INTERNO:       "Interno",
  ADMINISTRATIVO:"Administrativo",
};

const STATUS_COLORS: Record<string, string> = {
  PENDENTE:  "bg-amber-50 text-amber-700 border-amber-200",
  CONCLUIDO: "bg-green-50 text-green-700 border-green-200",
  VENCIDO:   "bg-red-50 text-red-700 border-red-200",
  CANCELADO: "bg-gray-50 text-gray-500 border-gray-200",
};

// ─── Modal de novo prazo ────────────────────────────────────────────────────

function ModalNovoPrazo({
  onClose,
  onCriado,
}: {
  onClose: () => void;
  onCriado: () => void;
}) {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    dataVencimento: "",
    tipo: "PROCESSUAL",
    processoId: "",
  });
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch("/api/v1/processos?limit=100")
      .then(r => r.json())
      .then((d: { processos?: Processo[] }) => setProcessos(d.processos ?? []))
      .catch(() => {});
  }, []);

  const salvar = async () => {
    if (!form.titulo.trim() || !form.dataVencimento) {
      toast.error("Preencha título e data de vencimento.");
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch("/api/v1/prazos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.titulo,
          descricao: form.descricao || undefined,
          dataVencimento: form.dataVencimento,
          tipo: form.tipo,
          processoId: form.processoId || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Prazo criado com sucesso!");
      onCriado();
      onClose();
    } catch {
      toast.error("Erro ao criar prazo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={16} className="text-[#8B1A1A]" />
            Novo Prazo
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Título *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
              placeholder="Ex: Contestação processo 0001234-56.2024"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Vencimento *</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]"
                value={form.dataVencimento}
                onChange={e => setForm(f => ({ ...f, dataVencimento: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tipo</label>
              <div className="relative">
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] pr-8"
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                >
                  {Object.entries(TIPO_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Processo (opcional)</label>
            <div className="relative">
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] pr-8"
                value={form.processoId}
                onChange={e => setForm(f => ({ ...f, processoId: e.target.value }))}
              >
                <option value="">— Nenhum —</option>
                {processos.map(p => (
                  <option key={p.id} value={p.id}>{p.numero}{p.assunto ? ` — ${p.assunto.slice(0, 40)}` : ""}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Observações</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] resize-none"
              rows={3}
              placeholder="Detalhes, instruções, referências..."
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="flex-1 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {salvando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {salvando ? "Criando..." : "Criar Prazo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [prazos, setPrazos]         = useState<Prazo[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE");
  const [view, setView]             = useState<"proximos" | "todos">("proximos");
  const [modalAberto, setModalAberto] = useState(false);
  const [atualizando, setAtualizando] = useState<string | null>(null);

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

  // Vencidos: data passada E ainda pendente
  const vencidos = prazos.filter(p =>
    new Date(p.dataVencimento) < hoje && p.status === "PENDENTE"
  );
  // Urgentes: 0-3 dias
  const proximos7 = prazos.filter(p => {
    const diff = Math.ceil((new Date(p.dataVencimento).getTime() - hoje.getTime()) / 86400000);
    return diff >= 0 && diff <= 7 && p.status === "PENDENTE";
  });

  const getDias = (data: string) =>
    Math.ceil((new Date(data).getTime() - hoje.getTime()) / 86400000);

  const marcarStatus = async (id: string, status: "CONCLUIDO" | "PENDENTE") => {
    setAtualizando(id);
    try {
      const res = await fetch(`/api/v1/prazos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(status === "CONCLUIDO" ? "Prazo marcado como cumprido!" : "Prazo reaberto.");
      buscar();
    } catch {
      toast.error("Erro ao atualizar prazo.");
    } finally {
      setAtualizando(null);
    }
  };

  const excluir = async (id: string) => {
    if (!confirm("Excluir este prazo?")) return;
    setAtualizando(id);
    try {
      await fetch(`/api/v1/prazos/${id}`, { method: "DELETE" });
      toast.success("Prazo excluído.");
      buscar();
    } catch {
      toast.error("Erro ao excluir.");
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <>
      {modalAberto && (
        <ModalNovoPrazo
          onClose={() => setModalAberto(false)}
          onCriado={buscar}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={20} className="text-[#8B1A1A]" />
              Agenda & Prazos
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} prazo{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={buscar}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atualizar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-bold rounded-xl transition-colors"
            >
              <Plus size={16} />
              Novo Prazo
            </button>
          </div>
        </div>

        {/* Banners de alerta */}
        {vencidos.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700">
                {vencidos.length} prazo{vencidos.length !== 1 ? "s" : ""} vencido{vencidos.length !== 1 ? "s" : ""}!
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                {vencidos.slice(0, 3).map(p => p.titulo).join(", ")}
                {vencidos.length > 3 ? ` e mais ${vencidos.length - 3}...` : ""}
              </p>
            </div>
          </div>
        )}

        {proximos7.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Clock size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-700">
                {proximos7.length} prazo{proximos7.length !== 1 ? "s" : ""} nos próximos 7 dias
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {proximos7.slice(0, 3).map(p => `${p.titulo} (${getDias(p.dataVencimento)}d)`).join(", ")}
                {proximos7.length > 3 ? ` e mais ${proximos7.length - 3}...` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {[
              { value: "PENDENTE",  label: "Pendentes" },
              { value: "CONCLUIDO", label: "Cumpridos" },
              { value: "",          label: "Todos" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFiltro(opt.value)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  statusFiltro === opt.value
                    ? "bg-[#8B1A1A] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex rounded-xl border border-gray-200 overflow-hidden ml-auto">
            {(["proximos", "todos"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  view === v
                    ? "bg-[#8B1A1A] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {v === "proximos" ? "Próximos 30 dias" : "Todos"}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
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
          <div className="bg-white rounded-xl border border-gray-100 py-20 text-center text-gray-400 flex flex-col items-center gap-3">
            <Calendar size={36} className="opacity-20" />
            <p className="text-sm">Nenhum prazo encontrado</p>
            <button
              onClick={() => setModalAberto(true)}
              className="mt-1 text-xs text-[#8B1A1A] font-semibold hover:underline"
            >
              + Criar primeiro prazo
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {prazos.map((prazo) => {
              const dias    = getDias(prazo.dataVencimento);
              const vencido = dias < 0 && prazo.status === "PENDENTE";
              const urgente = dias >= 0 && dias <= 3 && prazo.status === "PENDENTE";
              const loading = atualizando === prazo.id;

              return (
                <div
                  key={prazo.id}
                  className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-all hover:shadow-sm ${
                    vencido ? "border-red-200 bg-red-50/30" :
                    urgente ? "border-orange-200 bg-orange-50/30" :
                    "border-gray-100"
                  }`}
                >
                  {/* Data */}
                  <div className={`text-center rounded-xl p-2.5 min-w-[52px] border shrink-0 ${
                    vencido ? "bg-red-100 border-red-200" :
                    urgente ? "bg-orange-100 border-orange-200" :
                    prazo.status === "CONCLUIDO" ? "bg-green-50 border-green-200" :
                    "bg-gray-50 border-gray-100"
                  }`}>
                    <p className={`text-xs font-bold ${
                      vencido ? "text-red-700" :
                      urgente ? "text-orange-700" :
                      prazo.status === "CONCLUIDO" ? "text-green-700" :
                      "text-gray-600"
                    }`}>
                      {new Date(prazo.dataVencimento).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "short"
                      }).replace(".", "")}
                    </p>
                    {prazo.status === "PENDENTE" && (
                      <p className={`text-[9px] font-bold mt-0.5 ${
                        vencido ? "text-red-600" :
                        urgente ? "text-orange-600" :
                        "text-gray-400"
                      }`}>
                        {vencido ? `${Math.abs(dias)}d atrás` : dias === 0 ? "hoje" : `${dias}d`}
                      </p>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm font-semibold leading-snug ${
                        prazo.status === "CONCLUIDO" ? "line-through text-gray-400" : "text-gray-900"
                      }`}>
                        {prazo.titulo}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${
                        STATUS_COLORS[prazo.status] ?? "bg-gray-50 text-gray-500 border-gray-100"
                      }`}>
                        {prazo.status === "CONCLUIDO" ? "Cumprido" :
                         prazo.status === "PENDENTE" ? "Pendente" :
                         prazo.status === "VENCIDO" ? "Vencido" : "Cancelado"}
                      </span>
                    </div>

                    {prazo.descricao && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{prazo.descricao}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded font-medium text-gray-600">
                        {TIPO_LABELS[prazo.tipo] ?? prazo.tipo}
                      </span>
                      {prazo.processo && (
                        <Link
                          href={`/processos/${prazo.processo.id}`}
                          className="font-mono hover:text-[#8B1A1A] transition-colors"
                        >
                          {prazo.processo.numero}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-1 shrink-0">
                    {prazo.status === "PENDENTE" ? (
                      <button
                        onClick={() => marcarStatus(prazo.id, "CONCLUIDO")}
                        disabled={loading}
                        title="Marcar como cumprido"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      </button>
                    ) : prazo.status === "CONCLUIDO" ? (
                      <button
                        onClick={() => marcarStatus(prazo.id, "PENDENTE")}
                        disabled={loading}
                        title="Reabrir prazo"
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                      </button>
                    ) : null}

                    <button
                      onClick={() => excluir(prazo.id)}
                      disabled={loading}
                      title="Excluir"
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
