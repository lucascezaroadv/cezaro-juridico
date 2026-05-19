"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

// Balança SVG artística - traço fino
function ScaleSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Haste central */}
      <line x1="24" y1="6" x2="24" y2="42" />
      {/* Base */}
      <line x1="16" y1="42" x2="32" y2="42" />
      {/* Viga horizontal */}
      <line x1="8" y1="14" x2="40" y2="14" />
      {/* Correntes esquerda */}
      <line x1="10" y1="14" x2="8" y2="22" />
      <line x1="10" y1="22" x2="6" y2="22" />
      {/* Prato esquerdo */}
      <path d="M4 22 Q6 28 12 28 Q18 28 20 22" />
      {/* Correntes direita */}
      <line x1="38" y1="14" x2="40" y2="22" />
      <line x1="40" y1="22" x2="44" y2="22" />
      {/* Prato direito */}
      <path d="M28 22 Q30 28 36 28 Q42 28 44 22" />
      {/* Detalhe topo */}
      <circle cx="24" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/97 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-white py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <ScaleSVG className="w-9 h-9 text-[#8B1A1A] group-hover:text-[#6B1010] transition-colors" />
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-cormorant)] text-[#1A0A0A] text-base font-bold tracking-widest uppercase">
              Cezaro Costa
            </div>
            <div className="text-[#8B1A1A] text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-lato)] font-medium">
              Advocacia & Consultoria
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[#3D2020]/70 hover:text-[#8B1A1A] text-sm tracking-wide font-[family-name:var(--font-lato)] transition-colors duration-200 relative group"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#8B1A1A] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-5 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1010] text-white text-sm font-bold tracking-wide font-[family-name:var(--font-lato)] transition-colors duration-200"
          >
            Fale Conosco
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#1A0A0A] hover:text-[#8B1A1A] transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[#3D2020]/80 hover:text-[#8B1A1A] font-[family-name:var(--font-lato)] text-base tracking-wide transition-colors border-b border-gray-50 pb-3"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 px-5 py-3.5 bg-[#8B1A1A] text-white text-sm font-bold text-center font-[family-name:var(--font-lato)] tracking-wide"
          >
            Fale Conosco no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
