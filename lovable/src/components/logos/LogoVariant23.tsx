import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Palatslik herrgård - stor och majestätisk med centrerat B
const LogoVariant23: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle23";
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
        <path d="M4 28 L32 6 L60 28 L60 56 L4 56 Z" />
        <rect x="24" y="12" width="16" height="10" rx="1" strokeWidth="2.5" />
        <line x1="4" y1="56" x2="60" y2="56" strokeWidth="4" />
        <line x1="10" y1="32" x2="10" y2="56" strokeWidth="2" />
        <line x1="54" y1="32" x2="54" y2="56" strokeWidth="2" />
      </g>
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <rect x="14" y="36" width="3" height="4" rx="0.5" />
        <rect x="47" y="36" width="3" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant23;
