import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

// IDs exatos do checklist — devem ser retornados pela IA sem alteração
const MEDIDAS_REFERENCIA = [
  // Financeiro
  { id: "SISBAJUD",         nome: "SISBAJUD — bloqueio de contas bancárias" },
  { id: "CCS",              nome: "CCS — Cadastro de Clientes do Sistema Financeiro" },
  { id: "CRIPTOJUD",        nome: "CRIPTOJUD — bloqueio de criptoativos" },
  { id: "Penhora_Creditos", nome: "Penhora de Créditos / duplicatas / precatórios" },
  { id: "Penhora_Salario",  nome: "Penhora de Salário ou proventos (até 30%)" },
  // Veículos
  { id: "RENAJUD",          nome: "RENAJUD — consulta e bloqueio de veículos" },
  { id: "Bloqueio_Veiculo", nome: "Restrição de transferência de veículos RENAJUD" },
  { id: "Suspensao_CNH",    nome: "Suspensão da CNH (art. 139, III CPC)" },
  // Imóveis
  { id: "CNIB",             nome: "CNIB — indisponibilidade de bens imóveis" },
  { id: "Cartorio_Imoveis", nome: "Cartório de Registro de Imóveis — pesquisa e penhora" },
  { id: "IPTU",             nome: "IPTU — consulta de imóveis via cadastro municipal" },
  { id: "ITR",              nome: "ITR — imóveis rurais na Receita Federal" },
  { id: "Penhora_Imovel",   nome: "Penhora de Imóvel — registro de penhora imobiliária" },
  // Empresarial
  { id: "Junta_Comercial",  nome: "Junta Comercial — participação societária" },
  { id: "Receita_CNPJ",     nome: "Receita Federal CNPJ — consulta de empresas vinculadas" },
  { id: "Penhora_Quotas",   nome: "Penhora de Quotas Societárias" },
  { id: "Desconsideracao_PJ", nome: "Desconsideração da Personalidade Jurídica (arts. 133-137 CPC)" },
  { id: "Habilitacao_Falencia", nome: "Habilitação em Falência ou Recuperação Judicial" },
  { id: "Restricao_Licitacoes", nome: "Restrição de Licitações CEIS/CNEP" },
  // Informações
  { id: "INFOJUD",          nome: "INFOJUD — declarações de Imposto de Renda" },
  { id: "SNIPER",           nome: "SNIPER — Sistema Nacional de Pesquisa PGFN" },
  { id: "SERP",             nome: "SERP — Sistema Eletrônico de Recuperação de Precatórios" },
  { id: "IDPJ",             nome: "IDPJ — Identificação de Pessoas Jurídicas Receita Federal" },
  // Coercitivas
  { id: "Protesto",         nome: "Protesto extrajudicial da decisão ou certidão" },
  { id: "SPC_SERASA",       nome: "SPC/SERASA — negativação do devedor" },
  { id: "Apreensao_Passaporte", nome: "Apreensão de Passaporte (art. 139, IV CPC)" },
  { id: "Redirecionamento_Socios", nome: "Redirecionamento contra Sócios ou ex-sócios" },
  // Processuais
  { id: "Citacao",          nome: "Citação do executado" },
  { id: "Intimacao_Executado", nome: "Intimação para pagar ou embargar (art. 829 CPC)" },
  { id: "Avaliacao_Bens",   nome: "Avaliação dos bens penhorados" },
  { id: "Leilao",           nome: "Leilão ou hasta pública" },
  { id: "Adjudicacao",      nome: "Adjudicação pelo credor" },
];

export async function POST(request: NextRequest) {
  const { error } = await apiAuth();
  if (error) return error;

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurado" }, { status: 503 });
  }

  let textoProcesso = "";
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    // PDF enviado como arquivo
    const formData = await request.formData();
    const arquivo = formData.get("arquivo") as File | null;
    const textoManual = formData.get("texto") as string | null;

    if (textoManual) {
      textoProcesso = textoManual.slice(0, 30000);
    } else if (arquivo) {
      // Converte PDF para base64 e envia para Claude com document block
      const buffer = await arquivo.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const client = new Anthropic({ apiKey: anthropicKey });

      try {
        const msg = await client.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 2000,
          temperature: 0,
          messages: [{
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: arquivo.type as "application/pdf" || "application/pdf",
                  data: base64,
                },
              } as Anthropic.DocumentBlockParam,
              {
                type: "text",
                text: `Você é um especialista em execução judicial brasileira. Analise este processo e identifique quais medidas executivas já foram realizadas.

LISTA DE MEDIDAS (use o "id" exato no JSON de retorno):
${MEDIDAS_REFERENCIA.map(m => `- id: "${m.id}" → ${m.nome}`).join("\n")}

Para cada medida que encontrar menção no processo (positiva, negativa ou em andamento), inclua no array "medidas_realizadas" com:
- "id": o id EXATO da lista acima (ex: "SISBAJUD", "Penhora_Imovel")
- "status": "positivo" (localizou bem/bloqueio efetuado), "negativo" (pesquisa realizada sem resultado) ou "parcial" (resultado parcial/em andamento)
- "observacao": resultado específico, valor bloqueado, data da diligência, número do ofício, etc.
- "data": "DD/MM/YYYY" se encontrada no documento, senão omitir

NÃO inclua medidas que não tenham menção no processo. Retorne APENAS JSON válido sem markdown:
{
  "medidas_realizadas": [
    { "id": "SISBAJUD", "status": "positivo", "observacao": "R$ 12.500,00 bloqueados", "data": "10/03/2025" }
  ],
  "bens_localizados": ["descrição de cada bem encontrado"],
  "valor_total_bloqueado": "R$ X.XXX,XX ou null",
  "fase_atual": "descrição da fase atual",
  "recomendacoes_ia": ["próxima medida recomendada 1", "medida 2"],
  "resumo": "resumo em 2-3 linhas do status da execução"
}`,
              },
            ],
          }],
        });

        const texto = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
        const json = texto.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
        return NextResponse.json(JSON.parse(json));
      } catch (e) {
        return NextResponse.json({ error: `Erro ao analisar PDF: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Nenhum arquivo ou texto fornecido" }, { status: 400 });
    }
  } else {
    // JSON com texto extraído do processo
    const body: { texto: string } = await request.json();
    textoProcesso = (body.texto ?? "").slice(0, 30000);
  }

  // Análise por texto puro (sem PDF)
  const client = new Anthropic({ apiKey: anthropicKey });

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      temperature: 0,
      system: "Você é um especialista em execução judicial brasileira. Retorne APENAS JSON válido sem markdown.",
      messages: [{
        role: "user",
        content: `Analise este processo de execução e identifique as medidas já realizadas.

TEXTO DO PROCESSO:
${textoProcesso}

MEDIDAS (use o id EXATO no JSON):
${MEDIDAS_REFERENCIA.map(m => `- id: "${m.id}" → ${m.nome}`).join("\n")}

Retorne JSON com apenas as medidas que tiverem menção no processo:
{
  "medidas_realizadas": [{"id": "SISBAJUD", "status": "positivo|negativo|parcial", "observacao": "resultado específico", "data": "DD/MM/YYYY"}],
  "bens_localizados": ["..."],
  "valor_total_bloqueado": "...",
  "fase_atual": "...",
  "recomendacoes_ia": ["..."],
  "resumo": "..."
}`,
      }],
    });

    const texto = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
    const json = texto.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    return NextResponse.json(JSON.parse(json));
  } catch (e) {
    return NextResponse.json({ error: `Erro na análise: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }
}
