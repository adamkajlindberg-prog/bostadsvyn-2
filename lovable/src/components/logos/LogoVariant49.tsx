import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus från höger vinkel - större format
const LogoVariant49: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle49";
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
        <linearGradient id="roof49" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <path
        d="M32 18 L12 28 L12 48 L32 58 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M52 28 L32 18 L32 58 L52 48 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M12 28 L32 38 L52 28 L52 48 L32 58 L12 48 Z"
        fill="currentColor"
        opacity="0.15"
      />

      <path d="M16 24 L32 16 L48 24 L32 32 Z" fill="url(#roof49)" />
      <path
        d="M32 32 L32 36 L16 28 L16 24 Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M48 24 L48 28 L32 36 L32 32 Z"
        fill="currentColor"
        opacity="0.4"
      />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 28 L32 18 L52 28 L52 48 L32 58 L12 48 Z" />
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

      <g fill="currentColor" opacity="0.5">
        <rect x="42" y="36" width="4" height="4" rx="0.5" />
        <rect x="42" y="42" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant49;
