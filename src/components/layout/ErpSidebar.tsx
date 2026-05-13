"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Bell,
  CalendarDays,
  Megaphone,
  Zap,
  DollarSign,
  FileArchive,
  Settings,
  Scale,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Jurídico",
    items: [
      { href: "/processos", icon: FolderOpen, label: "Processos" },
      { href: "/clientes", icon: Users, label: "Clientes" },
      { href: "/intimacoes", icon: Bell, label: "Intimações" },
      { href: "/agenda", icon: CalendarDays, label: "Agenda & Prazos" },
    ],
  },
  {
    label: "Comercial",
    items: [
      { href: "/crm", icon: Megaphone, label: "CRM / Funil" },
    ],
  },
  {
    label: "Estratégico",
    items: [
      { href: "/execucao", icon: Zap, label: "Execução" },
      { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
      { href: "/documentos", icon: FileArchive, label: "Documentos" },
    ],
  },
];

export default function ErpSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#060d1a] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
            <Scale size={15} className="text-[#c9a84c]" />
          </div>
          <div>
            <div className="text-white text-xs font-bold tracking-wide">CEZARO COSTA</div>
            <div className="text-white/30 text-[9px] tracking-widest uppercase">Sistema Jurídico</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-white/25 text-[9px] tracking-[0.2em] uppercase font-bold px-2 mb-2">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                        active
                          ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                          : "text-white/50 hover:text-white/90 hover:bg-white/5"
                      )}
                    >
                      <Icon size={16} className={active ? "text-[#c9a84c]" : ""} />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {active && <ChevronRight size={12} className="text-[#c9a84c]/60" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-3 py-3 border-t border-white/5">
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          <Settings size={16} />
          Configurações
        </Link>
      </div>
    </aside>
  );
}
