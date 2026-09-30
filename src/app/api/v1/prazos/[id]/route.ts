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
  processoId: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { dataVencimento, processoId, ...rest } = parsed.data;

  const prazo = await prisma.prazo.update({
    where: { id },
    data: {
      ...rest,
      ...(dataVencimento ? { dataVencimento: new Date(dataVencimento) } : {}),
      ...(processoId !== undefined
        ? processoId
          ? { processo: { connect: { id: processoId } } }
          : { processo: { disconnect: true } }
        : {}),
    },
  });

  return NextResponse.json(prazo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.prazo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
