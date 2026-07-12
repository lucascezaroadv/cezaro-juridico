import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

// PATCH /api/v1/intimacoes/[id]/vincular
// Body: { processoId: string } — vincula ou desvincula (null) de um processo
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  const body: { processoId: string | null } = await request.json();

  const intimacao = await prisma.intimacao.update({
    where: { id },
    data:  { processoId: body.processoId },
    include: { processo: { select: { id: true, numero: true, areaJuridica: true } } },
  });

  return NextResponse.json(intimacao);
}
