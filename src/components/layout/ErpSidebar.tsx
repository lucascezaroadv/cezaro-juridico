"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard, FolderOpen, Users, Bell, CalendarDays,
  Megaphone, Zap, DollarSign, FileArchive, Settings,
  ChevronRight, BrainCircuit, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Principal",
    items: [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }],
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
    items: [{ href: "/crm", icon: Megaphone, label: "CRM / Funil" }],
  },
  {
    label: "Estratégico",
    items: [
      { href: "/execucao", icon: Zap, label: "Execução" },
      { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
      { href: "/documentos", icon: FileArchive, label: "Documentos" },
    ],
  },
  {
    label: "Inteligência Artificial",
    items: [{ href: "/assistente", icon: BrainCircuit, label: "Assistente Jurídico" }],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#8B1A1A]/20 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          {/* Balança miniatura com filtro vermelho */}
          <div className="relative shrink-0" style={{ width: 34, height: 34 }}>
            <Image
              src="/logo-balanca.png"
              alt="Cezaro Costa"
              fill
              quality={100}
              style={{
                objectFit: "contain",
                filter: "brightness(0) saturate(100%) invert(14%) sepia(72%) saturate(800%) hue-rotate(330deg) brightness(0.85)",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "#1A0A0A",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              Cezaro Costa
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "#8B1A1A",
                textTransform: "uppercase",
                marginTop: 3,
                fontFamily: "var(--font-lato, system-ui)",
              }}
            >
              Sistema Jurídico
            </div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-[#8B1A1A] transition-colors p-1">
            <X size={17} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-2"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#8B1A1A",
                opacity: 0.6,
                fontFamily: "var(--font-lato, system-ui)",
              }}
            >
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
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 group",
                        active
                          ? "bg-[#8B1A1A] text-white"
                          : "text-[#3D2020]/60 hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/6"
                      )}
                      style={{ fontFamily: "var(--font-lato, system-ui)" }}
                    >
                      <Icon
                        size={15}
                        className={active ? "text-white/90" : "text-[#8B1A1A]/50 group-hover:text-[#8B1A1A]"}
                      />
                      <span className="flex-1 font-medium tracking-wide">{item.label}</span>
                      {active && <ChevronRight size={11} className="text-white/50" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Marca d'água decorativa */}
      <div
        className="mx-auto mb-2 pointer-events-none select-none"
        style={{
          width: 80, height: 80,
          opacity: 0.04,
          filter: "brightness(0) saturate(100%) invert(14%) sepia(72%) saturate(800%) hue-rotate(330deg) brightness(0.85)",
          position: "relative",
        }}
      >
        <Image src="/logo-balanca.png" alt="" fill quality={100} style={{ objectFit: "contain" }} />
      </div>

      {/* Settings */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <Link
          href="/configuracoes"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#3D2020]/45 hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/6 transition-all"
          style={{ fontFamily: "var(--font-lato, system-ui)" }}
        >
          <Settings size={15} />
          Configurações
        </Link>
      </div>
    </div>
  );
}

export default function ErpSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-gray-100 flex-col h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile trigger */}
      <button
        id="sidebar-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-50 p-2 bg-[#8B1A1A] text-white shadow-md"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[#1A0A0A]/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white flex flex-col h-full shadow-2xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
