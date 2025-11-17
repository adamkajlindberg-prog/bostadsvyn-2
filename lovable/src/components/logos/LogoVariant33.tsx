import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Modern B-torn - höghus känsla
const LogoVariant33: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle33";
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
        <rect x="22" y="8" width="20" height="48" rx="1" />
        <line x1="22" y1="28" x2="42" y2="28" strokeWidth="3" />
        <line x1="22" y1="38" x2="42" y2="38" strokeWidth="3" />
        <path d="M32 28 Q38 28 38 32 Q38 36 32 36" fill="currentColor" />
        <path d="M32 38 Q38 38 38 42 Q38 46 32 46" fill="currentColor" />
      </g>
      <g fill="currentColor" opacity="0.4">
        <rect x="28" y="14" width="2" height="2" />
        <rect x="34" y="14" width="2" height="2" />
        <rect x="28" y="20" width="2" height="2" />
        <rect x="34" y="20" width="2" height="2" />
      </g>
    </svg>
  );
};

export default LogoVariant33;
