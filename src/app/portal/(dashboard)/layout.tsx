"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Scale, LayoutDashboard, FolderOpen, MessageSquare, FileText, LogOut, Menu, X } from "lucide-react";

const NAV = [
  { href: "/portal/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/portal/processos", label: "Processos", icon: FolderOpen },
  { href: "/portal/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/portal/documentos", label: "Documentos", icon: FileText },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [nome, setNome] = useState("");
  const [msgCount, setMsgCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/portal/me")
      .then(r => {
        if (r.status === 401) router.push("/portal/login");
        return r.json();
      })
      .then(data => {
        if (data?.nome) {
          setNome(data.nome);
          setMsgCount(data._count?.mensagens ?? 0);
        }
      })
      .catch(() => router.push("/portal/login"));
  }, [router]);

  const logout = async () => {
    await fetch("/api/portal/auth/login", { method: "DELETE" });
    router.push("/portal/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-[#060d1a] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 text-white/60 hover:text-white">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-[#c9a84c]" />
              <span className="text-white text-sm font-bold">Cezaro Costa</span>
              <span className="hidden md:inline text-white/30 text-xs ml-1">· Portal do Cliente</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={13} />
                {item.label}
                {item.label === "Mensagens" && msgCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#c9a84c] text-[#060d1a] text-[8px] font-bold rounded-full flex items-center justify-center">
                    {msgCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {nome && <span className="hidden md:block text-xs text-white/50 max-w-28 truncate">{nome}</span>}
            <button onClick={logout} className="p-1.5 text-white/50 hover:text-white transition-colors" title="Sair">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === item.href ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                <item.icon size={15} />
                {item.label}
                {item.label === "Mensagens" && msgCount > 0 && (
                  <span className="ml-auto text-[10px] bg-[#c9a84c] text-[#060d1a] font-bold px-1.5 py-0.5 rounded-full">{msgCount}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
