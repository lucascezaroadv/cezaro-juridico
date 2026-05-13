import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const updateSchema = z.object({
  nome: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")),
  telefone: z.string().optional(),
  etapa: z.enum(["RECEBIDO", "QUALIFICACAO", "ATENDIMENTO_INICIAL", "REUNIAO", "PROPOSTA_ENVIADA", "NEGOCIACAO", "FECHADO", "PERDIDO"]).optional(),
  origem: z.enum(["INDICACAO", "SITE", "INSTAGRAM", "LINKEDIN", "GOOGLE", "WHATSAPP", "OUTRO"]).optional(),
  ticketPotencial: z.number().optional(),
  observacoes: z.string().optional(),
  responsavelId: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      responsavel: { select: { id: true, nome: true } },
      propostas: true,
      cliente: { select: { id: true, nome: true } },
    },
  });

  if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { responsavelId, ...rest } = parsed.data;
  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...rest,
      ...(responsavelId ? { responsavel: { connect: { id: responsavelId } } } : {}),
    },
  });
  return NextResponse.json(lead);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { etapa } = await request.json();

  const lead = await prisma.lead.update({
    where: { id },
    data: { etapa },
  });
  return NextResponse.json(lead);
}
