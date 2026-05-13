import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const criarProcessoSchema = z.object({
  numero: z.string().min(1),
  tribunal: z.string().optional(),
  vara: z.string().optional(),
  comarca: z.string().optional(),
  uf: z.string().optional(),
  assunto: z.string().optional(),
  areaJuridica: z.enum([
    "TRABALHISTA","EMPRESARIAL","EXECUCAO_CREDITO","LGPD",
    "CONSULTORIA","CONTRATOS","COMPLIANCE","CIVIL","TRIBUTARIO","PREVIDENCIARIO","OUTRO"
  ]),
  fase: z.enum(["CONHECIMENTO","RECURSAL","EXECUCAO","CUMPRIMENTO_SENTENCA","ARQUIVADO"]).optional(),
  poloAtivo: z.string().optional(),
  poloPassivo: z.string().optional(),
  valorCausa: z.number().optional(),
  honorarios: z.number().optional(),
  percentualExito: z.number().optional(),
  dataDistribuicao: z.string().optional(),
  observacoes: z.string().optional(),
  clienteId: z.string(),
  advogadoId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status");
  const area = searchParams.get("area");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 20;

  const where = {
    AND: [
      q ? {
        OR: [
          { numero: { contains: q, mode: "insensitive" as const } },
          { assunto: { contains: q, mode: "insensitive" as const } },
          { cliente: { nome: { contains: q, mode: "insensitive" as const } } },
        ],
      } : {},
      status ? { status: status as never } : {},
      area ? { areaJuridica: area as never } : {},
    ],
  };

  const [processos, total] = await Promise.all([
    prisma.processo.findMany({
      where,
      include: {
        cliente: { select: { id: true, nome: true } },
        advogado: { select: { id: true, nome: true } },
        _count: { select: { tarefas: true, prazos: true } },
      },
      orderBy: { atualizadoEm: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.processo.count({ where }),
  ]);

  return NextResponse.json({ processos, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = criarProcessoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.issues }, { status: 422 });
  }

  const { dataDistribuicao, ...rest } = parsed.data;

  const processo = await prisma.processo.create({
    data: {
      ...rest,
      dataDistribuicao: dataDistribuicao ? new Date(dataDistribuicao) : undefined,
    },
    include: { cliente: { select: { id: true, nome: true } } },
  });

  return NextResponse.json(processo, { status: 201 });
}
