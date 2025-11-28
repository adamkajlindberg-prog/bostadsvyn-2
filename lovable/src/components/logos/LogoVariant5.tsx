import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Bold architectural - strong lines, architectural B
const LogoVariant5: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle5';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="currentColor" opacity="0.15">
        <path d="M32 10 L56 26 L56 54 L32 54 L8 54 L8 26 Z" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 26 L32 12 L54 26" strokeWidth="4" />
        <path d="M16 26 V52" />
        <path d="M48 26 V52" />
        <path d="M12 52 H52" strokeWidth="4" />
        <line x1="32" y1="12" x2="32" y2="26" opacity="0.4" />
      </g>
      <text x="32" y="43" textAnchor="middle" fontSize="30" fontWeight="900" fill="currentColor" fontFamily="Arial Black, sans-serif">B</text>
      <g fill="currentColor">
        <rect x="20" y="32" width="4" height="4" rx="0.5" opacity="0.6" />
        <rect x="40" y="32" width="4" height="4" rx="0.5" opacity="0.6" />
      </g>
    </svg>
  );
};

export default LogoVariant5;
