import { NextRequest, NextResponse } from "next/server";
import { getPortalCliente } from "@/lib/portal-auth";
import { prisma } from "@/shared/database/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cliente = await getPortalCliente();
  if (!cliente) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const processo = await prisma.processo.findFirst({
    where: { id, clienteId: cliente.id },
    include: {
      movimentacoes: { orderBy: { data: "desc" }, take: 20 },
      documentos: { orderBy: { criadoEm: "desc" } },
      prazos: { where: { status: "PENDENTE" }, orderBy: { dataVencimento: "asc" }, take: 5 },
      intimacoes: {
        orderBy: { dataPublicacao: "desc" },
        take: 30,
        select: {
          id: true,
          titulo: true,
          conteudo: true,
          dataPublicacao: true,
          prazo: true,
          urgencia: true,
          status: true,
          fonte: true,
          sistemaOrigem: true,
        },
      },
    },
  });

  if (!processo) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(processo);
}
