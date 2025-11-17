import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B med takvåningar - varje kurva är ett våningsplan
const LogoVariant28: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle28";
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
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 52 L20 12 L32 12 Q42 12 42 20 Q42 26 36 28 Q42 30 42 36 Q42 44 32 44 L20 44" />
        <path d="M20 12 L26 8 L38 8 L42 12" strokeWidth="3" />
        <line x1="20" y1="28" x2="38" y2="28" strokeWidth="2" opacity="0.5" />
      </g>
      <g fill="currentColor" opacity="0.4">
        <rect x="28" y="18" width="3" height="3" rx="0.5" />
        <rect x="34" y="18" width="3" height="3" rx="0.5" />
        <rect x="28" y="34" width="3" height="3" rx="0.5" />
        <rect x="34" y="34" width="3" height="3" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant28;
