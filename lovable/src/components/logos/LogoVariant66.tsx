import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med takträdgård - större format
const LogoVariant66: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle66";
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
        d="M10 30 L32 20 L32 58 L10 48 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M32 20 L54 30 L54 48 L32 58 Z"
        fill="currentColor"
        opacity="0.24"
      />

      <path
        d="M14 26 L32 18 L50 26 L32 34 Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M14 26 L14 30 L32 38 L32 34 Z"
        fill="currentColor"
        opacity="0.38"
      />
      <path
        d="M32 34 L32 38 L50 30 L50 26 Z"
        fill="currentColor"
        opacity="0.5"
      />

      <g fill="currentColor" opacity="0.6">
        <circle cx="24" cy="24" r="1.2" />
        <circle cx="32" cy="22" r="1.2" />
        <circle cx="40" cy="24" r="1.2" />
        <rect x="26" y="26" width="2" height="3" rx="0.5" opacity="0.5" />
        <rect x="36" y="26" width="2" height="3" rx="0.5" opacity="0.5" />
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 30 L32 20 L54 30 L54 48 L32 58 L10 48 Z" />
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

export default LogoVariant66;
