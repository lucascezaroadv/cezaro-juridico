"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Loader2, Eye, EyeOff } from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpfCnpj, senha }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.error ?? "Erro ao fazer login");
        return;
      }
      router.push("/portal/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <Scale className="text-[#c9a84c]" size={28} />
          <span className="text-white font-bold text-xl tracking-tight">Cezaro Costa</span>
        </div>
        <p className="text-white/40 text-sm">Portal do Cliente</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Acesse sua conta</h1>
          <p className="text-sm text-gray-400 mb-6">Informe seu CPF/CNPJ e senha para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">CPF / CNPJ</label>
              <input
                value={cpfCnpj}
                onChange={e => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="Sua senha de acesso"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] pr-10 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#060d1a] hover:bg-[#0d1b2a] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Entrando..." : "Entrar no Portal"}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-6">
            Problemas com acesso? Entre em contato com o escritório.
          </p>
        </div>
      </div>
    </div>
  );
}
