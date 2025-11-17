import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Stor herrgård med mittenbyggnad - imponerande med centrerat B
const LogoVariant19: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle19";
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
        <path d="M4 30 L32 8 L60 30 L60 56 L4 56 Z" />
        <path d="M24 20 L32 14 L40 20 L40 32 L24 32 Z" />
        <line x1="4" y1="56" x2="60" y2="56" strokeWidth="4" />
      </g>
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.4">
        <rect x="10" y="36" width="3" height="4" rx="0.5" />
        <rect x="16" y="36" width="3" height="4" rx="0.5" />
        <rect x="45" y="36" width="3" height="4" rx="0.5" />
        <rect x="51" y="36" width="3" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant19;
