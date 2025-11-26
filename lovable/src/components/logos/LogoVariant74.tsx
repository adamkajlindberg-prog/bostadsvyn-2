import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med platt tak och moderna linjer - variant av v59
const LogoVariant74: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle74';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      {/* 3D-sidor */}
      <path d="M10 30 L32 20 L32 60 L10 50 Z" fill="currentColor" opacity="0.28" />
      <path d="M32 20 L54 30 L54 50 L32 60 Z" fill="currentColor" opacity="0.22" />
      
      {/* Platt takterrass med modern design */}
      <path d="M14 26 L32 18 L50 26 L32 34 Z" fill="currentColor" opacity="0.65" />
      <path d="M14 26 L14 30 L32 38 L32 34 Z" fill="currentColor" opacity="0.48" />
      <path d="M32 34 L32 38 L50 30 L50 26 Z" fill="currentColor" opacity="0.65" />
      
      {/* Moderna räckeslinjer */}
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
        <line x1="18" y1="28" x2="18" y2="30" />
        <line x1="24" y1="26" x2="24" y2="28" />
        <line x1="32" y1="25" x2="32" y2="27" />
        <line x1="40" y1="26" x2="40" y2="28" />
        <line x1="46" y1="28" x2="46" y2="30" />
        
        {/* Horisontella linjer för modern känsla */}
        <line x1="18" y1="30" x2="46" y2="30" opacity="0.5" />
      </g>
      
      {/* Yttre kontur */}
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 30 L32 20 L54 30 L54 50 L32 60 L10 50 Z" />
      </g>
      
      <text x="32" y="49" textAnchor="middle" fontSize="28" fontWeight="800" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant74;
