import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Platt tak modern - minimalistisk box med centrerat B
const LogoVariant11: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle11";
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
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="14" y="20" width="36" height="34" rx="2" />
        <line x1="14" y1="20" x2="8" y2="16" />
        <line x1="50" y1="20" x2="56" y2="16" />
      </g>
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.5">
        <circle cx="20" cy="28" r="1.5" />
        <circle cx="44" cy="28" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant11;
