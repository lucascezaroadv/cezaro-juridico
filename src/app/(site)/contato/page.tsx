"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Loader2, ArrowRight } from "lucide-react";

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setEnviado(true);
  };

  const inputCls =
    "w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10 transition-all bg-white placeholder:text-gray-400 font-[family-name:var(--font-lato)]";

  const infos = [
    {
      icon: Phone,
      label: "Telefone / WhatsApp",
      value: "(00) 00000-0000",
      href: "https://wa.me/5500000000000",
      sub: "Atendimento de segunda a sexta",
    },
    {
      icon: Mail,
      label: "E-mail",
      value: "contato@cezarocosta.adv.br",
      href: "mailto:contato@cezarocosta.adv.br",
      sub: "Resposta em até 24h úteis",
    },
    {
      icon: MapPin,
      label: "Endereço",
      value: "Rua Exemplo, 123 — Centro",
      sub: "Cidade — Estado, CEP 00000-000",
    },
    {
      icon: Clock,
      label: "Horário de Atendimento",
      value: "Segunda a Sexta",
      sub: "08h às 18h",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-[family-name:var(--font-lato)]">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#8B1A1A] pt-32 pb-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <MessageCircle size={12} />
            Fale Conosco
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-white font-bold mb-5">
            Estamos prontos para<br />
            <em className="not-italic font-light">ouvir e ajudar</em>
          </h1>
          <div className="h-px w-12 bg-white/30 mx-auto mb-6" />
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            Entre em contato com nossa equipe. Respondemos rapidamente para entender sua necessidade
            e indicar o melhor caminho jurídico.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-5 gap-12">

          {/* Informações de contato */}
          <div className="md:col-span-2 space-y-10">
            <div>
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#1A0A0A] font-bold mb-8">
                Informações de Contato
              </h2>
              <div className="space-y-6">
                {infos.map((info) => (
                  <div key={info.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#8B1A1A]/8 flex items-center justify-center shrink-0">
                      <info.icon size={17} className="text-[#8B1A1A]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#3D2020]/50 uppercase tracking-[0.2em] mb-0.5">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[#1A0A0A] hover:text-[#8B1A1A] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-[#1A0A0A]">{info.value}</p>
                      )}
                      <p className="text-xs text-[#3D2020]/40 mt-0.5">{info.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#8B1A1A] p-6">
              <h3 className="font-[family-name:var(--font-cormorant)] text-xl text-white font-bold mb-2">
                Prefere o WhatsApp?
              </h3>
              <p className="text-white/60 text-sm mb-5 leading-relaxed">
                Atendimento rápido e direto com nossa equipe.
              </p>
              <a
                href="https://wa.me/5500000000000?text=Olá! Gostaria de agendar uma consulta com a Cezaro Costa Advocacia."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-bold transition-colors w-full justify-center"
              >
                <MessageCircle size={16} />
                Iniciar conversa
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Horário destaque */}
            <div className="border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[#8B1A1A]" />
                <span className="text-xs font-bold text-[#3D2020]/60 uppercase tracking-wide">
                  Disponibilidade
                </span>
              </div>
              <p className="text-sm text-[#1A0A0A] font-semibold">Segunda a Sexta</p>
              <p className="text-sm text-[#3D2020]/55">08h às 18h</p>
              <p className="text-xs text-[#3D2020]/40 mt-2">
                Consultas urgentes: WhatsApp disponível fora do horário comercial.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="md:col-span-3">
            {enviado ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-[#F8F6F4] border border-gray-100">
                <div className="w-16 h-16 bg-[#8B1A1A] flex items-center justify-center mx-auto mb-5">
                  <Send size={24} className="text-white" />
                </div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#1A0A0A] font-bold mb-3">
                  Mensagem enviada!
                </h3>
                <p className="text-sm text-[#3D2020]/55 max-w-xs leading-relaxed">
                  Recebemos sua mensagem e entraremos em contato em breve. Obrigado pelo interesse!
                </p>
              </div>
            ) : (
              <div className="bg-[#F8F6F4] border border-gray-100 p-8 md:p-10">
                <h2 className="font-[family-name:var(--font-cormorant)] text-2xl text-[#1A0A0A] font-bold mb-2">
                  Envie uma mensagem
                </h2>
                <p className="text-[#3D2020]/50 text-sm mb-8">
                  Preencha o formulário e retornaremos em até 24h úteis.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3D2020]/60 uppercase tracking-wide mb-1.5">
                        Nome completo *
                      </label>
                      <input
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3D2020]/60 uppercase tracking-wide mb-1.5">
                        Telefone / WhatsApp
                      </label>
                      <input
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2020]/60 uppercase tracking-wide mb-1.5">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="seu@email.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2020]/60 uppercase tracking-wide mb-1.5">
                      Assunto *
                    </label>
                    <select
                      name="assunto"
                      value={form.assunto}
                      onChange={handleChange}
                      required
                      className={inputCls}
                    >
                      <option value="">Selecione o assunto</option>
                      <option value="Consulta Trabalhista">Consulta Trabalhista</option>
                      <option value="Direito Empresarial">Direito Empresarial</option>
                      <option value="Recuperação de Crédito">Recuperação de Crédito</option>
                      <option value="LGPD">LGPD / Proteção de Dados</option>
                      <option value="Contratos">Elaboração/Revisão de Contratos</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Consultoria Preventiva">Consultoria Preventiva</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D2020]/60 uppercase tracking-wide mb-1.5">
                      Mensagem *
                    </label>
                    <textarea
                      name="mensagem"
                      value={form.mensagem}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Descreva sua necessidade ou dúvida..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full py-4 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-bold tracking-wide transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {enviando ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {enviando ? "Enviando..." : "Enviar Mensagem"}
                  </button>

                  <p className="text-xs text-[#3D2020]/35 text-center">
                    Suas informações são tratadas com sigilo absoluto conforme nossa política de privacidade.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
