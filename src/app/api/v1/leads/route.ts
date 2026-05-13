import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  origem: z.enum(["INDICACAO", "SITE", "INSTAGRAM", "LINKEDIN", "GOOGLE", "WHATSAPP", "OUTRO"]).optional(),
  areaJuridica: z.enum(["TRABALHISTA", "EMPRESARIAL", "EXECUCAO_CREDITO", "LGPD", "CONSULTORIA", "CONTRATOS", "COMPLIANCE", "CIVIL", "TRIBUTARIO", "PREVIDENCIARIO", "OUTRO"]).optional(),
  ticketPotencial: z.number().optional(),
  observacoes: z.string().optional(),
  responsavelId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const etapa = searchParams.get("etapa");

  const leads = await prisma.lead.findMany({
    where: etapa ? { etapa: etapa as never } : undefined,
    include: {
      responsavel: { select: { id: true, nome: true } },
      propostas: { select: { id: true, honorarios: true, status: true }, take: 1, orderBy: { criadoEm: "desc" } },
    },
    orderBy: { criadoEm: "desc" },
  });

  const grouped = leads.reduce<Record<string, typeof leads>>((acc, lead) => {
    acc[lead.etapa] = acc[lead.etapa] ?? [];
    acc[lead.etapa].push(lead);
    return acc;
  }, {});

  return NextResponse.json({ leads, grouped, total: leads.length });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 422 });

  const { responsavelId, ...rest } = parsed.data;
  const lead = await prisma.lead.create({
    data: {
      ...rest,
      ...(responsavelId ? { responsavel: { connect: { id: responsavelId } } } : {}),
    },
  });
  return NextResponse.json(lead, { status: 201 });
}
