import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Detailed modern - mer detaljerad med flera element
const LogoVariant9: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle9';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 28 L32 12 L56 28" />
        <path d="M14 28 V52" />
        <path d="M50 28 V52" />
        <path d="M10 52 H54" strokeWidth="4" />
        <line x1="32" y1="12" x2="32" y2="20" strokeWidth="2" />
        <circle cx="32" cy="20" r="1.5" fill="currentColor" />
      </g>
      <text x="32" y="42" textAnchor="middle" fontSize="27" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor">
        <rect x="20" y="32" width="3.5" height="3.5" rx="0.5" />
        <rect x="26" y="32" width="3.5" height="3.5" rx="0.5" />
        <rect x="34" y="32" width="3.5" height="3.5" rx="0.5" />
        <rect x="40" y="32" width="3.5" height="3.5" rx="0.5" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
        <line x1="22" y1="46" x2="28" y2="46" />
        <line x1="36" y1="46" x2="42" y2="46" />
      </g>
    </svg>
  );
};

export default LogoVariant9;
