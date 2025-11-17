import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med asymmetrisk takterrass - större format
const LogoVariant61: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle61";
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
        d="M10 30 L32 20 L32 60 L10 50 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M32 20 L54 30 L54 50 L32 60 Z"
        fill="currentColor"
        opacity="0.24"
      />

      <path
        d="M22 24 L32 18 L50 26 L32 34 Z"
        fill="currentColor"
        opacity="0.54"
      />
      <path d="M22 24 L22 28 L32 34 Z" fill="currentColor" opacity="0.4" />
      <path
        d="M32 34 L32 38 L50 30 L50 26 Z"
        fill="currentColor"
        opacity="0.54"
      />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 30 L32 20 L54 30 L54 50 L32 60 L10 50 Z" />
      </g>

      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>

      <g fill="currentColor" opacity="0.4">
        <rect x="16" y="38" width="4" height="4" rx="0.5" />
        <rect x="42" y="38" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant61;
