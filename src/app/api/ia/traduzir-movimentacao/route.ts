import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function POST(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { movimentacaoId } = await request.json();
  if (!movimentacaoId) return NextResponse.json({ error: "movimentacaoId obrigatório" }, { status: 422 });

  const mov = await prisma.movimentacao.findUnique({ where: { id: movimentacaoId } });
  if (!mov) return NextResponse.json({ error: "Movimentação não encontrada" }, { status: 404 });

  if (mov.resumoIA) {
    return NextResponse.json({ resumoIA: mov.resumoIA });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OpenAI não configurado" }, { status: 503 });

  const prompt = `Você é um assistente jurídico especializado em traduzir termos técnicos do Direito brasileiro para linguagem simples e clara.

Traduza e explique a seguinte movimentação processual em até 2 frases curtas, como se estivesse explicando para o cliente leigo. Use linguagem direta e evite jargões jurídicos.

Movimentação: ${mov.descricao}

Responda em JSON com: { "resumo": "explicação em linguagem simples" }`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 200,
      }),
    });

    if (!res.ok) throw new Error("OpenAI error");

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const updated = await prisma.movimentacao.update({
      where: { id: movimentacaoId },
      data: { resumoIA: parsed.resumo },
    });

    return NextResponse.json({ resumoIA: updated.resumoIA });
  } catch {
    return NextResponse.json({ error: "Erro ao processar com IA" }, { status: 500 });
  }
}
