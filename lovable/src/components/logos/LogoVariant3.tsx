import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// Rounded modern - soft curves, friendly B
const LogoVariant3: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle3";
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
        <path d="M10 28 Q10 26 12 26 L30 14 Q32 12 34 14 L52 26 Q54 26 54 28" />
        <path d="M16 28 Q16 26 16 26 V50 Q16 52 18 52 H46 Q48 52 48 50 V26" />
        <circle cx="32" cy="18" r="2" fill="currentColor" />
      </g>
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, sans-serif"
      >
        B
      </text>
      <g fill="currentColor" opacity="0.8">
        <circle cx="26" cy="32" r="1.5" />
        <circle cx="38" cy="32" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant3;
