import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med penthouse-känsla - större format
const LogoVariant67: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle67';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id="glass67" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      
      <path d="M10 30 L32 20 L32 58 L10 48 Z" fill="currentColor" opacity="0.3" />
      <path d="M32 20 L54 30 L54 48 L32 58 Z" fill="currentColor" opacity="0.24" />
      
      <path d="M14 26 L32 18 L50 26 L32 34 Z" fill="url(#glass67)" />
      <path d="M14 26 L14 30 L32 38 L32 34 Z" fill="currentColor" opacity="0.4" />
      <path d="M32 34 L32 38 L50 30 L50 26 Z" fill="currentColor" opacity="0.52" />
      
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
        <line x1="20" y1="24" x2="20" y2="28" />
        <line x1="28" y1="22" x2="28" y2="26" />
        <line x1="36" y1="22" x2="36" y2="26" />
        <line x1="44" y1="24" x2="44" y2="28" />
        <path d="M18 28 L46 28" />
      </g>
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 30 L32 20 L54 30 L54 48 L32 58 L10 48 Z" />
      </g>
      
      <text x="32" y="48" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant67;
