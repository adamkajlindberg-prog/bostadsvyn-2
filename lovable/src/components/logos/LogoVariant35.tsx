import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Abstrakt B-struktur
const LogoVariant35: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle35";
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
        <linearGradient id="bGrad35" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <g fill="url(#bGrad35)">
        <path d="M20 10 L20 54 L32 54 Q42 54 42 46 Q42 40 36 38 Q42 36 42 30 Q42 22 32 22 L20 22 Z" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10 L32 4 L42 10 M20 54 L20 10 M20 22 L32 22 Q42 22 42 30 Q42 36 36 38 M36 38 Q42 40 42 46 Q42 54 32 54 L20 54" />
      </g>
    </svg>
  );
};

export default LogoVariant35;
