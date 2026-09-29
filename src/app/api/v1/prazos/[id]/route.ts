import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["PENDENTE", "CONCLUIDO", "VENCIDO", "CANCELADO"]).optional(),
  titulo: z.string().min(1).optional(),
  descricao: z.string().optional(),
  dataVencimento: z.string().optional(),
  tipo: z.enum(["PROCESSUAL", "ADMINISTRATIVO", "CONTRATUAL", "INTERNO"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await apiAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { dataVencimento, ...rest } = parsed.data;

  const prazo = await prisma.prazo.update({
    where: { id: params.id },
    data: {
      ...rest,
      ...(dataVencimento ? { dataVencimento: new Date(dataVencimento) } : {}),
    },
  });

  return NextResponse.json(prazo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await apiAuth();
  if (error) return error;

  await prisma.prazo.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
