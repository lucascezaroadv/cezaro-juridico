/**
 * Rota de configuração inicial — cria o primeiro usuário administrador.
 * Só funciona enquanto não existir nenhum usuário no banco.
 * Após criar o primeiro admin, esta rota retorna 403 para sempre.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";
import { setSession } from "@/shared/auth/session";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const total = await prisma.usuario.count();
    if (total > 0) {
      return NextResponse.json({ error: "Sistema já configurado" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
    }

    const { nome, email, senha } = parsed.data;
    const senhaHash = await bcrypt.hash(senha, 12);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, cargo: "ADMIN", ativo: true },
    });

    await setSession({ userId: usuario.id, email: usuario.email, nome: usuario.nome, cargo: usuario.cargo });
    return NextResponse.json({ ok: true, nome: usuario.nome });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  const total = await prisma.usuario.count();
  return NextResponse.json({ configurado: total > 0 });
}
