import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med geometrisk precision - variant av v59
const LogoVariant77: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle77';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      {/* 3D-sidor med stark kontrast */}
      <path d="M10 32 L32 22 L32 60 L10 50 Z" fill="currentColor" opacity="0.35" />
      <path d="M32 22 L54 32 L54 50 L32 60 Z" fill="currentColor" opacity="0.2" />
      
      {/* Geometrisk takterrass */}
      <path d="M14 28 L32 20 L50 28 L50 30 L32 38 L14 30 Z" fill="currentColor" opacity="0.6" />
      <path d="M14 30 L14 32 L32 40 L32 38 Z" fill="currentColor" opacity="0.42" />
      <path d="M32 38 L32 40 L50 32 L50 30 Z" fill="currentColor" opacity="0.6" />
      
      {/* Strikt geometriska räcken */}
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" opacity="0.7">
        <line x1="18" y1="29" x2="18" y2="31" />
        <line x1="24" y1="27" x2="24" y2="29" />
        <line x1="32" y1="26" x2="32" y2="28" />
        <line x1="40" y1="27" x2="40" y2="29" />
        <line x1="46" y1="29" x2="46" y2="31" />
      </g>
      
      {/* Skarpa linjer för modern känsla */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" opacity="0.4">
        <line x1="14" y1="30" x2="50" y2="30" />
        <line x1="18" y1="31" x2="46" y2="31" />
      </g>
      
      {/* Yttre kontur med skarpa hörn */}
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M10 32 L32 22 L54 32 L54 50 L32 60 L10 50 Z" />
      </g>
      
      <text x="32" y="50" textAnchor="middle" fontSize="27" fontWeight="800" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant77;
