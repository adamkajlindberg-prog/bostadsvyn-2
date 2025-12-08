/**
 * SkipToContent component provides keyboard users with a quick way to skip navigation
 * and jump directly to the main content. This is a WCAG 2.4.1 (Level A) requirement.
 *
 * The link is visually hidden by default but becomes visible when focused with Tab key.
 *
 * Usage: Add this component as the first child of your body/layout, and ensure your
 * main content has id="main-content".
 *
 * @example
 * ```tsx
 * <body>
 *   <SkipToContent />
 *   <Header />
 *   <main id="main-content">...</main>
 * </body>
 * ```
 */
const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all text-sm font-medium"
      aria-label="Hoppa till huvudinnehåll"
    >
      Hoppa till huvudinnehåll
    </a>
  );
};

export default SkipToContent;
