import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Klassisk mansion - bred och imponerande med centrerat B
const LogoVariant26: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle26";
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
        <path d="M16 24 L16 56" strokeWidth="2" opacity="0.3" />
        <path d="M48 24 L48 56" strokeWidth="2" opacity="0.3" />
        <line x1="4" y1="56" x2="60" y2="56" strokeWidth="4" />
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
        <rect x="10" y="34" width="3" height="5" rx="0.5" />
        <rect x="22" y="34" width="3" height="5" rx="0.5" />
        <rect x="39" y="34" width="3" height="5" rx="0.5" />
        <rect x="51" y="34" width="3" height="5" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant26;
