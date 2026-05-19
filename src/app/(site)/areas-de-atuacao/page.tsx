import Link from "next/link";
import { ArrowRight, Briefcase, Building2, CreditCard, Shield, FileText, CheckSquare, Users } from "lucide-react";

const AREAS = [
  {
    slug: "trabalhista",
    icon: Users,
    titulo: "Direito do Trabalho",
    resumo:
      "Defesa de empregados e empregadores em todas as fases da Justiça do Trabalho, desde a negociação extrajudicial até o TST.",
    destaques: ["Reclamações trabalhistas", "Defesa de empresas", "Acordos e homologações", "Compliance trabalhista"],
  },
  {
    slug: "empresarial",
    icon: Building2,
    titulo: "Direito Empresarial",
    resumo:
      "Assessoria jurídica completa para empresas em todas as fases do ciclo de negócios, da constituição à dissolução.",
    destaques: ["Constituição e alteração societária", "Fusões e aquisições", "Recuperação judicial", "Contencioso empresarial"],
  },
  {
    slug: "execucao-credito",
    icon: CreditCard,
    titulo: "Execução e Recuperação de Crédito",
    resumo:
      "Estratégias eficazes para recuperação de créditos por meio de ações judiciais e ferramentas de bloqueio de ativos.",
    destaques: ["SISBAJUD / RENAJUD / INFOJUD", "Penhora e leilão", "Recuperação extrajudicial", "Pesquisa patrimonial"],
  },
  {
    slug: "lgpd",
    icon: Shield,
    titulo: "LGPD e Proteção de Dados",
    resumo:
      "Adequação de empresas à Lei Geral de Proteção de Dados Pessoais, com mapeamento, implementação e treinamentos.",
    destaques: ["Diagnóstico de conformidade", "Elaboração de políticas", "DPO terceirizado", "Resposta a incidentes"],
  },
  {
    slug: "consultoria-preventiva",
    icon: Briefcase,
    titulo: "Consultoria Preventiva",
    resumo:
      "Identificação e mitigação de riscos jurídicos antes que se tornem litígios, protegendo seu patrimônio e negócio.",
    destaques: ["Due diligence", "Auditoria jurídica", "Gestão de riscos", "Pareceres especializados"],
  },
  {
    slug: "contratos",
    icon: FileText,
    titulo: "Contratos",
    resumo:
      "Elaboração e revisão de contratos empresariais, prestação de serviços, locação, franquias e instrumentos negociais complexos.",
    destaques: ["Contratos empresariais", "Contratos de serviço", "Revisão e análise", "Instrumentos de garantia"],
  },
  {
    slug: "compliance",
    icon: CheckSquare,
    titulo: "Compliance",
    resumo:
      "Implementação de programas de integridade e ética corporativa para proteção da empresa e seus gestores.",
    destaques: ["Programas de integridade", "Código de conduta", "Canal de denúncias", "Treinamentos", "Lei Anticorrupção"],
  },
];

export default function AreasDeAtuacaoPage() {
  return (
    <div className="bg-white min-h-screen font-[family-name:var(--font-lato)]">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-[#8B1A1A] pt-32 pb-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            Áreas de Atuação
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl text-white font-bold mb-5">
            Soluções jurídicas<br />
            <em className="not-italic font-light">para cada necessidade</em>
          </h1>
          <div className="h-px w-12 bg-white/30 mx-auto mb-6" />
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            Atuamos nas principais vertentes do Direito com equipe especializada, entregando resultados
            consistentes para empresas e pessoas físicas.
          </p>
        </div>
      </section>

      {/* ── ÁREAS ────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-4">
        {AREAS.map((area) => {
          const Icon = area.icon;
          return (
            <div
              key={area.slug}
              className="bg-white border border-gray-100 hover:border-[#8B1A1A]/30 hover:shadow-md transition-all duration-300 group overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Acento lateral */}
                <div className="md:w-1 shrink-0 bg-[#8B1A1A] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-[#8B1A1A]/8 flex items-center justify-center shrink-0">
                          <Icon size={17} className="text-[#8B1A1A]" />
                        </div>
                        <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-bold text-[#1A0A0A] group-hover:text-[#8B1A1A] transition-colors">
                          {area.titulo}
                        </h2>
                      </div>
                      <p className="text-sm text-[#3D2020]/60 leading-relaxed mb-4">{area.resumo}</p>
                      <div className="flex flex-wrap gap-2">
                        {area.destaques.map((d) => (
                          <span
                            key={d}
                            className="text-[10px] px-2.5 py-1 bg-[#F8F6F4] text-[#3D2020]/70 border border-gray-100 font-medium tracking-wide"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/areas-de-atuacao/${area.slug}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-xs font-bold tracking-wide transition-colors"
                    >
                      Saiba mais <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#F8F6F4] border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl text-[#1A0A0A] font-bold mb-3">
            Não encontrou sua área?
          </h2>
          <p className="text-sm text-[#3D2020]/55 mb-8 leading-relaxed">
            Entre em contato e nossa equipe indicará a melhor solução para o seu caso.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-bold tracking-wide transition-colors"
          >
            Consultar gratuitamente <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
