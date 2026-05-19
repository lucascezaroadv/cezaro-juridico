import { NextResponse } from "next/server";
import { getSession } from "./session";

/**
 * Drop-in replacement para `auth()` do Clerk nas API routes.
 * Retorna { userId, session } se autenticado, ou { error } para retornar imediatamente.
 */
export async function apiAuth() {
  const session = await getSession();
  if (!session) {
    return {
      userId: null as null,
      session: null as null,
      error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    };
  }
  return { userId: session.userId, session, error: null as null };
}
