import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// B med flat roof - modern stil
const LogoVariant40: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle40';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="20" y="12" width="24" height="42" rx="1" />
        <line x1="20" y1="30" x2="44" y2="30" strokeWidth="3" />
        <line x1="20" y1="40" x2="44" y2="40" strokeWidth="3" />
      </g>
      <g fill="currentColor">
        <path d="M28 30 Q36 30 36 34 Q36 38 28 38" />
        <path d="M28 40 Q36 40 36 44 Q36 48 28 48" />
        <rect x="28" y="18" width="2.5" height="2.5" />
        <rect x="33.5" y="18" width="2.5" height="2.5" />
      </g>
    </svg>
  );
};

export default LogoVariant40;
