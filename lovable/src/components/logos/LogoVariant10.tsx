import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Ultra minimal - endast essentiella element
const LogoVariant10: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle10';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 30 L32 18 L48 30 M20 30 V50 M44 30 V50 M18 50 H46" />
      </g>
      <text x="32" y="44" textAnchor="middle" fontSize="34" fontWeight="300" fill="currentColor" fontFamily="system-ui, sans-serif" style={{ letterSpacing: '-3px' }}>B</text>
      <circle cx="32" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
};

export default LogoVariant10;
