import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";
import { prisma } from "@/shared/database/prisma";

export async function POST(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const { intimacaoId } = await request.json();
  if (!intimacaoId) return NextResponse.json({ error: "intimacaoId obrigatório" }, { status: 422 });

  const intimacao = await prisma.intimacao.findUnique({ where: { id: intimacaoId } });
  if (!intimacao) return NextResponse.json({ error: "Intimação não encontrada" }, { status: 404 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OpenAI não configurado" }, { status: 503 });

  const prompt = `Você é um assistente jurídico especializado. Analise a seguinte intimação judicial e forneça:
1. Um resumo objetivo em até 3 frases
2. As principais providências que o advogado deve tomar

Intimação:
${intimacao.conteudo}

Responda em JSON com: { "resumo": "...", "sugestao": "..." }`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 500,
      }),
    });

    if (!res.ok) throw new Error("OpenAI error");

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const updated = await prisma.intimacao.update({
      where: { id: intimacaoId },
      data: { resumoIA: parsed.resumo, sugestaoIA: parsed.sugestao },
    });

    return NextResponse.json({ resumoIA: updated.resumoIA, sugestaoIA: updated.sugestaoIA });
  } catch {
    return NextResponse.json({ error: "Erro ao processar com IA" }, { status: 500 });
  }
}
