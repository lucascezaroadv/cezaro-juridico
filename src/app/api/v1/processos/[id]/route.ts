import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const processo = await prisma.processo.findUnique({
    where: { id },
    include: {
      cliente: true,
      advogado: { select: { id: true, nome: true, email: true } },
      movimentacoes: { orderBy: { data: "desc" }, take: 20 },
      intimacoes: { orderBy: { dataPublicacao: "desc" }, take: 10 },
      prazos: { orderBy: { dataVencimento: "asc" }, where: { status: "PENDENTE" } },
      tarefas: { orderBy: { prazo: "asc" }, where: { status: { not: "CONCLUIDA" } } },
      audiencias: { orderBy: { data: "asc" } },
      diligencias: { orderBy: { data: "desc" } },
      documentos: { orderBy: { criadoEm: "desc" } },
    },
  });

  if (!processo) return NextResponse.json({ error: "Processo não encontrado" }, { status: 404 });
  return NextResponse.json(processo);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const processo = await prisma.processo.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(processo);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.processo.update({ where: { id }, data: { status: "ARQUIVADO" } });
  return NextResponse.json({ ok: true });
}
