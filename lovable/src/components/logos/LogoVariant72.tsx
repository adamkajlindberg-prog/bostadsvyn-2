import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Minimalistiskt lyxigt B med hus - exklusiv och clean
const LogoVariant72: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle72";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>

      {/* Yttre B-kontur - outline style för lyxig känsla */}
      <path
        d="M16 10 L16 54 L38 54 Q52 54 52 42 Q52 35 46 33 Q52 31 52 22 Q52 10 38 10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Mittenlinje i B */}
      <line
        x1="16"
        y1="32"
        x2="46"
        y2="32"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Övre huset - filled solid för kontrast */}
      <g fill="currentColor">
        <path d="M24 16 L32 12 L40 16 L40 28 L24 28 Z" />
        {/* Fönster som cutouts */}
        <rect x="28" y="20" width="2.5" height="3.5" fill="white" />
        <rect x="33.5" y="20" width="2.5" height="3.5" fill="white" />
      </g>

      {/* Undre huset - filled solid för kontrast */}
      <g fill="currentColor">
        <path d="M24 36 L32 32 L40 36 L40 48 L24 48 Z" />
        {/* Fönster och dörr som cutouts */}
        <rect x="28" y="39" width="2.5" height="3.5" fill="white" />
        <rect x="33.5" y="39" width="2.5" height="3.5" fill="white" />
        <rect x="30" y="43" width="4" height="5" rx="0.5" fill="white" />
      </g>
    </svg>
  );
};

export default LogoVariant72;
