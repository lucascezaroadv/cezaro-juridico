import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "cezaro-juridico-secret-key-32chars!!"
);

const COOKIE = "cezaro_session";
const EXPIRES = 60 * 60 * 24 * 7; // 7 dias

export type SessionPayload = {
  userId: string;
  email: string;
  nome: string;
  cargo: string;
};

export async function criarToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES}s`)
    .sign(SECRET);
}

export async function verificarToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return verificarToken(token);
}

export async function setSession(payload: SessionPayload): Promise<void> {
  const token = await criarToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EXPIRES,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

// Para uso em API routes (server-side)
export async function requireSession() {
  const session = await getSession();
  if (!session) return { session: null, userId: null };
  return { session, userId: session.userId };
}

// Para uso no middleware (Edge) — lê o cookie do request
export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  return verificarToken(token);
}
