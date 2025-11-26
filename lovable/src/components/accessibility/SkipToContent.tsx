import React from 'react';

/**
 * SkipToContent component provides keyboard users with a quick way to skip navigation
 * and jump directly to the main content. This is a WCAG 2.4.1 (Level A) requirement.
 * 
 * The link is visually hidden by default but becomes visible when focused with Tab key.
 */
const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-ring focus:ring-offset-2 transition-all"
      aria-label="Hoppa till huvudinnehåll"
    >
      Hoppa till huvudinnehåll
    </a>
  );
};

export default SkipToContent;
