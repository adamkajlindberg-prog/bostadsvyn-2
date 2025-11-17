import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B-byggnad med balkonger
const LogoVariant38: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle38";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="currentColor">
        <path d="M20 12 L20 54 H30 Q38 54 38 48 Q38 43 34 41 Q38 39 38 34 Q38 28 30 28 H20 Z M26 32 H30 Q32 32 32 34 Q32 36 30 36 H26 Z M26 42 H30 Q32 42 32 44 Q32 48 30 48 H26 Z" />
      </g>
      <path
        d="M20 12 L30 6 L38 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M38 34 L42 34 L42 36" />
        <path d="M38 44 L42 44 L42 48" />
      </g>
    </svg>
  );
};

export default LogoVariant38;
