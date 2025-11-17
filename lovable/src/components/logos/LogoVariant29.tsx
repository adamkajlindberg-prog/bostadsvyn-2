import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Minimalistisk B-hus - ren outline
const LogoVariant29: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle29";
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
        <path d="M22 10 L22 54 M22 10 L34 10 Q44 10 44 18 Q44 24 38 26 M38 26 Q44 28 44 34 Q44 42 34 42 L22 42 M22 26 L38 26 M22 54 L34 54" />
        <path d="M22 10 L28 6 L38 6 L44 10" strokeWidth="2.5" />
      </g>
      <circle cx="38" cy="18" r="1.5" fill="currentColor" />
      <circle cx="38" cy="34" r="1.5" fill="currentColor" />
    </svg>
  );
};

export default LogoVariant29;
