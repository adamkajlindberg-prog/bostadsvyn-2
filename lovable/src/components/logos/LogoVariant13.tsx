import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Kubisk modern - ren box med centrerat B
const LogoVariant13: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle13";
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
        <rect x="16" y="16" width="32" height="38" rx="1" />
        <line x1="16" y1="24" x2="48" y2="24" strokeWidth="2" opacity="0.5" />
      </g>
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor">
        <rect x="22" y="18" width="2" height="2" rx="0.5" opacity="0.6" />
        <rect x="26" y="18" width="2" height="2" rx="0.5" opacity="0.6" />
        <rect x="36" y="18" width="2" height="2" rx="0.5" opacity="0.6" />
        <rect x="40" y="18" width="2" height="2" rx="0.5" opacity="0.6" />
      </g>
    </svg>
  );
};

export default LogoVariant13;
