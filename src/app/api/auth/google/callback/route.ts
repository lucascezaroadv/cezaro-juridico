import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";

// Recebe o code do Google, troca por tokens e salva no banco
export async function GET(request: NextRequest) {
  const { searchParams, protocol, host } = new URL(request.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state"); // userId que passamos no inicio do fluxo
  const error = searchParams.get("error");

  // Deriva a URL base do próprio request — sem depender de variável de ambiente
  const baseUrl    = `${protocol}//${host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (error || !code || !state) {
    return NextResponse.redirect(`${baseUrl}/configuracoes?gmail=erro&msg=${error ?? "sem_codigo"}`);
  }

  const clientId     = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  // ── 1. Trocar code por tokens ─────────────────────────────────────────────
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     clientId,
      client_secret: clientSecret,
      redirect_uri:  redirectUri,
      grant_type:    "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("[Google OAuth] Erro ao trocar code:", err);
    return NextResponse.redirect(`${baseUrl}/configuracoes?gmail=erro&msg=token_falhou`);
  }

  const tokens: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
  } = await tokenRes.json();

  // ── 2. Buscar e-mail da conta Google conectada ───────────────────────────
  let googleEmail: string | undefined;
  try {
    const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (infoRes.ok) {
      const info: { email?: string } = await infoRes.json();
      googleEmail = info.email;
    }
  } catch { /* não crítico */ }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  // ── 3. Salvar token no banco ──────────────────────────────────────────────
  await prisma.googleToken.upsert({
    where:  { usuarioId: state },
    create: {
      usuarioId:    state,
      accessToken:  tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      expiresAt,
      googleEmail:  googleEmail ?? null,
    },
    update: {
      accessToken:  tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt,
      googleEmail:  googleEmail ?? undefined,
    },
  });

  return NextResponse.redirect(`${baseUrl}/configuracoes?gmail=conectado`);
}
