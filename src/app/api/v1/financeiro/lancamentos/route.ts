import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const schema = z.object({
  tipo: z.enum(["RECEITA", "DESPESA"]),
  descricao: z.string().min(1),
  valor: z.number().positive(),
  vencimento: z.string(),
  categoria: z.string().optional(),
  observacoes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");
  const mes = searchParams.get("mes");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = 30;

  const mesWhere = mes ? {
    vencimento: {
      gte: new Date(`${mes}-01`),
      lt: new Date(new Date(`${mes}-01`).setMonth(new Date(`${mes}-01`).getMonth() + 1)),
    }
  } : {};

  const where = {
    AND: [
      tipo ? { tipo: tipo as never } : {},
      mesWhere,
    ],
  };

  const [lancamentos, total] = await Promise.all([
    prisma.lancamentoFinanceiro.findMany({
      where,
      orderBy: { vencimento: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lancamentoFinanceiro.count({ where }),
  ]);

  const [receitas, despesas] = await Promise.all([
    prisma.lancamentoFinanceiro.aggregate({
      where: { AND: [{ tipo: "RECEITA" as never }, mesWhere] },
      _sum: { valor: true },
    }),
    prisma.lancamentoFinanceiro.aggregate({
      where: { AND: [{ tipo: "DESPESA" as never }, mesWhere] },
      _sum: { valor: true },
    }),
  ]);

  const totalReceitas = receitas._sum.valor ?? 0;
  const totalDespesas = despesas._sum.valor ?? 0;

  return NextResponse.json({
    lancamentos,
    total,
    page,
    pages: Math.ceil(total / limit),
    resumo: { receitas: totalReceitas, despesas: totalDespesas, saldo: totalReceitas - totalDespesas },
  });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });

  const { vencimento, ...rest } = parsed.data;
  const lancamento = await prisma.lancamentoFinanceiro.create({
    data: { ...rest, vencimento: new Date(vencimento) },
  });

  return NextResponse.json(lancamento, { status: 201 });
}
