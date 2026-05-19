import { Scale, Award, Users, Target, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

const VALORES = [
  { icon: ShieldCheck, titulo: "Ética e Integridade", desc: "Atuação pautada pela transparência e compromisso com os princípios da OAB e da boa-fé." },
  { icon: Target, titulo: "Estratégia e Precisão", desc: "Cada caso é analisado em profundidade para construir a melhor tese jurídica possível." },
  { icon: TrendingUp, titulo: "Resultados Comprovados", desc: "Histórico sólido de êxito em processos trabalhistas, empresariais e de recuperação de crédito." },
  { icon: Users, titulo: "Atendimento Personalizado", desc: "Relação próxima com cada cliente, com comunicação clara sobre o andamento do caso." },
];

const AREAS = [
  "Direito do Trabalho", "Direito Empresarial", "Execução e Recuperação de Crédito",
  "LGPD e Proteção de Dados", "Consultoria Preventiva", "Contratos", "Compliance",
];

export default function SobrePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#060d1a] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-5">
            <Scale size={14} />
            Sobre o Escritório
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-2xl leading-tight">
            Advocacia com propósito,<br />
            <span className="text-[#c9a84c]">resultados com consistência</span>
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Cezaro Costa Advocacia e Consultoria Jurídica atua com excelência técnica e comprometimento com os interesses de cada cliente, oferecendo soluções jurídicas sob medida para empresas e pessoas físicas.
          </p>
        </div>
      </section>

      {/* Quem somos */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Quem Somos</h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Fundado com o propósito de oferecer assessoria jurídica de alto nível, o escritório Cezaro Costa reúne profissionais especializados nas principais áreas do Direito, com foco em soluções estratégicas e preventivas.
                </p>
                <p>
                  Nossa atuação combina o rigor técnico com a compreensão das necessidades reais de cada cliente — sejam empresas em crescimento que precisam de segurança jurídica, ou pessoas físicas que buscam proteção de seus direitos.
                </p>
                <p>
                  Utilizamos tecnologia de ponta em nossa gestão interna para garantir agilidade, organização e qualidade no acompanhamento de cada caso.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Anos de Atuação", valor: "10+" },
                { label: "Clientes Atendidos", valor: "500+" },
                { label: "Taxa de Êxito", valor: "94%" },
                { label: "Áreas de Atuação", valor: "7" },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="text-2xl font-bold text-[#c9a84c]">{stat.valor}</div>
                    <div className="text-xs font-medium text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Nossos Valores</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Os princípios que guiam cada decisão e cada atendimento do nosso escritório.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALORES.map(v => (
              <div key={v.titulo} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-[#c9a84c]" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{v.titulo}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Áreas */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Áreas de Atuação</h2>
            <p className="text-gray-500 text-sm">Cobertura completa para as principais demandas jurídicas de empresas e pessoas físicas.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {AREAS.map(area => (
              <span key={area} className="px-4 py-2 bg-[#060d1a] text-white text-xs font-medium rounded-full">
                {area}
              </span>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/areas-de-atuacao"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#060d1a] text-[#060d1a] text-sm font-bold rounded-xl hover:bg-[#060d1a] hover:text-white transition-colors"
            >
              Conhecer todas as áreas →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#060d1a]">
        <div className="max-w-3xl mx-auto text-center">
          <Award size={32} className="text-[#c9a84c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Pronto para proteger seus direitos?</h2>
          <p className="text-white/50 text-sm mb-8">Agende uma consulta e descubra como podemos ajudar você ou sua empresa.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contato"
              className="px-8 py-3.5 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] text-sm font-bold rounded-xl transition-colors"
            >
              Agendar Consulta
            </Link>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-white/20 text-white hover:bg-white/5 text-sm font-medium rounded-xl transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
