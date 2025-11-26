import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med skarp vinkel - större format
const LogoVariant53: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle53';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      <path d="M8 32 L32 18 L32 58 L8 50 Z" fill="currentColor" opacity="0.32" />
      <path d="M32 18 L56 32 L56 50 L32 58 Z" fill="currentColor" opacity="0.26" />
      
      <path d="M12 28 L32 14 L52 28 L32 36 Z" fill="currentColor" opacity="0.58" />
      <path d="M12 28 L12 32 L32 40 L32 36 Z" fill="currentColor" opacity="0.42" />
      <path d="M32 36 L32 40 L52 32 L52 28 Z" fill="currentColor" opacity="0.58" />
      
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 32 L32 18 L56 32 L56 50 L32 58 L8 50 Z" />
      </g>
      
      <text x="32" y="48" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant53;
