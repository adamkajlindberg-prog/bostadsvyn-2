import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med modern loft - större format
const LogoVariant64: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle64";
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
        d="M12 30 L32 20 L32 58 L12 48 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M32 20 L52 30 L52 48 L32 58 Z"
        fill="currentColor"
        opacity="0.24"
      />

      <path
        d="M16 26 L32 18 L48 26 L32 34 Z"
        fill="currentColor"
        opacity="0.52"
      />
      <path
        d="M16 26 L16 30 L32 38 L32 34 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M32 34 L32 38 L48 30 L48 26 Z"
        fill="currentColor"
        opacity="0.52"
      />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      >
        <rect x="24" y="27" width="16" height="4" rx="0.5" />
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 30 L32 20 L52 30 L52 48 L32 58 L12 48 Z" />
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

      <g fill="currentColor" opacity="0.4">
        <rect x="18" y="38" width="3" height="3" rx="0.5" />
        <rect x="41" y="38" width="3" height="3" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant64;
