import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med kompakt design - större format
const LogoVariant60: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle60";
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
        d="M14 28 L32 18 L32 56 L14 46 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M32 18 L50 28 L50 46 L32 56 Z"
        fill="currentColor"
        opacity="0.24"
      />

      <path
        d="M18 24 L32 16 L46 24 L32 32 Z"
        fill="currentColor"
        opacity="0.54"
      />
      <path
        d="M18 24 L18 28 L32 36 L32 32 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M32 32 L32 36 L46 28 L46 24 Z"
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
        <path d="M14 28 L32 18 L50 28 L50 46 L32 56 L14 46 Z" />
      </g>

      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>

      <g fill="currentColor" opacity="0.4">
        <circle cx="20" cy="36" r="1.5" />
        <circle cx="44" cy="36" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant60;
