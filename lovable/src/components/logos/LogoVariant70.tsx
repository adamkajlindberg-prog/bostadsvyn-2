import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Negativ space B med hus - elegant och sofistikerat
const LogoVariant70: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle70";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>

      {/* Huvudsaklig B-form */}
      <path
        d="M18 10 H38 Q50 10 50 22 Q50 28 46 30 Q50 32 50 40 Q50 54 38 54 H18 Z"
        fill="currentColor"
      />

      {/* Övre hus som negativ space */}
      <g>
        <path d="M24 16 L32 12 L40 16 L40 28 L24 28 Z" fill="white" />
        <line
          x1="24"
          y1="28"
          x2="40"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="28"
          y="20"
          width="3"
          height="4"
          fill="currentColor"
          opacity="0.5"
        />
        <rect
          x="33"
          y="20"
          width="3"
          height="4"
          fill="currentColor"
          opacity="0.5"
        />
      </g>

      {/* Undre hus som negativ space */}
      <g>
        <path d="M24 34 L32 30 L40 34 L40 48 L24 48 Z" fill="white" />
        <line
          x1="24"
          y1="48"
          x2="40"
          y2="48"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="28"
          y="38"
          width="3"
          height="5"
          fill="currentColor"
          opacity="0.5"
        />
        <rect
          x="33"
          y="38"
          width="3"
          height="5"
          fill="currentColor"
          opacity="0.5"
        />
      </g>

      {/* B:ets mittenlinje för tydlighet */}
      <line
        x1="18"
        y1="30"
        x2="46"
        y2="30"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
    </svg>
  );
};

export default LogoVariant70;
