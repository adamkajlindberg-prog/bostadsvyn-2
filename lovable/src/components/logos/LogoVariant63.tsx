import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med trappstegstak - större format
const LogoVariant63: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle63';
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
      
      <path d="M18 28 L32 22 L46 28 L32 34 Z" fill="currentColor" opacity="0.5" />
      <path d="M22 26 L32 20 L42 26 L32 32 Z" fill="currentColor" opacity="0.56" />
      <path d="M26 24 L32 20 L38 24 L32 28 Z" fill="currentColor" opacity="0.62" />
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 32 L32 22 L54 32 L54 50 L32 60 L10 50 Z" />
      </g>
      
      <text x="32" y="50" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant63;
