import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med högt perspektiv - större format
const LogoVariant56: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle56';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      <path d="M14 26 L32 16 L32 54 L14 44 Z" fill="currentColor" opacity="0.3" />
      <path d="M32 16 L50 26 L50 44 L32 54 Z" fill="currentColor" opacity="0.24" />
      
      <path d="M18 22 L32 14 L46 22 L32 30 Z" fill="currentColor" opacity="0.56" />
      <path d="M18 22 L18 26 L32 34 L32 30 Z" fill="currentColor" opacity="0.42" />
      <path d="M32 30 L32 34 L46 26 L46 22 Z" fill="currentColor" opacity="0.56" />
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 26 L32 16 L50 26 L50 44 L32 54 L14 44 Z" />
        <line x1="32" y1="16" x2="32" y2="30" opacity="0.4" />
      </g>
      
      <text x="32" y="46" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      
      <g fill="currentColor" opacity="0.4">
        <rect x="20" y="34" width="3" height="3" rx="0.5" />
        <rect x="20" y="39" width="3" height="3" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant56;
