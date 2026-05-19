import { NextResponse } from "next/server";
import { prisma } from "@/shared/database/prisma";

export async function GET() {
  const result: Record<string, unknown> = {
    DATABASE_URL: process.env.DATABASE_URL ? "definida ✓" : "NÃO DEFINIDA ✗",
    AUTH_SECRET: process.env.AUTH_SECRET ? "definida ✓" : "NÃO DEFINIDA ✗",
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "definida ✓" : "NÃO DEFINIDA ✗",
    NODE_ENV: process.env.NODE_ENV,
  };

  try {
    const count = await prisma.usuario.count();
    result.banco = "conectado ✓";
    result.usuarios = count;
  } catch (err) {
    result.banco = "ERRO ✗";
    result.bancoErro = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(result);
}
