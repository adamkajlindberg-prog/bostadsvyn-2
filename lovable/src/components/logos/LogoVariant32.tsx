import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// B med skorsten - traditionellt hus
const LogoVariant32: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle32';
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
        <rect x="38" y="6" width="4" height="8" />
        <path d="M20 14 L20 54 H30 Q38 54 38 48 Q38 43 34 41 Q38 39 38 34 Q38 28 30 28 H20 Z M26 32 H30 Q32 32 32 34 Q32 36 30 36 H26 Z M26 42 H30 Q32 42 32 44 Q32 48 30 48 H26 Z" />
      </g>
      <path d="M20 14 L30 8 L38 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="20" y1="54" x2="38" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <g fill="currentColor" opacity="0.3">
        <rect x="28" y="33" width="2" height="2" />
        <rect x="28" y="44" width="2" height="2" />
      </g>
    </svg>
  );
};

export default LogoVariant32;
