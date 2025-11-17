import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med dubbel terrass - variant av v59
const LogoVariant76: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle76";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>

      {/* 3D-sidor */}
      <path
        d="M10 32 L32 22 L32 60 L10 50 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M32 22 L54 32 L54 50 L32 60 Z"
        fill="currentColor"
        opacity="0.24"
      />

      {/* Övre takterrass */}
      <path
        d="M16 26 L32 20 L48 26 L32 32 Z"
        fill="currentColor"
        opacity="0.62"
      />
      <path
        d="M16 26 L16 29 L32 35 L32 32 Z"
        fill="currentColor"
        opacity="0.46"
      />
      <path
        d="M32 32 L32 35 L48 29 L48 26 Z"
        fill="currentColor"
        opacity="0.62"
      />

      {/* Undre takterrass */}
      <path
        d="M14 30 L32 24 L50 30 L32 36 Z"
        fill="currentColor"
        opacity="0.54"
      />
      <path
        d="M14 30 L14 33 L32 39 L32 36 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M32 36 L32 39 L50 33 L50 30 Z"
        fill="currentColor"
        opacity="0.54"
      />

      {/* Räckeslinjer för båda terrasserna */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      >
        <line x1="20" y1="27" x2="20" y2="29" />
        <line x1="26" y1="25" x2="26" y2="27" />
        <line x1="38" y1="25" x2="38" y2="27" />
        <line x1="44" y1="27" x2="44" y2="29" />

        <line x1="18" y1="31" x2="18" y2="33" />
        <line x1="24" y1="29" x2="24" y2="31" />
        <line x1="40" y1="29" x2="40" y2="31" />
        <line x1="46" y1="31" x2="46" y2="33" />
      </g>

      {/* Yttre kontur */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 32 L32 22 L54 32 L54 50 L32 60 L10 50 Z" />
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
    </svg>
  );
};

export default LogoVariant76;
