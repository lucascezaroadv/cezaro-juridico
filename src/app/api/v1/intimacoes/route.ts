import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(1),
  conteudo: z.string().min(1),
  dataPublicacao: z.string(),
  prazo: z.string().optional(),
  urgencia: z.enum(["CRITICA", "ALTA", "NORMAL", "BAIXA"]).optional(),
  fonte: z.string().optional(),
  processoId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const urgencia = searchParams.get("urgencia");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 25;

  const where = {
    AND: [
      status ? { status: status as never } : {},
      urgencia ? { urgencia: urgencia as never } : {},
    ],
  };

  const [intimacoes, total] = await Promise.all([
    prisma.intimacao.findMany({
      where,
      include: {
        processo: { select: { id: true, numero: true, areaJuridica: true } },
        _count: { select: { tarefas: true } },
      },
      orderBy: [{ urgencia: "asc" }, { dataPublicacao: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.intimacao.count({ where }),
  ]);

  return NextResponse.json({ intimacoes, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { dataPublicacao, prazo, ...rest } = parsed.data;

  const intimacao = await prisma.intimacao.create({
    data: {
      ...rest,
      dataPublicacao: new Date(dataPublicacao),
      prazo: prazo ? new Date(prazo) : undefined,
    },
  });

  return NextResponse.json(intimacao, { status: 201 });
}
