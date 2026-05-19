import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MessageCircle } from "lucide-react";

const AREAS: Record<string, {
  titulo: string; resumo: string; cor: string;
  descricao: string[]; servicos: string[]; diferenciais: string[];
}> = {
  "trabalhista": {
    titulo: "Direito do Trabalho",
    resumo: "Defesa técnica e estratégica nas relações de trabalho, com atuação em todas as instâncias da Justiça do Trabalho.",
    cor: "#3b82f6",
    descricao: [
      "O Direito do Trabalho é uma das áreas de maior complexidade e volume no Brasil, exigindo conhecimento atualizado e atuação ágil. Nossa equipe defende com igual competência empregados e empregadores em todas as fases processuais.",
      "Seja para reclamar direitos trabalhistas, elaborar defesas em reclamações, ou estruturar contratos e políticas internas, oferecemos assessoria completa que reduz riscos e maximiza resultados.",
    ],
    servicos: [
      "Reclamações trabalhistas (TRT e TST)", "Defesa de empresas em ações trabalhistas",
      "Elaboração de contratos de trabalho", "Rescisão e homologação",
      "Acordos coletivos e convenções", "Compliance trabalhista e auditoria",
      "Ações de indenização por danos morais", "Assédio moral e sexual",
    ],
    diferenciais: [
      "Equipe especializada em Direito do Trabalho", "Atuação em todas as instâncias",
      "Acompanhamento próximo e comunicação clara", "Histórico comprovado de êxito",
    ],
  },
  "empresarial": {
    titulo: "Direito Empresarial",
    resumo: "Assessoria jurídica estratégica para empresas em crescimento, proteção patrimonial e resolução de conflitos societários.",
    cor: "#8b5cf6",
    descricao: [
      "O sucesso empresarial depende de uma sólida base jurídica. Nosso escritório oferece assessoria completa no ciclo de vida das empresas, desde a constituição até operações complexas de fusão e aquisição.",
      "Atuamos preventivamente para blindar seu negócio de riscos jurídicos e contenciosamente para proteger seus interesses quando o litígio é inevitável.",
    ],
    servicos: [
      "Constituição e registro de empresas", "Alterações e reestruturações societárias",
      "Fusões, aquisições e due diligence", "Recuperação judicial e extrajudicial",
      "Contratos empresariais e parcerias", "Dissolução e liquidação societária",
      "Contencioso empresarial", "Direito do consumidor para empresas",
    ],
    diferenciais: [
      "Visão estratégica de negócios aliada ao rigor jurídico",
      "Experiência em operações M&A", "Rede de especialistas para casos complexos",
      "Atendimento ágil e respostas práticas",
    ],
  },
  "execucao-credito": {
    titulo: "Execução e Recuperação de Crédito",
    resumo: "Estratégias eficazes e ferramentas tecnológicas para recuperar créditos com máxima eficiência.",
    cor: "#ef4444",
    descricao: [
      "A recuperação de crédito exige conhecimento técnico profundo e uso estratégico das ferramentas disponíveis na Justiça brasileira. Nossa atuação utiliza os sistemas SISBAJUD, RENAJUD e INFOJUD para localizar bens e realizar bloqueios com agilidade.",
      "Desenvolvemos estratégias personalizadas para cada devedor, aumentando significativamente as chances de efetiva recuperação dos valores.",
    ],
    servicos: [
      "Ações de execução judicial", "Pesquisa patrimonial (SISBAJUD, RENAJUD, INFOJUD)",
      "Penhora online e bloqueio de ativos", "Arrematação em leilões judiciais",
      "Recuperação extrajudicial de crédito", "Negociação e acordos de parcelamento",
      "Proteção SERP e restrições creditícias", "Execuções trabalhistas e fiscais",
    ],
    diferenciais: [
      "Uso ativo de ferramentas de busca de bens", "Estratégia personalizada por devedor",
      "Relatórios periódicos de andamento", "Eficiência comprovada em recuperação",
    ],
  },
  "lgpd": {
    titulo: "LGPD e Proteção de Dados",
    resumo: "Adequação completa à Lei Geral de Proteção de Dados com suporte contínuo para empresas de todos os tamanhos.",
    cor: "#06b6d4",
    descricao: [
      "A LGPD trouxe obrigações legais significativas para todas as empresas que tratam dados pessoais no Brasil. O não cumprimento sujeita organizações a multas de até 2% do faturamento, além de danos reputacionais graves.",
      "Nossa equipe oferece desde o diagnóstico inicial até a implementação completa e o monitoramento contínuo da conformidade com a lei.",
    ],
    servicos: [
      "Diagnóstico e mapeamento de dados (ROPA)", "Elaboração de políticas de privacidade",
      "Implementação de programas de conformidade", "DPO (Encarregado) terceirizado",
      "Atendimento a titulares de dados", "Resposta a incidentes e notificações à ANPD",
      "Treinamentos e capacitação de equipes", "Adequação de contratos com fornecedores",
    ],
    diferenciais: [
      "Metodologia estruturada de adequação", "DPO disponível de forma contínua",
      "Atualização permanente sobre decisões da ANPD", "Experiência em setores regulados",
    ],
  },
  "consultoria-preventiva": {
    titulo: "Consultoria Preventiva",
    resumo: "Identificação proativa de riscos jurídicos para proteger seu patrimônio e garantir a continuidade do negócio.",
    cor: "#10b981",
    descricao: [
      "Prevenir é sempre mais eficiente e econômico do que litigar. Nossa consultoria preventiva identifica vulnerabilidades jurídicas antes que se tornem problemas, permitindo ações corretivas a tempo.",
      "Oferecemos análise completa dos aspectos jurídicos do seu negócio, contratos, relações trabalhistas, questões regulatórias e tributárias.",
    ],
    servicos: [
      "Auditoria jurídica empresarial", "Due diligence pré-investimento",
      "Análise de risco contratual", "Gestão de passivos trabalhistas",
      "Pareceres jurídicos especializados", "Revisão de estrutura societária",
      "Análise de conformidade regulatória", "Planejamento sucessório empresarial",
    ],
    diferenciais: [
      "Abordagem preventiva e estratégica", "Relatórios objetivos com recomendações práticas",
      "Visão multidisciplinar do negócio", "Relação de parceria de longo prazo",
    ],
  },
  "contratos": {
    titulo: "Contratos",
    resumo: "Elaboração, revisão e negociação de contratos que protegem seus interesses e previnem litígios futuros.",
    cor: "#f59e0b",
    descricao: [
      "Um contrato bem elaborado é o melhor investimento jurídico que uma empresa ou pessoa pode fazer. Ele previne disputas, define obrigações com clareza e protege todas as partes envolvidas.",
      "Nossa equipe elabora e revisa contratos de qualquer complexidade, com linguagem clara e cláusulas que realmente funcionam na prática.",
    ],
    servicos: [
      "Contratos de prestação de serviços", "Contratos empresariais e societários",
      "Contratos de trabalho e terceirização", "Contratos de locação e imobiliários",
      "Contratos de franquia e distribuição", "Termos de uso e política de privacidade",
      "Revisão e análise crítica de contratos", "Negociação e mediação contratual",
    ],
    diferenciais: [
      "Linguagem clara sem perder o rigor jurídico", "Proteção efetiva dos seus interesses",
      "Experiência em contratos de alta complexidade", "Entrega ágil e revisões inclusas",
    ],
  },
  "compliance": {
    titulo: "Compliance",
    resumo: "Programas de integridade corporativa que protegem sua empresa, gestores e reputação no mercado.",
    cor: "#c9a84c",
    descricao: [
      "Com a Lei Anticorrupção (12.846/2013) e a crescente exigência por transparência corporativa, o compliance deixou de ser diferencial para se tornar necessidade. Empresas sem programas estruturados expõem gestores e acionistas a riscos graves.",
      "Desenvolvemos programas de integridade sob medida, considerando o porte, setor e perfil de risco de cada organização.",
    ],
    servicos: [
      "Mapeamento de riscos de corrupção", "Elaboração de código de ética e conduta",
      "Implantação de canal de denúncias", "Treinamentos e workshops para equipes",
      "Due diligence de terceiros", "Investigações internas",
      "Defesa em processos da Lei Anticorrupção", "Acordos de leniência",
    ],
    diferenciais: [
      "Programas práticos e adequados ao porte da empresa",
      "Gestores experientes em setores regulados",
      "Monitoramento e atualização contínuos",
      "Credibilidade perante órgãos de controle",
    ],
  },
};

export default async function AreaDetalhe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = AREAS[slug];
  if (!area) notFound();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: area.cor + "15" }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/areas-de-atuacao" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft size={13} />
            Todas as áreas
          </Link>
          <div className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 text-white" style={{ backgroundColor: area.cor }}>
            Área de Atuação
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{area.titulo}</h1>
          <p className="text-base text-gray-600 max-w-xl leading-relaxed">{area.resumo}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Conteúdo principal */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Como Atuamos</h2>
              <div className="space-y-4">
                {area.descricao.map((p, i) => (
                  <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Serviços Prestados</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {area.servicos.map(s => (
                  <div key={s} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: area.cor }} />
                    <span className="text-xs text-gray-700 leading-relaxed">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#060d1a] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Nossos Diferenciais</h3>
              <ul className="space-y-3">
                {area.diferenciais.map(d => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: area.cor }} />
                    <span className="text-xs text-white/70 leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 rounded-2xl p-6 text-center" style={{ borderColor: area.cor + "40" }}>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Precisa de ajuda?</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Agende uma consulta e descubra como podemos resolver o seu caso.
              </p>
              <Link
                href="/contato"
                className="block w-full py-3 text-xs font-bold text-white rounded-xl transition-colors mb-2"
                style={{ backgroundColor: area.cor }}
              >
                Falar com especialista
              </Link>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 text-xs font-medium border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
