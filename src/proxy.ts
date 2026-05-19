import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/shared/auth/session";

// Rotas que NÃO precisam de autenticação
const publicPaths = [
  "/",
  "/sobre",
  "/contato",
  "/login",
  "/setup",
  "/areas-de-atuacao",
  "/blog",
  "/portal",
  "/api/auth",
  "/api/portal",
  "/api/webhook",
  "/_next",
  "/favicon",
];

function isPublic(pathname: string): boolean {
  return publicPaths.some(p => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Arquivos estáticos — sempre permitir
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff|woff2|ttf)$/)) {
    return NextResponse.next();
  }

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Verificar sessão JWT
  const session = await getSessionFromRequest(request);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
