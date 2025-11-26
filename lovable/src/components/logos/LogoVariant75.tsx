import React from 'react';

interface LogoProps {
  className?: string;
  title?: string;
}

// 3D Hus med runda former och mjuk takterrass - variant av v59
const LogoVariant75: React.FC<LogoProps> = ({ className = 'h-10 w-10', title = 'Bostadsvyn logotyp' }) => {
  const titleId = 'logoTitle75';
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      
      {/* 3D-sidor med mjukare övergångar */}
      <path d="M10 32 L32 22 L32 60 L10 50 Z" fill="currentColor" opacity="0.32" />
      <path d="M32 22 L54 32 L54 50 L32 60 Z" fill="currentColor" opacity="0.26" />
      
      {/* Rundad takterrass */}
      <ellipse cx="32" cy="30" rx="20" ry="6" fill="currentColor" opacity="0.58" />
      <path d="M12 30 L12 33 L32 39 L32 36 Z" fill="currentColor" opacity="0.44" />
      <path d="M32 36 L32 39 L52 33 L52 30 Z" fill="currentColor" opacity="0.58" />
      
      {/* Mjuka räckeslinjer */}
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.68">
        <path d="M16 30 Q16 31 16 32" />
        <path d="M22 29 Q22 30 22 31" />
        <path d="M28 28 Q28 29 28 30" />
        <path d="M36 28 Q36 29 36 30" />
        <path d="M42 29 Q42 30 42 31" />
        <path d="M48 30 Q48 31 48 32" />
      </g>
      
      {/* Yttre kontur med rundade hörn */}
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 32 L32 22 L54 32 L54 50 L32 60 L10 50 Z" />
      </g>
      
      <text x="32" y="50" textAnchor="middle" fontSize="26" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">B</text>
    </svg>
  );
};

export default LogoVariant75;
