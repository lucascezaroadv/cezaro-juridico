import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  cpfCnpj: z.string().min(1),
  senha: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

    const { cpfCnpj, senha } = parsed.data;
    const doc = cpfCnpj.replace(/\D/g, "");

    const cliente = await prisma.cliente.findFirst({
      where: { cpfCnpj: { contains: doc }, portalAtivo: true },
    });

    if (!cliente || !cliente.portalSenha) {
      return NextResponse.json({ error: "CPF/CNPJ ou senha inválidos" }, { status: 401 });
    }

    // Suporta senhas em texto puro (legado) e bcrypt hash
    const senhaValida = cliente.portalSenha.startsWith("$2")
      ? await bcrypt.compare(senha, cliente.portalSenha)
      : cliente.portalSenha === senha;

    if (!senhaValida) {
      return NextResponse.json({ error: "CPF/CNPJ ou senha inválidos" }, { status: 401 });
    }

    // Se senha ainda é texto puro, migra para hash
    if (!cliente.portalSenha.startsWith("$2")) {
      const hash = await bcrypt.hash(senha, 10);
      await prisma.cliente.update({ where: { id: cliente.id }, data: { portalSenha: hash } });
    }

    const cookieStore = await cookies();
    cookieStore.set("portal_cliente_id", cliente.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/portal",
    });

    return NextResponse.json({ ok: true, nome: cliente.nome });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("portal_cliente_id");
  return NextResponse.json({ ok: true });
}
