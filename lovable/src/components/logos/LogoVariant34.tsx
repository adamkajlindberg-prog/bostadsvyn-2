import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B-fasad med veranda
const LogoVariant34: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle34";
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
        <path d="M18 16 L18 48 H28 Q36 48 36 42 Q36 38 32 36 Q36 34 36 30 Q36 24 28 24 H18 Z M24 28 H28 Q30 28 30 30 Q30 32 28 32 H24 Z M24 36 H28 Q30 36 30 38 Q30 42 28 42 H24 Z" />
      </g>
      <path
        d="M18 16 L28 10 L36 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="14" y1="48" x2="14" y2="54" />
        <line x1="40" y1="48" x2="40" y2="54" />
        <line x1="14" y1="54" x2="40" y2="54" />
      </g>
    </svg>
  );
};

export default LogoVariant34;
