import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// A-frame hus - triangulär form med centrerat B
const LogoVariant12: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle12';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 54 L10 28 L32 10 L54 28 L54 54 Z" />
        <line x1="18" y1="54" x2="18" y2="36" />
        <line x1="46" y1="54" x2="46" y2="36" />
      </g>
      <text x="32" y="42" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
      <g fill="currentColor" opacity="0.4">
        <path d="M32 10 L32 24" strokeWidth="2" stroke="currentColor" opacity="0.3" />
        <circle cx="32" cy="24" r="1.5" />
      </g>
    </svg>
  );
};

export default LogoVariant12;
