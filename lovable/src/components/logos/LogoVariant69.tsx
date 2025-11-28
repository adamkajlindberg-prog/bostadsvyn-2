import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Geometriskt modernt B med hus - clean och premium
const LogoVariant69: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle69';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      {/* Yttre B-kontur med rundade hörn */}
      <rect x="14" y="10" width="36" height="44" rx="8" fill="currentColor" />
      
      {/* Skapa B-formen genom cutouts */}
      <rect x="38" y="10" width="12" height="44" rx="6" fill="white" opacity="0.15" />
      <circle cx="38" cy="31" r="8" fill="white" opacity="0.15" />
      
      {/* Övre huset - tydlig siluett */}
      <g>
        <path d="M22 20 L28 16 L34 20 L34 28 L22 28 Z" fill="white" />
        <rect x="25" y="22" width="2.5" height="3" fill="currentColor" opacity="0.4" />
        <rect x="28.5" y="22" width="2.5" height="3" fill="currentColor" opacity="0.4" />
      </g>
      
      {/* Undre huset - tydlig siluett */}
      <g>
        <path d="M22 38 L28 34 L34 38 L34 46 L22 46 Z" fill="white" />
        <rect x="25" y="40" width="2.5" height="3" fill="currentColor" opacity="0.4" />
        <rect x="28.5" y="40" width="2.5" height="3" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  );
};

export default LogoVariant69;
