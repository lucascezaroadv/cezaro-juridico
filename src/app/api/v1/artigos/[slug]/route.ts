import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artigo = await prisma.artigo.findUnique({ where: { slug, publicado: true } });
  if (!artigo) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(artigo);
}
