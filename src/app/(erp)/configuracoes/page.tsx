"use client";

import { useState, useEffect } from "react";
import {
  Settings, User, Shield, Bell, Building2, Save, Loader2,
  Mail, CheckCircle, AlertCircle, RefreshCw, Unlink, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

type Aba = "escritorio" | "conta" | "integracoes" | "notificacoes" | "seguranca";

export default function ConfiguracoesPage() {
  const [aba, setAba] = useState<Aba>("escritorio");

  // Lê parâmetro ?gmail= na URL para mostrar feedback após callback OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gmail = params.get("gmail");
    if (gmail === "conectado") { toast.success("Gmail conectado com sucesso!"); setAba("integracoes"); }
    if (gmail === "erro")      { toast.error("Erro ao conectar Gmail. Tente novamente."); setAba("integracoes"); }
    // Limpa o parâmetro da URL sem recarregar
    if (gmail) window.history.replaceState({}, "", "/configuracoes");
  }, []);

  const abas: { id: Aba; label: string; icon: React.ElementType }[] = [
    { id: "escritorio",   label: "Escritório",    icon: Building2 },
    { id: "conta",        label: "Minha Conta",   icon: User },
    { id: "integracoes",  label: "Integrações",   icon: Mail },
    { id: "notificacoes", label: "Notificações",  icon: Bell },
    { id: "seguranca",    label: "Segurança",     icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={20} className="text-[#8B1A1A]" />
          Configurações
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie as preferências do sistema</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Menu lateral */}
        <aside className="md:w-48 shrink-0">
          <nav className="bg-white border border-gray-100 overflow-hidden">
            {abas.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => setAba(a.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b border-gray-50 last:border-0 ${
                    aba === a.id
                      ? "bg-[#8B1A1A]/6 text-[#8B1A1A] border-l-2 border-l-[#8B1A1A]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {a.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Conteúdo */}
        <div className="flex-1">
          {aba === "escritorio"   && <AbaEscritorio />}
          {aba === "conta"        && <AbaConta />}
          {aba === "integracoes"  && <AbaIntegracoes />}
          {aba === "notificacoes" && <AbaNotificacoes />}
          {aba === "seguranca"    && <AbaSeguranca />}
        </div>
      </div>
    </div>
  );
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-gray-100 p-6 mb-4">
      <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#8B1A1A] rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40 transition-colors bg-white";

function SaveButton({ loading }: { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-medium transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
      {loading ? "Salvando..." : "Salvar"}
    </button>
  );
}

// ─── Aba Escritório ───────────────────────────────────────────────────────────

const ESCRITORIO_KEY = "cfg_escritorio";
type EscritorioData = { nome: string; oab: string; telefone: string; email: string; endereco: string };

function AbaEscritorio() {
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState<EscritorioData>({
    nome: "Cezaro Costa Advocacia e Consultoria Jurídica",
    oab: "", telefone: "", email: "", endereco: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ESCRITORIO_KEY);
      if (saved) setDados(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const set = (k: keyof EscritorioData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados(prev => ({ ...prev, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem(ESCRITORIO_KEY, JSON.stringify(dados));
      toast.success("Dados do escritório salvos!");
    } catch {
      toast.error("Erro ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <Section title="Dados do Escritório">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Escritório">
            <input value={dados.nome} onChange={set("nome")} className={inputCls} />
          </Field>
          <Field label="OAB">
            <input value={dados.oab} onChange={set("oab")} placeholder="OAB/SP 000000" className={inputCls} />
          </Field>
          <Field label="Telefone">
            <input value={dados.telefone} onChange={set("telefone")} placeholder="(00) 00000-0000" className={inputCls} />
          </Field>
          <Field label="E-mail de Contato">
            <input type="email" value={dados.email} onChange={set("email")} placeholder="contato@escritorio.adv.br" className={inputCls} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Endereço Completo">
              <input value={dados.endereco} onChange={set("endereco")} placeholder="Rua, número, bairro, cidade - UF" className={inputCls} />
            </Field>
          </div>
        </div>
      </Section>
      <div className="flex justify-end">
        <SaveButton loading={loading} />
      </div>
    </form>
  );
}

// ─── Aba Conta ────────────────────────────────────────────────────────────────

function AbaConta() {
  return (
    <Section title="Minha Conta">
      <div className="text-sm text-gray-500 bg-gray-50 p-4 border border-gray-100">
        <p>As informações da sua conta são gerenciadas internamente pelo sistema.</p>
        <p className="mt-1.5">Contate o administrador para alterar nome, e-mail ou senha.</p>
      </div>
    </Section>
  );
}

// ─── Aba Integrações — Gmail ──────────────────────────────────────────────────

type GmailStatus = {
  conectado: boolean;
  googleEmail?: string;
  ultimaSync?: string;
  totalImportado?: number;
  tokenValido?: boolean;
};

function AbaIntegracoes() {
  const [status, setStatus]           = useState<GmailStatus | null>(null);
  const [carregando, setCarregando]   = useState(true);
  const [desconectando, setDesconectando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  const carregarStatus = async () => {
    try {
      const res = await fetch("/api/integracoes/gmail/status");
      setStatus(await res.json());
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarStatus(); }, []);

  const desconectar = async () => {
    if (!confirm("Deseja desconectar o Gmail? As intimações já importadas serão mantidas.")) return;
    setDesconectando(true);
    await fetch("/api/integracoes/gmail/status", { method: "DELETE" });
    toast.success("Gmail desconectado.");
    setStatus({ conectado: false });
    setDesconectando(false);
  };

  const sincronizar = async () => {
    setSincronizando(true);
    try {
      const res = await fetch("/api/integracoes/gmail/sincronizar", { method: "POST" });
      const data: { msg?: string; importadas?: number; error?: string } = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erro na sincronização"); return; }
      toast.success(data.msg ?? `${data.importadas} intimações importadas`);
      carregarStatus();
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <>
      <Section title="Integração com Gmail">
        {carregando ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            Verificando conexão...
          </div>
        ) : status?.conectado ? (
          // ── Conectado ──────────────────────────────────────────────────────
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100">
              <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Gmail conectado</p>
                <p className="text-xs text-green-700 mt-0.5">{status.googleEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#F8F6F4] p-3 border border-gray-100">
                <p className="text-xl font-bold text-[#8B1A1A]">{status.totalImportado ?? 0}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Intimações importadas</p>
              </div>
              <div className="bg-[#F8F6F4] p-3 border border-gray-100">
                <p className="text-xs font-semibold text-gray-700">
                  {status.ultimaSync
                    ? new Date(status.ultimaSync).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
                    : "Nunca"}
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Última sincronização</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-[#F8F6F4] p-3 border border-gray-100 leading-relaxed">
              O sistema lê e-mails dos seguintes tribunais: <strong>PJe</strong> (TRT, TRF, Justiça Federal), <strong>e-SAJ</strong> (TJSP), <strong>EPROC</strong> (TJSP), além de qualquer sistema que envie e-mails com domínio <code className="text-[10px] bg-white px-1">@jus.br</code>. Processa os últimos 90 dias de e-mails.
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={sincronizar}
                disabled={sincronizando}
                className="flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                <RefreshCw size={14} className={sincronizando ? "animate-spin" : ""} />
                {sincronizando ? "Sincronizando..." : "Sincronizar agora"}
              </button>
              <button
                onClick={desconectar}
                disabled={desconectando}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 text-sm font-medium transition-colors"
              >
                <Unlink size={14} />
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          // ── Não conectado ──────────────────────────────────────────────────
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100">
              <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Gmail não conectado</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Conecte sua conta Google para importar automaticamente as intimações recebidas por e-mail dos sistemas PJe, e-SAJ, EPROC e outros tribunais.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm text-gray-600">
              <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Como funciona:</p>
              {[
                "O sistema lê apenas e-mails de tribunais (domínio @jus.br)",
                "Usa IA para extrair: número do processo, prazo, vara e urgência",
                "Vincula automaticamente ao processo já cadastrado no sistema",
                "Não lê nem acessa outros e-mails pessoais",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#8B1A1A]/10 text-[#8B1A1A] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/api/auth/google"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-semibold transition-colors"
            >
              <Mail size={15} />
              Conectar Gmail
              <ExternalLink size={12} className="opacity-60" />
            </a>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Ao conectar, você autoriza leitura somente de e-mails. O sistema não envia, não deleta e não modifica nenhuma mensagem.
              A autorização pode ser revogada a qualquer momento nesta página ou em{" "}
              <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline">myaccount.google.com/permissions</a>.
            </p>
          </div>
        )}
      </Section>

      {/* Outros sistemas — roadmap */}
      <section className="bg-white border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-200 rounded-full" />
          Próximas integrações
        </h2>
        <div className="space-y-2">
          {[
            { nome: "Outlook / Microsoft 365",  desc: "Leitura de e-mails via Microsoft Graph API" },
            { nome: "PJe — consulta direta",     desc: "Acesso ao portal do PJe com seu CPF/OAB" },
            { nome: "DataJud / CNJ",             desc: "Monitoramento de movimentações via API do CNJ" },
          ].map(item => (
            <div key={item.nome} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-xs font-semibold text-gray-700">{item.nome}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Em breve</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Aba Notificações ─────────────────────────────────────────────────────────

const NOTIF_KEY = "cfg_notificacoes";

function AbaNotificacoes() {
  const [email, setEmail]       = useState(true);
  const [prazo, setPrazo]       = useState(true);
  const [intimacao, setIntimacao] = useState(true);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTIF_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p.email === "boolean") setEmail(p.email);
        if (typeof p.prazo === "boolean") setPrazo(p.prazo);
        if (typeof p.intimacao === "boolean") setIntimacao(p.intimacao);
      }
    } catch { /* ignore */ }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem(NOTIF_KEY, JSON.stringify({ email, prazo, intimacao }));
      toast.success("Preferências de notificação salvas!");
    } catch {
      toast.error("Erro ao salvar preferências");
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-[#8B1A1A]" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <Section title="Preferências de Notificação">
        <Toggle value={email} onChange={setEmail} label="Notificações por e-mail" desc="Receba alertas no seu e-mail" />
        <Toggle value={prazo} onChange={setPrazo} label="Alertas de prazo" desc="Notificação 3 dias antes do vencimento" />
        <Toggle value={intimacao} onChange={setIntimacao} label="Novas intimações" desc="Alerta ao receber intimações no sistema" />
      </Section>
      <div className="flex justify-end">
        <SaveButton loading={loading} />
      </div>
    </form>
  );
}

// ─── Aba Segurança ────────────────────────────────────────────────────────────

function AbaSeguranca() {
  return (
    <Section title="Segurança">
      <div className="text-sm text-gray-500 bg-gray-50 p-4 border border-gray-100">
        <p>A segurança da sua conta é gerenciada pelo sistema interno.</p>
        <p className="mt-1.5">Contate o administrador para alterar senha ou gerenciar acessos.</p>
      </div>
    </Section>
  );
}
