import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const resultado = searchParams.get("resultado");
  const processoId = searchParams.get("processoId");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 25;

  const where = {
    ...(resultado ? { resultado: resultado as never } : {}),
    ...(processoId ? { processoId } : {}),
  };

  const [diligencias, total, stats] = await Promise.all([
    prisma.diligencia.findMany({
      where,
      include: { processo: { select: { id: true, numero: true, areaJuridica: true } } },
      orderBy: { data: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.diligencia.count({ where }),
    prisma.diligencia.groupBy({
      by: ["resultado"],
      _count: { _all: true },
    }),
  ]);

  return NextResponse.json({ diligencias, total, stats, page, pages: Math.ceil(total / limit) });
}
