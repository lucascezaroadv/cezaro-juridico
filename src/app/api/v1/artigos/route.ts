import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 9;

  const where = {
    publicado: true,
    ...(categoria ? { categoria } : {}),
  };

  const [artigos, total] = await Promise.all([
    prisma.artigo.findMany({
      where,
      select: { id: true, titulo: true, slug: true, resumo: true, categoria: true, tags: true, imagemCapa: true, publicadoEm: true, criadoEm: true },
      orderBy: { publicadoEm: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.artigo.count({ where }),
  ]);

  return NextResponse.json({ artigos, total, page, pages: Math.ceil(total / limit) });
}
