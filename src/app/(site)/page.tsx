import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CreditCard,
  Shield,
  FileText,
  Scale,
  CheckSquare,
  Users,
  Award,
  Clock,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Star,
} from "lucide-react";

const areas = [
  {
    icon: Users,
    title: "Direito do Trabalho",
    desc: "Defesa de empregados e empregadores em reclamações trabalhistas, negociações e consultorias preventivas.",
    slug: "direito-do-trabalho",
  },
  {
    icon: Building2,
    title: "Direito Empresarial",
    desc: "Assessoria jurídica completa para empresas: constituição, contratos, reorganização societária e contencioso.",
    slug: "direito-empresarial",
  },
  {
    icon: CreditCard,
    title: "Execução e Recuperação de Crédito",
    desc: "Estratégias avançadas de cobrança judicial, penhoras, bloqueios patrimoniais e recuperação de ativos.",
    slug: "execucao-recuperacao-credito",
  },
  {
    icon: Shield,
    title: "LGPD",
    desc: "Adequação à Lei Geral de Proteção de Dados, políticas de privacidade, DPO e gestão de incidentes.",
    slug: "lgpd",
  },
  {
    icon: Scale,
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
  { valor: "500+", label: "Processos Concluídos" },
  { valor: "95%", label: "Taxa de Êxito" },
  { valor: "10+", label: "Anos de Experiência" },
  { valor: "300+", label: "Clientes Atendidos" },
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
    <div className="bg-[#060d1a] font-[family-name:var(--font-lato)]">

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060d1a] via-[#0a1428] to-[#040810]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 80px, #c9a84c 80px, #c9a84c 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, #c9a84c 80px, #c9a84c 81px)",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#c9a84c]/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#1a3a6e]/30 blur-3xl pointer-events-none" />

        {/* Decorative vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#c9a84c]/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
          <div className="max-w-4xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-[#c9a84c]/30 rounded-full bg-[#c9a84c]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase">
                Advocacia & Consultoria Jurídica
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white font-bold leading-[1.08] mb-6">
              Justiça com
              <br />
              <span className="text-[#c9a84c] italic">Estratégia</span> e
              <br />
              Precisão
            </h1>

            {/* Gold divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-[#c9a84c]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            </div>

            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
              Escritório especializado em soluções jurídicas de alto impacto para empresas e pessoas físicas.
              Combinamos expertise técnica, tecnologia jurídica avançada e comprometimento absoluto com seus resultados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] font-bold text-sm tracking-wide rounded transition-all duration-200 group"
              >
                <MessageCircle size={18} />
                Consulta Gratuita
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/areas-de-atuacao"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-[#c9a84c]/60 text-white/80 hover:text-white text-sm tracking-wide rounded transition-all duration-200"
              >
                Nossas Áreas de Atuação
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
              {indicadores.slice(0, 3).map((ind) => (
                <div key={ind.label}>
                  <div className="font-[family-name:var(--font-playfair)] text-3xl text-[#c9a84c] font-bold">
                    {ind.valor}
                  </div>
                  <div className="text-white/40 text-xs tracking-wide mt-0.5">{ind.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d1a] to-transparent" />
      </section>

      {/* ── SOBRE ───────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#c9a84c]/[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">O Escritório</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
              Comprometimento com o seu resultado
            </h2>
            <div className="h-px w-16 bg-[#c9a84c] mb-8" />
            <p className="text-white/60 leading-relaxed mb-6">
              O Cezaro Costa Advocacia é um escritório fundado sobre os pilares da excelência técnica, da ética profissional
              e da inovação jurídica. Atuamos com uma equipe altamente especializada, sempre orientada pela construção de
              soluções jurídicas que protegem e impulsionam nossos clientes.
            </p>
            <p className="text-white/60 leading-relaxed mb-10">
              Nossa abordagem une o rigor do Direito à inteligência estratégica, garantindo que cada caso seja tratado com
              a atenção personalizada que merece — seja uma empresa ou um indivíduo.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-[#c9a84c] text-sm font-bold tracking-wide hover:gap-3 transition-all"
            >
              Conheça nossa história <ArrowRight size={16} />
            </Link>
          </div>

          {/* Decorative card grid */}
          <div className="grid grid-cols-2 gap-4">
            {indicadores.map((ind) => (
              <div
                key={ind.label}
                className="bg-[#0a1428] border border-white/5 hover:border-[#c9a84c]/30 rounded-xl p-6 transition-all duration-300 group"
              >
                <div className="font-[family-name:var(--font-playfair)] text-4xl text-[#c9a84c] font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                  {ind.valor}
                </div>
                <div className="text-white/50 text-sm leading-snug">{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÁREAS DE ATUAÇÃO ─────────────────────────── */}
      <section className="py-28 bg-[#040a15]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Especialidades</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white font-bold">
              Áreas de Atuação
            </h2>
            <div className="h-px w-16 bg-[#c9a84c] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {areas.map((area, i) => {
              const Icon = area.icon;
              return (
                <Link
                  key={area.slug}
                  href={`/areas-de-atuacao/${area.slug}`}
                  className={`group relative bg-[#0a1428] border border-white/5 hover:border-[#c9a84c]/40 rounded-xl p-7 transition-all duration-300 overflow-hidden ${
                    i === areas.length - 1 && areas.length % 3 !== 0 ? "md:col-span-1 lg:col-start-2" : ""
                  }`}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/0 to-[#c9a84c]/0 group-hover:from-[#c9a84c]/5 group-hover:to-transparent transition-all duration-500 rounded-xl" />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/0 to-transparent group-hover:via-[#c9a84c]/60 transition-all duration-500" />

                  <div className="relative">
                    <div className="w-11 h-11 rounded-lg bg-[#c9a84c]/10 group-hover:bg-[#c9a84c]/20 border border-[#c9a84c]/20 flex items-center justify-center mb-5 transition-colors">
                      <Icon className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-white text-lg font-semibold mb-3 group-hover:text-[#c9a84c] transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-5">{area.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#c9a84c] text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-300">
                      Saiba mais <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ─────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#c9a84c]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060d1a] via-[#08111f] to-[#060d1a]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Por que nos escolher</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
                Nossos Diferenciais
              </h2>
              <div className="h-px w-16 bg-[#c9a84c] mb-8" />
              <p className="text-white/60 leading-relaxed">
                Mais do que representação jurídica — somos parceiros estratégicos comprometidos com a proteção
                e o crescimento de quem confia em nosso trabalho.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {diferenciais.map((d) => {
                const Icon = d.icon;
                return (
                  <div
                    key={d.title}
                    className="group bg-[#0a1428] border border-white/5 hover:border-[#c9a84c]/30 rounded-xl p-6 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-[#c9a84c] mb-4" />
                    <h3 className="text-white font-bold text-sm mb-2 font-[family-name:var(--font-lato)]">
                      {d.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────── */}
      <section className="py-28 bg-[#040a15]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Depoimentos</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-white font-bold">
              O que dizem nossos clientes
            </h2>
            <div className="h-px w-16 bg-[#c9a84c] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => (
              <div
                key={i}
                className="bg-[#0a1428] border border-white/5 hover:border-[#c9a84c]/20 rounded-xl p-8 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />
                  ))}
                </div>

                {/* Opening quote */}
                <div className="font-[family-name:var(--font-playfair)] text-5xl text-[#c9a84c]/20 leading-none mb-2">
                  "
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 -mt-2">{d.texto}</p>

                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
                    <span className="text-[#c9a84c] text-sm font-bold">{d.autor[0]}</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">{d.autor}</div>
                    <div className="text-white/40 text-xs">{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA WHATSAPP ─────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3c] to-[#060d1a]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.04] blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-8">
            <MessageCircle className="w-7 h-7 text-[#c9a84c]" />
          </div>

          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-white font-bold mb-6">
            Fale com um especialista{" "}
            <span className="text-[#c9a84c] italic">agora</span>
          </h2>

          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Tire suas dúvidas, agende uma consulta ou receba uma avaliação jurídica gratuita.
            Nossa equipe está pronta para atendê-lo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] font-bold text-sm tracking-wide rounded transition-all duration-200 group"
            >
              <MessageCircle size={18} />
              Conversar no WhatsApp
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 border border-white/20 hover:border-[#c9a84c]/60 text-white/80 hover:text-white text-sm tracking-wide rounded transition-all duration-200"
            >
              Enviar Mensagem
            </Link>
          </div>

          <p className="text-white/30 text-xs mt-8">
            Atendimento sigiloso e especializado — OAB/XX 000.000
          </p>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────────── */}
      <section className="py-20 bg-[#040a15] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-3">Conhecimento</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-white font-bold">
                Blog Jurídico
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-[#c9a84c] text-sm font-bold hover:gap-3 transition-all"
            >
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="group bg-[#0a1428] border border-white/5 hover:border-[#c9a84c]/20 rounded-xl p-7 transition-all duration-300"
              >
                <span className="inline-block text-[#c9a84c] text-xs tracking-[0.2em] uppercase mb-4 font-bold">
                  {art.tag}
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-white text-lg font-semibold leading-snug mb-4 group-hover:text-[#c9a84c] transition-colors">
                  {art.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">{art.data}</span>
                  <ArrowRight size={14} className="text-white/20 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#c9a84c] text-sm font-bold"
            >
              Ver todos os artigos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
