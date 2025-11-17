import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Herrgård med balkong - elegant övre våning med centrerat B
const LogoVariant25: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle25";
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
        <path d="M6 28 L32 8 L58 28 L58 56 L6 56 Z" />
        <path d="M20 28 L20 32 L44 32 L44 28" strokeWidth="2" />
        <line x1="24" y1="32" x2="24" y2="28" strokeWidth="1.5" />
        <line x1="40" y1="32" x2="40" y2="28" strokeWidth="1.5" />
        <line x1="6" y1="56" x2="58" y2="56" strokeWidth="4" />
      </g>
      <text
        x="32"
        y="48"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <rect x="12" y="36" width="3" height="4" rx="0.5" />
        <rect x="49" y="36" width="3" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant25;
