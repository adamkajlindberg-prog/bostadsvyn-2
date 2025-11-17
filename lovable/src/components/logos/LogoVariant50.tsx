import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med dubbel takterrass - större format
const LogoVariant50: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle50";
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
        opacity="0.25"
      />

      <path
        d="M14 26 L32 18 L50 26 L32 34 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M14 26 L14 30 L32 38 L32 34 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M32 34 L32 38 L50 30 L50 26 Z"
        fill="currentColor"
        opacity="0.55"
      />

      <path
        d="M20 22 L32 16 L44 22 L32 28 Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M20 22 L20 26 L32 32 L32 28 Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M32 28 L32 32 L44 26 L44 22 Z"
        fill="currentColor"
        opacity="0.6"
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
        y="48"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
    </svg>
  );
};

export default LogoVariant50;
