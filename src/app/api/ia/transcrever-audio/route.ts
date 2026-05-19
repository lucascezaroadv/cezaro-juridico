import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { userId, error } = await apiAuth();
  if (error) return error;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OpenAI não configurado" }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get("audio") as File | null;
  if (!file) return NextResponse.json({ error: "Arquivo de áudio obrigatório" }, { status: 422 });

  const maxBytes = 25 * 1024 * 1024; // Whisper API limit: 25 MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Arquivo muito grande. Limite: 25 MB." }, { status: 413 });
  }

  const whisperForm = new FormData();
  whisperForm.append("file", file);
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", "pt");
  whisperForm.append(
    "prompt",
    "Transcrição de reunião entre advogado e cliente sobre caso jurídico brasileiro. Pode conter termos técnicos jurídicos, nomes de leis, artigos e procedimentos legais."
  );

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: whisperForm,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Whisper error:", err);
    return NextResponse.json({ error: "Erro ao transcrever áudio" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({ transcricao: data.text });
}
