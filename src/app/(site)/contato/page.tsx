"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Loader2 } from "lucide-react";

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    // Simula envio — integrar com e-mail/CRM conforme necessário
    await new Promise(r => setTimeout(r, 1200));
    setEnviando(false);
    setEnviado(true);
  };

  const inputCls = "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors bg-white";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#060d1a] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">
            <MessageCircle size={14} />
            Fale Conosco
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Estamos prontos para<br />
            <span className="text-[#c9a84c]">ouvir e ajudar</span>
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Entre em contato com nossa equipe. Respondemos rapidamente para entender sua necessidade e indicar o melhor caminho.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Informações de contato */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Informações de Contato</h2>
              <div className="space-y-5">
                {[
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
                ].map(info => (
                  <div key={info.label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                      <info.icon size={18} className="text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-semibold text-gray-800 hover:text-[#c9a84c] transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">{info.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5500000000000?text=Olá! Gostaria de agendar uma consulta com a Cezaro Costa Advocacia."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full py-3.5 px-5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-bold rounded-xl transition-colors"
            >
              <MessageCircle size={18} className="text-[#c9a84c]" />
              Iniciar conversa no WhatsApp
            </a>
          </div>

          {/* Formulário */}
          <div className="md:col-span-3">
            {enviado ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Send size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mensagem enviada!</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Recebemos sua mensagem e entraremos em contato em breve. Obrigado pelo interesse!
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Envie uma mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome completo *</label>
                      <input name="nome" value={form.nome} onChange={handleChange} required
                        placeholder="Seu nome" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Telefone / WhatsApp</label>
                      <input name="telefone" value={form.telefone} onChange={handleChange}
                        placeholder="(00) 00000-0000" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      placeholder="seu@email.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Assunto *</label>
                    <select name="assunto" value={form.assunto} onChange={handleChange} required className={inputCls}>
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mensagem *</label>
                    <textarea name="mensagem" value={form.mensagem} onChange={handleChange} required
                      rows={5} placeholder="Descreva sua necessidade ou dúvida..."
                      className={`${inputCls} resize-none`} />
                  </div>
                  <button type="submit" disabled={enviando}
                    className="w-full py-3.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {enviando ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {enviando ? "Enviando..." : "Enviar Mensagem"}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
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
