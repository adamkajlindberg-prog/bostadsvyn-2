import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Minimalist house + B logo as inline SVG using currentColor so it can be themed
const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      {/* House outline */}
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 26 L32 10 L56 26" />
        <path d="M14 26 V52" />
        <path d="M50 26 V52" />
        <path d="M10 52 H54" />
      </g>
      {/* Letter B */}
      <text x="32" y="44" textAnchor="middle" fontSize="30" fontWeight="700" fill="currentColor">B</text>
      {/* Small window detail */}
      <g fill="currentColor">
        <rect x="28" y="18" width="4" height="4" rx="0.5" />
        <rect x="33" y="18" width="4" height="4" rx="0.5" />
        <rect x="28" y="23" width="4" height="4" rx="0.5" />
        <rect x="33" y="23" width="4" height="4" rx="0.5" />
      </g>
    </svg>
  );
};

export default Logo;
