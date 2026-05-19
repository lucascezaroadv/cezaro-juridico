import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";
import { z } from "zod";

const criarClienteSchema = z.object({
  tipo: z.enum(["PESSOA_FISICA", "PESSOA_JURIDICA"]).optional(),
  nome: z.string().min(2),
  cpfCnpj: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  observacoes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId, error } = await apiAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = 20;

    const where = q
      ? {
          OR: [
            { nome: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { cpfCnpj: { contains: q } },
          ],
        }
      : {};

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        include: { _count: { select: { processos: true } } },
        orderBy: { nome: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cliente.count({ where }),
    ]);

    return NextResponse.json({ clientes, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[GET /clientes]", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, error } = await apiAuth();
    if (error) return error;

    const body = await request.json();
    const parsed = criarClienteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parsed.error.issues }, { status: 422 });
    }

    // Remover cpfCnpj vazio para evitar conflito de unicidade
    const data = { ...parsed.data };
    if (!data.cpfCnpj?.trim()) delete data.cpfCnpj;

    const cliente = await prisma.cliente.create({ data });
    return NextResponse.json(cliente, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /clientes]", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    // Unique constraint no CPF/CNPJ
    if (msg.includes("Unique constraint") || msg.includes("cpfCnpj")) {
      return NextResponse.json({ error: "CPF/CNPJ já cadastrado para outro cliente." }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
