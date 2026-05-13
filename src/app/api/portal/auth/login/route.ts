import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  cpfCnpj: z.string().min(1),
  senha: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { cpfCnpj, senha } = parsed.data;
  const doc = cpfCnpj.replace(/\D/g, "");

  const cliente = await prisma.cliente.findFirst({
    where: { cpfCnpj: { contains: doc }, portalAtivo: true },
  });

  if (!cliente || cliente.portalSenha !== senha) {
    return NextResponse.json({ error: "CPF/CNPJ ou senha inválidos" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("portal_cliente_id", cliente.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/portal",
  });

  return NextResponse.json({ ok: true, nome: cliente.nome });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("portal_cliente_id");
  return NextResponse.json({ ok: true });
}
