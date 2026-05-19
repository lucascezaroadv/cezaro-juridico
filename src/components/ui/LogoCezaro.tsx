"use client";

/**
 * Logo oficial Cezaro Costa — balança artística fiel à identidade da marca.
 * Disponível em duas variantes: "color" (vermelho #8B1A1A) e "white" (branco).
 * Layouts: "horizontal" (balança + texto lado a lado) e "stacked" (texto abaixo).
 */

type Props = {
  variant?: "color" | "white";
  layout?: "horizontal" | "stacked" | "mark-only";
  className?: string;
  scaleSize?: number; // tamanho em px da balança
};

// Balança artística — fiel à identidade visual da marca
function BalancaSVG({ color, size = 80 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {/* ── Monograma ⟨LCC⟩ ── */}
      <text
        x="60"
        y="14"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="10"
        fontStyle="italic"
        fill={color}
        stroke="none"
        letterSpacing="1"
      >
        {"⟨LCC⟩"}
      </text>
      {/* traço decorativo acima */}
      <path d="M54 4 Q58 2 60 3 Q62 4 66 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>

      {/* ── Viga / braço principal — curva assimétrica (esquerda cai, direita sobe) ── */}
      <path
        d="M 26 52 C 38 48, 58 42, 95 30"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Coluna central (tronco orgânico) ── */}
      <path
        d="M 61 44 C 60 54, 59 62, 60 72 C 60 78, 60 84, 61 90"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* detalhe interno do tronco */}
      <path
        d="M 61 72 C 59 76, 60 82, 62 86"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Base triangular ── */}
      <path
        d="M 49 92 C 52 98, 60 104, 68 100 L 72 92"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Lado ESQUERDO — prato mais baixo (peso maior) ── */}
      {/* fio esquerdo */}
      <path
        d="M 28 53 L 20 68"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* prato esquerdo — curva larga, mais baixo */}
      <path
        d="M 4 82 C 6 90, 14 96, 24 94 C 34 92, 40 86, 38 78"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* vincos internos prato esquerdo (3 linhas) */}
      <path d="M 10 84 L 8 93" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M 17 82 L 16 92" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M 25 81 L 25 90" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>

      {/* ── Lado DIREITO — prato mais alto ── */}
      {/* fio direito */}
      <path
        d="M 92 32 L 90 48"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* prato direito — curva mais alta */}
      <path
        d="M 72 58 C 74 64, 82 68, 92 66 C 102 64, 108 56, 106 50"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* vincos internos prato direito (2 linhas) */}
      <path d="M 80 60 L 78 66" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M 90 58 L 90 65" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export default function LogoCezaro({
  variant = "color",
  layout = "horizontal",
  className = "",
  scaleSize,
}: Props) {
  const primary = variant === "white" ? "#FFFFFF" : "#8B1A1A";
  const textColor = variant === "white" ? "text-white" : "text-[#8B1A1A]";
  const subColor = variant === "white" ? "rgba(255,255,255,0.75)" : "#5A1010";

  if (layout === "mark-only") {
    return <BalancaSVG color={primary} size={scaleSize ?? 80} />;
  }

  if (layout === "stacked") {
    // Balança em cima, texto abaixo — como nas imagens de fundo vermelho
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <BalancaSVG color={primary} size={scaleSize ?? 96} />
        <div className="text-center">
          <div
            className={`font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-[0.12em] ${textColor}`}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Cezaro Costa
          </div>
          <div
            className="mt-1"
            style={{
              width: "100%",
              height: "1px",
              background: primary,
              opacity: 0.6,
            }}
          />
          <div
            className="mt-1 text-xs tracking-[0.08em]"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: subColor,
              fontStyle: "italic",
            }}
          >
            Advocacia e Consultoria Jurídica
          </div>
        </div>
      </div>
    );
  }

  // layout === "horizontal" — balança à esquerda, texto à direita
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <BalancaSVG color={primary} size={scaleSize ?? 56} />
      <div>
        <div
          className={`font-[family-name:var(--font-cormorant)] text-xl font-semibold tracking-[0.08em] leading-none ${textColor}`}
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Cezaro Costa
        </div>
        <div
          className="mt-1.5"
          style={{ width: "100%", height: "1px", background: primary, opacity: 0.5 }}
        />
        <div
          className="mt-1 text-[11px] tracking-[0.06em]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: subColor,
            fontStyle: "italic",
          }}
        >
          Advocacia e Consultoria Jurídica
        </div>
      </div>
    </div>
  );
}
