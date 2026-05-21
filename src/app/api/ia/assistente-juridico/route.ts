import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { apiAuth } from "@/shared/auth/api-auth";

export const maxDuration = 60;

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT — Assistente Jurídico Profissional
// ═══════════════════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Assistente jurídico profissional especializado em Direito brasileiro. Apoia advogados na elaboração de peças processuais, análises e estratégias jurídicas.

REGRA ABSOLUTA: Nunca invente números de processos, súmulas, acórdãos ou precedentes. Cite apenas jurisprudência fornecida pelo usuário ou use referências genéricas consolidadas ("conforme entendimento do TST", "segundo o STJ").

ÁREAS: Trabalhista (CLT/reforma 2017), Civil (CC/2002), Consumidor (CDC), Empresarial, Tributário, Previdenciário, Administrativo, LGPD.

PEÇAS: Petição inicial, contestação, tutela de urgência, recursos (ordinário, apelação, agravo, revista), embargos, mandado de segurança, notificação, parecer, contratos, acordos.

ESTRUTURA de peças: endereçamento → qualificação das partes → DOS FATOS (numerados) → DO DIREITO (fundamentos legais) → DOS PEDIDOS (numerados) → valor da causa.

MODOS: REDAÇÃO (peça completa) | ANÁLISE (riscos/chances baixo/médio/alto) | REVISÃO (corrige) | ESTRATÉGIA (teses) | CÁLCULO (verbas) | CHECKLIST (documentos) | CONSULTA (dúvidas).

FORMATAÇÃO: ## seções, **termos-chave**, listas numeradas para pedidos. Linguagem formal, técnica e objetiva.

Ao final de peças completas: "---\n*⚖️ Documento elaborado com apoio de IA. Revisar e assinar antes do protocolo.*"

Responda sempre em português brasileiro jurídico.`;

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMPLATES: Record<string, string> = {
  peticao_inicial_trabalhista: `Elabore uma petição inicial trabalhista completa: endereçamento à Vara do Trabalho, qualificação das partes, fatos cronológicos, fundamentação na CLT e jurisprudência consolidada do TST, pedidos numerados com valores e valor da causa.`,
  contestacao: `Elabore contestação completa: preliminares cabíveis, impugnação específica de cada fato da inicial com fundamento legal, pedidos de improcedência total ou parcial.`,
  recurso_ordinario: `Elabore Recurso Ordinário completo: cabimento, tempestividade, impugnação específica de cada ponto da sentença, pedido de conhecimento e provimento.`,
  tutela_urgencia: `Elabore requerimento de Tutela de Urgência (art. 300 CPC/2015): demonstre probabilidade do direito (fumus boni iuris), perigo de dano (periculum in mora) e adequação da medida.`,
  notificacao_extrajudicial: `Elabore Notificação Extrajudicial formal: identificação das partes, fatos, fundamentação jurídica, exigência objetiva com prazo determinado e consequências do descumprimento.`,
  parecer_juridico: `Elabore Parecer Jurídico estruturado: ementa, objeto, fatos, questões jurídicas, análise do direito aplicável, conclusão objetiva e recomendação.`,
  acordo_extrajudicial: `Elabore proposta de acordo extrajudicial: qualificação das partes, objeto, valor e forma de pagamento, cláusula de quitação, foro, data e campo para duas testemunhas.`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  // 1. Auth
  const { error } = await apiAuth();
  if (error) return error;

  // 2. Chaves de API
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!anthropicKey && !groqKey) {
    return new Response("Assistente não configurado. Adicione ANTHROPIC_API_KEY ou GROQ_API_KEY no Vercel.", { status: 503 });
  }

  // 3. Corpo da requisição
  let body: {
    mensagens: { role: "user" | "assistant"; content: string }[];
    contexto?: Record<string, string>;
  };
  try {
    body = await request.json();
  } catch {
    return new Response("Corpo inválido", { status: 400 });
  }

  const { mensagens: todasMensagens, contexto } = body;
  if (!todasMensagens?.length) return new Response("Mensagens ausentes", { status: 400 });

  // Limita o histórico enviado à API — máximo 10 mensagens (5 trocas)
  // Evita estourar o limite de tokens do plano gratuito
  const mensagens = todasMensagens.slice(-10);

  // 4. Montar system prompt com contexto
  let systemContent = SYSTEM_PROMPT;
  if (contexto && Object.values(contexto).some(v => v?.trim())) {
    const parts = ["\n\n═══ CONTEXTO DO CASO ═══"];
    if (contexto.modo) parts.push(`MODO: ${contexto.modo}`);
    if (contexto.tipo) parts.push(`Tipo: ${contexto.tipo}`);
    if (contexto.area) parts.push(`Área: ${contexto.area}`);
    if (contexto.polo_ativo) parts.push(`Polo Ativo: ${contexto.polo_ativo}`);
    if (contexto.polo_passivo) parts.push(`Polo Passivo: ${contexto.polo_passivo}`);
    if (contexto.numero_processo) parts.push(`Processo nº: ${contexto.numero_processo}`);
    if (contexto.vara) parts.push(`Vara: ${contexto.vara}`);
    if (contexto.comarca) parts.push(`Comarca: ${contexto.comarca}`);
    if (contexto.tribunal) parts.push(`Tribunal: ${contexto.tribunal}`);
    if (contexto.juiz) parts.push(`Magistrado: ${contexto.juiz}`);
    if (contexto.valorCausa) parts.push(`Valor da causa: R$ ${contexto.valorCausa}`);
    if (contexto.dataFatos) parts.push(`Data dos fatos: ${contexto.dataFatos}`);
    if (contexto.prazoResposta) parts.push(`Prazo: ${contexto.prazoResposta}`);
    // Trunca campos longos — limite conservador para o free tier do Groq
    const truncar = (s: string, max = 2000) => s.length > max ? s.slice(0, max) + "\n[conteúdo resumido — forneça em partes se necessário]" : s;
    if (contexto.jurisprudencia) parts.push(`\nJurisprudência fornecida:\n${truncar(contexto.jurisprudencia, 1500)}`);
    if (contexto.informacoes) parts.push(`\nFatos e informações:\n${truncar(contexto.informacoes, 2500)}`);
    if (contexto.template && TEMPLATES[contexto.template]) parts.push(`\nInstrução: ${TEMPLATES[contexto.template]}`);
    parts.push("═══ FIM DO CONTEXTO ═══");
    systemContent += parts.join("\n");
  }

  const streamHeaders = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "X-Content-Type-Options": "nosniff",
  };

  // ── Claude (Anthropic) ───────────────────────────────────────────────────────
  if (anthropicKey) {
    const stream = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          const client = new Anthropic({ apiKey: anthropicKey });
          const response = await client.messages.stream({
            model: "claude-sonnet-4-5",
            max_tokens: 8096,
            temperature: 0.25,
            system: systemContent,
            messages: mensagens.map(m => ({ role: m.role, content: m.content })),
          });
          for await (const chunk of response) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(enc.encode(chunk.delta.text));
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          controller.enqueue(enc.encode(`\n\n⚠️ Erro Claude: ${msg}`));
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, { headers: streamHeaders });
  }

  // ── Groq (fallback) ──────────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const groqMessages = [
          { role: "system", content: systemContent },
          ...mensagens.map(m => ({ role: m.role, content: m.content })),
        ];

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",  // 70b para qualidade jurídica
            messages: groqMessages,
            stream: true,
            max_tokens: 3000,
            temperature: 0.2,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();

          // Rate limit (413/429) — tenta com modelo menor e contexto mínimo
          if (res.status === 413 || res.status === 429) {
            controller.enqueue(enc.encode("⚠️ Limite de tokens atingido. Tentando com contexto reduzido...\n\n"));
            const ultimaMensagem = groqMessages[groqMessages.length - 1];
            const retryRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
              body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [groqMessages[0], ultimaMensagem], // apenas system + última msg
                stream: true,
                max_tokens: 3000,
                temperature: 0.25,
              }),
            });
            if (retryRes.ok) {
              const retryReader = retryRes.body!.getReader();
              const retryDecoder = new TextDecoder();
              while (true) {
                const { done, value } = await retryReader.read();
                if (done) break;
                const chunk = retryDecoder.decode(value, { stream: true });
                for (const line of chunk.split("\n")) {
                  const t = line.trim();
                  if (!t.startsWith("data: ")) continue;
                  const d = t.slice(6);
                  if (d === "[DONE]") continue;
                  try {
                    const delta = JSON.parse(d).choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(enc.encode(delta));
                  } catch { /* skip */ }
                }
              }
              controller.close();
              return;
            }
          }

          controller.enqueue(enc.encode(`⚠️ Erro Groq (${res.status}): ${errText}`));
          controller.close();
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(enc.encode(delta));
            } catch { /* linha malformada */ }
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        controller.enqueue(enc.encode(`\n\n⚠️ Erro: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: streamHeaders });
}
