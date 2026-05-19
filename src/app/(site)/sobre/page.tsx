import { Award, Users, Target, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

// Balança SVG
function ScaleSVG({ className }: { className?: string }) {
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

const VALORES = [
  {
    icon: ShieldCheck,
    titulo: "Ética e Integridade",
    desc: "Atuação pautada pela transparência e compromisso com os princípios da OAB e da boa-fé.",
  },
  {
    icon: Target,
    titulo: "Estratégia e Precisão",
    desc: "Cada caso é analisado em profundidade para construir a melhor tese jurídica possível.",
  },
  {
    icon: TrendingUp,
    titulo: "Resultados Comprovados",
    desc: "Histórico sólido de êxito em processos trabalhistas, empresariais e de recuperação de crédito.",
  },
  {
    icon: Users,
    titulo: "Atendimento Personalizado",
    desc: "Relação próxima com cada cliente, com comunicação clara sobre o andamento do caso.",
  },
];

const AREAS = [
  "Direito do Trabalho",
  "Direito Empresarial",
  "Execução e Recuperação de Crédito",
  "LGPD e Proteção de Dados",
  "Consultoria Preventiva",
  "Contratos",
  "Compliance",
];

const STATS = [
  { label: "Anos de Atuação", valor: "15+" },
  { label: "Casos Concluídos", valor: "500+" },
  { label: "Taxa de Satisfação", valor: "98%" },
  { label: "Áreas de Atuação", valor: "7" },
];

export default function SobrePage() {
  return (
    <div className="bg-white min-h-screen font-[family-name:var(--font-lato)]">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#8B1A1A] pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Decoração */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-[0.07] pointer-events-none pr-10">
          <ScaleSVG className="w-80 h-80 text-white" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            Sobre o Escritório
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-white font-bold leading-tight mb-6 max-w-2xl">
            Advocacia com propósito,<br />
            <em className="not-italic font-light">resultados com consistência</em>
          </h1>
          <div className="h-px w-12 bg-white/30 mb-6" />
          <p className="text-white/65 text-base max-w-xl leading-relaxed">
            Cezaro Costa Advocacia e Consultoria Jurídica atua com excelência técnica e comprometimento
            com os interesses de cada cliente, oferecendo soluções jurídicas sob medida para empresas e
            pessoas físicas.
          </p>
        </div>
      </section>

      {/* ── QUEM SOMOS ───────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
                Nossa história
              </p>
              <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[#1A0A0A] font-bold mb-5">
                Quem Somos
              </h2>
              <div className="h-px w-10 bg-[#8B1A1A] mb-8" />
              <div className="space-y-5 text-[#3D2020]/65 text-base leading-relaxed">
                <p>
                  Fundado com o propósito de oferecer assessoria jurídica de alto nível, o escritório
                  Cezaro Costa reúne profissionais especializados nas principais áreas do Direito, com
                  foco em soluções estratégicas e preventivas.
                </p>
                <p>
                  Nossa atuação combina o rigor técnico com a compreensão das necessidades reais de
                  cada cliente — sejam empresas em crescimento que precisam de segurança jurídica, ou
                  pessoas físicas que buscam proteção de seus direitos.
                </p>
                <p>
                  Utilizamos tecnologia de ponta em nossa gestão interna para garantir agilidade,
                  organização e qualidade no acompanhamento de cada caso.
                </p>
              </div>
              <Link
                href="/contato"
                className="mt-8 inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-bold tracking-wide hover:gap-3 transition-all"
              >
                Agende uma consulta <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#F8F6F4] border border-gray-100 hover:border-[#8B1A1A]/30 p-6 transition-all duration-300 group"
                >
                  <div className="font-[family-name:var(--font-cormorant)] text-4xl text-[#8B1A1A] font-bold mb-2 group-hover:scale-105 transition-transform origin-left">
                    {stat.valor}
                  </div>
                  <div className="text-[#3D2020]/55 text-sm leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────── */}
      <section className="py-24 px-4 bg-[#F8F6F4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
              Princípios
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[#1A0A0A] font-bold mb-3">
              Nossos Valores
            </h2>
            <div className="h-px w-10 bg-[#8B1A1A] mx-auto mt-5 mb-5" />
            <p className="text-[#3D2020]/55 text-sm max-w-xl mx-auto">
              Os princípios que guiam cada decisão e cada atendimento do nosso escritório.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALORES.map((v) => (
              <div
                key={v.titulo}
                className="bg-white border border-gray-100 hover:border-[#8B1A1A]/30 p-7 transition-all duration-300 hover:shadow-md group"
              >
                <div className="w-11 h-11 bg-[#8B1A1A]/8 group-hover:bg-[#8B1A1A]/15 flex items-center justify-center mb-5 transition-colors">
                  <v.icon size={20} className="text-[#8B1A1A]" />
                </div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-[#1A0A0A] text-xl font-bold mb-2">
                  {v.titulo}
                </h3>
                <p className="text-[#3D2020]/55 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÁREAS ────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#8B1A1A] text-[10px] tracking-[0.35em] uppercase font-bold mb-4">
              Especialidades
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-[#1A0A0A] font-bold mb-3">
              Áreas de Atuação
            </h2>
            <div className="h-px w-10 bg-[#8B1A1A] mx-auto mt-5 mb-5" />
            <p className="text-[#3D2020]/55 text-sm">
              Cobertura completa para as principais demandas jurídicas de empresas e pessoas físicas.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {AREAS.map((area) => (
              <span
                key={area}
                className="px-5 py-2 bg-[#8B1A1A] text-white text-xs font-medium tracking-wide"
              >
                {area}
              </span>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/areas-de-atuacao"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#8B1A1A] text-[#8B1A1A] text-sm font-bold hover:bg-[#8B1A1A] hover:text-white transition-all duration-200"
            >
              Conhecer todas as áreas <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#8B1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <Award size={36} className="text-white/40 mx-auto mb-5" />
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl text-white font-bold mb-4">
            Pronto para proteger seus direitos?
          </h2>
          <p className="text-white/60 text-sm mb-10 leading-relaxed">
            Agende uma consulta e descubra como podemos ajudar você ou sua empresa com soluções
            jurídicas personalizadas e estratégicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="px-8 py-3.5 bg-white hover:bg-gray-50 text-[#8B1A1A] text-sm font-bold transition-colors"
            >
              Agendar Consulta
            </Link>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-bold transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
