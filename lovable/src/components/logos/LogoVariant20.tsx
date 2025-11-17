import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Herrgård med veranda - elegant entré med centrerat B
const LogoVariant20: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle20";
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
        <path d="M6 28 L32 10 L58 28 L58 54 L6 54 Z" />
        <path d="M16 38 L16 54" strokeWidth="2" />
        <path d="M48 38 L48 54" strokeWidth="2" />
        <path d="M16 38 L48 38" strokeWidth="2" />
        <line x1="6" y1="54" x2="58" y2="54" strokeWidth="4" />
      </g>
      <text
        x="32"
        y="30"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <circle cx="20" cy="42" r="1.5" />
        <circle cx="44" cy="42" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant20;
