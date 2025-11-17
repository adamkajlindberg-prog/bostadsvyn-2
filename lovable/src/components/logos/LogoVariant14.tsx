import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Asymmetriskt modernt - modern arkitektur med centrerat B
const LogoVariant14: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle14";
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
        <path d="M12 32 L24 18 L32 18 L32 14 L44 14 L52 24 L52 54 L12 54 Z" />
        <line x1="32" y1="18" x2="32" y2="54" opacity="0.3" />
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
        <circle cx="20" cy="30" r="1.5" />
        <circle cx="44" cy="30" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant14;
