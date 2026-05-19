"use client";

import { useState } from "react";
import { Settings, User, Shield, Bell, Palette, Building2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Aba = "escritorio" | "conta" | "notificacoes" | "seguranca";

export default function ConfiguracoesPage() {
  const [aba, setAba] = useState<Aba>("escritorio");

  const abas: { id: Aba; label: string; icon: React.ElementType }[] = [
    { id: "escritorio", label: "Escritório", icon: Building2 },
    { id: "conta", label: "Minha Conta", icon: User },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "seguranca", label: "Segurança", icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings size={20} className="text-[#c9a84c]" />
          Configurações
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Gerencie as preferências do sistema</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Menu lateral */}
        <aside className="md:w-48 shrink-0">
          <nav className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {abas.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => setAba(a.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left border-b border-gray-50 last:border-0 ${
                    aba === a.id
                      ? "bg-[#c9a84c]/8 text-[#c9a84c]"
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
          {aba === "escritorio" && <AbaEscritorio />}
          {aba === "conta" && <AbaConta />}
          {aba === "notificacoes" && <AbaNotificacoes />}
          {aba === "seguranca" && <AbaSeguranca />}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full" />
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

const input = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c] transition-colors";

function SaveButton({ loading }: { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
      {loading ? "Salvando..." : "Salvar"}
    </button>
  );
}

function AbaEscritorio() {
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Dados salvos!"); }, 800);
  };
  return (
    <form onSubmit={submit}>
      <Section title="Dados do Escritório">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Escritório">
            <input defaultValue="Cezaro Costa Advocacia e Consultoria Jurídica" className={input} />
          </Field>
          <Field label="OAB">
            <input placeholder="OAB/RJ 000000" className={input} />
          </Field>
          <Field label="Telefone">
            <input placeholder="(00) 00000-0000" className={input} />
          </Field>
          <Field label="E-mail de Contato">
            <input type="email" placeholder="contato@escritorio.adv.br" className={input} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Endereço Completo">
              <input placeholder="Rua, número, bairro, cidade - UF" className={input} />
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

function AbaConta() {
  return (
    <Section title="Minha Conta">
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p>As informações da sua conta (nome, e-mail, foto) são gerenciadas pelo <strong>Clerk</strong>.</p>
        <p className="mt-1.5">Clique na sua foto de perfil no canto superior direito para editar.</p>
      </div>
    </Section>
  );
}

function AbaNotificacoes() {
  const [email, setEmail] = useState(true);
  const [prazo, setPrazo] = useState(true);
  const [intimacao, setIntimacao] = useState(true);
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Preferências salvas!"); }, 800);
  };

  const Toggle = ({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button type="button" onClick={() => onChange(!value)} className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? "bg-[#c9a84c]" : "bg-gray-200"}`}>
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

function AbaSeguranca() {
  return (
    <Section title="Segurança">
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p>A segurança da sua conta é gerenciada pelo <strong>Clerk</strong>, incluindo alteração de senha e autenticação em dois fatores.</p>
        <p className="mt-1.5">Clique na sua foto de perfil → <em>Gerenciar conta</em> para acessar as opções de segurança.</p>
      </div>
    </Section>
  );
}
