import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// B-stadshus - urban känsla
const LogoVariant41: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle41';
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
        <path d="M22 14 L22 56 H32 Q40 56 40 50 Q40 45 36 43 Q40 41 40 36 Q40 30 32 30 H22 Z M27 34 H32 Q34 34 34 36 Q34 38 32 38 H27 Z M27 44 H32 Q34 44 34 46 Q34 50 32 50 H27 Z" />
        <rect x="34" y="8" width="4" height="8" />
      </g>
      <line x1="18" y1="56" x2="44" y2="56" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 14 L32 8 L40 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="currentColor" opacity="0.3">
        <rect x="29" y="35" width="2" height="2" />
        <rect x="29" y="46" width="2" height="2" />
      </g>
    </svg>
  );
};

export default LogoVariant41;
