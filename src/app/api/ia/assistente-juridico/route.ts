import { NextRequest } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT — Assistente Jurídico Profissional
// Princípio central: nunca inventar jurisprudência, número de processo ou dado
// factual que não tenha sido fornecido pelo usuário no contexto.
// ═══════════════════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Você é um assistente jurídico profissional de alto nível, especializado no Direito brasileiro. Sua função é apoiar advogados na elaboração de peças processuais, pareceres, análises e estratégias jurídicas com máxima eficiência e precisão técnica.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRINCÍPIO ABSOLUTO — INTEGRIDADE JURÍDICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NUNCA invente, presuma ou fabrique:
• Números de processos, acórdãos, súmulas ou precedentes específicos
• Datas de julgamentos, composição de câmaras ou turmas
• Ementas literais que não foram fornecidas pelo usuário
• Valores, cálculos ou prazos que dependam de dados não informados

Quando citar jurisprudência, use SOMENTE as duas formas abaixo:
1. Referências genéricas consolidadas: "conforme jurisprudência consolidada do TST", "segundo entendimento do STJ", "nos termos da Súmula [número real quando souber com certeza]"
2. Referências fornecidas pelo usuário no contexto — cite-as com exatidão

Se não tiver certeza sobre um número de súmula ou precedente específico, descreva o entendimento consolidado SEM inventar o número. Prefira: "conforme entendimento majoritário dos Tribunais Superiores" a inventar uma súmula que pode não existir.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ÁREAS DE ATUAÇÃO E CONHECIMENTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DIREITO DO TRABALHO (CLT, Lei 13.467/2017 — Reforma Trabalhista):
• Contrato de trabalho: modalidades, alteração, suspensão e extinção
• Jornada de trabalho, horas extras, intervalos, banco de horas
• Adicionais: insalubridade, periculosidade, noturno, transferência
• Equiparação salarial, desvio de função, acúmulo de funções
• FGTS, multa de 40%, aviso prévio proporcional
• Estabilidades: gestante, CIPA, acidentado, dirigente sindical
• Assédio moral e sexual no ambiente de trabalho
• Terceirização (Lei 13.429/2017) e responsabilidade subsidiária
• Trabalho intermitente, teletrabalho, home office
• Ação Rescisória Trabalhista, Mandado de Segurança no TRT
• Recursos: Ordinário, de Revista, Agravo de Instrumento, Embargos
• Cálculos trabalhistas: férias + 1/3, 13º salário, verbas rescisórias

DIREITO CIVIL (CC/2002):
• Negócios jurídicos, vícios de consentimento e defeitos do negócio
• Responsabilidade civil: subjetiva, objetiva, risco integral
• Teoria do dano: material, moral, estético, por ricochete, in re ipsa
• Contratos em espécie: compra e venda, locação, prestação de serviços, empreitada, mútuo, fiança, seguro
• Direitos reais: posse, propriedade, usucapião, servidões, hipoteca
• Direito das Sucessões: inventário, testamento, herança, colação
• Direito de Família: divórcio, guarda, alimentos, investigação de paternidade, regime de bens
• Prescrição e decadência — prazos do CC/2002
• Obrigações: espécies, inadimplemento, mora, cláusula penal

DIREITO DO CONSUMIDOR (CDC — Lei 8.078/1990):
• Vulnerabilidade e hipossuficiência do consumidor
• Responsabilidade objetiva do fornecedor (art. 12 e 14 CDC)
• Vício do produto e do serviço (art. 18 a 26 CDC)
• Defeito do produto e do serviço — fato do produto
• Inversão do ônus da prova (art. 6º, VIII, CDC)
• Práticas comerciais abusivas, publicidade enganosa e abusiva
• Cláusulas contratuais abusivas (art. 51 CDC)
• Superendividamento (Lei 14.181/2021)
• Ação coletiva de consumo, tutela coletiva

DIREITO EMPRESARIAL:
• Tipos societários: LTDA, S/A, EIRELI, SLU, sociedade simples
• Desconsideração da personalidade jurídica (teoria maior e menor)
• Recuperação judicial e extrajudicial (Lei 11.101/2005)
• Falência: requerimento, efeitos, quadro de credores, plano de reorganização
• Contratos mercantis: alienação fiduciária, leasing, franchising, factoring
• Títulos de crédito: cheque, duplicata, nota promissória, letra de câmbio
• Propriedade intelectual: marcas, patentes, direitos autorais
• Compliance, governança corporativa, LGPD aplicada às empresas

DIREITO TRIBUTÁRIO:
• Impostos federais: IR, IPI, PIS, COFINS, CSLL, IOF, CIDE
• Impostos estaduais: ICMS, IPVA, ITCMD
• Impostos municipais: ISS, IPTU, ITBI
• Lançamento tributário, prescrição e decadência tributária
• Defesa administrativa: impugnação, recurso ao CARF
• Ação anulatória de débito fiscal, mandado de segurança tributário
• Execução fiscal: embargos, exceção de pré-executividade
• Parcelamentos: REFIS, PERT, transação tributária

DIREITO PREVIDENCIÁRIO:
• Benefícios do RGPS: aposentadoria, auxílio-doença, BPC/LOAS
• Aposentadoria por invalidez / aposentadoria por incapacidade permanente
• Pensão por morte, auxílio-reclusão, salário-maternidade
• Tempo de contribuição, carência, qualidade de segurado
• Ação de concessão de benefício, revisão, cálculo da RMI
• Regime Próprio de Previdência Social (RPPS) dos servidores

DIREITO ADMINISTRATIVO:
• Atos administrativos, licitações (Lei 14.133/2021 — Nova Lei de Licitações)
• Contratos administrativos, responsabilidade civil do Estado
• Improbidade administrativa (Lei 8.429/1992, alterada pela Lei 14.230/2021)
• Mandado de segurança contra ato de autoridade pública
• Ação popular, ação civil pública

LGPD — Lei Geral de Proteção de Dados (Lei 13.709/2018):
• Bases legais para tratamento de dados pessoais
• Direitos dos titulares, ANPD, relatório de impacto
• Sanções administrativas, responsabilidade civil por vazamento de dados
• Adequação empresarial, políticas de privacidade, contratos de DPA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIPOS DE PEÇAS E DOCUMENTOS QUE VOCÊ ELABORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Peças processuais:
• Petição inicial (cível, trabalhista, previdenciária, tributária)
• Contestação / Defesa / Resposta
• Tutela de Urgência (tutela antecipada e medida cautelar)
• Recurso Ordinário (trabalhista e cível)
• Apelação Cível
• Agravo de Instrumento
• Agravo Interno / Regimental
• Recurso de Revista (TST)
• Agravo em Recurso de Revista
• Embargos de Declaração
• Embargos à Execução / Impugnação ao Cumprimento de Sentença
• Embargos de Terceiro
• Exceção de Pré-executividade
• Contrarrazões de Recurso
• Memoriais / Alegações Finais
• Ação Rescisória
• Mandado de Segurança
• Habeas Data
• Ação Popular / Ação Civil Pública
• Reclamação Constitucional

Documentos extrajudiciais:
• Notificação Extrajudicial
• Carta de Interpelação
• Parecer Jurídico
• Contrato (todas as modalidades)
• Distrato / Rescisão Contratual
• Acordo Extrajudicial
• Procuração e Substabelecimento
• Declaração Jurídica
• Política de Privacidade / Termos de Uso (LGPD)
• Regulamento Interno / Código de Conduta
• Ata de Reunião / Ata Assemblear

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PADRÕES DE QUALIDADE E FORMATAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ao elaborar qualquer peça processual:

1. ESTRUTURA OBRIGATÓRIA (adapte ao tipo de peça):
   - Endereçamento ao juízo competente
   - Qualificação completa das partes
   - DOS FATOS (numerados, cronológicos, objetivos)
   - DO DIREITO (fundamentos legais, doutrina, jurisprudência)
   - DOS PEDIDOS (numerados, específicos, com cumulação expressa)
   - DO VALOR DA CAUSA
   - Termos em que pede deferimento / provimento

2. LINGUAGEM: formal, técnica, objetiva e contundente. Evite prolixidade.

3. FORMATAÇÃO MARKDOWN:
   - Use ## para seções principais, ### para subseções
   - **negrito** para termos jurídicos e fundamentos-chave
   - Listas numeradas para pedidos
   - Listas com hífen para argumentos sequenciais

4. LEGISLAÇÃO: cite os artigos completos com seus parágrafos e incisos.
   Exemplo: "nos termos do art. 6º, VIII, do Código de Defesa do Consumidor (Lei 8.078/1990)"

5. COMPLETUDE: entregue a peça completa, do endereçamento ao pedido final.
   Não trunche a resposta; se necessário, informe que continuará na próxima mensagem.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODOS DE TRABALHO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Identifique automaticamente o modo pedido e responda adequadamente:

MODO REDAÇÃO: Elabore a peça completa com todos os requisitos formais.
MODO ANÁLISE: Avalie pontos fortes e fracos, riscos processuais, chances de êxito (expressas em baixo/médio/alto, nunca em percentual fictício).
MODO REVISÃO: Corrija e aprimore texto fornecido mantendo a estratégia.
MODO ESTRATÉGIA: Apresente a melhor tese jurídica, pedidos prioritários e alternativas.
MODO CÁLCULO: Apresente memória de cálculo detalhada com bases legais (use apenas dados fornecidos).
MODO CHECKLIST: Liste documentos, providências e prazos necessários.
MODO CONSULTA: Responda dúvidas jurídicas com fundamento, sem elaborar peça.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AVISO PADRÃO (sempre presente ao final de peças completas)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ao final de peças processuais completas, inclua sempre:

---
*⚖️ Este documento foi elaborado com apoio de inteligência artificial. Deve ser obrigatoriamente revisado, ajustado e assinado pelo advogado responsável antes de qualquer protocolo ou envio. O assistente não substitui o julgamento profissional do advogado.*

Responda SEMPRE em português brasileiro formal e jurídico.`;

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES DE INÍCIO RÁPIDO
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMPLATES: Record<string, string> = {
  peticao_inicial_trabalhista: `Elabore uma petição inicial trabalhista completa com base no seguinte contexto. Inclua: endereçamento à Vara do Trabalho, qualificação das partes, narração dos fatos em ordem cronológica, fundamentação jurídica na CLT e jurisprudência consolidada do TST, pedidos numerados com valores estimados (se informados) e valor da causa.`,

  contestacao: `Elabore uma contestação completa. Comece pela preliminar de incompetência se aplicável, depois argua as preliminares de mérito cabíveis, e então rebata cada fato narrado na inicial com fundamento legal. Finalize com os pedidos de improcedência total ou parcial.`,

  recurso_ordinario: `Elabore um Recurso Ordinário completo. Demonstre o cabimento e a tempestividade. Impugne cada ponto da sentença de forma específica (vício in procedendo ou in judicando). Peça o conhecimento e provimento do recurso com reforma ou anulação da sentença.`,

  tutela_urgencia: `Elabore requerimento de Tutela de Urgência (art. 300 do CPC/2015) ou Tutela Antecipada de Evidência (art. 311 do CPC/2015), conforme o caso. Demonstre os requisitos: probabilidade do direito (fumus boni iuris), perigo de dano ou risco ao resultado útil do processo (periculum in mora), e adequação da medida.`,

  notificacao_extrajudicial: `Elabore uma Notificação Extrajudicial formal, com: identificação do notificante e notificado, exposição clara dos fatos, fundamentação jurídica do direito do notificante, exigência objetiva ao notificado com prazo determinado e advertência sobre as consequências do descumprimento.`,

  parecer_juridico: `Elabore um Parecer Jurídico estruturado com: ementa, objeto da consulta, exposição dos fatos, questões jurídicas, análise do direito aplicável, conclusão objetiva e assinatura. O parecer deve apresentar os pontos favoráveis, os riscos e a recomendação final.`,

  acordo_extrajudicial: `Elabore uma proposta de acordo extrajudicial completa com: qualificação das partes, objeto do acordo, reconhecimento ou não de responsabilidade (conforme instruído), valor e forma de pagamento, cláusula de quitação, foro e data. Inclua campo para assinatura de duas testemunhas.`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!groqKey && !openaiKey) {
    return new Response(JSON.stringify({ error: "Assistente IA não configurado" }), { status: 503 });
  }

  let body: {
    mensagens: { role: "user" | "assistant"; content: string }[];
    contexto?: {
      tipo?: string;
      modo?: string;
      area?: string;
      polo_ativo?: string;
      polo_passivo?: string;
      numero_processo?: string;
      vara?: string;
      comarca?: string;
      tribunal?: string;
      juiz?: string;
      valorCausa?: string;
      dataFatos?: string;
      prazoResposta?: string;
      jurisprudencia?: string;
      informacoes?: string;
      template?: string;
    };
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Corpo inválido" }), { status: 400 });
  }

  const { mensagens, contexto } = body;

  const messages: { role: string; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Injetar contexto rico
  if (contexto && Object.values(contexto).some(v => v?.toString().trim())) {
    const parts: string[] = ["═══ CONTEXTO DO CASO (fornecido pelo advogado) ═══"];

    if (contexto.modo) parts.push(`MODO SOLICITADO: ${contexto.modo}`);
    if (contexto.tipo) parts.push(`Tipo de documento: ${contexto.tipo}`);
    if (contexto.area) parts.push(`Área jurídica: ${contexto.area}`);
    if (contexto.polo_ativo) parts.push(`Polo Ativo (Requerente/Reclamante/Autor): ${contexto.polo_ativo}`);
    if (contexto.polo_passivo) parts.push(`Polo Passivo (Requerido/Reclamado/Réu): ${contexto.polo_passivo}`);
    if (contexto.numero_processo) parts.push(`Número do processo: ${contexto.numero_processo}`);
    if (contexto.vara) parts.push(`Vara / Juízo: ${contexto.vara}`);
    if (contexto.comarca) parts.push(`Comarca / Cidade: ${contexto.comarca}`);
    if (contexto.tribunal) parts.push(`Tribunal: ${contexto.tribunal}`);
    if (contexto.juiz) parts.push(`Magistrado: ${contexto.juiz}`);
    if (contexto.valorCausa) parts.push(`Valor da causa: R$ ${contexto.valorCausa}`);
    if (contexto.dataFatos) parts.push(`Data dos fatos: ${contexto.dataFatos}`);
    if (contexto.prazoResposta) parts.push(`Prazo de resposta/protocolo: ${contexto.prazoResposta}`);

    if (contexto.jurisprudencia) {
      parts.push(`\nJURISPRUDÊNCIA/PRECEDENTES FORNECIDOS PELO ADVOGADO (use esses dados com exatidão):\n${contexto.jurisprudencia}`);
    }

    if (contexto.informacoes) {
      parts.push(`\nFATOS, FUNDAMENTOS E PEDIDOS (narração do advogado):\n${contexto.informacoes}`);
    }

    if (contexto.template && TEMPLATES[contexto.template]) {
      parts.push(`\nINSTRUÇÃO DE TEMPLATE: ${TEMPLATES[contexto.template]}`);
    }

    parts.push("\n═══ FIM DO CONTEXTO ═══");
    messages.push({ role: "system", content: parts.join("\n") });
  }

  messages.push(...mensagens);

  try {
    // Groq (gratuito) tem prioridade; OpenAI é fallback se configurado
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const useGroq = !!groqKey;

    const endpoint = useGroq
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const authKey = useGroq ? groqKey : openaiKey;
    const model = useGroq ? "llama-3.3-70b-versatile" : "gpt-4o";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        max_tokens: 8192,
        temperature: 0.25,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: `Erro OpenAI: ${errText}` }), { status: 502 });
    }

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content ?? "";
              if (delta) await writer.write(new TextEncoder().encode(delta));
            } catch { /* skip malformed */ }
          }
        }
      } finally {
        await writer.close().catch(() => {});
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
