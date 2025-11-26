import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med stark 3D-effekt - större format
const LogoVariant65: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle65';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      <path d="M8 32 L32 20 L32 60 L8 52 Z" fill="currentColor" opacity="0.35" />
      <path d="M32 20 L56 32 L56 52 L32 60 Z" fill="currentColor" opacity="0.28" />
      
      <path d="M12 28 L32 18 L52 28 L32 38 Z" fill="currentColor" opacity="0.58" />
      <path d="M12 28 L12 32 L32 42 L32 38 Z" fill="currentColor" opacity="0.45" />
      <path d="M32 38 L32 42 L52 32 L52 28 Z" fill="currentColor" opacity="0.58" />
      
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 32 L32 20 L56 32 L56 52 L32 60 L8 52 Z" />
        <line x1="32" y1="20" x2="32" y2="38" opacity="0.5" />
      </g>
      
      <text x="32" y="52" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant65;
