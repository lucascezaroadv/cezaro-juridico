import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

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
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  try {
    const body = await request.json();
    // Remove campos de relação que não podem ser atualizados diretamente
    const { cliente, advogado, movimentacoes, intimacoes, prazos, tarefas, audiencias, diligencias, documentos, ...data } = body;
    // Remove strings vazias
    const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ""));

    const processo = await prisma.processo.update({ where: { id }, data: clean });
    return NextResponse.json(processo);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.processo.update({ where: { id }, data: { status: "ARQUIVADO" } });
  return NextResponse.json({ ok: true });
}
