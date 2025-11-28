import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Elegant B-residens
const LogoVariant39: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle39';
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
        <path d="M20 10 L20 56 L32 56 Q44 56 44 48 Q44 42 38 40 Q44 38 44 32 Q44 24 32 24 L20 24 Z" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10 L32 4 L44 10 M20 10 L20 56 M20 24 L32 24 Q44 24 44 32 Q44 38 38 40 M38 40 Q44 42 44 48 Q44 56 32 56 L20 56" />
      </g>
      <g fill="currentColor">
        <circle cx="36" cy="28" r="2" />
        <circle cx="36" cy="44" r="2" />
      </g>
    </svg>
  );
};

export default LogoVariant39;
