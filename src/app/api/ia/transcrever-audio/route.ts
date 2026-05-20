import { NextRequest, NextResponse } from "next/server";
import { apiAuth } from "@/shared/auth/api-auth";

/**
 * Transcrição de áudio via Groq Whisper (gratuito).
 * Aceita: mp3, mp4, m4a, wav, webm, ogg — até 25MB.
 * Retorna: { transcricao: string }
 */
export async function POST(request: NextRequest) {
  const { error } = await apiAuth();
  if (error) return error;

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return NextResponse.json({ error: "Serviço de transcrição não configurado" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Erro ao ler o arquivo enviado" }, { status: 400 });
  }

  const audio = formData.get("audio") as File | null;
  if (!audio) {
    return NextResponse.json({ error: "Nenhum arquivo de áudio enviado" }, { status: 400 });
  }

  if (audio.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo muito grande. Limite: 25MB" }, { status: 413 });
  }

  try {
    const groqForm = new FormData();
    groqForm.append("file", audio, audio.name);
    groqForm.append("model", "whisper-large-v3");
    groqForm.append("language", "pt");
    groqForm.append("response_format", "text");
    groqForm.append("temperature", "0");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}` },
      body: groqForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq Whisper error:", errText);
      return NextResponse.json({ error: "Falha na transcrição. Tente novamente." }, { status: 502 });
    }

    const transcricao = await res.text();
    return NextResponse.json({ transcricao: transcricao.trim() });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
