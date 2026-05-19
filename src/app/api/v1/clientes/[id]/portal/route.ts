import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  ativar: z.boolean(),
  senha: z.string().min(6).optional(),
});

// PUT /api/v1/clientes/[id]/portal — ativa/desativa portal e define senha
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

    const { ativar, senha } = parsed.data;

    const data: Record<string, unknown> = { portalAtivo: ativar };
    if (senha) {
      data.portalSenha = await bcrypt.hash(senha, 10);
    }
    if (!ativar) {
      data.portalSenha = null;
    }

    const cliente = await prisma.cliente.update({ where: { id }, data });
    return NextResponse.json({ ok: true, portalAtivo: cliente.portalAtivo });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
