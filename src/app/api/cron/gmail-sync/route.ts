import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";

export const maxDuration = 60;

// ─── Verifica que a chamada vem do próprio Vercel Cron ────────────────────────
function autorizarCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // sem segredo configurado: ambiente de dev
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

// ─── Helpers de token Google ──────────────────────────────────────────────────

async function refreshToken(usuarioId: string, refreshToken: string): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
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

async function getAccessToken(usuarioId: string): Promise<string | null> {
  const token = await prisma.googleToken.findUnique({ where: { usuarioId } });
  if (!token) return null;
  if (token.expiresAt > new Date(Date.now() + 3 * 60 * 1000)) return token.accessToken;
  if (!token.refreshToken) return null;
  return refreshToken(usuarioId, token.refreshToken);
}

// ─── Gmail helpers ────────────────────────────────────────────────────────────

type GmailMsg = { id: string; threadId: string };

async function listarMensagens(accessToken: string, query: string): Promise<GmailMsg[]> {
  const params = new URLSearchParams({ q: query, maxResults: "50" });
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return [];
  const data: { messages?: GmailMsg[] } = await res.json();
  return data.messages ?? [];
}

type GmailPart = { mimeType: string; body?: { data?: string }; parts?: GmailPart[] };
type GmailFull = {
  id: string;
  payload: { headers: { name: string; value: string }[]; body?: { data?: string }; parts?: GmailPart[] };
  internalDate: string;
};

async function obterMensagem(accessToken: string, id: string): Promise<GmailFull | null> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) return null;
  return res.json();
}

function extrairTexto(msg: GmailFull) {
  const h = msg.payload.headers;
  const assunto   = h.find(x => x.name.toLowerCase() === "subject")?.value ?? "";
  const remetente = h.find(x => x.name.toLowerCase() === "from")?.value ?? "";

  function partes(parts?: GmailPart[]): string {
    if (!parts) return "";
    let t = "";
    for (const p of parts) {
      if (p.mimeType === "text/plain" && p.body?.data) {
        t += Buffer.from(p.body.data, "base64url").toString("utf-8");
      } else if (p.mimeType === "text/html" && p.body?.data && !t) {
        t += Buffer.from(p.body.data, "base64url").toString("utf-8")
          .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
      } else if (p.parts) {
        t += partes(p.parts);
      }
    }
    return t;
  }

  let corpo = msg.payload.body?.data
    ? Buffer.from(msg.payload.body.data, "base64url").toString("utf-8")
    : partes(msg.payload.parts);

  return { assunto, remetente, corpo: corpo.slice(0, 6000) };
}

// ─── Parser / IA ─────────────────────────────────────────────────────────────

type Extraido = {
  titulo: string; conteudo: string;
  numero_processo: string | null; tipo_ato: string;
  tribunal: string | null; vara: string | null;
  data_prazo: string | null;
  urgencia: "CRITICA" | "ALTA" | "NORMAL" | "BAIXA";
  sistema: string; is_intimacao_juridica: boolean;
};

function isJudicial(remetente: string, assunto: string): boolean {
  const r = remetente.toLowerCase(), a = assunto.toLowerCase();
  if (r.includes("@jus.br") || r.includes("@trt") || r.includes("@trf") || r.includes("@tjsp")) return true;
  return ["pje", "intimação", "intimacao", "publicação", "esaj", "eproc", "tribunal"].some(p => a.includes(p));
}

function parseRegex(assunto: string, corpo: string, remetente: string): Extraido {
  const texto = `${assunto}\n${corpo}`;
  const numMatch = texto.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/);

  const tipoMap: [string, string][] = [
    ["tutela", "Tutela de Urgência"], ["citação", "Citação"], ["sentença", "Sentença"],
    ["acórdão", "Acórdão"], ["despacho", "Despacho"], ["decisão", "Decisão"],
  ];
  const tl = texto.toLowerCase();
  const tipo_ato = tipoMap.find(([k]) => tl.includes(k))?.[1] ?? "Intimação";

  const diasM = corpo.match(/prazo\s+de\s+(\d+)\s+dias?/i);
  const dias  = diasM ? parseInt(diasM[1]) : null;
  const dataM = corpo.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  let data_prazo: string | null = null;
  if (dataM) data_prazo = `${dataM[3]}-${dataM[2]}-${dataM[1]}`;
  else if (dias) { const d = new Date(); d.setDate(d.getDate() + dias); data_prazo = d.toISOString().slice(0, 10); }

  const urgencia: Extraido["urgencia"] =
    (dias !== null && dias <= 2) ? "CRITICA" :
    (dias !== null && dias <= 5) ? "ALTA" :
    (tipo_ato === "Tutela de Urgência") ? "ALTA" : "NORMAL";

  const sistema = tl.includes("pje") ? "PJe" : tl.includes("esaj") ? "e-SAJ" :
    tl.includes("eproc") ? "EPROC" : tl.includes("dje") ? "DJe" : "Outro";

  return {
    titulo:  assunto.slice(0, 120) || `${tipo_ato} — ${sistema}`,
    conteudo: corpo.slice(0, 4000) || assunto,
    numero_processo: numMatch ? numMatch[0] : null,
    tipo_ato, tribunal: null, vara: null, data_prazo, urgencia, sistema,
    is_intimacao_juridica: isJudicial(remetente, assunto),
  };
}

async function parseComIA(assunto: string, corpo: string, remetente: string): Promise<Extraido> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: key });
      const msg = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        temperature: 0,
        system: "Extrator de e-mails judiciais brasileiros. Retorne APENAS JSON válido.",
        messages: [{ role: "user", content:
          `ASSUNTO: ${assunto}\nREMETENTE: ${remetente}\nCORPO:\n${corpo.slice(0, 3000)}\n\n` +
          `JSON: {"titulo":"","conteudo":"","numero_processo":"...ou null","tipo_ato":"Intimação","tribunal":null,"vara":null,"data_prazo":"YYYY-MM-DD ou null","urgencia":"CRITICA|ALTA|NORMAL|BAIXA","sistema":"PJe|e-SAJ|EPROC|DJe|Outro","is_intimacao_juridica":true}`,
        }],
      });
      const t = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
      return JSON.parse(t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")) as Extraido;
    } catch { /* fallback */ }
  }
  return parseRegex(assunto, corpo, remetente);
}

// ─── Sincronizar um usuário ───────────────────────────────────────────────────

const QUERY =
  "from:(@jus.br) OR from:(@tjsp.jus.br) OR from:(@trt.jus.br) OR from:(@trf.jus.br) OR " +
  "subject:(intimação OR intimacao OR pje OR esaj OR eproc OR \"diário da justiça\") newer_than:90d";

async function sincronizarUsuario(usuarioId: string): Promise<{ importadas: number; ignoradas: number }> {
  const accessToken = await getAccessToken(usuarioId);
  if (!accessToken) return { importadas: 0, ignoradas: 0 };

  const mensagens = await listarMensagens(accessToken, QUERY);
  if (mensagens.length === 0) return { importadas: 0, ignoradas: 0 };

  const ids = mensagens.map(m => m.id);
  const existentes = await prisma.intimacao.findMany({
    where: { emailId: { in: ids } },
    select: { emailId: true },
  });
  const setExistentes = new Set(existentes.map(i => i.emailId));
  const novas = mensagens.filter(m => !setExistentes.has(m.id));

  let importadas = 0, ignoradas = 0;

  for (const ref of novas.slice(0, 20)) {
    const msg = await obterMensagem(accessToken, ref.id);
    if (!msg) continue;
    const { assunto, corpo, remetente } = extrairTexto(msg);
    if (!corpo && !assunto) continue;
    const dados = await parseComIA(assunto, corpo, remetente);
    if (!dados.is_intimacao_juridica) { ignoradas++; continue; }

    const dataPublicacao = new Date(Number(msg.internalDate));
    const prazo          = dados.data_prazo ? new Date(dados.data_prazo) : null;

    let processoId: string | undefined;
    if (dados.numero_processo) {
      const proc = await prisma.processo.findUnique({
        where: { numero: dados.numero_processo }, select: { id: true },
      });
      processoId = proc?.id;
    }

    await prisma.intimacao.create({
      data: {
        titulo: dados.titulo, conteudo: dados.conteudo,
        dataPublicacao, prazo, urgencia: dados.urgencia,
        status: "PENDENTE", fonte: dados.sistema,
        emailId: ref.id, sistemaOrigem: dados.sistema,
        processoId,
      },
    });
    importadas++;
  }

  await prisma.googleToken.update({
    where: { usuarioId },
    data: { ultimaSync: new Date(), totalImportado: { increment: importadas } },
  });

  return { importadas, ignoradas };
}

// ─── GET — chamado pelo Vercel Cron ───────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!autorizarCron(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Busca todos os usuários com token Google válido
  const tokens = await prisma.googleToken.findMany({
    select: { usuarioId: true, ultimaSync: true },
  });

  if (tokens.length === 0) {
    return NextResponse.json({ msg: "Nenhum usuário com Gmail conectado." });
  }

  let totalImportadas = 0, totalIgnoradas = 0;
  const resultados: { usuarioId: string; importadas: number; ignoradas: number }[] = [];

  for (const t of tokens) {
    try {
      const { importadas, ignoradas } = await sincronizarUsuario(t.usuarioId);
      totalImportadas += importadas;
      totalIgnoradas  += ignoradas;
      resultados.push({ usuarioId: t.usuarioId, importadas, ignoradas });
    } catch {
      resultados.push({ usuarioId: t.usuarioId, importadas: 0, ignoradas: 0 });
    }
  }

  return NextResponse.json({
    ok: true,
    usuarios: tokens.length,
    totalImportadas,
    totalIgnoradas,
    resultados,
    executadoEm: new Date().toISOString(),
  });
}
