"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  BrainCircuit, Send, Loader2, Copy, Check, Download,
  Mic, MicOff, Upload, X, FileAudio, ChevronDown, ChevronUp,
  Sparkles, RotateCcw, User, Scale, History, Trash2,
  FileText, Search, BookOpen, Calculator, ClipboardList,
  MessageSquare, ChevronLeft, ChevronRight, AlertCircle,
  Gavel, Briefcase, Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mensagem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Conversa = {
  id: string;
  titulo: string;
  mensagens: Mensagem[];
  criadaEm: Date;
};

type Contexto = {
  tipo: string;
  modo: string;
  area: string;
  polo_ativo: string;
  polo_passivo: string;
  numero_processo: string;
  vara: string;
  comarca: string;
  tribunal: string;
  juiz: string;
  valorCausa: string;
  dataFatos: string;
  prazoResposta: string;
  jurisprudencia: string;
  informacoes: string;
  template: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MODOS = [
  { id: "REDAÇÃO", label: "Redigir Peça", icon: FileText, desc: "Elabora documento completo" },
  { id: "ANÁLISE", label: "Analisar Caso", icon: Search, desc: "Avalia riscos e chances" },
  { id: "REVISÃO", label: "Revisar Texto", icon: BookOpen, desc: "Corrige e aprimora peça" },
  { id: "ESTRATÉGIA", label: "Estratégia", icon: Gavel, desc: "Teses e abordagem ideal" },
  { id: "CÁLCULO", label: "Memória de Cálculo", icon: Calculator, desc: "Verbas e valores" },
  { id: "CHECKLIST", label: "Checklist", icon: ClipboardList, desc: "Documentos e providências" },
  { id: "CONSULTA", label: "Consulta Jurídica", icon: MessageSquare, desc: "Dúvidas e orientações" },
];

const TIPOS_PECA = [
  "── Cível ──",
  "Petição Inicial Cível",
  "Contestação",
  "Tutela de Urgência / Antecipada",
  "Medida Cautelar",
  "Apelação Cível",
  "Agravo de Instrumento",
  "Agravo Interno / Regimental",
  "Embargos de Declaração",
  "Embargos à Execução",
  "Impugnação ao Cumprimento de Sentença",
  "Embargos de Terceiro",
  "Exceção de Pré-executividade",
  "Contrarrazões de Apelação",
  "Ação Rescisória",
  "Mandado de Segurança",
  "── Trabalhista ──",
  "Petição Inicial Trabalhista",
  "Contestação Trabalhista",
  "Recurso Ordinário (TRT)",
  "Recurso de Revista (TST)",
  "Agravo de Instrumento (TRT)",
  "Embargos de Declaração (Trabalhista)",
  "Embargos à Execução (Trabalhista)",
  "Alegações Finais",
  "── Tributário / Previdenciário ──",
  "Impugnação Administrativa",
  "Ação Anulatória de Débito",
  "Mandado de Segurança Tributário",
  "Ação de Concessão de Benefício",
  "Recurso Previdenciário",
  "── Extrajudicial ──",
  "Notificação Extrajudicial",
  "Carta de Interpelação",
  "Proposta de Acordo",
  "Contrato",
  "Distrato / Rescisão",
  "Parecer Jurídico",
  "Política de Privacidade (LGPD)",
  "Regulamento Interno",
  "── Outros ──",
  "Outro (livre)",
];

const AREAS = [
  "Direito do Trabalho",
  "Direito Civil",
  "Direito do Consumidor",
  "Direito Empresarial",
  "Direito Tributário",
  "Direito Previdenciário",
  "Direito Administrativo",
  "Direito de Família",
  "Direito das Sucessões",
  "Direito Imobiliário",
  "LGPD / Proteção de Dados",
  "Recuperação Judicial / Falência",
  "Compliance / Anticorrupção",
  "Outro",
];

const TEMPLATES_RAPIDOS = [
  { id: "peticao_inicial_trabalhista", label: "Petição Trabalhista", icon: Briefcase, area: "Direito do Trabalho" },
  { id: "contestacao", label: "Contestação", icon: Shield, area: "Qualquer área" },
  { id: "recurso_ordinario", label: "Recurso Ordinário", icon: Gavel, area: "Trabalhista / Cível" },
  { id: "tutela_urgencia", label: "Tutela de Urgência", icon: AlertCircle, area: "Qualquer área" },
  { id: "notificacao_extrajudicial", label: "Notificação", icon: FileText, area: "Qualquer área" },
  { id: "parecer_juridico", label: "Parecer Jurídico", icon: BookOpen, area: "Qualquer área" },
  { id: "acordo_extrajudicial", label: "Proposta de Acordo", icon: ClipboardList, area: "Qualquer área" },
];

const SUGGESTIONS_POR_MODO: Record<string, string[]> = {
  "REDAÇÃO": [
    "Adicione pedido de danos morais com arbitramento pelo juízo",
    "Inclua requerimento de tutela antecipada de urgência",
    "Acrescente capítulo sobre litigância de má-fé do réu",
    "Reformule os pedidos de forma numerada e específica",
  ],
  "ANÁLISE": [
    "Quais os pontos mais vulneráveis da minha tese?",
    "Analise o risco de inversão do ônus da prova",
    "Avalie as chances de êxito na tutela antecipada",
    "Identifique possíveis exceções do réu à minha argumentação",
  ],
  "REVISÃO": [
    "Torne a fundamentação mais contundente",
    "Corrija a estrutura lógica dos argumentos",
    "Adeque a linguagem para peça mais formal e técnica",
    "Revise os pedidos para maior precisão",
  ],
  "ESTRATÉGIA": [
    "Qual a melhor tese para o polo ativo?",
    "Devo pedir tutela antecipada ou aguardar o mérito?",
    "Como estruturar os pedidos em ordem de preferência?",
    "Quais precedentes fortalecem minha tese?",
  ],
  "CÁLCULO": [
    "Calcule as verbas rescisórias com aviso prévio indenizado",
    "Estime o valor total das horas extras com reflexos",
    "Calcule o FGTS e a multa de 40%",
    "Memória de cálculo de férias + 1/3 e 13º salário",
  ],
  "CHECKLIST": [
    "Liste os documentos necessários para ajuizar a ação",
    "Quais providências tomar antes do prazo vencer?",
    "Checklist de diligências para a fase de execução",
    "O que verificar antes de protocolar o recurso?",
  ],
  "CONSULTA": [
    "Quais os prazos prescricionais aplicáveis ao caso?",
    "Qual o foro competente para esta ação?",
    "A empresa tem responsabilidade solidária ou subsidiária?",
    "Quais os efeitos da Reforma Trabalhista neste caso?",
  ],
};

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-gray-900 mt-5 mb-2 flex items-center gap-1.5">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-gray-900 mt-6 mb-3 pb-1.5 border-b border-gray-200">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-gray-900 mt-4 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>')
    .replace(/^---$/gm, '<hr class="border-gray-200 my-4" />')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-3 border-[#8B1A1A] pl-3 italic text-gray-600 text-xs my-2">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed text-gray-700">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm leading-relaxed text-gray-700"><span class="font-semibold">$1.</span> $2</li>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-xs px-1 py-0.5 rounded font-mono text-gray-800">$1</code>')
    .replace(/\n\n/g, '</p><p class="text-sm text-gray-700 leading-relaxed mt-3">')
    .replace(/\n/g, "<br />");
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = "assistente_juridico_historico";

function salvarHistorico(conversas: Conversa[]) {
  try {
    const serialized = conversas.slice(0, 20).map(c => ({
      ...c,
      criadaEm: c.criadaEm.toISOString(),
      mensagens: c.mensagens.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch { /* ignore */ }
}

function carregarHistorico(): Conversa[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: Record<string, unknown>) => ({
      ...c,
      criadaEm: new Date(c.criadaEm as string),
      mensagens: (c.mensagens as Record<string, unknown>[]).map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp as string),
      })),
    }));
  } catch { return []; }
}

function gerarTitulo(mensagens: Mensagem[]): string {
  const primeira = mensagens.find(m => m.role === "user")?.content ?? "";
  return primeira.slice(0, 50) + (primeira.length > 50 ? "..." : "") || "Nova conversa";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssistentePage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conversaAtualId, setConversaAtualId] = useState<string | null>(null);
  const [historico, setHistorico] = useState<Conversa[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const [contexto, setContexto] = useState<Contexto>({
    tipo: "", modo: "REDAÇÃO", area: "", polo_ativo: "", polo_passivo: "",
    numero_processo: "", vara: "", comarca: "", tribunal: "", juiz: "",
    valorCausa: "", dataFatos: "", prazoResposta: "", jurisprudencia: "",
    informacoes: "", template: "",
  });

  const [painelAberto, setPainelAberto] = useState(true);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [secaoContexto, setSecaoContexto] = useState<"basico" | "avancado" | "audio">("basico");

  // Audio
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcrevendo, setTranscrevendo] = useState(false);
  const [transcricaoConcluida, setTranscricaoConcluida] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Carregar histórico ao montar
  useEffect(() => {
    setHistorico(carregarHistorico());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Sugestões do modo atual
  const suggestions = SUGGESTIONS_POR_MODO[contexto.modo] ?? SUGGESTIONS_POR_MODO["REDAÇÃO"];

  // ── Enviar mensagem ──────────────────────────────────────────────────────────

  const enviar = useCallback(async (textoOverride?: string) => {
    const texto = (textoOverride ?? input).trim();
    if (!texto || streaming) return;

    setInput("");
    const userMsg: Mensagem = {
      id: crypto.randomUUID(),
      role: "user",
      content: texto,
      timestamp: new Date(),
    };

    const novasMensagens = [...mensagens, userMsg];
    setMensagens(novasMensagens);

    const assistantId = crypto.randomUUID();
    setMensagens(prev => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date() }]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/ia/assistente-juridico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          mensagens: novasMensagens.map(m => ({ role: m.role, content: m.content })),
          contexto: Object.values(contexto).some(v => v.trim()) ? contexto : undefined,
        }),
      });

      if (!res.body) throw new Error("Resposta sem corpo");
      if (!res.ok) {
        // Tenta extrair mensagem de erro do JSON
        const errText = await res.text();
        let errMsg = `Erro ${res.status}`;
        try { errMsg = JSON.parse(errText).error ?? errMsg; } catch { errMsg = errText || errMsg; }
        throw new Error(errMsg);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const final = acc;
        setMensagens(prev => prev.map(m => m.id === assistantId ? { ...m, content: final } : m));
      }

      // Salvar no histórico
      setMensagens(prev => {
        const finais = prev;
        const novoId = conversaAtualId ?? crypto.randomUUID();
        setConversaAtualId(novoId);

        setHistorico(hist => {
          const idx = hist.findIndex(c => c.id === novoId);
          const conv: Conversa = {
            id: novoId,
            titulo: gerarTitulo(finais),
            mensagens: finais,
            criadaEm: idx >= 0 ? hist[idx].criadaEm : new Date(),
          };
          const novoHist = idx >= 0
            ? hist.map(c => c.id === novoId ? conv : c)
            : [conv, ...hist];
          salvarHistorico(novoHist);
          return novoHist;
        });

        return finais;
      });

    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        const errMsg = (e as Error).message ?? "Erro desconhecido";
        setMensagens(prev => prev.map(m =>
          m.id === assistantId
            ? { ...m, content: `⚠️ Erro: ${errMsg}\n\nTente novamente. Se o erro persistir, verifique sua conexão ou aguarde alguns segundos.` }
            : m
        ));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, mensagens, contexto, conversaAtualId]);

  const pararGeracao = () => { abortRef.current?.abort(); setStreaming(false); };

  // ── Gerar peça a partir do contexto ─────────────────────────────────────────

  const gerarPeca = () => {
    const partes: string[] = [];
    const modo = contexto.modo || "REDAÇÃO";

    if (contexto.template) {
      partes.push(`[MODO: ${modo}]`);
      if (contexto.tipo) partes.push(`Elabore uma **${contexto.tipo}**`);
      if (contexto.area) partes.push(`na área de **${contexto.area}**`);
    } else {
      partes.push(`[MODO: ${modo}]`);
      if (contexto.tipo) partes.push(`Elabore uma **${contexto.tipo}**`);
      if (contexto.area) partes.push(`na área de **${contexto.area}**`);
    }

    if (contexto.polo_ativo) partes.push(`\n\n**Polo Ativo:** ${contexto.polo_ativo}`);
    if (contexto.polo_passivo) partes.push(`\n**Polo Passivo:** ${contexto.polo_passivo}`);
    if (contexto.numero_processo) partes.push(`\n**Processo nº:** ${contexto.numero_processo}`);
    if (contexto.vara) partes.push(`**Vara:** ${contexto.vara}`);
    if (contexto.comarca) partes.push(`**Comarca:** ${contexto.comarca}`);
    if (contexto.tribunal) partes.push(`**Tribunal:** ${contexto.tribunal}`);
    if (contexto.valorCausa) partes.push(`**Valor da causa:** R$ ${contexto.valorCausa}`);
    if (contexto.dataFatos) partes.push(`**Data dos fatos:** ${contexto.dataFatos}`);
    if (contexto.prazoResposta) partes.push(`**Prazo:** ${contexto.prazoResposta}`);
    if (contexto.jurisprudencia) partes.push(`\n\n**Jurisprudência indicada:**\n${contexto.jurisprudencia}`);
    if (contexto.informacoes) partes.push(`\n\n**Fatos e informações do caso:**\n${contexto.informacoes}`);

    const prompt = partes.join(" ") || "Com base no contexto fornecido, elabore a peça processual indicada de forma completa.";
    enviar(prompt);
  };

  // ── Carregar conversa do histórico ───────────────────────────────────────────

  const carregarConversa = (conv: Conversa) => {
    setMensagens(conv.mensagens);
    setConversaAtualId(conv.id);
    setHistoricoAberto(false);
  };

  const excluirConversa = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistorico(hist => {
      const novo = hist.filter(c => c.id !== id);
      salvarHistorico(novo);
      return novo;
    });
    if (conversaAtualId === id) novaConversa();
  };

  const novaConversa = () => {
    setMensagens([]);
    setConversaAtualId(null);
    setInput("");
    setAudioFile(null);
    setTranscricaoConcluida(false);
  };

  // ── Transcrição de áudio ─────────────────────────────────────────────────────

  const transcreverAudio = async () => {
    if (!audioFile) return;
    setTranscrevendo(true);
    const fd = new FormData();
    fd.append("audio", audioFile);
    try {
      const res = await fetch("/api/ia/transcrever-audio", { method: "POST", body: fd });
      const data = await res.json();
      if (data.transcricao) {
        setContexto(c => ({
          ...c,
          informacoes: c.informacoes
            ? `${c.informacoes}\n\n[Transcrição de áudio]\n${data.transcricao}`
            : `[Transcrição de áudio]\n${data.transcricao}`,
        }));
        setTranscricaoConcluida(true);
        setSecaoContexto("basico");
      } else {
        alert(`Erro na transcrição: ${data.error ?? "Tente novamente."}`);
      }
    } catch (err) {
      alert(`Erro: ${err instanceof Error ? err.message : "Falha ao transcrever o áudio."}`);
    } finally {
      setTranscrevendo(false);
    }
  };

  // ── Copy / Download ──────────────────────────────────────────────────────────

  const copiar = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const baixar = (content: string, tipo = "txt") => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peca-juridica-${new Date().toISOString().slice(0, 10)}.${tipo}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const modoAtual = MODOS.find(m => m.id === contexto.modo) ?? MODOS[0];
  const ModoIcon = modoAtual.icon;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="-m-4 md:-m-6 flex overflow-hidden bg-[#F8F6F4]" style={{ height: "calc(100vh - 56px)" }}>

      {/* ── Painel de contexto (desktop: lateral | mobile: overlay) ─────────── */}
      <aside className={`bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 z-20
        ${painelAberto ? "w-80 md:w-80" : "w-0 overflow-hidden"}
        fixed md:relative inset-y-0 left-0 md:inset-auto shadow-xl md:shadow-none`}
        style={{ top: 0, height: "100%" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#8B1A1A]/10 flex items-center justify-center">
              <BrainCircuit size={13} className="text-[#8B1A1A]" />
            </div>
            <span className="text-xs font-bold text-gray-900">Contexto do Caso</span>
          </div>
          <button onClick={() => setPainelAberto(false)} className="text-gray-300 hover:text-gray-600 p-1 rounded">
            <ChevronLeft size={15} />
          </button>
        </div>

        {/* Seletor de Modo */}
        <div className="px-3 py-3 border-b border-gray-100 shrink-0">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Modo de trabalho</p>
          <div className="grid grid-cols-2 gap-1.5">
            {MODOS.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setContexto(c => ({ ...c, modo: m.id }))}
                  title={m.desc}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[10px] font-semibold transition-colors text-left ${
                    contexto.modo === m.id
                      ? "bg-[#8B1A1A] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={11} />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Rápidos */}
        <div className="px-3 py-3 border-b border-gray-100 shrink-0">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Templates rápidos</p>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES_RAPIDOS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setContexto(c => ({ ...c, template: t.id, tipo: t.label, modo: "REDAÇÃO" }))}
                  title={t.area}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                    contexto.template === t.id
                      ? "bg-[#8B1A1A]/15 text-[#8B1A1A] border border-[#8B1A1A]/30"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <Icon size={10} />
                  {t.label}
                </button>
              );
            })}
            {contexto.template && (
              <button
                onClick={() => setContexto(c => ({ ...c, template: "" }))}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-red-400 hover:bg-red-50 border border-transparent"
              >
                <X size={10} />
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Tabs de seção */}
        <div className="flex border-b border-gray-100 shrink-0">
          {[
            { id: "basico", label: "Dados" },
            { id: "avancado", label: "Avançado" },
            { id: "audio", label: "Áudio", badge: transcricaoConcluida },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSecaoContexto(tab.id as "basico" | "avancado" | "audio")}
              className={`flex-1 py-2 text-[10px] font-semibold transition-colors relative ${
                secaoContexto === tab.id
                  ? "text-[#8B1A1A] border-b-2 border-[#8B1A1A]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {tab.badge && <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-green-500" />}
            </button>
          ))}
        </div>

        {/* Conteúdo da seção */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

          {secaoContexto === "basico" && (
            <>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tipo de Documento</label>
                <select
                  value={contexto.tipo}
                  onChange={e => setContexto(c => ({ ...c, tipo: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40 bg-white"
                >
                  <option value="">Selecione...</option>
                  {TIPOS_PECA.map(t => (
                    t.startsWith("──") ? (
                      <option key={t} disabled className="text-gray-400 font-bold">{t}</option>
                    ) : (
                      <option key={t} value={t}>{t}</option>
                    )
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Área Jurídica</label>
                <select
                  value={contexto.area}
                  onChange={e => setContexto(c => ({ ...c, area: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40 bg-white"
                >
                  <option value="">Selecione...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Polo Ativo (Requerente / Autor)</label>
                <input
                  placeholder="Nome completo e qualificação"
                  value={contexto.polo_ativo}
                  onChange={e => setContexto(c => ({ ...c, polo_ativo: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Polo Passivo (Requerido / Réu)</label>
                <input
                  placeholder="Nome completo e qualificação"
                  value={contexto.polo_passivo}
                  onChange={e => setContexto(c => ({ ...c, polo_passivo: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fatos, Fundamentos e Pedidos</label>
                <textarea
                  placeholder="Descreva os fatos em ordem cronológica, os fundamentos jurídicos aplicáveis e os pedidos desejados. Quanto mais detalhado, melhor será o resultado."
                  value={contexto.informacoes}
                  onChange={e => setContexto(c => ({ ...c, informacoes: e.target.value }))}
                  rows={8}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40 resize-none leading-relaxed"
                />
              </div>
            </>
          )}

          {secaoContexto === "avancado" && (
            <>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nº do Processo</label>
                <input value={contexto.numero_processo} onChange={e => setContexto(c => ({ ...c, numero_processo: e.target.value }))} placeholder="0000000-00.0000.0.00.0000" className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Vara / Juízo</label>
                <input value={contexto.vara} onChange={e => setContexto(c => ({ ...c, vara: e.target.value }))} placeholder="Ex: 5ª Vara do Trabalho" className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Comarca / Cidade</label>
                <input value={contexto.comarca} onChange={e => setContexto(c => ({ ...c, comarca: e.target.value }))} placeholder="Ex: São Paulo - SP" className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tribunal</label>
                <input value={contexto.tribunal} onChange={e => setContexto(c => ({ ...c, tribunal: e.target.value }))} placeholder="Ex: TRT 1ª Região" className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Magistrado</label>
                <input value={contexto.juiz} onChange={e => setContexto(c => ({ ...c, juiz: e.target.value }))} placeholder="Nome do juiz (opcional)" className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Valor da Causa (R$)</label>
                <input type="number" value={contexto.valorCausa} onChange={e => setContexto(c => ({ ...c, valorCausa: e.target.value }))} placeholder="0,00" className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Data dos Fatos</label>
                <input type="date" value={contexto.dataFatos} onChange={e => setContexto(c => ({ ...c, dataFatos: e.target.value }))} className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Prazo / Data-limite</label>
                <input type="date" value={contexto.prazoResposta} onChange={e => setContexto(c => ({ ...c, prazoResposta: e.target.value }))} className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jurisprudência / Precedentes (cole aqui)</label>
                <textarea
                  placeholder="Cole ementa de acórdão, número de súmula confirmado, trechos de decisões relevantes..."
                  value={contexto.jurisprudencia}
                  onChange={e => setContexto(c => ({ ...c, jurisprudencia: e.target.value }))}
                  rows={5}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B1A1A]/40 resize-none leading-relaxed"
                />
                <p className="text-[9px] text-gray-400 mt-1">Apenas precedentes fornecidos aqui serão citados com exatidão.</p>
              </div>
            </>
          )}

          {secaoContexto === "audio" && (
            <>
              <div className="text-[10px] text-gray-500 leading-relaxed bg-blue-50 border border-blue-100 rounded-lg p-3">
                Anexe a gravação de áudio da reunião com o cliente. O conteúdo será transcrito por IA e adicionado ao campo de fatos do caso.
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${audioFile ? "border-[#8B1A1A]/50 bg-[#8B1A1A]/5" : "border-gray-200 hover:border-gray-300"}`}
              >
                {audioFile ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileAudio size={16} className="text-[#8B1A1A] shrink-0" />
                      <span className="text-xs text-gray-700 truncate">{audioFile.name}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setAudioFile(null); setTranscricaoConcluida(false); }} className="text-gray-400 hover:text-red-500 shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload size={20} className="text-gray-300 mx-auto" />
                    <p className="text-[10px] text-gray-400">Clique para selecionar<br />MP3, MP4, WAV, M4A — máx. 25MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="audio/*,video/mp4,video/webm" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setAudioFile(f); setTranscricaoConcluida(false); }
                e.target.value = "";
              }} />
              {audioFile && !transcricaoConcluida && (
                <button onClick={transcreverAudio} disabled={transcrevendo} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#8B1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#6B1010] disabled:opacity-50 transition-colors">
                  {transcrevendo ? <><Loader2 size={13} className="animate-spin" />Transcrevendo...</> : <><MicOff size={13} />Transcrever Áudio</>}
                </button>
              )}
              {transcricaoConcluida && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                  <Check size={16} className="text-green-500 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-green-700">Transcrição concluída!</p>
                  <p className="text-[10px] text-green-600 mt-0.5">Conteúdo adicionado à aba Dados.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Botão Gerar */}
        <div className="px-3 py-3 border-t border-gray-100 shrink-0">
          <button
            onClick={gerarPeca}
            disabled={streaming || (!contexto.tipo && !contexto.informacoes && !contexto.template)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#8B1A1A] hover:bg-[#d4b85a] text-[#8B1A1A] text-xs font-bold rounded-xl transition-colors disabled:opacity-40"
          >
            <Sparkles size={13} />
            {streaming ? "Gerando..." : `${modoAtual.label}`}
          </button>
        </div>
      </aside>

      {/* Overlay mobile para fechar painel */}
      {painelAberto && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-10" onClick={() => setPainelAberto(false)} />
      )}

      {/* ── Área principal de chat ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Header do chat */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPainelAberto(v => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1A1A] transition-colors"
              title="Contexto do caso"
            >
              {painelAberto ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8B1A1A] flex items-center justify-center">
                <Scale size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-tight">Assistente Jurídico IA</p>
                <div className="flex items-center gap-1.5">
                  <ModoIcon size={9} className="text-[#8B1A1A]" />
                  <p className="text-[10px] text-gray-400">{modoAtual.label} · {contexto.area || "Todas as áreas"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setHistoricoAberto(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${historicoAberto ? "bg-[#8B1A1A]/10 text-[#8B1A1A]" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <History size={13} />
              <span className="hidden sm:inline">Histórico</span>
              {historico.length > 0 && <span className="w-4 h-4 rounded-full bg-gray-200 text-[9px] font-bold text-gray-600 flex items-center justify-center">{historico.length}</span>}
            </button>
            {mensagens.length > 0 && (
              <button
                onClick={novaConversa}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Nova</span>
              </button>
            )}
          </div>
        </div>

        {/* Painel de histórico (drawer) */}
        {historicoAberto && (
          <div className="absolute top-14 right-0 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-20 m-2 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800">Conversas salvas</span>
              <button onClick={() => setHistoricoAberto(false)} className="text-gray-300 hover:text-gray-600"><X size={13} /></button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {historico.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Nenhuma conversa salva ainda</p>
              ) : historico.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => carregarConversa(conv)}
                  className={`flex items-start gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 group ${conversaAtualId === conv.id ? "bg-[#8B1A1A]/5" : ""}`}
                >
                  <MessageSquare size={12} className="text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{conv.titulo}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{conv.mensagens.length} mensagens · {conv.criadaEm.toLocaleDateString("pt-BR")}</p>
                  </div>
                  <button
                    onClick={e => excluirConversa(conv.id, e)}
                    className="shrink-0 text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-6 space-y-6">
          {mensagens.length === 0 && (
            <div className="max-w-2xl mx-auto text-center pt-8 md:pt-16 space-y-6 px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#8B1A1A] flex items-center justify-center mx-auto">
                <Scale size={24} className="text-[#8B1A1A]" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Assistente Jurídico</h2>
                <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Especializado em Direito do Trabalho, Civil, Consumidor, Empresarial, Tributário, Previdenciário e LGPD. Redige, analisa, revisa e orienta com base na legislação brasileira vigente.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => enviar(s)}
                    className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 hover:border-[#8B1A1A]/50 hover:bg-[#8B1A1A]/5 transition-colors leading-relaxed"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400">
                Preencha o painel lateral com os dados do caso, ou converse diretamente.
              </p>
            </div>
          )}

          {mensagens.map(msg => (
            <div key={msg.id} className={`flex gap-2 md:gap-3 max-w-4xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === "user" ? "bg-[#3b82f6] text-white" : "bg-[#8B1A1A] text-white"}`}>
                {msg.role === "user" ? <User size={13} /> : <Scale size={13} />}
              </div>
              <div className={`flex-1 ${msg.role === "user" ? "max-w-[80%] md:max-w-[75%]" : ""}`}>
                <div className={`rounded-2xl px-4 md:px-5 py-3 md:py-4 ${msg.role === "user" ? "bg-[#8B1A1A] text-white" : "bg-white border border-gray-100 shadow-sm"}`}>
                  {msg.role === "user" ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.content ? (
                    <div
                      className="prose-sm text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: `<p class="text-sm text-gray-700 leading-relaxed">${renderMarkdown(msg.content)}</p>`,
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-xs">Elaborando resposta...</span>
                    </div>
                  )}
                </div>
                {msg.role === "assistant" && msg.content && !streaming && (
                  <div className="flex items-center gap-2 mt-1.5 px-1 flex-wrap">
                    <button onClick={() => copiar(msg.id, msg.content)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors">
                      {copiadoId === msg.id ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                      {copiadoId === msg.id ? "Copiado!" : "Copiar"}
                    </button>
                    <span className="text-gray-200 text-[10px]">·</span>
                    <button onClick={() => baixar(msg.content)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors">
                      <Download size={10} />
                      Baixar .txt
                    </button>
                    <span className="text-gray-200 text-[10px]">·</span>
                    <span className="text-[10px] text-gray-300">
                      {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-100 px-3 md:px-4 py-3 shrink-0">
          {!streaming && mensagens.length > 0 && (
            <div className="flex gap-2 mb-2.5 overflow-x-auto pb-1">
              {suggestions.slice(0, 3).map(s => (
                <button key={s} onClick={() => enviar(s)}
                  className="shrink-0 text-[10px] px-3 py-1.5 bg-gray-100 hover:bg-[#8B1A1A]/10 text-gray-600 rounded-full transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 md:gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
              placeholder="Peça uma revisão, ajuste o fundamento, inclua novos pedidos... (Enter para enviar)"
              rows={2}
              disabled={streaming}
              className="flex-1 text-sm px-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#8B1A1A]/40 focus:ring-2 focus:ring-[#8B1A1A]/10 resize-none disabled:opacity-50 leading-relaxed"
            />
            {streaming ? (
              <button onClick={pararGeracao} className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0" title="Parar">
                <X size={15} />
              </button>
            ) : (
              <button onClick={() => enviar()} disabled={!input.trim()}
                className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#8B1A1A] text-white flex items-center justify-center hover:bg-[#6B1010] disabled:opacity-30 transition-colors shrink-0">
                <Send size={15} />
              </button>
            )}
          </div>
          <p className="text-[9px] text-gray-300 text-center mt-2 hidden md:block">
            Claude · As peças devem ser revisadas e assinadas pelo advogado responsável antes do protocolo · O assistente não inventa jurisprudência
          </p>
        </div>
      </div>
    </div>
  );
}
