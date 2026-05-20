"use client";

import Image from "next/image";

/**
 * Logo oficial Cezaro Costa usando o arquivo PNG real do designer.
 * Arquivo esperado: /public/logo-balanca.png (versão escura/preta)
 *
 * variant="white"  → aplica filtro CSS para tornar branco (uso em fundo vermelho/escuro)
 * variant="color"  → aplica filtro CSS para tornar vermelho #8B1A1A (uso em fundo branco)
 *
 * layout="stacked"    → balança em cima, texto abaixo (hero)
 * layout="horizontal" → balança à esquerda, texto à direita (navbar)
 * layout="mark-only"  → só a balança, sem texto (decorativo)
 */

type Props = {
  variant?: "color" | "white";
  layout?: "horizontal" | "stacked" | "mark-only";
  className?: string;
  scaleSize?: number;
};

// Filtros CSS para recolorir o PNG preto original
const filters = {
  // Torna branco puro
  white: "brightness(0) invert(1)",
  // Torna vermelho #8B1A1A
  color:
    "brightness(0) saturate(100%) invert(14%) sepia(72%) saturate(800%) hue-rotate(330deg) brightness(0.85)",
};

export default function LogoCezaro({
  variant = "color",
  layout = "horizontal",
  className = "",
  scaleSize = 80,
}: Props) {
  const filter = filters[variant];
  const textColor = variant === "white" ? "#FFFFFF" : "#8B1A1A";
  const subColor = variant === "white" ? "rgba(255,255,255,0.8)" : "#6B1010";

  const Balanca = (
    <div style={{ width: scaleSize, height: scaleSize, flexShrink: 0 }}>
      <Image
        src="/logo-balanca.png"
        alt="Balança da Justiça — Cezaro Costa"
        width={scaleSize}
        height={scaleSize}
        style={{ filter, objectFit: "contain", width: "100%", height: "100%" }}
        priority
      />
    </div>
  );

  if (layout === "mark-only") {
    return <div className={className}>{Balanca}</div>;
  }

  if (layout === "stacked") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {Balanca}
        <div className="text-center mt-2">
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.6rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: textColor,
              lineHeight: 1.1,
            }}
          >
            Cezaro Costa
          </div>
          <div
            style={{
              width: "100%",
              height: "1px",
              background: textColor,
              opacity: 0.5,
              margin: "6px 0 4px",
            }}
          />
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "0.85rem",
              fontStyle: "italic",
              letterSpacing: "0.04em",
              color: subColor,
            }}
          >
            Advocacia e Consultoria Jurídica
          </div>
        </div>
      </div>
    );
  }

  // horizontal
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Balanca}
      <div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.15rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: textColor,
            lineHeight: 1,
          }}
        >
          Cezaro Costa
        </div>
        <div
          style={{
            width: "100%",
            height: "1px",
            background: textColor,
            opacity: 0.4,
            margin: "5px 0 3px",
          }}
        />
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "0.68rem",
            fontStyle: "italic",
            letterSpacing: "0.04em",
            color: subColor,
          }}
        >
          Advocacia e Consultoria Jurídica
        </div>
      </div>
    </div>
  );
}
