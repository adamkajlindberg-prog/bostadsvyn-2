import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Herrgård med kolonner - elegant med centrerat B
const LogoVariant18: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle18";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 26 L32 10 L58 26 L58 56 L6 56 Z" />
        <line x1="14" y1="30" x2="14" y2="56" strokeWidth="2.5" />
        <line x1="50" y1="30" x2="50" y2="56" strokeWidth="2.5" />
        <line x1="6" y1="56" x2="58" y2="56" strokeWidth="4" />
      </g>
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <rect x="20" y="32" width="3.5" height="5" rx="0.5" />
        <rect x="40.5" y="32" width="3.5" height="5" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant18;
