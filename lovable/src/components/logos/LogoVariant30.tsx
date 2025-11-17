import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Geometrisk B-byggnad - sharp angles
const LogoVariant30: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle30";
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
        <path d="M20 8 L20 56 L32 56 L44 50 L44 40 L38 38 L44 36 L44 26 L32 20 L20 20 Z M26 24 L32 26 L38 28 L38 32 L32 34 L26 32 Z M26 38 L32 40 L38 42 L38 46 L32 50 L26 48 Z" />
        <path
          d="M20 8 L32 2 L44 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
      </g>
      <g fill="background" opacity="0.2">
        <rect x="30" y="28" width="2" height="2" />
        <rect x="30" y="42" width="2" height="2" />
      </g>
    </svg>
  );
};

export default LogoVariant30;
