import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med bred takterrass - större format
const LogoVariant51: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle51";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>

      <path
        d="M10 32 L32 22 L32 58 L10 48 Z"
        fill="currentColor"
        opacity="0.28"
      />
      <path
        d="M32 22 L54 32 L54 48 L32 58 Z"
        fill="currentColor"
        opacity="0.22"
      />

      <path
        d="M8 28 L32 16 L56 28 L32 40 Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path d="M8 28 L8 32 L32 44 L32 40 Z" fill="currentColor" opacity="0.4" />
      <path
        d="M32 40 L32 44 L56 32 L56 28 Z"
        fill="currentColor"
        opacity="0.5"
      />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      >
        <line x1="12" y1="30" x2="12" y2="33" />
        <line x1="20" y1="27" x2="20" y2="30" />
        <line x1="44" y1="27" x2="44" y2="30" />
        <line x1="52" y1="30" x2="52" y2="33" />
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 32 L32 22 L54 32 L54 48 L32 58 L10 48 Z" />
      </g>

      <text
        x="32"
        y="48"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
    </svg>
  );
};

export default LogoVariant51;
