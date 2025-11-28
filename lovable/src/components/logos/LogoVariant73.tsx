import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med djup perspektiv - variant av v59
const LogoVariant73: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle73';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      {/* Djupare 3D-effekt med mer pronounced sidor */}
      <path d="M8 34 L32 24 L32 62 L8 52 Z" fill="currentColor" opacity="0.25" />
      <path d="M32 24 L56 34 L56 52 L32 62 Z" fill="currentColor" opacity="0.2" />
      
      {/* Takterrass med mer detaljer */}
      <path d="M12 30 L32 22 L52 30 L32 38 Z" fill="currentColor" opacity="0.6" />
      <path d="M12 30 L12 34 L32 42 L32 38 Z" fill="currentColor" opacity="0.45" />
      <path d="M32 38 L32 42 L52 34 L52 30 Z" fill="currentColor" opacity="0.6" />
      
      {/* Terrass räcken - mer detaljer */}
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <line x1="16" y1="31" x2="16" y2="34" />
        <line x1="20" y1="30" x2="20" y2="33" />
        <line x1="24" y1="29" x2="24" y2="32" />
        <line x1="32" y1="28" x2="32" y2="31" />
        <line x1="40" y1="29" x2="40" y2="32" />
        <line x1="44" y1="30" x2="44" y2="33" />
        <line x1="48" y1="31" x2="48" y2="34" />
      </g>
      
      {/* Yttre kontur */}
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 34 L32 24 L56 34 L56 52 L32 62 L8 52 Z" />
      </g>
      
      {/* B med skugga för djup */}
      <text x="32.5" y="51" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" opacity="0.2" fontFamily="system-ui, sans-serif">B</text>
      <text x="32" y="50" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant73;
