import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// B som hus - klassisk B-form med tak och fönster
const LogoVariant27: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle27";
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
        <path d="M18 12 L18 52 H28 Q36 52 36 44 Q36 38 32 36 Q36 34 36 28 Q36 20 28 20 H18 Z M24 26 H28 Q30 26 30 28 Q30 30 28 30 H24 Z M24 36 H28 Q30 36 30 38 V42 Q30 46 28 46 H24 Z" />
        <path
          d="M18 12 L28 6 L36 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="26" y="24" width="2" height="2" opacity="0.3" />
        <rect x="26" y="38" width="2" height="2" opacity="0.3" />
      </g>
    </svg>
  );
};

export default LogoVariant27;
