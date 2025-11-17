import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Abstract modern - geometriskt abstrakt med overlays
const LogoVariant8: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle8";
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
        <linearGradient id="bgGrad8" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <g fill="url(#bgGrad8)">
        <path d="M32 8 L58 28 L58 58 L6 58 L6 28 Z" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 28 L32 14 L52 28" />
        <path d="M18 28 V52" opacity="0.6" />
        <path d="M46 28 V52" opacity="0.6" />
        <line x1="18" y1="52" x2="46" y2="52" strokeWidth="4" />
      </g>
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontSize="28"
        fontWeight="800"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
        opacity="0.95"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <path d="M32 14 L32 28 L22 28 Z" />
        <path d="M32 14 L32 28 L42 28 Z" />
      </g>
    </svg>
  );
};

export default LogoVariant8;
