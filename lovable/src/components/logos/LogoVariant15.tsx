import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Klassiskt med skorsten - traditionell husform med centrerat B
const LogoVariant15: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle15';
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
        <path d="M8 30 L32 12 L56 30 L56 54 L8 54 Z" />
        <rect x="40" y="8" width="6" height="14" rx="1" strokeWidth="2.5" />
        <line x1="8" y1="54" x2="56" y2="54" strokeWidth="4" />
      </g>
      <text x="32" y="42" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor" opacity="0.5">
        <rect x="18" y="34" width="4" height="4" rx="0.5" />
        <rect x="42" y="34" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant15;
