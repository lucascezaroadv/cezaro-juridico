import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 20;

  const where = q ? {
    OR: [
      { nome: { contains: q, mode: "insensitive" as never } },
      { tipo: { contains: q, mode: "insensitive" as never } },
      { categoria: { contains: q, mode: "insensitive" as never } },
    ],
  } : {};

  const [documentos, total] = await Promise.all([
    prisma.documento.findMany({
      where,
      include: {
        processo: { select: { id: true, numero: true } },
        cliente: { select: { id: true, nome: true } },
      },
      orderBy: { criadoEm: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.documento.count({ where }),
  ]);

  return NextResponse.json({ documentos, total, page, pages: Math.ceil(total / limit) });
}
