import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B med kolonner - klassisk arkitektur
const LogoVariant36: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle36";
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
        <path d="M24 18 L24 50 H32 Q40 50 40 44 Q40 39 36 37 Q40 35 40 30 Q40 24 32 24 H24 Z M28 28 H32 Q34 28 34 30 Q34 32 32 32 H28 Z M28 38 H32 Q34 38 34 40 Q34 44 32 44 H28 Z" />
      </g>
      <path
        d="M24 18 L32 12 L40 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="20"
        y1="50"
        x2="20"
        y2="56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="44"
        y1="50"
        x2="44"
        y2="56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="56"
        x2="46"
        y2="56"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LogoVariant36;
