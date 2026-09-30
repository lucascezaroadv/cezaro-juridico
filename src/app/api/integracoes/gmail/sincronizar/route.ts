import { NextResponse } from "next/server";
import { getSession } from "@/shared/auth/session";
import { prisma } from "@/shared/database/prisma";

export const maxDuration = 60;

// ─── Helpers de token ────────────────────────────────────────────────────────

async function obterAccessToken(usuarioId: string): Promise<string | null> {
  const token = await prisma.googleToken.findUnique({ where: { usuarioId } });
  if (!token) return null;

  if (token.expiresAt > new Date(Date.now() + 3 * 60 * 1000)) {
    return token.accessToken;
  }

  if (!token.refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: token.refreshToken,
      grant_type:    "refresh_token",
    }),
  });

  if (!res.ok) return null;

  const dados: { access_token: string; expires_in: number } = await res.json();
  const expiresAt = new Date(Date.now() + dados.expires_in * 1000);

  await prisma.googleToken.update({
    where: { usuarioId },
    data:  { accessToken: dados.access_token, expiresAt },
  });

  return dados.access_token;
}

// ─── Helpers de prazo automático ─────────────────────────────────────────────

function adicionarDiasUteis(inicio: Date, dias: number): Date {
  const d = new Date(inicio);
  let adicionados = 0;
  while (adicionados < dias) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) adicionados++; // pula sábado e domingo
  }
  return d;
}

function detectarDataAudiencia(texto: string): Date | null {
  // Padrões: "audiência designada para DD/MM/YYYY", "audiência em DD/MM/YYYY"
  const patterns = [
    /audi[eê]ncia\s+(?:designada\s+para|marcada\s+para|em|no\s+dia)\s+(\d{2})\/(\d{2})\/(\d{4})/i,
    /(?:data|dia)\s+da\s+audi[eê]ncia[:\s]+(\d{2})\/(\d{2})\/(\d{4})/i,
    /audi[eê]ncia[^.]{0,60}(\d{2})\/(\d{2})\/(\d{4})/i,
  ];
  for (const re of patterns) {
    const m = texto.match(re);
    if (m) {
      const [, d, mo, y] = m;
      const dt = new Date(Number(y), Number(mo) - 1, Number(d));
      if (!isNaN(dt.getTime())) return dt;
    }
  }
  return null;
}

// ─── Gmail API helpers ────────────────────────────────────────────────────────

type GmailMessage = { id: string; threadId: string };

async function listarMensagens(
  accessToken: string,
  query: string,
  maxResults = 50
): Promise<{ mensagens: GmailMessage[]; erro?: string }> {
  const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message ?? `HTTP ${res.status}`;
    return { mensagens: [], erro: msg };
  }
  const data: { messages?: GmailMessage[] } = await res.json();
  return { mensagens: data.messages ?? [] };
}

type GmailPart = {
  mimeType: string;
  body?: { data?: string };
  parts?: GmailPart[];
};

type GmailFullMessage = {
  id: string;
  payload: {
    headers: { name: string; value: string }[];
    body?: { data?: string };
    parts?: GmailPart[];
  };
  internalDate: string;
};

async function obterMensagem(accessToken: string, id: string): Promise<GmailFullMessage | null> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return res.json();
}

function extrairTexto(msg: GmailFullMessage): { assunto: string; corpo: string; remetente: string } {
  const headers  = msg.payload.headers;
  const assunto  = headers.find(h => h.name.toLowerCase() === "subject")?.value ?? "";
  const remetente = headers.find(h => h.name.toLowerCase() === "from")?.value ?? "";

  function extrairPartes(parts?: GmailPart[]): string {
    if (!parts) return "";
    let texto = "";
    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        texto += Buffer.from(part.body.data, "base64url").toString("utf-8");
      } else if (part.mimeType === "text/html" && part.body?.data && !texto) {
        const html = Buffer.from(part.body.data, "base64url").toString("utf-8");
        texto += html
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/p>/gi, "\n\n")
          .replace(/<\/div>/gi, "\n")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
          .replace(/[ \t]+/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      } else if (part.parts) {
        texto += extrairPartes(part.parts);
      }
    }
    return texto;
  }

  let corpo = "";
  if (msg.payload.body?.data) {
    corpo = Buffer.from(msg.payload.body.data, "base64url").toString("utf-8");
  } else {
    corpo = extrairPartes(msg.payload.parts);
  }

  return { assunto, corpo: corpo.slice(0, 6000), remetente };
}

// ─── Parser por regex — funciona sem IA ──────────────────────────────────────

type IntimacaoExtraida = {
  titulo: string;
  conteudo: string;
  numero_processo: string | null;
  tipo_ato: string;
  tribunal: string | null;
  vara: string | null;
  data_prazo: string | null;
  urgencia: "CRITICA" | "ALTA" | "NORMAL" | "BAIXA";
  sistema: string;
  is_intimacao_juridica: boolean;
};

function detectarSistema(remetente: string, assunto: string, corpo: string): string {
  const texto = `${remetente} ${assunto} ${corpo}`.toLowerCase();
  if (texto.includes("pje") || texto.includes("processo judicial eletrônico")) return "PJe";
  if (texto.includes("esaj") || texto.includes("e-saj")) return "e-SAJ";
  if (texto.includes("eproc")) return "EPROC";
  if (texto.includes("projudi")) return "PROJUDI";
  if (texto.includes("diário da justiça") || texto.includes("dje")) return "DJe";
  return "Outro";
}

function extrairNumeroProcesso(texto: string): string | null {
  // Formato CNJ: 0000000-00.0000.0.00.0000
  const match = texto.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/);
  return match ? match[0] : null;
}

function extrairTipoAto(assunto: string, corpo: string): string {
  const texto = `${assunto} ${corpo}`.toLowerCase();
  if (texto.includes("tutela de urgência") || texto.includes("tutela antecipada")) return "Tutela de Urgência";
  if (texto.includes("citação")) return "Citação";
  if (texto.includes("intimação") || texto.includes("intimacao")) return "Intimação";
  if (texto.includes("sentença") || texto.includes("sentenca")) return "Sentença";
  if (texto.includes("acórdão") || texto.includes("acordao")) return "Acórdão";
  if (texto.includes("despacho")) return "Despacho";
  if (texto.includes("decisão") || texto.includes("decisao")) return "Decisão";
  if (texto.includes("publicação") || texto.includes("publicacao")) return "Publicação";
  return "Intimação";
}

function extrairPrazo(corpo: string): { data: string | null; dias: number | null } {
  // Busca padrões como "prazo de 15 dias", "no prazo de 30"
  const diasMatch = corpo.match(/prazo\s+de\s+(\d+)\s+dias?/i);
  const dias = diasMatch ? parseInt(diasMatch[1]) : null;

  // Busca datas no formato DD/MM/YYYY
  const dataMatch = corpo.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  let data: string | null = null;
  if (dataMatch) {
    data = `${dataMatch[3]}-${dataMatch[2]}-${dataMatch[1]}`;
  } else if (dias) {
    const prazoDate = new Date();
    prazoDate.setDate(prazoDate.getDate() + dias);
    data = prazoDate.toISOString().slice(0, 10);
  }

  return { data, dias };
}

function calcularUrgencia(dias: number | null, tipoAto: string): "CRITICA" | "ALTA" | "NORMAL" | "BAIXA" {
  const tipo = tipoAto.toLowerCase();
  if (tipo.includes("tutela") || tipo.includes("citação")) return "ALTA";
  if (dias === null) return "NORMAL";
  if (dias <= 2) return "CRITICA";
  if (dias <= 5) return "ALTA";
  if (dias <= 15) return "NORMAL";
  return "BAIXA";
}

function isEmailJudicial(remetente: string, assunto: string): boolean {
  const rem = remetente.toLowerCase();
  const ass = assunto.toLowerCase();
  // Verifica se vem de domínio judicial
  if (rem.includes("@jus.br") || rem.includes("@trt") || rem.includes("@trf") || rem.includes("@tjsp")) return true;
  // Ou se o assunto tem palavras-chave judiciais
  const palavras = ["pje", "intimação", "intimacao", "publicação", "esaj", "eproc", "tribunal", "processo judicial"];
  return palavras.some(p => ass.includes(p));
}

function parseEmailPorRegex(
  assunto: string,
  corpo: string,
  remetente: string
): IntimacaoExtraida {
  const textoCompleto = `${assunto}\n${corpo}`;
  const sistema       = detectarSistema(remetente, assunto, corpo);
  const numeroProcesso = extrairNumeroProcesso(textoCompleto);
  const tipoAto       = extrairTipoAto(assunto, corpo);
  const { data: dataPrazo, dias } = extrairPrazo(corpo);
  const urgencia      = calcularUrgencia(dias, tipoAto);
  const is_intimacao_juridica = isEmailJudicial(remetente, assunto);

  // Título: usa o assunto, limitado a 120 chars
  const titulo = assunto.slice(0, 120) || `${tipoAto} — ${sistema}`;

  // Conteúdo: corpo limpo
  const conteudo = corpo.slice(0, 4000) || assunto;

  // Tenta extrair tribunal e vara do corpo
  const tribunalMatch = corpo.match(/(Tribunal\s+[\w\s]+(?:Regional|Superior|Federal|Justiça)[\w\s]*)/i);
  const varaMatch     = corpo.match(/(\d+[aª°]?\s+Vara[\w\s]*(?:do|da|de)[\w\s]*)/i);

  return {
    titulo,
    conteudo,
    numero_processo: numeroProcesso,
    tipo_ato: tipoAto,
    tribunal: tribunalMatch ? tribunalMatch[1].trim().slice(0, 100) : null,
    vara: varaMatch ? varaMatch[1].trim().slice(0, 100) : null,
    data_prazo: dataPrazo,
    urgencia,
    sistema,
    is_intimacao_juridica,
  };
}

// ─── Tenta usar IA, cai no regex se não tiver chave ou falhar ────────────────

async function parseEmail(
  assunto: string,
  corpo: string,
  remetente: string
): Promise<IntimacaoExtraida | null> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (anthropicKey) {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: anthropicKey });
      const msg = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 800,
        temperature: 0,
        system: "Você é um extrator de dados de e-mails judiciais brasileiros. Retorne APENAS JSON válido, sem markdown.",
        messages: [{
          role: "user",
          content: `Analise este e-mail judicial e retorne JSON:\n\nASSUNTO: ${assunto}\nREMETENTE: ${remetente}\n\nCORPO:\n${corpo.slice(0, 3000)}\n\nJSON esperado:\n{"titulo":"...","conteudo":"...","numero_processo":"0000000-00.0000.0.00.0000 ou null","tipo_ato":"Intimação|Citação|Despacho|Decisão|Sentença|Publicação|Outro","tribunal":"... ou null","vara":"... ou null","data_prazo":"YYYY-MM-DD ou null","urgencia":"CRITICA|ALTA|NORMAL|BAIXA","sistema":"PJe|e-SAJ|EPROC|PROJUDI|DJe|Outro","is_intimacao_juridica":true}`,
        }],
      });
      const texto = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
      const json  = texto.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      return JSON.parse(json) as IntimacaoExtraida;
    } catch {
      // Cai no parser por regex
    }
  }

  // Fallback: parser por regex (sem IA)
  return parseEmailPorRegex(assunto, corpo, remetente);
}

// ─── Query Gmail ──────────────────────────────────────────────────────────────

const GMAIL_QUERY =
  "from:(@jus.br) OR from:(@tjsp.jus.br) OR from:(@trt.jus.br) OR from:(@trf.jus.br) OR " +
  "subject:(intimação OR intimacao OR pje OR esaj OR eproc OR \"diário da justiça\") newer_than:90d";

// ─── Route ───────────────────────────────────────────────────────────────────

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const accessToken = await obterAccessToken(session.userId);
  if (!accessToken) {
    return NextResponse.json({
      error: "Gmail não conectado ou token expirado. Reconecte o Gmail nas configurações.",
    }, { status: 403 });
  }

  const { mensagens, erro } = await listarMensagens(accessToken, GMAIL_QUERY, 50);
  if (erro) {
    // Erro 401/403 geralmente significa que o token não tem escopo gmail.readonly
    const semEscopo = erro.toLowerCase().includes("insufficient") || erro.includes("401") || erro.includes("403");
    return NextResponse.json({
      error: semEscopo
        ? "Permissão de leitura do Gmail não concedida. Desconecte e reconecte o Gmail nas Configurações → Integrações."
        : `Erro ao acessar Gmail: ${erro}`,
    }, { status: 403 });
  }
  if (mensagens.length === 0) {
    return NextResponse.json({
      importadas: 0, puladas: 0, total: 0,
      msg: "Nenhum e-mail judicial encontrado nos últimos 90 dias.",
    });
  }

  const emailIds     = mensagens.map((m: GmailMessage) => m.id);
  const jaExistentes = await prisma.intimacao.findMany({
    where: { emailId: { in: emailIds } },
    select: { emailId: true },
  });
  const idsExistentes = new Set(jaExistentes.map(i => i.emailId));
  const novas = mensagens.filter(m => !idsExistentes.has(m.id));

  if (novas.length === 0) {
    return NextResponse.json({
      importadas: 0, puladas: mensagens.length, total: mensagens.length,
      msg: "Todas as intimações já foram importadas anteriormente.",
    });
  }

  let importadas = 0;
  let ignoradas  = 0;

  for (const msgRef of novas.slice(0, 20)) {
    const msg = await obterMensagem(accessToken, msgRef.id);
    if (!msg) continue;

    const { assunto, corpo, remetente } = extrairTexto(msg);
    if (!corpo && !assunto) continue;

    const dados = await parseEmail(assunto, corpo, remetente);
    if (!dados || !dados.is_intimacao_juridica) { ignoradas++; continue; }

    const dataPublicacao = new Date(Number(msg.internalDate));
    const prazo          = dados.data_prazo ? new Date(dados.data_prazo) : null;

    let processoId: string | undefined;
    if (dados.numero_processo) {
      const proc = await prisma.processo.findUnique({
        where: { numero: dados.numero_processo },
        select: { id: true },
      });
      processoId = proc?.id;
    }

    const novaIntimacao = await prisma.intimacao.create({
      data: {
        titulo:        dados.titulo,
        conteudo:      dados.conteudo,
        dataPublicacao,
        prazo,
        urgencia:      dados.urgencia,
        status:        "PENDENTE",
        fonte:         dados.sistema,
        emailId:       msgRef.id,
        sistemaOrigem: dados.sistema,
        processoId,
      },
    });
    importadas++;

    // Auto-prazo de consulta: 5 dias úteis a partir de hoje, sem duplicar
    const prazoExiste = await prisma.prazo.findFirst({
      where: { intimacaoId: novaIntimacao.id },
    });
    if (!prazoExiste) {
      const dataConsulta = adicionarDiasUteis(new Date(), 5);

      // Detectar audiência no texto
      const dataAudiencia = detectarDataAudiencia(corpo + " " + assunto);

      if (dataAudiencia && dataAudiencia > new Date()) {
        await prisma.prazo.create({
          data: {
            titulo:        `Audiência: ${dados.titulo.slice(0, 80)}`,
            descricao:     `Audiência detectada automaticamente via e-mail de ${dados.sistema}.`,
            dataVencimento: dataAudiencia,
            tipo:          "PROCESSUAL",
            status:        "PENDENTE",
            intimacaoId:   novaIntimacao.id,
            processoId,
          },
        });
      }

      await prisma.prazo.create({
        data: {
          titulo:        `Consulta: ${dados.titulo.slice(0, 80)}`,
          descricao:     `Prazo automático gerado a partir de intimação recebida via ${dados.sistema}. Verifique o prazo fatal e ajuste se necessário.`,
          dataVencimento: dataConsulta,
          tipo:          "PROCESSUAL",
          status:        "PENDENTE",
          intimacaoId:   novaIntimacao.id,
          processoId,
        },
      });
    }
  }

  await prisma.googleToken.update({
    where: { usuarioId: session.userId },
    data: {
      ultimaSync:     new Date(),
      totalImportado: { increment: importadas },
    },
  });

  return NextResponse.json({
    importadas,
    ignoradas,
    puladas: idsExistentes.size,
    total:   mensagens.length,
    msg: `${importadas} nova${importadas !== 1 ? "s" : ""} intimaç${importadas !== 1 ? "ões" : "ão"} importada${importadas !== 1 ? "s" : ""}.`,
  });
}
