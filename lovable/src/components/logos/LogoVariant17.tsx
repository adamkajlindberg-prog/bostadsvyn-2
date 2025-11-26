import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Klassisk herrgård - symmetrisk fasad med centrerat B
const LogoVariant17: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle17';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 28 L32 8 L58 28 L58 56 L6 56 Z" />
        <line x1="6" y1="56" x2="58" y2="56" strokeWidth="4" />
        <rect x="26" y="18" width="12" height="8" rx="1" strokeWidth="2" />
      </g>
      <text x="32" y="42" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor" opacity="0.4">
        <rect x="12" y="32" width="3" height="4" rx="0.5" />
        <rect x="18" y="32" width="3" height="4" rx="0.5" />
        <rect x="43" y="32" width="3" height="4" rx="0.5" />
        <rect x="49" y="32" width="3" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant17;
