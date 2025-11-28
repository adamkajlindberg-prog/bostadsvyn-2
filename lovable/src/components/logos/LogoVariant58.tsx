import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med mittenterrass - större format
const LogoVariant58: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle58';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      <path d="M12 30 L32 20 L32 58 L12 48 Z" fill="currentColor" opacity="0.3" />
      <path d="M32 20 L52 30 L52 48 L32 58 Z" fill="currentColor" opacity="0.24" />
      
      <path d="M20 26 L32 20 L44 26 L32 32 Z" fill="currentColor" opacity="0.52" />
      <path d="M20 26 L20 30 L32 36 L32 32 Z" fill="currentColor" opacity="0.4" />
      <path d="M32 32 L32 36 L44 30 L44 26 Z" fill="currentColor" opacity="0.52" />
      
      <path d="M24 32 L32 28 L40 32 L32 36 Z" fill="currentColor" opacity="0.46" />
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 30 L32 20 L52 30 L52 48 L32 58 L12 48 Z" />
      </g>
      
      <text x="32" y="50" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant58;
