import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Tvåvånings B-hus
const LogoVariant43: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle43";
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
        <path d="M20 16 L20 52 H28 Q36 52 36 46 Q36 41 32 39 Q36 37 36 32 Q36 26 28 26 H20 Z M25 30 H28 Q30 30 30 32 Q30 34 28 34 H25 Z M25 40 H28 Q30 40 30 42 Q30 46 28 46 H25 Z" />
      </g>
      <path
        d="M16 26 L20 16 L28 10 L36 16 L40 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="52"
        x2="40"
        y2="52"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g fill="currentColor" opacity="0.4">
        <rect x="27" y="31" width="2" height="2" />
        <rect x="27" y="42" width="2" height="2" />
      </g>
    </svg>
  );
};

export default LogoVariant43;
