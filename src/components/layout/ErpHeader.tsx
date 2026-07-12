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
    <header
      className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0"
      style={{ fontFamily: "var(--font-lato, system-ui)" }}
    >
      {/* Espaço para hamburguer mobile */}
      <div className="w-10 md:hidden" />

      {/* Search */}
      <div className="relative flex-1 max-w-xs md:max-w-sm md:flex-none md:w-72 mx-2 md:mx-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          placeholder="Buscar processo, cliente..."
          className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F6F4] border border-gray-100 focus:outline-none focus:border-[#8B1A1A]/40 focus:bg-white transition-colors placeholder:text-gray-300"
          style={{ fontFamily: "inherit" }}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Notificações */}
        <button className="relative p-2 text-gray-400 hover:text-[#8B1A1A] transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#8B1A1A] rounded-full" />
        </button>

        <div className="h-5 w-px bg-gray-100 hidden md:block" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuAberto(v => !v)}
            className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#F8F6F4] transition-colors"
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 bg-[#8B1A1A] flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ fontFamily: "inherit" }}
            >
              {iniciais}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-[#1A0A0A] leading-tight">{session.nome.split(" ")[0]}</p>
              <p
                className="text-[10px] text-[#8B1A1A]/60 tracking-wide"
                style={{ letterSpacing: "0.05em" }}
              >
                {CARGO_LABELS[session.cargo] ?? session.cargo}
              </p>
            </div>
            <ChevronDown size={12} className="text-gray-300 hidden md:block" />
          </button>

          {menuAberto && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-lg z-20 overflow-hidden">

                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-50 bg-[#F8F6F4]">
                  <p
                    className="text-xs font-semibold text-[#1A0A0A]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "0.9rem" }}
                  >
                    {session.nome}
                  </p>
                  <p className="text-[10px] text-[#3D2020]/50 mt-0.5 tracking-wide">{session.email}</p>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => { setMenuAberto(false); router.push("/configuracoes"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#3D2020]/70 hover:bg-[#F8F6F4] hover:text-[#8B1A1A] transition-colors"
                  >
                    <User size={12} className="text-[#8B1A1A]/50" />
                    Configurações
                  </button>
                  <div className="h-px bg-gray-50 my-1" />
                  <button
                    onClick={sair}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#8B1A1A]/70 hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A] transition-colors"
                  >
                    <LogOut size={12} className="text-[#8B1A1A]/50" />
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
