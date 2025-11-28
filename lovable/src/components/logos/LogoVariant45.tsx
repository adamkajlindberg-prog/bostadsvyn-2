import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// B-fyrkantig modern box
const LogoVariant45: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle45';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <g fill="currentColor">
        <rect x="20" y="12" width="24" height="44" rx="2" />
      </g>
      <g fill="background" opacity="0.9">
        <path d="M24 20 L24 48 H32 Q38 48 38 42 Q38 38 34 36 Q38 34 38 30 Q38 24 32 24 H24 Z M28 28 H32 Q34 28 34 30 Q34 32 32 32 H28 Z M28 36 H32 Q34 36 34 38 Q34 42 32 42 H28 Z" />
      </g>
      <g fill="currentColor" opacity="0.3">
        <rect x="30" y="29" width="2" height="2" />
        <rect x="30" y="38" width="2" height="2" />
      </g>
    </svg>
  );
};

export default LogoVariant45;
