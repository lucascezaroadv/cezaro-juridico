import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const upcoming = searchParams.get("upcoming");
  const processoId = searchParams.get("processoId");

  const now = new Date();

  const prazos = await prisma.prazo.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(processoId ? { processoId } : {}),
      ...(upcoming ? {
        dataVencimento: {
          gte: now,
          lte: new Date(now.getTime() + Number(upcoming) * 86400000),
        }
      } : {}),
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

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
