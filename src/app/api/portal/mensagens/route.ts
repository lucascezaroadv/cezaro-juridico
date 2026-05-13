import { NextRequest, NextResponse } from "next/server";
import { getPortalCliente } from "@/lib/portal-auth";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

export async function GET() {
  const cliente = await getPortalCliente();
  if (!cliente) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const mensagens = await prisma.mensagemPortal.findMany({
    where: { clienteId: cliente.id },
    orderBy: { criadoEm: "asc" },
  });

  // Mark unread messages from escritório as read
  await prisma.mensagemPortal.updateMany({
    where: { clienteId: cliente.id, remetente: "ESCRITORIO", lida: false },
    data: { lida: true },
  });

  return NextResponse.json({ mensagens });
}

const msgSchema = z.object({ conteudo: z.string().min(1).max(2000) });

export async function POST(request: NextRequest) {
  const cliente = await getPortalCliente();
  if (!cliente) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = msgSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const mensagem = await prisma.mensagemPortal.create({
    data: { conteudo: parsed.data.conteudo, clienteId: cliente.id, remetente: "CLIENTE" },
  });

  return NextResponse.json(mensagem, { status: 201 });
}
