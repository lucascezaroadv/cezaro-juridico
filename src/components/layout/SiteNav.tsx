"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/sobre", label: "O Escritório" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/blog", label: "Blog Jurídico" },
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
          ? "bg-[#060d1a]/95 backdrop-blur-md border-b border-[#c9a84c]/20 py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full border border-[#c9a84c] flex items-center justify-center group-hover:bg-[#c9a84c]/10 transition-colors">
            <Scale className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-playfair)] text-white text-sm font-bold tracking-wide">
              CEZARO COSTA
            </div>
            <div className="text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-lato)]">
              Advocacia & Consultoria
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/70 hover:text-[#c9a84c] text-sm tracking-wide font-[family-name:var(--font-lato)] transition-colors duration-200 relative group"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#060d1a] text-sm font-bold tracking-wide font-[family-name:var(--font-lato)] rounded transition-colors duration-200"
          >
            Fale Conosco
          </a>
        </nav>

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white hover:text-[#c9a84c] transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#060d1a]/98 backdrop-blur-xl border-t border-[#c9a84c]/20 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-[#c9a84c] font-[family-name:var(--font-lato)] text-base tracking-wide transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-5 py-3 bg-[#c9a84c] text-[#060d1a] text-sm font-bold text-center rounded font-[family-name:var(--font-lato)]"
          >
            Fale Conosco no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
