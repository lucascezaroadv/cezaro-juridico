import { NextResponse } from "next/server";
import { getPortalCliente } from "@/lib/portal-auth";
import { prisma } from "@/shared/database/prisma";

export async function GET() {
  const cliente = await getPortalCliente();
  if (!cliente) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const processos = await prisma.processo.findMany({
    where: { clienteId: cliente.id },
    select: {
      id: true, numero: true, areaJuridica: true, status: true, fase: true,
      tribunal: true, assunto: true, atualizadoEm: true,
      _count: { select: { movimentacoes: true, documentos: true } },
    },
    orderBy: { atualizadoEm: "desc" },
  });

  return NextResponse.json({ processos });
}
