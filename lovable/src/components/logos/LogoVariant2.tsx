import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Modern geometric - sharp angles, bold B
const LogoVariant2: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle2';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M10 28 L32 12 L54 28" />
        <path d="M16 28 V54 H48 V28" />
        <rect x="26" y="44" width="12" height="10" fill="currentColor" opacity="0.2" />
      </g>
      <text x="32" y="40" textAnchor="middle" fontSize="28" fontWeight="800" fill="currentColor" fontFamily="Arial, sans-serif" letterSpacing="-1">B</text>
      <g fill="currentColor">
        <rect x="22" y="20" width="3" height="3" />
        <rect x="39" y="20" width="3" height="3" />
      </g>
    </svg>
  );
};

export default LogoVariant2;
