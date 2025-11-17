import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Herrgård med torn - klassisk med centrerat B
const LogoVariant24: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle24";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 30 L32 10 L58 30 L58 56 L6 56 Z" />
        <rect x="8" y="18" width="7" height="12" rx="1" strokeWidth="2.5" />
        <rect x="49" y="18" width="7" height="12" rx="1" strokeWidth="2.5" />
        <line x1="6" y1="56" x2="58" y2="56" strokeWidth="4" />
      </g>
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <rect x="18" y="34" width="3" height="4" rx="0.5" />
        <rect x="43" y="34" width="3" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant24;
