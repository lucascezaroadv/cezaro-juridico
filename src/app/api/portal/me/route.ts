import { NextResponse } from "next/server";
import { getPortalCliente } from "@/lib/portal-auth";
import { prisma } from "@/shared/database/prisma";

export async function GET() {
  const cliente = await getPortalCliente();
  if (!cliente) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const data = await prisma.cliente.findUnique({
    where: { id: cliente.id },
    select: {
      id: true, nome: true, email: true, tipo: true,
      _count: {
        select: {
          processos: true,
          mensagens: { where: { lida: false, remetente: "ESCRITORIO" } },
          documentos: true,
        },
      },
    },
  });

  return NextResponse.json(data);
}
