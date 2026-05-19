import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";

const AREAS = [
  {
    slug: "trabalhista",
    titulo: "Direito do Trabalho",
    resumo: "Defesa de empregados e empregadores em todas as fases da Justiça do Trabalho, desde a negociação extrajudicial até o TST.",
    destaques: ["Reclamações trabalhistas", "Defesa de empresas", "Acordos e homologações", "Compliance trabalhista"],
    cor: "#3b82f6",
  },
  {
    slug: "empresarial",
    titulo: "Direito Empresarial",
    resumo: "Assessoria jurídica completa para empresas em todas as fases do ciclo de negócios, da constituição à dissolução.",
    destaques: ["Constituição e alteração societária", "Fusões e aquisições", "Recuperação judicial", "Contencioso empresarial"],
    cor: "#8b5cf6",
  },
  {
    slug: "execucao-credito",
    titulo: "Execução e Recuperação de Crédito",
    resumo: "Estratégias eficazes para recuperação de créditos por meio de ações judiciais e ferramentas de bloqueio de ativos.",
    destaques: ["SISBAJUD / RENAJUD / INFOJUD", "Penhora e leilão", "Recuperação extrajudicial", "Pesquisa patrimonial"],
    cor: "#ef4444",
  },
  {
    slug: "lgpd",
    titulo: "LGPD e Proteção de Dados",
    resumo: "Adequação de empresas à Lei Geral de Proteção de Dados Pessoais, com mapeamento, implementação e treinamentos.",
    destaques: ["Diagnóstico de conformidade", "Elaboração de políticas", "DPO terceirizado", "Resposta a incidentes"],
    cor: "#06b6d4",
  },
  {
    slug: "consultoria-preventiva",
    titulo: "Consultoria Preventiva",
    resumo: "Identificação e mitigação de riscos jurídicos antes que se tornem litígios, protegendo seu patrimônio e negócio.",
    destaques: ["Due diligence", "Auditoria jurídica", "Gestão de riscos", "Pareceres especializados"],
    cor: "#10b981",
  },
  {
    slug: "contratos",
    titulo: "Contratos",
    resumo: "Elaboração e revisão de contratos empresariais, prestação de serviços, locação, franquias e instrumentos negociais complexos.",
    destaques: ["Contratos empresariais", "Contratos de serviço", "Revisão e análise", "Instrumentos de garantia"],
    cor: "#f59e0b",
  },
  {
    slug: "compliance",
    titulo: "Compliance",
    resumo: "Implementação de programas de integridade e ética corporativa para proteção da empresa e seus gestores.",
    destaques: ["Programas de integridade", "Código de conduta", "Canal de denúncias", "Treinamentos", "Lei Anticorrupção"],
    cor: "#c9a84c",
  },
];

export default function AreasDeAtuacaoPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#060d1a] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">
            <Scale size={14} />
            Áreas de Atuação
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Soluções jurídicas<br />
            <span className="text-[#c9a84c]">para cada necessidade</span>
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            Atuamos nas principais vertentes do Direito com equipe especializada, entregando resultados consistentes para empresas e pessoas físicas.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        {AREAS.map(area => (
          <div key={area.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1.5 shrink-0" style={{ backgroundColor: area.cor }} />
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#060d1a]">{area.titulo}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{area.resumo}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.destaques.map(d => (
                        <span key={d} className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">{d}</span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/areas-de-atuacao/${area.slug}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors"
                    style={{ backgroundColor: area.cor }}
                  >
                    Saiba mais <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Não encontrou sua área?</h2>
          <p className="text-sm text-gray-500 mb-6">Entre em contato e nossa equipe indicará a melhor solução para o seu caso.</p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-bold rounded-xl transition-colors"
          >
            Consultar gratuitamente
          </Link>
        </div>
      </section>
    </div>
  );
}
