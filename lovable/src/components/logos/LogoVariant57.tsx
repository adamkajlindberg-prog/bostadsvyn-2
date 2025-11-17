import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med bred bas - större format
const LogoVariant57: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle57";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>

      <path d="M8 34 L32 24 L32 58 L8 52 Z" fill="currentColor" opacity="0.3" />
      <path
        d="M32 24 L56 34 L56 52 L32 58 Z"
        fill="currentColor"
        opacity="0.24"
      />

      <path
        d="M14 30 L32 22 L50 30 L32 38 Z"
        fill="currentColor"
        opacity="0.54"
      />
      <path
        d="M14 30 L14 34 L32 42 L32 38 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M32 38 L32 42 L50 34 L50 30 Z"
        fill="currentColor"
        opacity="0.54"
      />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 34 L32 24 L56 34 L56 52 L32 58 L8 52 Z" />
      </g>

      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>

      <g fill="currentColor" opacity="0.45">
        <rect x="14" y="42" width="4" height="4" rx="0.5" />
        <rect x="46" y="42" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant57;
