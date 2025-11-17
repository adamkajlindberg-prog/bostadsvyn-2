import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B-kupol - unik arkitektur
const LogoVariant44: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle44";
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
        <path d="M22 54 L22 20 Q22 12 28 8 Q32 6 36 8 Q42 12 42 20 M22 54 L32 54" />
        <path d="M22 30 L28 30 Q36 30 36 36 Q36 40 30 41" />
        <path d="M22 41 L30 41 Q36 41 36 46 Q36 50 30 51" />
      </g>
      <g fill="currentColor">
        <circle cx="32" cy="36" r="1.5" />
        <circle cx="32" cy="46" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant44;
