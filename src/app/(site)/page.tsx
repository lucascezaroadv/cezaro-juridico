import Link from "next/link";
import Image from "next/image";
import LogoCezaro from "@/components/ui/LogoCezaro";
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
  { valor: "98%", label: "Índice de Satisfação" },
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

        {/* Marca d'água — balança grande, pura imagem sem texto */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none">
          <div
            className="relative"
            style={{
              width: "min(680px, 65vw)",
              height: "min(680px, 65vw)",
              opacity: 0.07,
              filter: "brightness(0) invert(1)",
              marginRight: "-4%",
            }}
          >
            <Image
              src="/logo-balanca.png"
              alt=""
              fill
              quality={100}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Segunda balança menor — canto inferior esquerdo */}
        <div className="absolute bottom-[-80px] left-[-80px] pointer-events-none select-none"
          style={{ opacity: 0.04, filter: "brightness(0) invert(1)", width: 320, height: 320 }}>
          <Image src="/logo-balanca.png" alt="" fill quality={100} style={{ objectFit: "contain" }} />
        </div>

        {/* Linhas decorativas verticais */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10" />
        <div className="absolute left-[clamp(40px,6vw,80px)] top-0 bottom-0 w-[1px] bg-white/5" />

        {/* Linha horizontal sutil no topo */}
        <div className="absolute top-[120px] left-0 right-0 h-[1px] bg-white/8" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-28 w-full">
          <div className="max-w-[600px]">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-10">
              <div className="w-8 h-[1px] bg-white/40" />
              <span className="text-white/60 text-[9px] tracking-[0.45em] uppercase font-[family-name:var(--font-lato)] font-semibold">
                Advocacia & Consultoria Jurídica
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-white font-bold leading-[1.0] mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Soluções Jurídicas<br />
              <span style={{ fontWeight: 300, fontStyle: "italic" }}>de Alto Impacto</span>
            </h1>

            {/* Divisor elegante */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-10 bg-white/35" />
              <div className="w-1 h-1 bg-white/35 rotate-45" />
            </div>

            <p className="text-white/65 text-[1.05rem] leading-[1.8] max-w-[480px] mb-12 font-light tracking-wide">
              Excelência técnica, comprometimento absoluto e tecnologia
              a serviço dos seus direitos e do seu patrimônio.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 bg-white hover:bg-gray-50 text-[#8B1A1A] font-bold text-[0.8rem] tracking-[0.12em] uppercase transition-all duration-300 group"
              >
                <MessageCircle size={16} />
                Fale Conosco
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/sobre"
                className="inline-flex items-center justify-center gap-3 px-9 py-4 border border-white/30 hover:border-white/60 text-white/80 hover:text-white text-[0.8rem] tracking-[0.12em] uppercase transition-all duration-300"
              >
                O Escritório
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Indicadores */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/12">
              {indicadores.slice(0, 3).map((ind) => (
                <div key={ind.label}>
                  <div
                    className="text-white font-bold leading-none mb-2"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(2rem, 4vw, 2.8rem)",
                    }}
                  >
                    {ind.valor}
                  </div>
                  <div className="text-white/40 text-[0.65rem] tracking-[0.18em] uppercase">{ind.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gradiente bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 48 L0 24 Q360 0 720 24 Q1080 48 1440 24 L1440 48 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── SOBRE ─────────────────────────────────── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[#8B1A1A] text-[9px] tracking-[0.4em] uppercase font-bold mb-5">
              O Escritório
            </p>
            <h2
              className="text-[#1A0A0A] font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
              }}
            >
              Comprometimento com<br />o seu resultado
            </h2>
            <div className="flex items-center gap-3 mb-9">
              <div className="h-[1px] w-8 bg-[#8B1A1A]" />
              <div className="w-1 h-1 bg-[#8B1A1A]/50 rotate-45" />
            </div>
            <p className="text-[#3D2020]/60 leading-[1.9] mb-5 text-[0.95rem]">
              O Cezaro Costa Advocacia é um escritório fundado sobre os pilares da excelência técnica,
              da ética profissional e da inovação jurídica. Atuamos com equipe altamente especializada,
              orientada pela construção de soluções que protegem e impulsionam nossos clientes.
            </p>
            <p className="text-[#3D2020]/60 leading-[1.9] mb-12 text-[0.95rem]">
              Nossa abordagem une o rigor do Direito à inteligência estratégica, garantindo que cada
              caso seja tratado com a atenção personalizada que merece — seja uma empresa ou um indivíduo.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-[#8B1A1A] text-[0.78rem] font-bold tracking-[0.15em] uppercase hover:gap-4 transition-all duration-300"
            >
              Conheça nossa história <ArrowRight size={14} />
            </Link>
          </div>

          {/* Card vermelho com balança como marca d'água */}
          <div className="bg-[#8B1A1A] p-12 relative overflow-hidden">
            {/* Marca d'água — só a balança, grande */}
            <div
              className="absolute -right-12 -bottom-12 pointer-events-none select-none"
              style={{ width: 260, height: 260, opacity: 0.08, filter: "brightness(0) invert(1)" }}
            >
              <Image src="/logo-balanca.png" alt="" fill quality={100} style={{ objectFit: "contain" }} />
            </div>

            <h3
              className="text-white font-bold mb-10"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.6rem" }}
            >
              Por que escolher a Cezaro Costa?
            </h3>
            <div className="space-y-5 relative">
              {[
                "Atendimento personalizado e humanizado",
                "Tecnologia jurídica de ponta",
                "Portal do cliente com acesso em tempo real",
                "Equipe especializada e multidisciplinar",
                "Compromisso total com seus resultados",
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-[1px] h-6 bg-white/30 shrink-0" />
                  <span className="text-white/80 text-[0.88rem] leading-relaxed tracking-wide">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 gap-8">
              {indicadores.slice(0, 2).map((ind) => (
                <div key={ind.label}>
                  <div
                    className="text-white font-bold leading-none mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2.6rem" }}
                  >
                    {ind.valor}
                  </div>
                  <div className="text-white/45 text-[0.68rem] tracking-[0.15em] uppercase mt-2">{ind.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÁREAS DE ATUAÇÃO ─────────────────────── */}
      <section className="py-32 bg-[#F8F6F4]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <p className="text-[#8B1A1A] text-[9px] tracking-[0.4em] uppercase font-bold mb-5">
              Especialidades
            </p>
            <h2
              className="text-[#1A0A0A] font-bold"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Áreas de Atuação
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-[1px] w-8 bg-[#8B1A1A]/40" />
              <div className="w-1 h-1 bg-[#8B1A1A]/40 rotate-45" />
              <div className="h-[1px] w-8 bg-[#8B1A1A]/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#E8E4E0]">
            {areas.map((area, i) => {
              const Icon = area.icon;
              return (
                <Link
                  key={area.slug}
                  href={`/areas-de-atuacao/${area.slug}`}
                  className={`group bg-white hover:bg-[#8B1A1A] p-9 transition-all duration-400 flex flex-col${
                    i === areas.length - 1 && areas.length % 3 !== 0 ? " lg:col-start-2" : ""
                  }`}
                >
                  <div className="w-10 h-10 border border-[#8B1A1A]/20 group-hover:border-white/30 flex items-center justify-center mb-7 transition-colors">
                    <Icon className="w-4 h-4 text-[#8B1A1A] group-hover:text-white transition-colors" />
                  </div>
                  <h3
                    className="text-[#1A0A0A] group-hover:text-white text-[1.2rem] font-semibold mb-3 transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {area.title}
                  </h3>
                  <p className="text-[#3D2020]/55 group-hover:text-white/65 text-[0.83rem] leading-relaxed mb-7 flex-1 transition-colors">{area.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[#8B1A1A] group-hover:text-white/80 text-[0.72rem] font-bold tracking-[0.15em] uppercase transition-all">
                    Saiba mais <ArrowRight size={11} />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/areas-de-atuacao"
              className="inline-flex items-center gap-3 px-10 py-4 border border-[#8B1A1A] text-[#8B1A1A] text-[0.78rem] font-bold tracking-[0.15em] uppercase hover:bg-[#8B1A1A] hover:text-white transition-all duration-300"
            >
              Ver todas as especialidades <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ─────────────────────────── */}
      <section className="py-32 bg-[#8B1A1A] relative overflow-hidden">
        {/* Marca d'água central grande */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        >
          <div className="relative" style={{ width: 700, height: 700, filter: "brightness(0) invert(1)" }}>
            <Image src="/logo-balanca.png" alt="" fill quality={100} style={{ objectFit: "contain" }} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <p className="text-white/45 text-[9px] tracking-[0.4em] uppercase font-bold mb-5">
              Por que nos escolher
            </p>
            <h2
              className="text-white font-bold"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Nossos Diferenciais
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-[1px] w-8 bg-white/25" />
              <div className="w-1 h-1 bg-white/25 rotate-45" />
              <div className="h-[1px] w-8 bg-white/25" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {diferenciais.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="group text-center p-8 border border-white/10 hover:border-white/25 transition-all duration-400">
                  <div className="w-12 h-12 border border-white/20 group-hover:border-white/40 flex items-center justify-center mx-auto mb-7 transition-colors">
                    <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <h3
                    className="text-white text-[1.15rem] font-bold mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {d.title}
                  </h3>
                  <p className="text-white/50 text-[0.82rem] leading-[1.8]">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NÚMEROS ───────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {indicadores.map((ind, i) => (
              <div key={ind.label} className={`text-center px-8 py-6 ${i === 0 ? "" : ""}`}>
                <div
                  className="text-[#8B1A1A] font-bold leading-none mb-3"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(2.8rem, 5vw, 4rem)",
                  }}
                >
                  {ind.valor}
                </div>
                <div className="w-6 h-[1px] bg-[#8B1A1A]/25 mx-auto mb-3" />
                <div className="text-[#3D2020]/50 text-[0.72rem] tracking-[0.15em] uppercase">{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────── */}
      <section className="py-32 bg-[#F8F6F4]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <p className="text-[#8B1A1A] text-[9px] tracking-[0.4em] uppercase font-bold mb-5">
              Depoimentos
            </p>
            <h2
              className="text-[#1A0A0A] font-bold"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              O que dizem nossos clientes
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-[1px] w-8 bg-[#8B1A1A]/40" />
              <div className="w-1 h-1 bg-[#8B1A1A]/40 rotate-45" />
              <div className="h-[1px] w-8 bg-[#8B1A1A]/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 hover:border-[#8B1A1A]/15 hover:shadow-lg p-10 transition-all duration-400 flex flex-col"
              >
                <div className="flex gap-0.5 mb-7">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={11} className="text-[#8B1A1A] fill-[#8B1A1A]" />
                  ))}
                </div>
                <div
                  className="text-[#8B1A1A]/12 leading-none mb-2 -ml-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "5rem" }}
                >
                  "
                </div>
                <p className="text-[#3D2020]/65 text-[0.88rem] leading-[1.9] mb-8 -mt-3 flex-1">{d.texto}</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-9 h-9 bg-[#8B1A1A] flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">{d.autor[0]}</span>
                  </div>
                  <div>
                    <div className="text-[#1A0A0A] text-[0.85rem] font-bold tracking-wide">{d.autor}</div>
                    <div className="text-[#3D2020]/40 text-[0.72rem] mt-0.5">{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="py-32 bg-[#8B1A1A] relative overflow-hidden">
        {/* Marca d'água direita */}
        <div
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ width: 480, height: 480, opacity: 0.06, filter: "brightness(0) invert(1)" }}
        >
          <Image src="/logo-balanca.png" alt="" fill quality={100} style={{ objectFit: "contain" }} />
        </div>
        {/* Marca d'água esquerda menor */}
        <div
          className="absolute left-[-60px] bottom-[-60px] pointer-events-none select-none"
          style={{ width: 280, height: 280, opacity: 0.04, filter: "brightness(0) invert(1)" }}
        >
          <Image src="/logo-balanca.png" alt="" fill quality={100} style={{ objectFit: "contain" }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-white/40 text-[9px] tracking-[0.45em] uppercase font-bold mb-6">
            Agende uma Consulta
          </p>
          <h2
            className="text-white font-bold mb-6 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            }}
          >
            Estamos prontos para<br />
            <span style={{ fontWeight: 300, fontStyle: "italic" }}>defender seus interesses</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-[1px] w-8 bg-white/25" />
            <div className="w-1 h-1 bg-white/25 rotate-45" />
            <div className="h-[1px] w-8 bg-white/25" />
          </div>

          <p className="text-white/60 text-[1rem] leading-[1.9] max-w-lg mx-auto mb-14 font-light">
            Tire suas dúvidas, agende uma consulta ou receba uma avaliação jurídica gratuita.
            Atendimento sigiloso, ágil e especializado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-[0.78rem] tracking-[0.15em] uppercase transition-all duration-300 group"
            >
              <MessageCircle size={16} />
              WhatsApp
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-white hover:bg-gray-50 text-[#8B1A1A] font-bold text-[0.78rem] tracking-[0.15em] uppercase transition-all duration-300"
            >
              <Phone size={14} />
              Enviar Mensagem
            </Link>
          </div>

          <p className="text-white/25 text-[0.7rem] tracking-widest mt-12 uppercase">
            OAB/XX 000.000 · Atendimento sigiloso e especializado
          </p>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────── */}
      <section className="py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[#8B1A1A] text-[9px] tracking-[0.4em] uppercase font-bold mb-4">
                Conhecimento
              </p>
              <h2
                className="text-[#1A0A0A] font-bold"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
              >
                Blog Jurídico
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-[#8B1A1A] text-[0.75rem] font-bold tracking-[0.15em] uppercase hover:gap-4 transition-all duration-300"
            >
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-gray-100">
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
                className="group bg-white hover:bg-[#F8F6F4] p-9 transition-all duration-300 flex flex-col"
              >
                <span className="text-[#8B1A1A] text-[9px] tracking-[0.3em] uppercase mb-5 font-bold">
                  {art.tag}
                </span>
                <h3
                  className="text-[#1A0A0A] group-hover:text-[#8B1A1A] text-[1.15rem] font-semibold leading-snug mb-6 flex-1 transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {art.title}
                </h3>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="text-[#3D2020]/35 text-[0.72rem] tracking-wide">{art.data}</span>
                  <ArrowRight size={13} className="text-gray-200 group-hover:text-[#8B1A1A] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-bold">
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
