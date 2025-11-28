import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Modern B med integrerade hus - tydligt och exklusivt
const LogoVariant68: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle68';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      {/* B-formen med rundade hörn */}
      <path 
        d="M16 12 L16 52 L36 52 Q48 52 48 42 Q48 36 42 34 Q48 32 48 24 Q48 12 36 12 Z" 
        fill="currentColor"
      />
      
      {/* Övre huset inuti B */}
      <g fill="white">
        <path d="M24 18 L32 14 L40 18 L40 28 L24 28 Z" />
        <rect x="28" y="22" width="3" height="4" fill="currentColor" opacity="0.3" />
        <rect x="33" y="22" width="3" height="4" fill="currentColor" opacity="0.3" />
      </g>
      
      {/* Undre huset inuti B */}
      <g fill="white">
        <path d="M24 36 L32 32 L40 36 L40 46 L24 46 Z" />
        <rect x="28" y="38" width="3" height="4" fill="currentColor" opacity="0.3" />
        <rect x="33" y="38" width="3" height="4" fill="currentColor" opacity="0.3" />
        <rect x="30" y="42" width="4" height="4" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  );
};

export default LogoVariant68;
