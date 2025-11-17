import type React from "react";

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D-perspektiv B med hus - premium och djup
const LogoVariant71: React.FC<LogoProps> = ({
  className = "h-10 w-10",
  title = "Bostadsvyn logotyp",
}) => {
  const titleId = "logoTitle71";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>

      {/* Skuggor för 3D-effekt */}
      <path
        d="M20 14 H40 Q52 14 52 26 Q52 32 48 34 Q52 36 52 44 Q52 56 40 56 H20 Z"
        fill="currentColor"
        opacity="0.2"
        transform="translate(2, 2)"
      />

      {/* Huvudsaklig B-form */}
      <path
        d="M18 12 H38 Q50 12 50 24 Q50 30 46 32 Q50 34 50 42 Q50 54 38 54 H18 Z"
        fill="currentColor"
      />

      {/* Övre hus med 3D-perspektiv */}
      <g>
        {/* Husvägg - vänster sida */}
        <path d="M24 18 L30 14 L30 26 L24 26 Z" fill="white" opacity="0.9" />
        {/* Husvägg - höger sida */}
        <path d="M30 14 L38 18 L38 26 L30 26 Z" fill="white" opacity="0.7" />
        {/* Tak */}
        <path d="M24 18 L30 14 L38 18 L38 20 L30 16 L24 20 Z" fill="white" />
        {/* Fönster */}
        <rect
          x="27"
          y="20"
          width="2"
          height="3"
          fill="currentColor"
          opacity="0.4"
        />
        <rect
          x="33"
          y="20"
          width="2"
          height="3"
          fill="currentColor"
          opacity="0.4"
        />
      </g>

      {/* Undre hus med 3D-perspektiv */}
      <g>
        {/* Husvägg - vänster sida */}
        <path d="M24 36 L30 32 L30 48 L24 48 Z" fill="white" opacity="0.9" />
        {/* Husvägg - höger sida */}
        <path d="M30 32 L38 36 L38 48 L30 48 Z" fill="white" opacity="0.7" />
        {/* Tak */}
        <path d="M24 36 L30 32 L38 36 L38 38 L30 34 L24 38 Z" fill="white" />
        {/* Fönster och dörr */}
        <rect
          x="27"
          y="38"
          width="2"
          height="3"
          fill="currentColor"
          opacity="0.4"
        />
        <rect
          x="33"
          y="38"
          width="2"
          height="3"
          fill="currentColor"
          opacity="0.4"
        />
        <rect
          x="29"
          y="42"
          width="3"
          height="5"
          fill="currentColor"
          opacity="0.4"
        />
      </g>
    </svg>
  );
};

export default LogoVariant71;
