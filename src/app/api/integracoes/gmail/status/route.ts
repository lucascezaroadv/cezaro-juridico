import { NextResponse } from "next/server";
import { getSession } from "@/shared/auth/session";
import { prisma } from "@/shared/database/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const token = await prisma.googleToken.findUnique({
    where: { usuarioId: session.userId },
    select: {
      googleEmail:     true,
      ultimaSync:      true,
      totalImportado:  true,
      expiresAt:       true,
    },
  });

  if (!token) return NextResponse.json({ conectado: false });

  return NextResponse.json({
    conectado:      true,
    googleEmail:    token.googleEmail,
    ultimaSync:     token.ultimaSync,
    totalImportado: token.totalImportado,
    tokenValido:    token.expiresAt > new Date(),
  });
}

// Desconectar — revoga o token e remove do banco
export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const token = await prisma.googleToken.findUnique({ where: { usuarioId: session.userId } });
  if (!token) return NextResponse.json({ ok: true });

  // Tenta revogar no Google (best-effort)
  try {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${token.accessToken}`, { method: "POST" });
  } catch { /* ignora */ }

  await prisma.googleToken.delete({ where: { usuarioId: session.userId } });
  return NextResponse.json({ ok: true });
}
