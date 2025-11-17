import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B-lägenhet - modern flerfamiljshus
const LogoVariant42: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle42";
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
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="18" y="8" width="28" height="50" rx="2" />
        <line x1="18" y1="28" x2="46" y2="28" />
        <line x1="18" y1="38" x2="46" y2="38" />
        <line x1="18" y1="48" x2="46" y2="48" />
      </g>
      <g fill="currentColor">
        <path d="M26 28 Q34 28 34 32 Q34 36 26 36" opacity="0.8" />
        <path d="M26 38 Q34 38 34 42 Q34 46 26 46" opacity="0.8" />
      </g>
      <g fill="currentColor" opacity="0.5">
        <rect x="24" y="14" width="3" height="3" rx="0.5" />
        <rect x="37" y="14" width="3" height="3" rx="0.5" />
        <rect x="24" y="20" width="3" height="3" rx="0.5" />
        <rect x="37" y="20" width="3" height="3" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant42;
