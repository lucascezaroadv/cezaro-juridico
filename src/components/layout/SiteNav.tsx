"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoCezaro from "@/components/ui/LogoCezaro";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

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
          ? "bg-[#0E0505]/97 backdrop-blur-md shadow-lg border-b border-white/5 py-2"
          : "bg-[#0E0505] py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" aria-label="Cezaro Costa Advocacia — Página inicial">
          <LogoCezaro variant="white" layout="horizontal" scaleSize={52} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/55 hover:text-white text-sm tracking-wide font-[family-name:var(--font-lato)] transition-colors duration-200 relative group"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#8B1A1A] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <Link
            href="/login"
            className="px-4 py-2 border border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white text-sm tracking-wide font-[family-name:var(--font-lato)] font-semibold transition-all duration-200"
          >
            Área Restrita
          </Link>
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
          className="md:hidden text-white/70 hover:text-white transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0E0505] border-t border-white/8 shadow-lg px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white font-[family-name:var(--font-lato)] text-base tracking-wide transition-colors border-b border-white/8 pb-3"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-[#8B1A1A] font-[family-name:var(--font-lato)] text-base tracking-wide transition-colors border-b border-white/8 pb-3"
          >
            Área Restrita
          </Link>
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
