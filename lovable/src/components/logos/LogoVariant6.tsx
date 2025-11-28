import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Compact modern - perfect for app icons
const LogoVariant6: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle6';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 28 L32 16 L50 28 L50 50 L14 50 Z" />
        <line x1="32" y1="16" x2="32" y2="24" />
      </g>
      <circle cx="32" cy="24" r="2" fill="currentColor" />
      <text x="32" y="45" textAnchor="middle" fontSize="24" fontWeight="800" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor" opacity="0.5">
        <rect x="20" y="32" width="5" height="5" rx="1" />
        <rect x="39" y="32" width="5" height="5" rx="1" />
      </g>
    </svg>
  );
};

export default LogoVariant6;
