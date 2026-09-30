"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, AlertTriangle, RefreshCw, Plus, Check,
  Trash2, X, ChevronDown, Loader2, ChevronLeft, ChevronRight,
  Pencil, Save, List,
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

// ─── Helpers ────────────────────────────────────────────────────────────────

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(iso: string) {
  // iso = "2026-06-15T..."
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ─── Modal de novo prazo ─────────────────────────────────────────────────────

function ModalPrazo({
  prazoInicial,
  onClose,
  onSalvo,
}: {
  prazoInicial?: Prazo;
  onClose: () => void;
  onSalvo: () => void;
}) {
  const editando = !!prazoInicial;
  const [form, setForm] = useState({
    titulo:         prazoInicial?.titulo ?? "",
    descricao:      prazoInicial?.descricao ?? "",
    dataVencimento: prazoInicial ? prazoInicial.dataVencimento.slice(0, 10) : "",
    tipo:           prazoInicial?.tipo ?? "PROCESSUAL",
    processoId:     prazoInicial?.processo?.id ?? "",
  });
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [salvando, setSalvando]   = useState(false);

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
      const url    = editando ? `/api/v1/prazos/${prazoInicial!.id}` : "/api/v1/prazos";
      const method = editando ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo:         form.titulo,
          descricao:      form.descricao || undefined,
          dataVencimento: form.dataVencimento,
          tipo:           form.tipo,
          processoId:     form.processoId || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(editando ? "Prazo atualizado!" : "Prazo criado!");
      onSalvo();
      onClose();
    } catch {
      toast.error("Erro ao salvar prazo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={16} className="text-[#8B1A1A]" />
            {editando ? "Editar Prazo" : "Novo Prazo"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
            <X size={16} />
          </button>
        </div>

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
              value={form.descricao ?? ""}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
            />
          </div>
        </div>

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
            {salvando ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar Prazo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Calendário ──────────────────────────────────────────────────────────────

function CalendarioView({
  prazos,
  onEdit,
  onMarcar,
  onExcluir,
  atualizando,
}: {
  prazos: Prazo[];
  onEdit: (p: Prazo) => void;
  onMarcar: (id: string, status: "CONCLUIDO" | "PENDENTE") => void;
  onExcluir: (id: string) => void;
  atualizando: string | null;
}) {
  const hoje      = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());
  const [diaSel, setDiaSel] = useState<string | null>(toDateKey(hoje));

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia   = new Date(ano, mes + 1, 0);
  const diasOffset  = primeiroDia.getDay(); // 0 = domingo
  const totalCelulas = diasOffset + ultimoDia.getDate();
  const semanas     = Math.ceil(totalCelulas / 7);

  // Mapa: "YYYY-MM-DD" → Prazo[]
  const prazosPorDia = prazos.reduce<Record<string, Prazo[]>>((acc, p) => {
    const key = p.dataVencimento.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const prazosNoDiaSel = diaSel ? (prazosPorDia[diaSel] ?? []) : [];

  const nomeMes = new Date(ano, mes, 1).toLocaleString("pt-BR", { month: "long", year: "numeric" });

  const navMes = (delta: number) => {
    const d = new Date(ano, mes + delta, 1);
    setMes(d.getMonth());
    setAno(d.getFullYear());
  };

  const getDotColor = (ps: Prazo[]) => {
    if (ps.some(p => p.status === "PENDENTE" && parseLocalDate(p.dataVencimento) < hoje)) return "bg-red-500";
    if (ps.some(p => {
      const diff = Math.ceil((parseLocalDate(p.dataVencimento).getTime() - hoje.getTime()) / 86400000);
      return p.status === "PENDENTE" && diff >= 0 && diff <= 3;
    })) return "bg-orange-400";
    if (ps.some(p => p.status === "PENDENTE")) return "bg-amber-400";
    if (ps.every(p => p.status === "CONCLUIDO")) return "bg-green-400";
    return "bg-gray-300";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Calendário */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
        {/* Navegação */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navMes(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <h2 className="text-sm font-bold text-gray-800 capitalize">{nomeMes}</h2>
          <button onClick={() => navMes(1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Cabeçalho dias */}
        <div className="grid grid-cols-7 mb-1">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Grid de dias */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
          {Array.from({ length: semanas * 7 }).map((_, i) => {
            const diaNum = i - diasOffset + 1;
            if (diaNum < 1 || diaNum > ultimoDia.getDate()) {
              return <div key={i} className="bg-gray-50 h-14" />;
            }
            const key = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diaNum).padStart(2, "0")}`;
            const ps  = prazosPorDia[key] ?? [];
            const isHoje  = key === toDateKey(hoje);
            const isSel   = key === diaSel;

            return (
              <button
                key={i}
                onClick={() => setDiaSel(key)}
                className={`bg-white h-14 flex flex-col items-center pt-1.5 gap-1 transition-colors hover:bg-[#8B1A1A]/5 ${
                  isSel ? "bg-[#8B1A1A]/8 ring-1 ring-inset ring-[#8B1A1A]/20" : ""
                }`}
              >
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                  isHoje ? "bg-[#8B1A1A] text-white font-bold" :
                  isSel  ? "text-[#8B1A1A] font-bold" :
                  "text-gray-700"
                }`}>
                  {diaNum}
                </span>
                {ps.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center px-1">
                    {ps.slice(0, 3).map((p, pi) => (
                      <span key={pi} className={`w-1.5 h-1.5 rounded-full ${getDotColor([p])}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Vencido</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Urgente (≤3d)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Pendente</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Cumprido</span>
        </div>
      </div>

      {/* Painel lateral do dia selecionado */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
        <h3 className="text-xs font-bold text-gray-700 mb-3">
          {diaSel
            ? new Date(diaSel + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
            : "Selecione um dia"}
        </h3>
        {prazosNoDiaSel.length === 0 ? (
          <p className="text-xs text-gray-400 mt-4 text-center">Nenhum prazo neste dia.</p>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1">
            {prazosNoDiaSel.map(prazo => {
              const isLoading = atualizando === prazo.id;
              return (
                <div key={prazo.id} className={`p-3 rounded-lg border text-xs ${
                  prazo.status === "CONCLUIDO" ? "bg-green-50 border-green-100" :
                  parseLocalDate(prazo.dataVencimento) < hoje && prazo.status === "PENDENTE" ? "bg-red-50 border-red-100" :
                  "bg-gray-50 border-gray-100"
                }`}>
                  <p className={`font-semibold leading-snug mb-1 ${prazo.status === "CONCLUIDO" ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {prazo.titulo}
                  </p>
                  {prazo.descricao && <p className="text-gray-500 mb-1.5 text-[10px]">{prazo.descricao.slice(0, 80)}</p>}
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[9px] text-gray-500 font-medium">
                      {TIPO_LABELS[prazo.tipo] ?? prazo.tipo}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <button onClick={() => onEdit(prazo)} className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-[#8B1A1A]">
                        <Pencil size={11} />
                      </button>
                      {prazo.status === "PENDENTE" ? (
                        <button onClick={() => onMarcar(prazo.id, "CONCLUIDO")} disabled={isLoading} className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-green-600">
                          {isLoading ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                        </button>
                      ) : prazo.status === "CONCLUIDO" ? (
                        <button onClick={() => onMarcar(prazo.id, "PENDENTE")} disabled={isLoading} className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-amber-600">
                          {isLoading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                        </button>
                      ) : null}
                      <button onClick={() => onExcluir(prazo.id)} disabled={isLoading} className="p-1 hover:bg-white rounded transition-colors text-gray-400 hover:text-red-500">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [prazos, setPrazos]           = useState<Prazo[]>([]);
  const [todosOsPrazos, setTodosOsPrazos] = useState<Prazo[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE");
  const [viewMode, setViewMode]       = useState<"lista" | "calendario">("lista");
  const [listMode, setListMode]       = useState<"proximos" | "todos">("proximos");
  const [modalAberto, setModalAberto] = useState(false);
  const [prazoEditando, setPrazoEditando] = useState<Prazo | undefined>(undefined);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      // Para lista: filtro normal
      const params = new URLSearchParams();
      if (statusFiltro) params.set("status", statusFiltro);
      if (listMode === "proximos") params.set("upcoming", "30");
      const [resLista, resTodos] = await Promise.all([
        fetch(`/api/v1/prazos?${params}`),
        fetch("/api/v1/prazos?limit=500"),
      ]);
      const dataLista = await resLista.json();
      const dataTodos = await resTodos.json();
      setPrazos(dataLista.prazos ?? []);
      setTotal(dataLista.total ?? 0);
      setTodosOsPrazos(dataTodos.prazos ?? []);
    } finally {
      setLoading(false);
    }
  }, [statusFiltro, listMode]);

  useEffect(() => { buscar(); }, [buscar]);

  const hoje = new Date();

  const vencidos  = prazos.filter(p => parseLocalDate(p.dataVencimento) < hoje && p.status === "PENDENTE");
  const proximos7 = prazos.filter(p => {
    const diff = Math.ceil((parseLocalDate(p.dataVencimento).getTime() - hoje.getTime()) / 86400000);
    return diff >= 0 && diff <= 7 && p.status === "PENDENTE";
  });

  const getDias = (data: string) =>
    Math.ceil((parseLocalDate(data).getTime() - hoje.getTime()) / 86400000);

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

  const abrirEdicao = (p: Prazo) => {
    setPrazoEditando(p);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPrazoEditando(undefined);
  };

  return (
    <>
      {modalAberto && (
        <ModalPrazo
          prazoInicial={prazoEditando}
          onClose={fecharModal}
          onSalvo={buscar}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={20} className="text-[#8B1A1A]" />
              Agenda & Prazos
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} prazo{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle lista/calendário */}
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode("lista")}
                className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === "lista" ? "bg-[#8B1A1A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List size={13} /> Lista
              </button>
              <button
                onClick={() => setViewMode("calendario")}
                className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === "calendario" ? "bg-[#8B1A1A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Calendar size={13} /> Calendário
              </button>
            </div>

            <button
              onClick={buscar}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atualizar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => { setPrazoEditando(undefined); setModalAberto(true); }}
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

        {/* Calendário */}
        {viewMode === "calendario" ? (
          loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-gray-300" />
            </div>
          ) : (
            <CalendarioView
              prazos={todosOsPrazos}
              onEdit={abrirEdicao}
              onMarcar={marcarStatus}
              onExcluir={excluir}
              atualizando={atualizando}
            />
          )
        ) : (
          <>
            {/* Filtros lista */}
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
                    onClick={() => setListMode(v)}
                    className={`px-4 py-2 text-xs font-medium transition-colors ${
                      listMode === v
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
                  onClick={() => { setPrazoEditando(undefined); setModalAberto(true); }}
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
                  const isLoading = atualizando === prazo.id;

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
                          {parseLocalDate(prazo.dataVencimento).toLocaleDateString("pt-BR", {
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
                        <button
                          onClick={() => abrirEdicao(prazo)}
                          title="Editar"
                          className="p-2 text-gray-300 hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/5 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>

                        {prazo.status === "PENDENTE" ? (
                          <button
                            onClick={() => marcarStatus(prazo.id, "CONCLUIDO")}
                            disabled={isLoading}
                            title="Marcar como cumprido"
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                          </button>
                        ) : prazo.status === "CONCLUIDO" ? (
                          <button
                            onClick={() => marcarStatus(prazo.id, "PENDENTE")}
                            disabled={isLoading}
                            title="Reabrir prazo"
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                          </button>
                        ) : null}

                        <button
                          onClick={() => excluir(prazo.id)}
                          disabled={isLoading}
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
          </>
        )}
      </div>
    </>
  );
}
