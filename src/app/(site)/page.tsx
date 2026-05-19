import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CreditCard,
  Shield,
  FileText,
  CheckSquare,
  Users,
  Award,
  Clock,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Star,
  Phone,
} from "lucide-react";

// Balança SVG artística grande para o hero
function HeroScaleSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full opacity-20"
      aria-hidden="true"
    >
      {/* Haste central */}
      <line x1="100" y1="20" x2="100" y2="175" />
      {/* Base */}
      <line x1="70" y1="175" x2="130" y2="175" />
      <line x1="60" y1="182" x2="140" y2="182" />
      {/* Viga horizontal */}
      <line x1="28" y1="55" x2="172" y2="55" />
      {/* Correntes esquerda */}
      <line x1="38" y1="55" x2="32" y2="78" />
      <line x1="28" y1="78" x2="42" y2="78" />
      {/* Prato esquerdo */}
      <path d="M16 78 Q26 100 50 100 Q74 100 84 78" />
      {/* Correntes direita */}
      <line x1="162" y1="55" x2="168" y2="78" />
      <line x1="158" y1="78" x2="172" y2="78" />
      {/* Prato direito */}
      <path d="M116 78 Q126 100 150 100 Q174 100 184 78" />
      {/* Detalhe topo */}
      <circle cx="100" cy="20" r="5" fill="white" stroke="none" opacity="0.4" />
      {/* Setas de equilíbrio */}
      <path d="M88 45 L100 35 L112 45" opacity="0.4" />
    </svg>
  );
}

// Balança SVG pequena para seções
function ScaleSVGSmall({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="24" y1="6" x2="24" y2="42" />
      <line x1="16" y1="42" x2="32" y2="42" />
      <line x1="8" y1="14" x2="40" y2="14" />
      <line x1="10" y1="14" x2="8" y2="22" />
      <line x1="10" y1="22" x2="6" y2="22" />
      <path d="M4 22 Q6 28 12 28 Q18 28 20 22" />
      <line x1="38" y1="14" x2="40" y2="22" />
      <line x1="40" y1="22" x2="44" y2="22" />
      <path d="M28 22 Q30 28 36 28 Q42 28 44 22" />
      <circle cx="24" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const areas = [
  {
    icon: Users,
    title: "Direito do Trabalho",
    desc: "Defesa de empregados e empregadores em reclamações trabalhistas, negociações e consultorias preventivas.",
    slug: "trabalhista",
  },
  {
    icon: Building2,
    title: "Direito Empresarial",
    desc: "Assessoria jurídica completa para empresas: constituição, contratos, reorganização societária e contencioso.",
    slug: "empresarial",
  },
  {
    icon: CreditCard,
    title: "Execução e Recuperação de Crédito",
    desc: "Estratégias avançadas de cobrança judicial, penhoras, bloqueios patrimoniais e recuperação de ativos.",
    slug: "execucao-credito",
  },
  {
    icon: Shield,
    title: "LGPD",
    desc: "Adequação à Lei Geral de Proteção de Dados, políticas de privacidade, DPO e gestão de incidentes.",
    slug: "lgpd",
  },
  {
    icon: Briefcase,
    title: "Consultoria Preventiva",
    desc: "Identificação de riscos jurídicos antes que se tornem litígios, reduzindo custos e protegendo o negócio.",
    slug: "consultoria-preventiva",
  },
  {
    icon: FileText,
    title: "Contratos",
    desc: "Elaboração, revisão e negociação de contratos empresariais com foco em segurança e clareza jurídica.",
    slug: "contratos",
  },
  {
    icon: CheckSquare,
    title: "Compliance",
    desc: "Implementação de programas de integridade, políticas internas e governança corporativa eficaz.",
    slug: "compliance",
  },
];

const diferenciais = [
  {
    icon: TrendingUp,
    title: "Inteligência Estratégica",
    desc: "Análise técnica aprofundada aliada ao uso de tecnologia jurídica de ponta para resultados superiores.",
  },
  {
    icon: Clock,
    title: "Agilidade e Transparência",
    desc: "Portal do cliente com acompanhamento em tempo real de processos, prazos e movimentações.",
  },
  {
    icon: Award,
    title: "Excelência Comprovada",
    desc: "Histórico sólido de êxito em causas complexas, com abordagem personalizada para cada cliente.",
  },
  {
    icon: Shield,
    title: "Segurança Jurídica",
    desc: "Assessoria preventiva que antecipa riscos, evita litígios e protege patrimônio e reputação.",
  },
];

const indicadores = [
  { valor: "15+", label: "Anos de Experiência" },
  { valor: "500+", label: "Casos Concluídos" },
  { valor: "98%", label: "Satisfação" },
  { valor: "7", label: "Áreas de Atuação" },
];

const depoimentos = [
  {
    texto:
      "A equipe do Cezaro Costa foi fundamental para a recuperação do nosso crédito. Processo ágil, transparente e com resultado excelente.",
    autor: "Maria S.",
    cargo: "Diretora Financeira",
  },
  {
    texto:
      "Assessoria trabalhista preventiva que evitou inúmeros processos na nossa empresa. Profissionalismo e conhecimento técnico incomparáveis.",
    autor: "João R.",
    cargo: "CEO, Empresa do Varejo",
  },
  {
    texto:
      "Adequamos nossa empresa à LGPD com total segurança. O acompanhamento foi completo e a comunicação sempre muito clara.",
    autor: "Ana C.",
    cargo: "Gestora de TI",
  },
];

export default function HomePage() {
  return (
    <div className="font-[family-name:var(--font-lato)] bg-white">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-[#8B1A1A] overflow-hidden">
        {/* Textura sutil */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Balança grande decorativa */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center pointer-events-none">
          <div className="w-[520px] h-[520px] max-w-full">
            <HeroScaleSVG />
          </div>
        </div>

        {/* Linha vertical esquerda decorativa */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-white/25 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white/80 text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-lato)]">
                Advocacia & Consultoria Jurídica
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl md:text-7xl text-white font-bold leading-[1.05] mb-6">
              Advocacia que<br />
              <em className="not-italic font-light">Transforma</em>
            </h1>

            {/* Divisor */}
            <div className="flex items-center gap-4 mb-7">
              <div className="h-px w-12 bg-white/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </div>

            <p className="text-white/75 text-lg leading-relaxed max-w-xl mb-10 font-light">
              Escritório especializado em soluções jurídicas de alto impacto. Excelência técnica,
              comprometimento absoluto e tecnologia a serviço dos seus direitos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-[#8B1A1A] font-bold text-sm tracking-wide transition-all duration-200 group"
              >
                <MessageCircle size={18} />
                Fale Conosco
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/sobre"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/40 hover:border-white/70 text-white text-sm tracking-wide transition-all duration-200"
              >
                Conheça o Escritório
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Indicadores */}
            <div className="flex flex-wrap gap-10 pt-8 border-t border-white/15">
              {indicadores.slice(0, 3).map((ind) => (
                <div key={ind.label}>
                  <div className="font-[family-name:var(--font-cormorant)] text-4xl text-white font-bold leading-none">
                    {ind.valor}
                  </div>
                  <div className="text-white/55 text-xs tracking-wide mt-1 uppercase">{ind.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── SOBRE ─────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
              O Escritório
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[#1A0A0A] font-bold leading-tight mb-5">
              Comprometimento com o seu resultado
            </h2>
            <div className="h-px w-12 bg-[#8B1A1A] mb-8" />
            <p className="text-[#3D2020]/70 leading-relaxed mb-5 text-base">
              O Cezaro Costa Advocacia é um escritório fundado sobre os pilares da excelência técnica,
              da ética profissional e da inovação jurídica. Atuamos com equipe altamente especializada,
              orientada pela construção de soluções que protegem e impulsionam nossos clientes.
            </p>
            <p className="text-[#3D2020]/70 leading-relaxed mb-10 text-base">
              Nossa abordagem une o rigor do Direito à inteligência estratégica, garantindo que cada
              caso seja tratado com a atenção personalizada que merece — seja uma empresa ou um indivíduo.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-bold tracking-wide hover:gap-3 transition-all"
            >
              Conheça nossa história <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card vermelho com diferenciais */}
          <div className="bg-[#8B1A1A] p-10 relative overflow-hidden">
            {/* Decoração */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <ScaleSVGSmall className="w-full h-full text-white" />
            </div>
            <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-white font-bold mb-8">
              Por que escolher a Cezaro Costa?
            </h3>
            <div className="space-y-6">
              {[
                "Atendimento personalizado e humanizado",
                "Tecnologia jurídica de ponta",
                "Portal do cliente com acesso em tempo real",
                "Equipe especializada e multidisciplinar",
                "Compromisso total com seus resultados",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="text-white/85 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-2 gap-6">
              {indicadores.slice(0, 2).map((ind) => (
                <div key={ind.label}>
                  <div className="font-[family-name:var(--font-cormorant)] text-3xl text-white font-bold">
                    {ind.valor}
                  </div>
                  <div className="text-white/60 text-xs mt-0.5">{ind.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÁREAS DE ATUAÇÃO ─────────────────────── */}
      <section className="py-28 bg-[#F8F6F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
              Especialidades
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-[#1A0A0A] font-bold">
              Áreas de Atuação
            </h2>
            <div className="h-px w-12 bg-[#8B1A1A] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {areas.map((area, i) => {
              const Icon = area.icon;
              const isLast = i === areas.length - 1;
              return (
                <Link
                  key={area.slug}
                  href={`/areas-de-atuacao/${area.slug}`}
                  className={`group bg-white border border-gray-100 hover:border-[#8B1A1A]/40 p-7 transition-all duration-300 hover:shadow-md${
                    isLast && areas.length % 3 !== 0 ? " lg:col-start-2" : ""
                  }`}
                >
                  <div className="w-11 h-11 bg-[#8B1A1A]/8 group-hover:bg-[#8B1A1A]/15 flex items-center justify-center mb-5 transition-colors border border-[#8B1A1A]/10">
                    <Icon className="w-5 h-5 text-[#8B1A1A]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-[#1A0A0A] text-xl font-semibold mb-3 group-hover:text-[#8B1A1A] transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-[#3D2020]/60 text-sm leading-relaxed mb-5">{area.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[#8B1A1A] text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                    Saiba mais <ArrowRight size={12} />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/areas-de-atuacao"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#8B1A1A] text-[#8B1A1A] text-sm font-bold tracking-wide hover:bg-[#8B1A1A] hover:text-white transition-all duration-200"
            >
              Ver todas as áreas <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ─────────────────────────── */}
      <section className="py-28 bg-[#8B1A1A] relative overflow-hidden">
        {/* Decoração fundo */}
        <div className="absolute right-[-60px] top-[-60px] opacity-[0.07] pointer-events-none">
          <ScaleSVGSmall className="w-80 h-80 text-white" />
        </div>
        <div className="absolute left-[-60px] bottom-[-60px] opacity-[0.05] pointer-events-none rotate-180">
          <ScaleSVGSmall className="w-80 h-80 text-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-white/60 text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
              Por que nos escolher
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-white font-bold">
              Nossos Diferenciais
            </h2>
            <div className="h-px w-12 bg-white/40 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="text-center p-6 border border-white/15 hover:border-white/35 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center mx-auto mb-5 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-white text-xl font-bold mb-3">
                    {d.title}
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RESULTADOS ───────────────────────────── */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {indicadores.map((ind) => (
              <div key={ind.label} className="group">
                <div className="font-[family-name:var(--font-cormorant)] text-5xl md:text-6xl text-[#8B1A1A] font-bold leading-none mb-2">
                  {ind.valor}
                </div>
                <div className="h-px w-8 bg-[#8B1A1A]/30 mx-auto mb-3" />
                <div className="text-[#3D2020]/60 text-sm tracking-wide">{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────── */}
      <section className="py-28 bg-[#F8F6F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
              Depoimentos
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl text-[#1A0A0A] font-bold">
              O que dizem nossos clientes
            </h2>
            <div className="h-px w-12 bg-[#8B1A1A] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 hover:border-[#8B1A1A]/20 hover:shadow-md p-8 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={13} className="text-[#8B1A1A] fill-[#8B1A1A]" />
                  ))}
                </div>

                {/* Quote */}
                <div className="font-[family-name:var(--font-cormorant)] text-5xl text-[#8B1A1A]/15 leading-none mb-1">
                  "
                </div>
                <p className="text-[#3D2020]/70 text-sm leading-relaxed mb-6 -mt-2">{d.texto}</p>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#8B1A1A] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{d.autor[0]}</span>
                  </div>
                  <div>
                    <div className="text-[#1A0A0A] text-sm font-bold">{d.autor}</div>
                    <div className="text-[#3D2020]/45 text-xs">{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="py-28 bg-[#8B1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ScaleSVGSmall className="w-14 h-14 text-white/40 mx-auto mb-8" />

          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-white font-bold mb-5">
            Agende sua Consulta
          </h2>

          <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto mb-10 font-light">
            Tire suas dúvidas, agende uma consulta ou receba uma avaliação jurídica gratuita.
            Nossa equipe está pronta para atendê-lo com discrição e expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm tracking-wide transition-all duration-200 group"
            >
              <MessageCircle size={18} />
              WhatsApp
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white hover:bg-gray-50 text-[#8B1A1A] font-bold text-sm tracking-wide transition-all duration-200"
            >
              <Phone size={16} />
              Enviar Mensagem
            </Link>
          </div>

          <p className="text-white/35 text-xs mt-10">
            Atendimento sigiloso e especializado — OAB/XX 000.000
          </p>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
                Conhecimento
              </p>
              <h2 className="font-[family-name:var(--font-cormorant)] text-3xl text-[#1A0A0A] font-bold">
                Blog Jurídico
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-bold hover:gap-3 transition-all"
            >
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                tag: "LGPD",
                title: "Como adequar sua empresa à Lei Geral de Proteção de Dados",
                data: "10 Mai 2026",
              },
              {
                tag: "Trabalhista",
                title: "Novas regras do eSocial: o que muda para empregadores",
                data: "05 Mai 2026",
              },
              {
                tag: "Execução",
                title: "SISBAJUD e RENAJUD: ferramentas essenciais na recuperação de crédito",
                data: "28 Abr 2026",
              },
            ].map((art) => (
              <Link
                key={art.title}
                href="/blog"
                className="group bg-[#F8F6F4] border border-gray-100 hover:border-[#8B1A1A]/30 hover:shadow-sm p-7 transition-all duration-300"
              >
                <span className="inline-block text-[#8B1A1A] text-[10px] tracking-[0.25em] uppercase mb-4 font-bold">
                  {art.tag}
                </span>
                <h3 className="font-[family-name:var(--font-cormorant)] text-[#1A0A0A] text-xl font-semibold leading-snug mb-4 group-hover:text-[#8B1A1A] transition-colors">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#3D2020]/40 text-xs">{art.data}</span>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-[#8B1A1A] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-bold"
            >
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
