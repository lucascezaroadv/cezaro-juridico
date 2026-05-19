import { NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function GET() {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const agora = new Date();
  const em7Dias = new Date(agora.getTime() + 7 * 86400000);
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const [
    processosAtivos,
    intimacoesPendentes,
    intimacoesCriticas,
    prazosProximos,
    prazoVenceHoje,
    tarefasPendentes,
    clientes,
    processosEncerrados,
    intimacoesRecentes,
    prazosLista,
    tarefasLista,
  ] = await Promise.all([
    prisma.processo.count({ where: { status: "ATIVO" } }),
    prisma.intimacao.count({ where: { status: "PENDENTE" } }),
    prisma.intimacao.count({ where: { status: "PENDENTE", urgencia: "CRITICA" } }),
    prisma.prazo.count({
      where: { status: "PENDENTE", dataVencimento: { gte: agora, lte: em7Dias } },
    }),
    prisma.prazo.count({
      where: {
        status: "PENDENTE",
        dataVencimento: {
          gte: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()),
          lt: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1),
        },
      },
    }),
    prisma.tarefa.count({ where: { status: "PENDENTE" } }),
    prisma.cliente.count(),
    prisma.processo.count({ where: { status: "ENCERRADO", atualizadoEm: { gte: inicioMes } } }),
    prisma.intimacao.findMany({
      where: { status: "PENDENTE" },
      include: { processo: { select: { id: true, numero: true } } },
      orderBy: [{ urgencia: "asc" }, { dataPublicacao: "desc" }],
      take: 5,
    }),
    prisma.prazo.findMany({
      where: { status: "PENDENTE", dataVencimento: { gte: agora, lte: em7Dias } },
      include: { processo: { select: { id: true, numero: true } } },
      orderBy: { dataVencimento: "asc" },
      take: 5,
    }),
    prisma.tarefa.findMany({
      where: { status: "PENDENTE" },
      include: { processo: { select: { id: true, numero: true } } },
      orderBy: [{ prioridade: "asc" }, { prazo: "asc" }],
      take: 5,
    }),
  ]);

  // Financeiro do mês
  const [receitasMes, despesasMes] = await Promise.all([
    prisma.lancamentoFinanceiro.aggregate({
      where: { tipo: "RECEITA", vencimento: { gte: inicioMes } },
      _sum: { valor: true },
    }),
    prisma.lancamentoFinanceiro.aggregate({
      where: { tipo: "DESPESA", vencimento: { gte: inicioMes } },
      _sum: { valor: true },
    }),
  ]);

  return NextResponse.json({
    kpis: {
      processosAtivos,
      intimacoesPendentes,
      intimacoesCriticas,
      prazosProximos,
      prazoVenceHoje,
      tarefasPendentes,
      clientes,
      processosEncerrados,
    },
    financeiro: {
      receitas: receitasMes._sum.valor ?? 0,
      despesas: despesasMes._sum.valor ?? 0,
    },
    intimacoesRecentes,
    prazosLista,
    tarefasLista,
  });
}
