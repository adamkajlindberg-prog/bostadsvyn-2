import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Kompakt B-bostad
const LogoVariant37: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle37';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 54 L22 14 L30 14 Q38 14 38 20 Q38 25 34 27 Q38 29 38 34 Q38 40 30 40 L22 40 M22 54 L30 54" />
        <path d="M22 14 L30 8 L38 14" strokeWidth="4" />
      </g>
      <g fill="currentColor">
        <rect x="28" y="19" width="3" height="3" rx="0.5" />
        <rect x="28" y="32" width="3" height="3" rx="0.5" />
        <rect x="26" y="46" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant37;
