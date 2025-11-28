import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med modern takterrass och räcke - större format
const LogoVariant52: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle52';
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
      
      <path d="M16 26 L32 18 L48 26 L32 34 Z" fill="currentColor" opacity="0.52" />
      <path d="M16 26 L16 30 L32 38 L32 34 Z" fill="currentColor" opacity="0.38" />
      <path d="M32 34 L32 38 L48 30 L48 26 Z" fill="currentColor" opacity="0.52" />
      
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M18 28 L18 30 L30 30 L30 28" opacity="0.7" />
        <path d="M34 28 L34 30 L46 30 L46 28" opacity="0.7" />
      </g>
      
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 30 L32 20 L52 30 L52 48 L32 58 L12 48 Z" />
      </g>
      
      <text x="32" y="48" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      
      <g fill="currentColor" opacity="0.45">
        <rect x="18" y="38" width="4" height="4" rx="0.5" />
        <rect x="40" y="38" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant52;
