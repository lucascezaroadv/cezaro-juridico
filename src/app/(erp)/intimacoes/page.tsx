"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell, AlertTriangle, RefreshCw, Eye, Plus, Mail, CheckCircle,
  Link2, Search, X, FolderOpen, Loader2, ExternalLink,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatarDataHora, formatarData } from "@/shared/utils/formatters";
import Link from "next/link";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Intimacao = {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  prazo: string | null;
  urgencia: string;
  status: string;
  fonte: string | null;
  sistemaOrigem: string | null;
  resumoIA: string | null;
  sugestaoIA: string | null;
  processo: { id: string; numero: string; areaJuridica: string } | null;
  _count: { tarefas: number };
};

type ProcessoBusca = {
  id: string;
  numero: string;
  assunto: string | null;
  areaJuridica: string;
  cliente: { nome: string };
};

type Cliente = { id: string; nome: string };

const AREAS = [
  { value: "TRABALHISTA",      label: "Trabalhista" },
  { value: "CIVIL",            label: "Civil" },
  { value: "EMPRESARIAL",      label: "Empresarial" },
  { value: "TRIBUTARIO",       label: "Tributário" },
  { value: "PREVIDENCIARIO",   label: "Previdenciário" },
  { value: "EXECUCAO_CREDITO", label: "Execução de Crédito" },
  { value: "LGPD",             label: "LGPD" },
  { value: "CONTRATOS",        label: "Contratos" },
  { value: "COMPLIANCE",       label: "Compliance" },
  { value: "CONSULTORIA",      label: "Consultoria" },
  { value: "OUTRO",            label: "Outro" },
];

// ─── Modal de vinculação ──────────────────────────────────────────────────────

function ModalVincular({
  intimacao,
  onClose,
  onVinculado,
}: {
  intimacao: Intimacao;
  onClose: () => void;
  onVinculado: (proc: { id: string; numero: string; areaJuridica: string }) => void;
}) {
  const [aba, setAba] = useState<"buscar" | "novo">("buscar");

  // Busca de processos existentes
  const [query, setQuery]             = useState("");
  const [resultados, setResultados]   = useState<ProcessoBusca[]>([]);
  const [buscando, setBuscando]       = useState(false);
  const [vinculando, setVinculando]   = useState(false);
  const debounceRef                   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cadastro de novo processo
  const [clientes, setClientes]       = useState<Cliente[]>([]);
  const [salvando, setSalvando]       = useState(false);
  const [novoProc, setNovoProc]       = useState({
    numero:       extrairNumero(intimacao.conteudo) ?? "",
    tribunal:     "",
    vara:         "",
    comarca:      "",
    uf:           "",
    areaJuridica: "TRABALHISTA",
    poloAtivo:    "",
    poloPassivo:  "",
    assunto:      intimacao.titulo,
    clienteId:    "",
  });

  // Carrega clientes para o select
  useEffect(() => {
    fetch("/api/v1/clientes?limit=100")
      .then(r => r.json())
      .then((d: { clientes?: Cliente[] }) => setClientes(d.clientes ?? []))
      .catch(() => {});
  }, []);

  // Busca com debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResultados([]); return; }
    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(`/api/v1/processos?q=${encodeURIComponent(query)}&limit=10`);
        const d: { processos?: ProcessoBusca[] } = await res.json();
        setResultados(d.processos ?? []);
      } finally {
        setBuscando(false);
      }
    }, 350);
  }, [query]);

  const vincularExistente = async (proc: ProcessoBusca) => {
    setVinculando(true);
    try {
      const res = await fetch(`/api/v1/intimacoes/${intimacao.id}/vincular`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processoId: proc.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error ?? "Erro ao vincular processo");
        return;
      }
      toast.success(`Vinculado ao processo ${proc.numero}`);
      onVinculado({ id: proc.id, numero: proc.numero, areaJuridica: proc.areaJuridica });
    } finally {
      setVinculando(false);
    }
  };

  const cadastrarNovo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProc.numero || !novoProc.clienteId) return;
    setSalvando(true);
    try {
      // 1. Cria o processo
      const res = await fetch("/api/v1/processos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novoProc }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error ?? "Erro ao cadastrar processo"); return; }
      const proc: { id: string; numero: string; areaJuridica: string } = await res.json();

      // 2. Vincula a intimação ao processo recém-criado
      await fetch(`/api/v1/intimacoes/${intimacao.id}/vincular`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processoId: proc.id }),
      });

      onVinculado(proc);
    } finally {
      setSalvando(false);
    }
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 focus:outline-none focus:border-[#8B1A1A]/40 bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-[#8B1A1A]" />
            <span className="text-sm font-bold text-gray-900">Vincular a Processo</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Intimação resumida */}
        <div className="px-5 py-3 bg-[#F8F6F4] border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-700 truncate">{intimacao.titulo}</p>
          {intimacao.fonte && <p className="text-[10px] text-[#8B1A1A] mt-0.5">{intimacao.fonte}</p>}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { id: "buscar", label: "Vincular existente", icon: Search },
            { id: "novo",   label: "Cadastrar novo",     icon: FolderOpen },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setAba(t.id as "buscar" | "novo")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${
                  aba === t.id
                    ? "text-[#8B1A1A] border-b-2 border-[#8B1A1A]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Aba buscar ── */}
          {aba === "buscar" && (
            <div className="p-5 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  autoFocus
                  placeholder="Buscar por número, cliente ou assunto..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-[#8B1A1A]/40"
                />
                {buscando && <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-300" />}
              </div>

              {resultados.length === 0 && query && !buscando && (
                <p className="text-xs text-gray-400 text-center py-4">Nenhum processo encontrado para "{query}"</p>
              )}

              {resultados.length === 0 && !query && (
                <p className="text-xs text-gray-400 text-center py-6">Digite o número do processo ou nome do cliente para buscar</p>
              )}

              <div className="space-y-1.5">
                {resultados.map(proc => (
                  <button
                    key={proc.id}
                    onClick={() => vincularExistente(proc)}
                    disabled={vinculando}
                    className="w-full text-left p-3 border border-gray-100 hover:border-[#8B1A1A]/30 hover:bg-[#8B1A1A]/5 transition-colors disabled:opacity-60"
                  >
                    <p className="text-xs font-mono font-semibold text-gray-800">{proc.numero}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500">{proc.cliente.nome}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-[10px] text-[#8B1A1A]">
                        {AREAS.find(a => a.value === proc.areaJuridica)?.label ?? proc.areaJuridica}
                      </span>
                    </div>
                    {proc.assunto && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{proc.assunto}</p>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Aba novo processo ── */}
          {aba === "novo" && (
            <form onSubmit={cadastrarNovo} className="p-5 space-y-4">
              <p className="text-xs text-gray-500 bg-[#F8F6F4] p-3 border border-gray-100 leading-relaxed">
                Preencha os dados do processo. As informações da intimação foram pré-carregadas onde possível.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Número do Processo *</label>
                  <input
                    required
                    placeholder="0000000-00.0000.0.00.0000"
                    value={novoProc.numero}
                    onChange={e => setNovoProc(p => ({ ...p, numero: e.target.value }))}
                    className={inputCls + " font-mono"}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Cliente *</label>
                  {clientes.length > 0 ? (
                    <select
                      required
                      value={novoProc.clienteId}
                      onChange={e => setNovoProc(p => ({ ...p, clienteId: e.target.value }))}
                      className={inputCls}
                    >
                      <option value="">Selecione o cliente...</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                  ) : (
                    <div className="text-xs text-amber-600 bg-amber-50 p-2 border border-amber-100">
                      Nenhum cliente cadastrado.{" "}
                      <Link href="/clientes/novo" target="_blank" className="underline">Cadastrar cliente →</Link>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Área Jurídica *</label>
                  <select
                    value={novoProc.areaJuridica}
                    onChange={e => setNovoProc(p => ({ ...p, areaJuridica: e.target.value }))}
                    className={inputCls}
                  >
                    {AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Tribunal</label>
                  <input
                    placeholder="Ex: TRT 2ª Região"
                    value={novoProc.tribunal}
                    onChange={e => setNovoProc(p => ({ ...p, tribunal: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Vara</label>
                  <input
                    placeholder="Ex: 5ª Vara do Trabalho"
                    value={novoProc.vara}
                    onChange={e => setNovoProc(p => ({ ...p, vara: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Comarca</label>
                  <input
                    placeholder="São Paulo"
                    value={novoProc.comarca}
                    onChange={e => setNovoProc(p => ({ ...p, comarca: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">UF</label>
                  <input
                    placeholder="SP"
                    maxLength={2}
                    value={novoProc.uf}
                    onChange={e => setNovoProc(p => ({ ...p, uf: e.target.value.toUpperCase() }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Polo Ativo</label>
                  <input
                    placeholder="Nome do autor"
                    value={novoProc.poloAtivo}
                    onChange={e => setNovoProc(p => ({ ...p, poloAtivo: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Polo Passivo</label>
                  <input
                    placeholder="Nome do réu"
                    value={novoProc.poloPassivo}
                    onChange={e => setNovoProc(p => ({ ...p, poloPassivo: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={salvando || !novoProc.numero || !novoProc.clienteId}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {salvando ? <><Loader2 size={14} className="animate-spin" />Cadastrando...</> : <><FolderOpen size={14} />Cadastrar e Vincular</>}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Extrai número de processo do texto
function extrairNumero(texto: string): string | null {
  const m = texto.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/);
  return m ? m[0] : null;
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function IntimacoesPage() {
  const [intimacoes, setIntimacoes] = useState<Intimacao[]>([]);
  const [total, setTotal]           = useState(0);
  const [statusFiltro, setStatusFiltro]   = useState("PENDENTE");
  const [urgenciaFiltro, setUrgenciaFiltro] = useState("");
  const [loading, setLoading]       = useState(true);
  const [selecionada, setSelecionada] = useState<Intimacao | null>(null);
  const [modalVincular, setModalVincular] = useState(false);

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFiltro)  params.set("status", statusFiltro);
      if (urgenciaFiltro) params.set("urgencia", urgenciaFiltro);
      const res = await fetch(`/api/v1/intimacoes?${params}`);
      const data = await res.json();
      setIntimacoes(data.intimacoes ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [statusFiltro, urgenciaFiltro]);

  useEffect(() => { buscar(); }, [buscar]);

  const [marcandoLida, setMarcandoLida] = useState(false);
  const marcarLida = async (id: string) => {
    if (marcandoLida) return;
    setMarcandoLida(true);
    try {
      const res = await fetch(`/api/v1/intimacoes/${id}/lida`, { method: "PATCH" });
      if (res.ok) {
        toast.success("Intimação marcada como lida");
        buscar();
      } else {
        toast.error("Erro ao marcar como lida");
      }
    } finally {
      setMarcandoLida(false);
    }
  };

  const [gerando, setGerando]               = useState(false);
  const [sincronizando, setSincronizando]   = useState(false);
  const [gmailConectado, setGmailConectado] = useState(false);
  const [ultimoSync, setUltimoSync]         = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/integracoes/gmail/status")
      .then(r => r.json())
      .then((d: { conectado: boolean; ultimaSync?: string }) => {
        setGmailConectado(d.conectado);
        if (d.ultimaSync) setUltimoSync(d.ultimaSync);
      })
      .catch(() => {});
  }, []);

  const sincronizarGmail = async () => {
    setSincronizando(true);
    try {
      const res = await fetch("/api/integracoes/gmail/sincronizar", { method: "POST" });
      const data: { msg?: string; importadas?: number; error?: string } = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro ao sincronizar Gmail"); return; }
      toast.success(data.msg ?? `${data.importadas ?? 0} intimações importadas`);
      setUltimoSync(new Date().toISOString());
      buscar();
    } finally {
      setSincronizando(false);
    }
  };

  const gerarAnalise = async (id: string) => {
    setGerando(true);
    try {
      const res = await fetch("/api/ia/resumir-intimacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intimacaoId: id }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro ao gerar análise IA"); return; }
      await buscar();
      setSelecionada(prev => prev ? { ...prev, resumoIA: data.resumoIA, sugestaoIA: data.sugestaoIA } : prev);
    } finally {
      setGerando(false);
    }
  };

  const onVinculado = (proc: { id: string; numero: string; areaJuridica: string }) => {
    setModalVincular(false);
    setSelecionada(prev => prev ? { ...prev, processo: proc } : prev);
    setIntimacoes(prev => prev.map(i => i.id === selecionada?.id ? { ...i, processo: proc } : i));
  };

  const criticas = intimacoes.filter(i => i.urgencia === "CRITICA").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* Modal vincular */}
      {modalVincular && selecionada && (
        <ModalVincular
          intimacao={selecionada}
          onClose={() => setModalVincular(false)}
          onVinculado={onVinculado}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={20} className="text-[#8B1A1A]" />
            Central de Intimações
            {criticas > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                <AlertTriangle size={11} />
                {criticas} crítica{criticas !== 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} intimaç{total !== 1 ? "ões" : "ão"}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {gmailConectado ? (
            <div className="flex flex-col items-end gap-0.5">
              <button
                onClick={sincronizarGmail}
                disabled={sincronizando}
                className="inline-flex items-center gap-2 px-3 py-2 border border-[#8B1A1A]/30 text-[#8B1A1A] hover:bg-[#8B1A1A]/5 text-xs font-medium transition-colors disabled:opacity-60"
              >
                <Mail size={14} className={sincronizando ? "animate-pulse" : ""} />
                {sincronizando ? "Sincronizando..." : "Sincronizar agora"}
                {ultimoSync && !sincronizando && <CheckCircle size={12} className="text-green-500" />}
              </button>
              <span className="text-[10px] text-gray-400">
                {ultimoSync
                  ? `Última sync: ${new Date(ultimoSync).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}`
                  : "Auto-sync ativo a cada 6h"}
              </span>
            </div>
          ) : (
            <Link
              href="/configuracoes"
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-500 hover:text-[#8B1A1A] hover:border-[#8B1A1A]/30 text-xs font-medium transition-colors"
            >
              <Mail size={14} />
              Conectar Gmail
            </Link>
          )}
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-medium transition-colors">
            <Plus size={16} />
            Nova Intimação
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex border border-gray-200 overflow-hidden">
          {[
            { value: "PENDENTE",   label: "Pendentes" },
            { value: "LIDA",       label: "Lidas" },
            { value: "PROCESSADA", label: "Processadas" },
            { value: "",           label: "Todas" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFiltro(opt.value)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                statusFiltro === opt.value ? "bg-[#8B1A1A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={urgenciaFiltro}
          onChange={e => setUrgenciaFiltro(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 bg-white focus:outline-none focus:border-[#8B1A1A]/40 text-gray-700"
        >
          <option value="">Toda urgência</option>
          <option value="CRITICA">Crítica</option>
          <option value="ALTA">Alta</option>
          <option value="NORMAL">Normal</option>
          <option value="BAIXA">Baixa</option>
        </select>

        <button onClick={buscar} className="p-2 text-gray-500 hover:bg-gray-100 transition-colors ml-auto">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Lista */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 p-4 animate-pulse">
                <div className="h-3 w-3/4 bg-gray-200 rounded mb-3" />
                <div className="h-2.5 w-full bg-gray-100 rounded mb-2" />
                <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
              </div>
            ))
          ) : intimacoes.length === 0 ? (
            <div className="bg-white border border-gray-100 py-16 text-center text-gray-400">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma intimação encontrada</p>
            </div>
          ) : (
            intimacoes.map(int => {
              const prazoVence = int.prazo ? new Date(int.prazo) : null;
              const diasPrazo  = prazoVence ? Math.ceil((prazoVence.getTime() - Date.now()) / 86400000) : null;

              return (
                <button
                  key={int.id}
                  onClick={() => setSelecionada(int)}
                  className={`w-full text-left bg-white border p-4 transition-all hover:shadow-sm ${
                    selecionada?.id === int.id
                      ? "border-[#8B1A1A]/40 bg-[#8B1A1A]/5"
                      : int.urgencia === "CRITICA"
                      ? "border-red-200 hover:border-red-300"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={`text-xs font-semibold leading-snug flex-1 ${int.status === "PENDENTE" ? "text-gray-900" : "text-gray-500"}`}>
                      {int.titulo}
                    </p>
                    <StatusBadge status={int.urgencia} />
                  </div>

                  {int.processo ? (
                    <p className="text-xs font-mono text-[#8B1A1A]/70 mb-2 truncate">{int.processo.numero}</p>
                  ) : (
                    <p className="text-[10px] text-amber-600 mb-2 flex items-center gap-1">
                      <Link2 size={10} />
                      Sem processo vinculado
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{formatarDataHora(int.dataPublicacao)}</span>
                    {diasPrazo !== null && (
                      <span className={`text-[10px] font-bold ${diasPrazo <= 0 ? "text-red-600" : diasPrazo <= 3 ? "text-orange-600" : "text-gray-500"}`}>
                        {diasPrazo <= 0 ? "Prazo vencido" : `Prazo: ${diasPrazo}d`}
                      </span>
                    )}
                  </div>

                  {int.resumoIA && (
                    <div className="mt-2 p-2 bg-blue-50 text-[10px] text-blue-700 leading-relaxed">
                      <span className="font-bold">IA: </span>{int.resumoIA}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Detalhe */}
        <div className="lg:col-span-3">
          {!selecionada ? (
            <div className="bg-white border border-gray-100 h-full min-h-64 flex items-center justify-center text-center p-10">
              <div>
                <Bell size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">Selecione uma intimação para visualizar os detalhes</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 overflow-hidden">
              {/* Header do detalhe */}
              <div className={`p-5 border-b ${
                selecionada.urgencia === "CRITICA" ? "bg-red-50 border-red-100" :
                selecionada.urgencia === "ALTA" ? "bg-orange-50 border-orange-100" : "border-gray-100"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-gray-900 leading-snug mb-2">{selecionada.titulo}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={selecionada.urgencia} />
                      <StatusBadge status={selecionada.status} />
                      <span className="text-xs text-gray-400">{formatarDataHora(selecionada.dataPublicacao)}</span>
                      {selecionada.sistemaOrigem && (
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 font-medium">
                          {selecionada.sistemaOrigem}
                        </span>
                      )}
                    </div>
                  </div>
                  {selecionada.status === "PENDENTE" && (
                    <button
                      onClick={() => marcarLida(selecionada.id)}
                      disabled={marcandoLida}
                      className="p-2 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      title="Marcar como lida"
                    >
                      {marcandoLida ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                    </button>
                  )}
                </div>

                {/* Processo vinculado ou botão vincular */}
                <div className="mt-3">
                  {selecionada.processo ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/processos/${selecionada.processo.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-gray-200 text-xs font-medium text-gray-700 hover:border-[#8B1A1A]/40 transition-colors"
                      >
                        <FolderOpen size={12} className="text-[#8B1A1A]" />
                        Processo: {selecionada.processo.numero}
                        <ExternalLink size={10} className="text-gray-400" />
                      </Link>
                      <button
                        onClick={() => setModalVincular(true)}
                        className="text-[10px] text-gray-400 hover:text-[#8B1A1A] underline"
                      >
                        Alterar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalVincular(true)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-medium transition-colors"
                    >
                      <Link2 size={12} />
                      Vincular a Processo
                    </button>
                  )}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-4">
                {selecionada.prazo && (
                  <div className={`p-3 border text-sm font-medium ${
                    new Date(selecionada.prazo) <= new Date()
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    ⏰ Prazo: {formatarData(selecionada.prazo)}
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Conteúdo Original</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 border border-gray-100">
                    {selecionada.conteudo}
                  </p>
                </div>

                {/* Análise IA */}
                <div className="bg-[#8B1A1A] p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wide">Análise da IA Jurídica</span>
                  </div>

                  {selecionada.resumoIA ? (
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide mb-1.5">Resumo</p>
                      <p className="text-sm text-white/80 leading-relaxed">{selecionada.resumoIA}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">Resumo ainda não gerado.</p>
                  )}

                  {selecionada.sugestaoIA && (
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide mb-1.5">Providências Sugeridas</p>
                      <p className="text-sm text-white/80 leading-relaxed">{selecionada.sugestaoIA}</p>
                    </div>
                  )}

                  <button
                    onClick={() => gerarAnalise(selecionada.id)}
                    disabled={gerando}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 border border-white/20"
                  >
                    {gerando && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {gerando ? "Analisando..." : "Gerar Análise com IA"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
