"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Scale, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Erro ao fazer login");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-4">
            <Scale size={24} className="text-[#c9a84c]" />
          </div>
          <h1 className="text-xl font-bold text-white">Cezaro Costa</h1>
          <p className="text-sm text-white/40 mt-1">Sistema Jurídico — Acesso Restrito</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white mb-6">Entrar no sistema</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={verSenha ? "text" : "password"}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                >
                  {verSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle size={13} className="shrink-0" />
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !senha}
              className="w-full py-2.5 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] font-semibold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Acesso autorizado apenas para membros da equipe
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
