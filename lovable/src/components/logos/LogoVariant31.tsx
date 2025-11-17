import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Rundad B-villa - mjuka kurvor
const LogoVariant31: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle31";
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
        <path d="M22 54 L22 14 Q22 12 24 12 L30 12 Q40 12 40 20 Q40 25 36 27 Q40 29 40 34 Q40 42 30 42 L22 42" />
        <path d="M22 14 Q22 10 26 8 L34 8 Q40 10 40 14" />
        <line x1="22" y1="54" x2="32" y2="54" strokeWidth="5" />
      </g>
      <g fill="currentColor">
        <circle cx="32" cy="20" r="1.5" />
        <circle cx="32" cy="34" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant31;
