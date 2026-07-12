import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/shared/auth/session";

// Inicia o fluxo OAuth2 do Google — redireciona para a tela de consentimento
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: "GOOGLE_CLIENT_ID não configurado" }, { status: 503 });

  // Deriva a URL base diretamente do request — evita problemas com variáveis de ambiente mal formatadas
  const { protocol, host } = new URL(request.url);
  const baseUrl = `${protocol}//${host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
    state: session.userId,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
