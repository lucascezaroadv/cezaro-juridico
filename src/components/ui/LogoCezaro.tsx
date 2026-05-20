"use client";

import Image from "next/image";

/**
 * Logo oficial Cezaro Costa usando o arquivo PNG real do designer.
 * Arquivo esperado: /public/logo-balanca.png (versão escura/preta)
 *
 * variant="white"  → aplica filtro CSS para tornar branco (uso em fundo vermelho/escuro)
 * variant="color"  → aplica filtro CSS para tornar vermelho #8B1A1A (uso em fundo branco)
 *
 * layout="horizontal" → balança à esquerda, texto à direita (navbar)
 * layout="mark-only"  → só a balança, sem texto (decorativo / marca d'água)
 */

type Props = {
  variant?: "color" | "white";
  layout?: "horizontal" | "mark-only";
  className?: string;
  scaleSize?: number;
  quality?: number;
};

// Filtros CSS para recolorir o PNG preto original
const filters = {
  white: "brightness(0) invert(1)",
  color:
    "brightness(0) saturate(100%) invert(14%) sepia(72%) saturate(800%) hue-rotate(330deg) brightness(0.85)",
};

export default function LogoCezaro({
  variant = "color",
  layout = "horizontal",
  className = "",
  scaleSize = 80,
  quality = 100,
}: Props) {
  const filter = filters[variant];
  const textColor = variant === "white" ? "#FFFFFF" : "#8B1A1A";
  const subColor = variant === "white" ? "rgba(255,255,255,0.7)" : "#6B1010";

  const Balanca = (
    <div style={{ width: scaleSize, height: scaleSize, flexShrink: 0 }}>
      <Image
        src="/logo-balanca.png"
        alt="Balança da Justiça — Cezaro Costa"
        width={scaleSize * 2}
        height={scaleSize * 2}
        quality={quality}
        style={{
          filter,
          objectFit: "contain",
          width: "100%",
          height: "100%",
          imageRendering: "auto",
        }}
        priority
      />
    </div>
  );

  if (layout === "mark-only") {
    return <div className={className}>{Balanca}</div>;
  }

  // horizontal — para navbar
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Balanca}
      <div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.15rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: textColor,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          Cezaro Costa
        </div>
        <div
          style={{
            width: "100%",
            height: "1px",
            background: textColor,
            opacity: 0.3,
            margin: "5px 0 4px",
          }}
        />
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "0.62rem",
            fontStyle: "italic",
            letterSpacing: "0.06em",
            color: subColor,
          }}
        >
          Advocacia & Consultoria Jurídica
        </div>
      </div>
    </div>
  );
}
