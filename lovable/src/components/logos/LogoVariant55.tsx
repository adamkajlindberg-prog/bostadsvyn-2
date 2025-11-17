import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med trädgårdsterass - större format
const LogoVariant55: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle55";
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
        d="M12 28 L32 18 L32 56 L12 46 Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M32 18 L52 28 L52 46 L32 56 Z"
        fill="currentColor"
        opacity="0.24"
      />

      <path
        d="M16 24 L32 16 L48 24 L32 32 Z"
        fill="currentColor"
        opacity="0.54"
      />
      <path
        d="M16 24 L16 28 L32 36 L32 32 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M32 32 L32 36 L48 28 L48 24 Z"
        fill="currentColor"
        opacity="0.54"
      />

      <g fill="currentColor" opacity="0.5">
        <circle cx="22" cy="26" r="1.5" />
        <circle cx="28" cy="24" r="1.5" />
        <circle cx="36" cy="24" r="1.5" />
        <circle cx="42" cy="26" r="1.5" />
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 28 L32 18 L52 28 L52 46 L32 56 L12 46 Z" />
      </g>

      <text
        x="32"
        y="46"
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

export default LogoVariant55;
