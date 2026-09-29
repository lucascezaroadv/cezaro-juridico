import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  dataVencimento: z.string(),
  tipo: z.enum(["PROCESSUAL", "ADMINISTRATIVO", "CONTRATUAL", "INTERNO"]).optional(),
  processoId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const upcoming = searchParams.get("upcoming");
  const processoId = searchParams.get("processoId");

  const now = new Date();

  // upcoming: inclui tanto os próximos N dias quanto os vencidos pendentes
  const upcomingWhere = upcoming
    ? {
        OR: [
          // Vencimentos nos próximos N dias
          { dataVencimento: { gte: now, lte: new Date(now.getTime() + Number(upcoming) * 86400000) } },
          // Vencidos ainda pendentes (para aparecerem no alerta)
          ...(status === "PENDENTE" || !status
            ? [{ dataVencimento: { lt: now }, status: "PENDENTE" as never }]
            : []),
        ],
      }
    : {};

  const prazos = await prisma.prazo.findMany({
    where: {
      ...(status && !upcoming ? { status: status as never } : {}),
      ...(processoId ? { processoId } : {}),
      ...upcomingWhere,
    },
    include: {
      processo: { select: { id: true, numero: true, areaJuridica: true } },
    },
    orderBy: { dataVencimento: "asc" },
    take: 100,
  });

  return NextResponse.json({ prazos, total: prazos.length });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { dataVencimento, processoId, ...rest } = parsed.data;
  const prazo = await prisma.prazo.create({
    data: {
      ...rest,
      dataVencimento: new Date(dataVencimento),
      ...(processoId ? { processo: { connect: { id: processoId } } } : {}),
    },
  });

  return NextResponse.json(prazo, { status: 201 });
}
