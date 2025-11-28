import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Abstrakt geometrisk - modern geometri med centrerat B
const LogoVariant16: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle16';
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
        <path d="M18 24 L32 14 L46 24 L50 24 L50 50 L14 50 L14 24 Z" />
        <path d="M32 14 L32 22" strokeWidth="2" opacity="0.4" />
      </g>
      <circle cx="32" cy="22" r="1.5" fill="currentColor" />
      <text x="32" y="42" textAnchor="middle" fontSize="29" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor" opacity="0.3">
        <polygon points="20,28 24,28 24,32 20,32" />
        <polygon points="40,28 44,28 44,32 40,32" />
      </g>
    </svg>
  );
};

export default LogoVariant16;
