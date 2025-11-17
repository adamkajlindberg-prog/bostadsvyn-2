import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B med glasfasad - modern glasbyggnad
const LogoVariant46: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle46";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id="glassGrad46" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <g fill="url(#glassGrad46)">
        <path d="M20 10 L20 56 L32 56 Q42 56 42 48 Q42 42 36 40 Q42 38 42 32 Q42 24 32 24 L20 24 Z" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10 L20 56 M20 24 L32 24 Q42 24 42 32 Q42 38 36 40 M36 40 Q42 42 42 48 Q42 56 32 56 L20 56" />
        <line x1="26" y1="10" x2="26" y2="56" opacity="0.3" />
        <line x1="32" y1="24" x2="32" y2="56" opacity="0.3" />
        <line x1="20" y1="32" x2="38" y2="32" opacity="0.3" />
        <line x1="20" y1="44" x2="38" y2="44" opacity="0.3" />
      </g>
      <path
        d="M20 10 L30 4 L42 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoVariant46;
