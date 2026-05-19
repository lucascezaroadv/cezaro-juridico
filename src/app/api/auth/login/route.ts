import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";
import { setSession } from "@/shared/auth/session";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });
    }

    const { email, senha } = parsed.data;

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !usuario.ativo) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    if (!usuario.senhaHash) {
      return NextResponse.json({ error: "Conta sem senha configurada. Contate o administrador." }, { status: 401 });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    await setSession({
      userId: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      cargo: usuario.cargo,
    });

    return NextResponse.json({ ok: true, nome: usuario.nome, cargo: usuario.cargo });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
