import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  const intimacao = await prisma.intimacao.update({
    where: { id },
    data: { status: "LIDA" },
  });

  return NextResponse.json(intimacao);
}
