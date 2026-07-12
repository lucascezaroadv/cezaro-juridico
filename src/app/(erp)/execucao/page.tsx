"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Zap, RefreshCw, ChevronRight, FileSearch, Upload, Sparkles,
  CheckCircle2, XCircle, Clock, MinusCircle, ChevronDown, ChevronUp,
  FileText, Download, Search, Building2, Car, Landmark, CreditCard,
  Scale, ShieldAlert, AlertCircle, Loader2, X, Printer,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatarData } from "@/shared/utils/formatters";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type Diligencia = {
  id: string;
  tipo: string;
  resultado: string;
  observacoes: string | null;
  data: string;
  processo: { id: string; numero: string; areaJuridica: string };
};

type Stat = { resultado: string; _count: { _all: number } };

type StatusMedida = "pendente" | "em_andamento" | "positivo" | "negativo" | "nao_aplicavel";

type MedidaItem = {
  id: string;
  nome: string;
  descricao: string;
  status: StatusMedida;
  observacao: string;
  data?: string;
  aiPreenchido?: boolean;
};

type Categoria = {
  id: string;
  nome: string;
  icone: React.ReactNode;
  cor: string;
  medidas: MedidaItem[];
};

type ProcessoBasico = { id: string; numero: string; parteContraria?: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const TIPO_LABELS: Record<string, string> = {
  SISBAJUD: "SISBAJUD", RENAJUD: "RENAJUD", INFOJUD: "INFOJUD",
  PENHORA: "Penhora", LEILAO: "Leilão", CITACAO: "Citação",
  INTIMACAO_EXECUTADO: "Intim. Executado", OUTROS: "Outros",
};

const RESULTADO_COLORS: Record<string, string> = {
  PENDENTE: "bg-amber-50 text-amber-700 border-amber-100",
  POSITIVO: "bg-green-50 text-green-700 border-green-100",
  NEGATIVO: "bg-red-50 text-red-700 border-red-100",
  PARCIAL: "bg-blue-50 text-blue-700 border-blue-100",
};

const STATUS_CONFIG: Record<StatusMedida, { label: string; cor: string; icone: React.ReactNode }> = {
  pendente:       { label: "Pendente",      cor: "bg-gray-100 text-gray-500 border-gray-200",   icone: <Clock size={12} /> },
  em_andamento:   { label: "Em andamento",  cor: "bg-blue-50 text-blue-600 border-blue-200",    icone: <Loader2 size={12} className="animate-spin" /> },
  positivo:       { label: "Positivo",      cor: "bg-green-50 text-green-700 border-green-200", icone: <CheckCircle2 size={12} /> },
  negativo:       { label: "Negativo",      cor: "bg-red-50 text-red-600 border-red-200",       icone: <XCircle size={12} /> },
  nao_aplicavel:  { label: "N/A",           cor: "bg-purple-50 text-purple-500 border-purple-200", icone: <MinusCircle size={12} /> },
};

function criarCategorias(): Categoria[] {
  return [
    {
      id: "financeiro",
      nome: "Bloqueio Financeiro",
      icone: <CreditCard size={16} />,
      cor: "text-emerald-600",
      medidas: [
        { id: "SISBAJUD", nome: "SISBAJUD", descricao: "Bloqueio de contas bancárias via sistema do Banco Central", status: "pendente", observacao: "" },
        { id: "CCS", nome: "CCS — Cadastro de Clientes do Sistema Financeiro", descricao: "Consulta de relacionamentos bancários do devedor", status: "pendente", observacao: "" },
        { id: "CRIPTOJUD", nome: "CRIPTOJUD", descricao: "Bloqueio de criptoativos em exchanges nacionais", status: "pendente", observacao: "" },
        { id: "Penhora_Creditos", nome: "Penhora de Créditos", descricao: "Penhora de créditos a receber, duplicatas, precatórios", status: "pendente", observacao: "" },
        { id: "Penhora_Salario", nome: "Penhora de Salário/Proventos", descricao: "Penhora de até 30% dos rendimentos mensais (art. 833, §2º CPC)", status: "pendente", observacao: "" },
      ],
    },
    {
      id: "veiculos",
      nome: "Veículos e Transportes",
      icone: <Car size={16} />,
      cor: "text-blue-600",
      medidas: [
        { id: "RENAJUD", nome: "RENAJUD", descricao: "Consulta e bloqueio de veículos no DETRAN/DENATRAN", status: "pendente", observacao: "" },
        { id: "Bloqueio_Veiculo", nome: "Restrição de Transferência RENAJUD", descricao: "Impedimento de transferência e alienação de veículos", status: "pendente", observacao: "" },
        { id: "Suspensao_CNH", nome: "Suspensão da CNH", descricao: "Suspensão da carteira de motorista (art. 139, III CPC — medidas coercitivas)", status: "pendente", observacao: "" },
      ],
    },
    {
      id: "imoveis",
      nome: "Imóveis e Patrimônio",
      icone: <Building2 size={16} />,
      cor: "text-orange-600",
      medidas: [
        { id: "CNIB", nome: "CNIB — Central de Indisponibilidade de Bens", descricao: "Decretação de indisponibilidade de bens imóveis", status: "pendente", observacao: "" },
        { id: "Cartorio_Imoveis", nome: "Cartório de Registro de Imóveis", descricao: "Pesquisa e penhora de imóveis em cartório", status: "pendente", observacao: "" },
        { id: "IPTU", nome: "IPTU — Prefeitura Municipal", descricao: "Consulta de imóveis registrados via cadastro municipal", status: "pendente", observacao: "" },
        { id: "ITR", nome: "ITR — Receita Federal (Imóvel Rural)", descricao: "Consulta de propriedades rurais na Receita Federal", status: "pendente", observacao: "" },
        { id: "Penhora_Imovel", nome: "Penhora de Imóvel", descricao: "Registro de penhora sobre bem imóvel localizado", status: "pendente", observacao: "" },
      ],
    },
    {
      id: "empresarial",
      nome: "Patrimônio Empresarial",
      icone: <Landmark size={16} />,
      cor: "text-violet-600",
      medidas: [
        { id: "Junta_Comercial", nome: "Junta Comercial", descricao: "Consulta de participação societária e bens empresariais", status: "pendente", observacao: "" },
        { id: "Receita_CNPJ", nome: "Receita Federal — CNPJ", descricao: "Pesquisa de CNPJs vinculados ao devedor (sócios, administradores)", status: "pendente", observacao: "" },
        { id: "Penhora_Quotas", nome: "Penhora de Quotas Societárias", descricao: "Penhora da participação do devedor em sociedades", status: "pendente", observacao: "" },
        { id: "Desconsideracao_PJ", nome: "Desconsideração da Personalidade Jurídica", descricao: "Redirecionamento da execução à pessoa jurídica controlada pelo devedor (arts. 133-137 CPC)", status: "pendente", observacao: "" },
        { id: "Habilitacao_Falencia", nome: "Habilitação em Falência/Recuperação", descricao: "Habilitação do crédito em processo falimentar ou de recuperação judicial", status: "pendente", observacao: "" },
        { id: "Restricao_Licitacoes", nome: "Restrição de Licitações (CEIS/CNEP)", descricao: "Inclusão do devedor em cadastros de restrição de contratos públicos", status: "pendente", observacao: "" },
      ],
    },
    {
      id: "informacoes",
      nome: "Localização e Informações",
      icone: <Search size={16} />,
      cor: "text-cyan-600",
      medidas: [
        { id: "INFOJUD", nome: "INFOJUD — Declarações IR", descricao: "Consulta de declarações de Imposto de Renda do devedor", status: "pendente", observacao: "" },
        { id: "SNIPER", nome: "SNIPER — PGFN", descricao: "Sistema Nacional de Pesquisa de Informações em Execução", status: "pendente", observacao: "" },
        { id: "SERP", nome: "SERP — Receita Federal", descricao: "Sistema Eletrônico de Recuperação de Precatórios", status: "pendente", observacao: "" },
        { id: "IDPJ", nome: "IDPJ — Identificação de Pessoas Jurídicas", descricao: "Consulta de patrimônio de pessoas jurídicas junto à Receita Federal", status: "pendente", observacao: "" },
      ],
    },
    {
      id: "coercitivas",
      nome: "Medidas Coercitivas",
      icone: <ShieldAlert size={16} />,
      cor: "text-red-600",
      medidas: [
        { id: "Protesto", nome: "Protesto da Decisão/Certidão", descricao: "Protesto extrajudicial do título executivo", status: "pendente", observacao: "" },
        { id: "SPC_SERASA", nome: "SPC/SERASA — Negativação", descricao: "Negativação do devedor em bureaus de crédito", status: "pendente", observacao: "" },
        { id: "Apreensao_Passaporte", nome: "Apreensão de Passaporte", descricao: "Apreensão do passaporte para devedores inadimplentes (art. 139, IV CPC)", status: "pendente", observacao: "" },
        { id: "Redirecionamento_Socios", nome: "Redirecionamento contra Sócios", descricao: "Inclusão de sócios e ex-sócios no polo passivo da execução", status: "pendente", observacao: "" },
      ],
    },
    {
      id: "processuais",
      nome: "Atos Processuais",
      icone: <Scale size={16} />,
      cor: "text-amber-600",
      medidas: [
        { id: "Citacao", nome: "Citação do Executado", descricao: "Confirmação da citação válida do executado", status: "pendente", observacao: "" },
        { id: "Intimacao_Executado", nome: "Intimação para Pagar/Embargar", descricao: "Prazo de 3 dias para pagamento ou embargos (art. 829 CPC)", status: "pendente", observacao: "" },
        { id: "Avaliacao_Bens", nome: "Avaliação de Bens Penhorados", descricao: "Laudo de avaliação dos bens constritos", status: "pendente", observacao: "" },
        { id: "Leilao", nome: "Leilão / Hasta Pública", descricao: "Alienação judicial dos bens penhorados", status: "pendente", observacao: "" },
        { id: "Adjudicacao", nome: "Adjudicação pelo Credor", descricao: "Recebimento do bem pelo exequente em pagamento do crédito", status: "pendente", observacao: "" },
      ],
    },
  ];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcularProgresso(cats: Categoria[]) {
  const todas = cats.flatMap(c => c.medidas);
  const total = todas.length;
  const feitas = todas.filter(m => m.status !== "pendente").length;
  const positivas = todas.filter(m => m.status === "positivo").length;
  const negativas = todas.filter(m => m.status === "negativo").length;
  return { total, feitas, positivas, negativas };
}

function storageKey(processoId: string) {
  return `execucao_ficha_${processoId}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status, onChange }: { status: StatusMedida; onChange: (s: StatusMedida) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const opcoes: StatusMedida[] = ["pendente", "em_andamento", "positivo", "negativo", "nao_aplicavel"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium whitespace-nowrap ${cfg.cor} transition-colors`}
      >
        {cfg.icone}
        {cfg.label}
        <ChevronDown size={9} className="opacity-60" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-lg border border-gray-200 shadow-lg py-1 w-40 text-[11px]">
            {opcoes.map(op => {
              const c = STATUS_CONFIG[op];
              return (
                <button
                  key={op}
                  onClick={() => { onChange(op); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 ${status === op ? "font-semibold" : ""}`}
                >
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${c.cor}`}>
                    {c.icone} {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function MedidaRow({
  medida,
  onStatusChange,
  onObsChange,
}: {
  medida: MedidaItem;
  onStatusChange: (id: string, s: StatusMedida) => void;
  onObsChange: (id: string, obs: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const isFeita = medida.status !== "pendente";

  return (
    <div className={`border-b border-gray-50 last:border-0 transition-colors ${isFeita ? "" : "opacity-80 hover:opacity-100"}`}>
      <div className="flex items-start gap-3 px-4 py-3">
        {/* status indicator */}
        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
          medida.status === "positivo" ? "bg-green-500" :
          medida.status === "negativo" ? "bg-red-400" :
          medida.status === "em_andamento" ? "bg-blue-400 animate-pulse" :
          medida.status === "nao_aplicavel" ? "bg-purple-400" :
          "bg-gray-300"
        }`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-800">{medida.nome}</span>
            {medida.aiPreenchido && (
              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-[#8B1A1A]/10 text-[#8B1A1A] rounded font-medium">
                <Sparkles size={8} /> IA
              </span>
            )}
            {medida.data && (
              <span className="text-[10px] text-gray-400">{medida.data}</span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{medida.descricao}</p>

          {/* obs inline */}
          {(expandido || medida.observacao) && (
            <input
              type="text"
              value={medida.observacao}
              onChange={e => onObsChange(medida.id, e.target.value)}
              placeholder="Observação (resultado, valor, data da diligência...)"
              className="mt-2 w-full text-xs px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:border-[#8B1A1A]/40 bg-gray-50/50"
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusPill status={medida.status} onChange={s => onStatusChange(medida.id, s)} />
          <button
            onClick={() => setExpandido(e => !e)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Adicionar observação"
          >
            {expandido ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoriaCard({
  categoria,
  onStatusChange,
  onObsChange,
}: {
  categoria: Categoria;
  onStatusChange: (catId: string, medidaId: string, s: StatusMedida) => void;
  onObsChange: (catId: string, medidaId: string, obs: string) => void;
}) {
  const [aberta, setAberta] = useState(true);
  const feitas = categoria.medidas.filter(m => m.status !== "pendente").length;
  const total = categoria.medidas.length;
  const positivas = categoria.medidas.filter(m => m.status === "positivo").length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setAberta(a => !a)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors text-left"
      >
        <span className={categoria.cor}>{categoria.icone}</span>
        <span className="flex-1 text-sm font-semibold text-gray-800">{categoria.nome}</span>
        <div className="flex items-center gap-2 text-[10px]">
          {positivas > 0 && (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium border border-green-100">
              {positivas} positivo{positivas !== 1 ? "s" : ""}
            </span>
          )}
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
            {feitas}/{total}
          </span>
          {aberta ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {aberta && (
        <div className="border-t border-gray-50">
          {categoria.medidas.map(m => (
            <MedidaRow
              key={m.id}
              medida={m}
              onStatusChange={(id, s) => onStatusChange(categoria.id, id, s)}
              onObsChange={(id, obs) => onObsChange(categoria.id, id, obs)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExecucaoPage() {
  // Painel Geral state
  const [diligencias, setDiligencias] = useState<Diligencia[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingDilig, setLoadingDilig] = useState(true);
  const [erroDilig, setErroDilig] = useState(false);
  const [resultadoFiltro, setResultadoFiltro] = useState("");

  // Tab
  const [aba, setAba] = useState<"painel" | "ficha">("ficha");

  // Ficha state
  const [processos, setProcessos] = useState<ProcessoBasico[]>([]);
  const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoBasico | null>(null);
  const [buscaProcesso, setBuscaProcesso] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>(criarCategorias());
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [erroAnalise, setErroAnalise] = useState("");
  const [resultadoIA, setResultadoIA] = useState<{
    resumo?: string;
    recomendacoes_ia?: string[];
    valor_total_bloqueado?: string;
    fase_atual?: string;
    _bruto?: { id: string; status: string; observacao: string; data?: string }[];
    _mapeadas?: number;
  } | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // ── Load diligências
  const buscarDiligencias = useCallback(async () => {
    setLoadingDilig(true);
    setErroDilig(false);
    try {
      const params = new URLSearchParams();
      if (resultadoFiltro) params.set("resultado", resultadoFiltro);
      const res = await fetch(`/api/v1/diligencias?${params}`);
      if (!res.ok) throw new Error("Erro na resposta do servidor");
      const data = await res.json();
      setDiligencias(data.diligencias ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? []);
    } catch {
      setErroDilig(true);
    } finally {
      setLoadingDilig(false);
    }
  }, [resultadoFiltro]);

  useEffect(() => { if (aba === "painel") buscarDiligencias(); }, [aba, buscarDiligencias]);

  // ── Load processos para selector
  useEffect(() => {
    fetch("/api/v1/processos?limit=100")
      .then(r => r.json())
      .then(d => setProcessos(d.processos ?? d ?? []))
      .catch(() => {});
  }, []);

  // ── Persist ficha per processo
  useEffect(() => {
    if (!processoSelecionado) return;
    const key = storageKey(processoSelecionado.id);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: { categorias: Categoria[] } = JSON.parse(saved);
        setCategorias(parsed.categorias);
        return;
      } catch { /* ignore */ }
    }
    setCategorias(criarCategorias());
    setResultadoIA(null);
    setArquivo(null);
    setErroAnalise("");
  }, [processoSelecionado]);

  function salvarFicha(cats: Categoria[]) {
    if (!processoSelecionado) return;
    localStorage.setItem(storageKey(processoSelecionado.id), JSON.stringify({ categorias: cats }));
  }

  // ── Status / obs change
  function onStatusChange(catId: string, medidaId: string, status: StatusMedida) {
    setCategorias(prev => {
      const next = prev.map(c => c.id !== catId ? c : {
        ...c,
        medidas: c.medidas.map(m => m.id !== medidaId ? m : { ...m, status }),
      });
      salvarFicha(next);
      return next;
    });
  }

  function onObsChange(catId: string, medidaId: string, observacao: string) {
    setCategorias(prev => {
      const next = prev.map(c => c.id !== catId ? c : {
        ...c,
        medidas: c.medidas.map(m => m.id !== medidaId ? m : { ...m, observacao }),
      });
      salvarFicha(next);
      return next;
    });
  }

  // ── Drag & drop
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setArquivo(f);
  }

  // ── AI analysis
  async function analisarComIA() {
    if (!arquivo || !processoSelecionado) return;
    setAnalisando(true);
    setErroAnalise("");
    try {
      const form = new FormData();
      form.append("arquivo", arquivo);
      const res = await fetch("/api/ia/analisar-execucao", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro na análise");

      // Pre-fill checklist — matching em 3 camadas para máxima cobertura
      const medidasIA: { id: string; status: string; observacao: string; data?: string }[] = data.medidas_realizadas ?? [];

      console.log("[IA] medidas_realizadas brutas:", JSON.stringify(medidasIA, null, 2));

      const statusMap: Record<string, StatusMedida> = {
        positivo: "positivo", negativo: "negativo", parcial: "em_andamento",
      };

      // Normalização agressiva: remove acentos, espaços, underscores, traços, tudo minúsculo
      const norm = (s: string) =>
        s.toLowerCase()
          .normalize("NFD").replace(/[̀-ͯ]/g, "")
          .replace(/[\s_\-/()]/g, "");

      let totalMapeadas = 0;

      setCategorias(prev => {
        const next = prev.map(cat => ({
          ...cat,
          medidas: cat.medidas.map(m => {
            const mIdNorm = norm(m.id);
            const mNomeNorm = norm(m.nome);

            const found = medidasIA.find(ai => {
              const aiIdNorm = norm(ai.id);
              // 1) ID exato
              if (aiIdNorm === mIdNorm) return true;
              // 2) Nome exato normalizado
              if (aiIdNorm === mNomeNorm) return true;
              // 3) ID da IA contém o ID do checklist (ou vice-versa)
              if (aiIdNorm.includes(mIdNorm) || mIdNorm.includes(aiIdNorm)) return true;
              // 4) Nome da IA contém palavras-chave do nome da medida
              const palavras = m.nome.split(/[\s/\-—]+/).filter(p => p.length > 4);
              return palavras.length > 0 && palavras.every(p => norm(ai.id).includes(norm(p)));
            });

            if (!found) return m;
            totalMapeadas++;
            console.log(`[IA] Match: "${found.id}" → "${m.id}" (${found.status})`);
            return {
              ...m,
              status: statusMap[found.status] ?? "em_andamento",
              observacao: found.observacao || m.observacao,
              data: found.data || m.data,
              aiPreenchido: true,
            };
          }),
        }));
        salvarFicha(next);
        return next;
      });

      if (medidasIA.length === 0) {
        toast.info("IA não identificou medidas com menção explícita no documento. Preencha o checklist manualmente.");
      } else {
        toast.success(`IA identificou ${medidasIA.length} ocorrência${medidasIA.length !== 1 ? "s" : ""} — ${totalMapeadas} mapeada${totalMapeadas !== 1 ? "s" : ""} no checklist`);
      }

      setResultadoIA({
        resumo: data.resumo,
        recomendacoes_ia: data.recomendacoes_ia,
        valor_total_bloqueado: data.valor_total_bloqueado,
        fase_atual: data.fase_atual,
        _bruto: medidasIA,
        _mapeadas: totalMapeadas,
      });
    } catch (e) {
      setErroAnalise(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setAnalisando(false);
    }
  }

  // ── Export TXT
  function exportarTxt() {
    if (!processoSelecionado) return;
    const prog = calcularProgresso(categorias);
    let txt = `FICHA DE EXECUÇÃO — Processo ${processoSelecionado.numero}\n`;
    txt += `Gerado em: ${new Date().toLocaleDateString("pt-BR")}\n`;
    txt += `Progresso: ${prog.feitas}/${prog.total} medidas verificadas | ${prog.positivas} positivas | ${prog.negativas} negativas\n\n`;
    categorias.forEach(cat => {
      txt += `\n== ${cat.nome} ==\n`;
      cat.medidas.forEach(m => {
        txt += `[${STATUS_CONFIG[m.status].label}] ${m.nome}`;
        if (m.observacao) txt += ` — ${m.observacao}`;
        if (m.data) txt += ` (${m.data})`;
        txt += "\n";
      });
    });
    if (resultadoIA?.recomendacoes_ia?.length) {
      txt += "\n== RECOMENDAÇÕES DA IA ==\n";
      resultadoIA.recomendacoes_ia.forEach((r, i) => { txt += `${i + 1}. ${r}\n`; });
    }
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ficha-execucao-${processoSelecionado.numero.replace(/\D/g, "")}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }

  // ── Export PDF (via janela de impressão estilizada)
  function exportarPDF() {
    if (!processoSelecionado) return;
    const prog = calcularProgresso(categorias);
    const data = new Date().toLocaleDateString("pt-BR");

    const statusIcon: Record<StatusMedida, string> = {
      pendente: "○", em_andamento: "◎", positivo: "✔", negativo: "✘", nao_aplicavel: "—",
    };
    const statusColor: Record<StatusMedida, string> = {
      pendente: "#9ca3af", em_andamento: "#3b82f6", positivo: "#16a34a", negativo: "#dc2626", nao_aplicavel: "#a855f7",
    };

    const recsHtml = resultadoIA?.recomendacoes_ia?.length
      ? `<div class="section">
          <h2>Recomendações da IA</h2>
          <ul>${resultadoIA.recomendacoes_ia.map(r => `<li>${r}</li>`).join("")}</ul>
        </div>`
      : "";

    const catsHtml = categorias.map(cat => `
      <div class="section">
        <h2>${cat.nome}</h2>
        <table>
          <thead><tr><th style="width:32px"></th><th>Medida</th><th style="width:100px">Status</th><th>Observação</th></tr></thead>
          <tbody>
            ${cat.medidas.map(m => `
              <tr>
                <td style="text-align:center;font-size:14px;color:${statusColor[m.status]}">${statusIcon[m.status]}</td>
                <td>${m.nome}${m.aiPreenchido ? ' <span class="ai-tag">IA</span>' : ""}${m.data ? ` <span class="date">${m.data}</span>` : ""}</td>
                <td><span class="badge" style="color:${statusColor[m.status]};border-color:${statusColor[m.status]}">${STATUS_CONFIG[m.status].label}</span></td>
                <td class="obs">${m.observacao || ""}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`).join("");

    const html = `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8">
<title>Ficha de Execução — ${processoSelecionado.numero}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; padding: 32px; }
  header { border-bottom: 2px solid #8B1A1A; padding-bottom: 12px; margin-bottom: 20px; }
  header h1 { font-size: 16px; font-weight: 700; color: #8B1A1A; }
  header .meta { margin-top: 4px; color: #666; font-size: 10px; }
  .progress { display: flex; gap: 16px; margin-bottom: 20px; }
  .progress-item { background: #f8f8f8; border: 1px solid #e5e5e5; border-radius: 6px; padding: 8px 12px; }
  .progress-item .num { font-size: 18px; font-weight: 700; }
  .progress-item .lbl { font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: .05em; }
  .section { margin-bottom: 20px; page-break-inside: avoid; }
  .section h2 { font-size: 11px; font-weight: 700; color: #374151; background: #f3f4f6; padding: 5px 10px; border-radius: 4px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .04em; }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 9px; color: #9ca3af; text-transform: uppercase; padding: 4px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; }
  td { padding: 4px 8px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .badge { font-size: 9px; padding: 1px 5px; border: 1px solid; border-radius: 3px; white-space: nowrap; }
  .ai-tag { font-size: 8px; background: #fee2e2; color: #8B1A1A; border-radius: 2px; padding: 0 3px; margin-left: 3px; }
  .date { font-size: 9px; color: #9ca3af; margin-left: 4px; }
  .obs { color: #6b7280; font-size: 10px; }
  ul { padding-left: 16px; }
  ul li { margin-bottom: 3px; }
  footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #9ca3af; text-align: center; }
  @media print { body { padding: 0; } @page { margin: 16mm; } }
</style>
</head><body>
<header>
  <h1>Ficha de Execução</h1>
  <div class="meta">Processo: <strong>${processoSelecionado.numero}</strong>${processoSelecionado.parteContraria ? ` · Parte: ${processoSelecionado.parteContraria}` : ""} · Gerado em ${data} pelo sistema Cezaro Costa Advocacia</div>
</header>
<div class="progress">
  <div class="progress-item"><div class="num">${prog.feitas}/${prog.total}</div><div class="lbl">Verificadas</div></div>
  <div class="progress-item" style="border-color:#86efac"><div class="num" style="color:#16a34a">${prog.positivas}</div><div class="lbl">Positivas</div></div>
  <div class="progress-item" style="border-color:#fca5a5"><div class="num" style="color:#dc2626">${prog.negativas}</div><div class="lbl">Negativas</div></div>
  <div class="progress-item"><div class="num" style="color:#9ca3af">${prog.total - prog.feitas}</div><div class="lbl">Pendentes</div></div>
</div>
${resultadoIA?.resumo ? `<div class="section"><h2>Resumo da IA</h2><p style="padding:8px 0;color:#374151;line-height:1.5">${resultadoIA.resumo}</p></div>` : ""}
${catsHtml}
${recsHtml}
<footer>Gerado automaticamente pelo módulo de Execução com IA — Cezaro Costa Advocacia e Consultoria Jurídica</footer>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
  }

  const prog = calcularProgresso(categorias);
  const pendentes = stats.find(s => s.resultado === "PENDENTE")?._count._all ?? 0;
  const positivos = stats.find(s => s.resultado === "POSITIVO")?._count._all ?? 0;
  const processosFiltrados = processos.filter(p =>
    !buscaProcesso || p.numero.includes(buscaProcesso) ||
    (p.parteContraria ?? "").toLowerCase().includes(buscaProcesso.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-[#8B1A1A]" />
            Execução e Recuperação de Crédito
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie diligências e gere fichas completas de execução com IA
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "painel" as const, label: "Painel Geral", icon: <RefreshCw size={14} /> },
          { id: "ficha" as const, label: "Ficha de Execução", icon: <FileSearch size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAba(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              aba === tab.id
                ? "border-[#8B1A1A] text-[#8B1A1A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ PAINEL GERAL ═══ */}
      {aba === "painel" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{total} diligência{total !== 1 ? "s" : ""} · {pendentes} pendentes · {positivos} positivos</p>
            <button onClick={buscarDiligencias} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw size={16} className={loadingDilig ? "animate-spin" : ""} />
            </button>
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["PENDENTE", "POSITIVO", "NEGATIVO", "PARCIAL"].map(res => {
                const count = stats.find(s => s.resultado === res)?._count._all ?? 0;
                return (
                  <div key={res} className={`rounded-xl border p-4 ${RESULTADO_COLORS[res] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                    <p className="text-lg font-bold">{count}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wide mt-0.5">{res}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
              {[
                { value: "", label: "Todas" },
                { value: "PENDENTE", label: "Pendentes" },
                { value: "POSITIVO", label: "Positivos" },
                { value: "NEGATIVO", label: "Negativos" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setResultadoFiltro(opt.value)}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    resultadoFiltro === opt.value ? "bg-[#8B1A1A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {erroDilig && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-sm text-red-700">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>Erro ao carregar diligências.</span>
              <button onClick={buscarDiligencias} className="ml-auto text-xs underline">Tentar novamente</button>
            </div>
          )}
          {loadingDilig ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : diligencias.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">
              <Zap size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma diligência encontrada</p>
              <p className="text-xs mt-1 opacity-70">Use a Ficha de Execução para gerar diligências com IA</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {diligencias.map((d, i) => (
                <div key={d.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${i > 0 ? "border-t border-gray-50" : ""}`}>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${RESULTADO_COLORS[d.resultado] ?? ""}`}>
                    {d.resultado}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-800">{TIPO_LABELS[d.tipo] ?? d.tipo}</span>
                      <span className="text-[10px] text-gray-400">{formatarData(d.data)}</span>
                    </div>
                    {d.observacoes && <p className="text-xs text-gray-500 leading-relaxed">{d.observacoes}</p>}
                    <Link href={`/processos/${d.processo.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#8B1A1A] hover:underline mt-1">
                      <span className="font-mono">{d.processo.numero}</span>
                      <ChevronRight size={9} />
                    </Link>
                  </div>
                  <StatusBadge status={d.processo.areaJuridica} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ FICHA DE EXECUÇÃO ═══ */}
      {aba === "ficha" && (
        <div className="space-y-5">
          {/* Step 1 — Selecionar processo */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#8B1A1A] text-white text-[10px] flex items-center justify-center font-bold">1</span>
              Selecionar Processo de Execução
            </h2>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={buscaProcesso}
                onChange={e => setBuscaProcesso(e.target.value)}
                placeholder="Buscar por número ou parte contrária..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40"
              />
            </div>
            {processoSelecionado ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-[#8B1A1A]/5 border border-[#8B1A1A]/20 rounded-lg">
                <FileText size={16} className="text-[#8B1A1A]" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800 font-mono">{processoSelecionado.numero}</p>
                  {processoSelecionado.parteContraria && (
                    <p className="text-[10px] text-gray-500 mt-0.5">{processoSelecionado.parteContraria}</p>
                  )}
                </div>
                <button onClick={() => { setProcessoSelecionado(null); setCategorias(criarCategorias()); setResultadoIA(null); }} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-50">
                {processosFiltrados.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">Nenhum processo encontrado</p>
                ) : processosFiltrados.slice(0, 20).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProcessoSelecionado(p)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={13} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-mono text-gray-700">{p.numero}</span>
                      {p.parteContraria && <span className="text-[10px] text-gray-400 ml-2">{p.parteContraria}</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {processoSelecionado && (
            <>
              {/* Step 2 — Upload PDF */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B1A1A] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Carregar Processo para Análise com IA
                  <span className="text-[10px] text-gray-400 font-normal ml-1">(opcional)</span>
                </h2>

                {!arquivo ? (
                  <div
                    ref={dropRef}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#8B1A1A]/30 hover:bg-[#8B1A1A]/2 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("pdf-input")?.click()}
                  >
                    <Upload size={24} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">Arraste o PDF do processo aqui</p>
                    <p className="text-xs text-gray-400 mt-1">ou clique para selecionar · máx. 10 MB</p>
                    <input
                      id="pdf-input"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={e => setArquivo(e.target.files?.[0] ?? null)}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                      <FileText size={16} className="text-green-600" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">{arquivo.name}</p>
                        <p className="text-[10px] text-gray-500">{(arquivo.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                      <button onClick={() => setArquivo(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    </div>

                    {erroAnalise && (
                      <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                        <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700">{erroAnalise}</p>
                      </div>
                    )}

                    <button
                      onClick={analisarComIA}
                      disabled={analisando}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      {analisando ? (
                        <><Loader2 size={15} className="animate-spin" /> Analisando processo com IA...</>
                      ) : (
                        <><Sparkles size={15} /> Analisar com IA e pré-preencher Ficha</>
                      )}
                    </button>
                  </div>
                )}

                {/* IA result summary */}
                {resultadoIA && (
                  <div className="mt-4 space-y-3">
                    {/* Banner de diagnóstico — sempre visível */}
                    <div className={`px-4 py-3 rounded-lg border flex items-start gap-2 ${
                      (resultadoIA._bruto?.length ?? 0) === 0
                        ? "bg-amber-50 border-amber-100"
                        : "bg-[#8B1A1A]/5 border-[#8B1A1A]/15"
                    }`}>
                      <Sparkles size={13} className={`mt-0.5 flex-shrink-0 ${(resultadoIA._bruto?.length ?? 0) === 0 ? "text-amber-500" : "text-[#8B1A1A]"}`} />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {(resultadoIA._bruto?.length ?? 0) === 0
                            ? "IA não encontrou medidas com menção explícita neste documento"
                            : `IA encontrou ${resultadoIA._bruto?.length} medida${(resultadoIA._bruto?.length ?? 0) !== 1 ? "s" : ""} — ${resultadoIA._mapeadas ?? 0} marcada${(resultadoIA._mapeadas ?? 0) !== 1 ? "s" : ""} no checklist`
                          }
                        </p>
                        {(resultadoIA._bruto?.length ?? 0) === 0 && (
                          <p className="text-[10px] text-amber-700 mt-0.5">O documento pode não conter registros de diligências realizadas, ou pode ser uma peça inicial. Preencha o checklist manualmente.</p>
                        )}
                      </div>
                    </div>

                    {/* O que a IA encontrou (lista das ocorrências brutas) */}
                    {(resultadoIA._bruto?.length ?? 0) > 0 && (
                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-3 py-2 border-b border-gray-50">O que a IA identificou no documento</p>
                        {resultadoIA._bruto!.map((m, i) => (
                          <div key={i} className={`flex items-start gap-2 px-3 py-2 text-xs ${i > 0 ? "border-t border-gray-50" : ""}`}>
                            <span className={`mt-0.5 text-[10px] px-1.5 py-0.5 rounded border font-medium whitespace-nowrap ${
                              m.status === "positivo" ? "bg-green-50 text-green-700 border-green-100" :
                              m.status === "negativo" ? "bg-red-50 text-red-600 border-red-100" :
                              "bg-blue-50 text-blue-600 border-blue-100"
                            }`}>{m.status}</span>
                            <div>
                              <span className="font-mono font-semibold text-gray-700">{m.id}</span>
                              {m.observacao && <span className="text-gray-400 ml-2">{m.observacao}</span>}
                              {m.data && <span className="text-gray-300 ml-1">({m.data})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {resultadoIA.resumo && (
                      <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Resumo</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{resultadoIA.resumo}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {resultadoIA.fase_atual && (
                        <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wide">Fase atual</p>
                          <p className="text-gray-700 mt-0.5">{resultadoIA.fase_atual}</p>
                        </div>
                      )}
                      {resultadoIA.valor_total_bloqueado && resultadoIA.valor_total_bloqueado !== "null" && (
                        <div className="px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                          <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide">Total bloqueado</p>
                          <p className="text-gray-700 font-mono mt-0.5">{resultadoIA.valor_total_bloqueado}</p>
                        </div>
                      )}
                    </div>
                    {resultadoIA.recomendacoes_ia && resultadoIA.recomendacoes_ia.length > 0 && (
                      <div className="px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-2">Próximas medidas recomendadas</p>
                        <ul className="space-y-1">
                          {resultadoIA.recomendacoes_ia.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                              <ChevronRight size={11} className="text-amber-500 mt-0.5 flex-shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 3 — Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8B1A1A] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    Ficha de Execução — Checklist de Medidas
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportarPDF}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#8B1A1A] hover:bg-[#6B1010] rounded-lg transition-colors"
                    >
                      <Printer size={12} />
                      Exportar PDF
                    </button>
                    <button
                      onClick={exportarTxt}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download size={12} />
                      TXT
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500">Progresso das medidas</span>
                    <span className="font-semibold text-gray-700">{prog.feitas}/{prog.total} verificadas</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8B1A1A] rounded-full transition-all duration-300"
                      style={{ width: `${prog.total ? (prog.feitas / prog.total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px]">
                    <span className="text-green-600 font-medium">{prog.positivas} positivas</span>
                    <span className="text-red-500 font-medium">{prog.negativas} negativas</span>
                    <span className="text-gray-400">{prog.total - prog.feitas} pendentes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {categorias.map(cat => (
                    <CategoriaCard
                      key={cat.id}
                      categoria={cat}
                      onStatusChange={onStatusChange}
                      onObsChange={onObsChange}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-2 items-center text-[10px] text-gray-500">
                  <span className="font-medium">Legenda:</span>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <span key={key} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${cfg.cor}`}>
                      {cfg.icone} {cfg.label}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {!processoSelecionado && (
            <div className="bg-white rounded-xl border border-gray-100 py-20 text-center text-gray-400">
              <FileSearch size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Selecione um processo acima</p>
              <p className="text-xs mt-1 opacity-70">para acessar a ficha de execução</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
