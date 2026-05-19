import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: {
      processos: {
        include: { advogado: { select: { nome: true } } },
        orderBy: { criadoEm: "desc" },
      },
      documentos: { orderBy: { criadoEm: "desc" }, take: 10 },
      mensagens: { orderBy: { criadoEm: "desc" }, take: 20 },
    },
  });

  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  return NextResponse.json(cliente);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  try {
    const body = await request.json();
    // Remove empty strings so they don't override existing values as blank
    const data = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== "")
    );
    const cliente = await prisma.cliente.update({ where: { id }, data });
    return NextResponse.json(cliente);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { id } = await params;
  await prisma.cliente.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
