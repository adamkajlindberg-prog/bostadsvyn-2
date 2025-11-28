import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Symmetrisk herrgård - dubbla gavlar med centrerat B
const LogoVariant21: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle21';
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
        <path d="M4 32 L16 22 L16 14 L20 14 L20 19 L28 13 L36 19 L36 14 L40 14 L40 19 L48 13 L60 24 L60 56 L4 56 Z" />
        <line x1="4" y1="56" x2="60" y2="56" strokeWidth="4" />
      </g>
      <text x="32" y="44" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor" opacity="0.4">
        <rect x="12" y="36" width="3" height="4" rx="0.5" />
        <rect x="49" y="36" width="3" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant21;
