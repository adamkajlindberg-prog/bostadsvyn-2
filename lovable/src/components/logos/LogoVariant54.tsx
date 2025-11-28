import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med lägre takterrass - större format
const LogoVariant54: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle54';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      <path d="M10 30 L32 20 L32 60 L10 50 Z" fill="currentColor" opacity="0.3" />
      <path d="M32 20 L54 30 L54 50 L32 60 Z" fill="currentColor" opacity="0.24" />
      
      <path d="M18 26 L32 20 L46 26 L32 32 Z" fill="currentColor" opacity="0.5" />
      <path d="M18 26 L18 30 L32 36 L32 32 Z" fill="currentColor" opacity="0.38" />
      <path d="M32 32 L32 36 L46 30 L46 26 Z" fill="currentColor" opacity="0.5" />
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 30 L32 20 L54 30 L54 50 L32 60 L10 50 Z" />
        <path d="M18 26 L32 20 L46 26" />
      </g>
      
      <text x="32" y="48" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      
      <g fill="currentColor" opacity="0.4">
        <rect x="16" y="38" width="3.5" height="3.5" rx="0.5" />
        <rect x="44" y="38" width="3.5" height="3.5" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant54;
