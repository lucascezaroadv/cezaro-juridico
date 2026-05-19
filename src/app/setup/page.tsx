"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Loader2, Check, AlertCircle } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (senha !== confirmar) { setErro("As senhas não coincidem"); return; }
    if (senha.length < 8) { setErro("Senha deve ter ao menos 8 caracteres"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();
      if (!res.ok) { setErro(data.error ?? "Erro ao criar conta"); return; }
      setConcluido(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch { setErro("Erro de conexão. Tente novamente."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-4">
            <Scale size={24} className="text-[#c9a84c]" />
          </div>
          <h1 className="text-xl font-bold text-white">Configuração Inicial</h1>
          <p className="text-sm text-white/40 mt-1">Crie a conta do administrador</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {concluido ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Check size={22} className="text-green-400" />
              </div>
              <p className="text-white font-semibold">Conta criada!</p>
              <p className="text-white/40 text-sm mt-1">Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Nome completo", value: nome, set: setNome, type: "text", placeholder: "Dr. Lucas Cezaro" },
                { label: "E-mail", value: email, set: setEmail, type: "email", placeholder: "seu@email.com" },
                { label: "Senha (mín. 8 caracteres)", value: senha, set: setSenha, type: "password", placeholder: "••••••••" },
                { label: "Confirmar senha", value: confirmar, set: setConfirmar, type: "password", placeholder: "••••••••" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    required
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                </div>
              ))}
              {erro && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                  <AlertCircle size={13} />
                  {erro}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-[#c9a84c] text-[#060d1a] font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Criando..." : "Criar conta e entrar"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-white/20 mt-4">
          Esta página só funciona uma vez
        </p>
      </div>
    </div>
  );
}
