import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// Integrated B - B är inbyggt i husets struktur
const LogoVariant7: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle7';
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
        <path d="M10 30 L32 14 L54 30" />
        <path d="M15 30 V54 H49 V30" />
      </g>
      <g fill="currentColor">
        <path d="M24 32 H35 Q39 32 39 36 Q39 38 37 39 Q39 40 39 43 Q39 47 35 47 H24 Z M28 36 V38 H34 Q35 38 35 37 Q35 36 34 36 Z M28 41 V44 H34 Q35 44 35 43 Q35 41 34 41 Z" />
        <rect x="28" y="20" width="3" height="3" rx="0.5" />
        <rect x="33" y="20" width="3" height="3" rx="0.5" />
      </g>
    </svg>
  );
};

export default LogoVariant7;
