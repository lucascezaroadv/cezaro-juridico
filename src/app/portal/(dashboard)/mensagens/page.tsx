"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { formatarDataHora } from "@/shared/utils/formatters";

type Mensagem = {
  id: string;
  conteudo: string;
  remetente: string;
  lida: boolean;
  criadoEm: string;
};

export default function PortalMensagensPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const buscar = async () => {
    const res = await fetch("/api/portal/mensagens");
    const data = await res.json();
    setMensagens(data.mensagens ?? []);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => { buscar(); }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    try {
      await fetch("/api/portal/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: texto.trim() }),
      });
      setTexto("");
      await buscar();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={20} className="text-[#c9a84c]" />
          Mensagens
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Comunicação direta com o escritório</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}>
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-300">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : mensagens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare size={32} className="opacity-30 mb-3" />
              <p className="text-sm">Nenhuma mensagem ainda</p>
              <p className="text-xs mt-1">Envie uma mensagem para iniciar a conversa</p>
            </div>
          ) : (
            mensagens.map(m => {
              const isCliente = m.remetente === "CLIENTE";
              return (
                <div key={m.id} className={`flex ${isCliente ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isCliente
                      ? "bg-[#060d1a] text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}>
                    {!isCliente && (
                      <p className="text-[9px] font-bold text-[#c9a84c] mb-1 uppercase tracking-wide">Escritório</p>
                    )}
                    <p className="text-sm leading-relaxed">{m.conteudo}</p>
                    <p className={`text-[9px] mt-1.5 ${isCliente ? "text-white/40" : "text-gray-400"}`}>
                      {formatarDataHora(m.criadoEm)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={enviar} className="flex gap-3 items-end">
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(e); }
              }}
              placeholder="Digite sua mensagem... (Enter para enviar)"
              rows={2}
              className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={enviando || !texto.trim()}
              className="p-3 bg-[#060d1a] text-white rounded-xl hover:bg-[#0d1b2a] transition-colors disabled:opacity-40 shrink-0"
            >
              {enviando ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
