import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Minimal line art - ultra clean, elegant B
const LogoVariant4: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle4';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 26 L32 14 L52 26 M16 26 V52 M48 26 V52 M14 52 H50" />
        <line x1="32" y1="14" x2="32" y2="22" opacity="0.5" />
        <circle cx="32" cy="22" r="1" fill="currentColor" />
      </g>
      <text x="32" y="42" textAnchor="middle" fontSize="32" fontWeight="600" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" style={{ letterSpacing: '-2px' }}>B</text>
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="22" y="44" width="8" height="8" rx="1" opacity="0.3" />
        <rect x="34" y="44" width="8" height="8" rx="1" opacity="0.3" />
      </g>
    </svg>
  );
};

export default LogoVariant4;
