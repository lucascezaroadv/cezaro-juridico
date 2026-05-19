"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react";
import type { SessionPayload } from "@/shared/auth/session";

const CARGO_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  SOCIO: "Sócio",
  ADVOGADO: "Advogado",
  ESTAGIARIO: "Estagiário",
  ADMINISTRATIVO: "Administrativo",
};

export default function ErpHeader({ session }: { session: SessionPayload }) {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  const sair = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const iniciais = session.nome
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Espaço para hamburguer mobile */}
      <div className="w-10 md:hidden" />

      {/* Search */}
      <div className="relative flex-1 max-w-xs md:max-w-sm md:flex-none md:w-72 mx-2 md:mx-0">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar processo, cliente..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a84c] focus:bg-white transition-colors placeholder:text-gray-400"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c9a84c] rounded-full" />
        </button>

        <div className="h-6 w-px bg-gray-200 hidden md:block" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuAberto(v => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#060d1a] flex items-center justify-center text-[#c9a84c] text-xs font-bold">
              {iniciais}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-tight">{session.nome.split(" ")[0]}</p>
              <p className="text-[10px] text-gray-400">{CARGO_LABELS[session.cargo] ?? session.cargo}</p>
            </div>
            <ChevronDown size={13} className="text-gray-400 hidden md:block" />
          </button>

          {menuAberto && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800">{session.nome}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{session.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setMenuAberto(false); router.push("/configuracoes"); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User size={13} />
                    Configurações
                  </button>
                  <button
                    onClick={sair}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={13} />
                    Sair do sistema
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
