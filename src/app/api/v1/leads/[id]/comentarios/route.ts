import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id: leadId } = await params;
  const { conteudo } = await request.json();

  if (!conteudo?.trim()) return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 422 });

  // userId agora é o próprio ID do usuário (não mais clerkId)
  const comentario = await prisma.comentario.create({
    data: {
      conteudo,
      lead: { connect: { id: leadId } },
      autor: { connect: { id: userId! } },
    },
    include: { autor: { select: { nome: true } } },
  });

  return NextResponse.json(comentario, { status: 201 });
}
