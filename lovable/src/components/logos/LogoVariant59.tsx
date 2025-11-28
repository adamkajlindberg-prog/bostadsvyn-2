import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med elegant takterrass - större format
const LogoVariant59: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle59';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      <path d="M10 32 L32 22 L32 60 L10 50 Z" fill="currentColor" opacity="0.3" />
      <path d="M32 22 L54 32 L54 50 L32 60 Z" fill="currentColor" opacity="0.24" />
      
      <path d="M14 28 L32 20 L50 28 L32 36 Z" fill="currentColor" opacity="0.56" />
      <path d="M14 28 L14 32 L32 40 L32 36 Z" fill="currentColor" opacity="0.42" />
      <path d="M32 36 L32 40 L50 32 L50 28 Z" fill="currentColor" opacity="0.56" />
      
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.65">
        <line x1="18" y1="30" x2="18" y2="32" />
        <line x1="24" y1="28" x2="24" y2="30" />
        <line x1="32" y1="27" x2="32" y2="29" />
        <line x1="40" y1="28" x2="40" y2="30" />
        <line x1="46" y1="30" x2="46" y2="32" />
      </g>
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 32 L32 22 L54 32 L54 50 L32 60 L10 50 Z" />
      </g>
      
      <text x="32" y="50" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant59;
