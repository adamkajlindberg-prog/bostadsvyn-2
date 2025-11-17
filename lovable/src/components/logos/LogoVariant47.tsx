import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Isometriskt hus med takterrass och centrerat B
const LogoVariant47: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle47";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id="roofGrad47" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="wallGrad47" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Höger sida (mörkare) */}
      <path
        d="M32 16 L48 24 L48 48 L32 56 Z"
        fill="currentColor"
        opacity="0.25"
      />

      {/* Vänster sida (ljusare) */}
      <path d="M16 24 L32 16 L32 56 L16 48 Z" fill="url(#wallGrad47)" />

      {/* Framsida med B */}
      <path
        d="M16 24 L32 32 L48 24 L48 48 L32 56 L16 48 Z"
        fill="currentColor"
        opacity="0.2"
      />

      {/* Takterrass - topp */}
      <path d="M20 20 L32 14 L44 20 L32 26 Z" fill="url(#roofGrad47)" />

      {/* Takterrass - sidor */}
      <path
        d="M20 20 L20 24 L32 30 L32 26 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M32 26 L32 30 L44 24 L44 20 Z"
        fill="currentColor"
        opacity="0.5"
      />

      {/* Räcke på takterrassen */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      >
        <line x1="22" y1="22" x2="22" y2="24" />
        <line x1="26" y1="21" x2="26" y2="23" />
        <line x1="38" y1="21" x2="38" y2="23" />
        <line x1="42" y1="22" x2="42" y2="24" />
      </g>

      {/* Huslinjer - kantlinjer */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 24 L32 16 L48 24 L48 48 L32 56 L16 48 Z" />
        <line x1="32" y1="16" x2="32" y2="32" opacity="0.4" />
      </g>

      {/* B i huset - centrerat och anpassat till 3D-formen */}
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        opacity="0.95"
      >
        B
      </text>

      {/* Fönster på sidorna */}
      <g fill="currentColor" opacity="0.4">
        <rect
          x="20"
          y="34"
          width="4"
          height="4"
          rx="0.5"
          transform="skewY(-10)"
        />
        <rect
          x="20"
          y="42"
          width="4"
          height="4"
          rx="0.5"
          transform="skewY(-10)"
        />
      </g>
    </svg>
  );
};

export default LogoVariant47;
