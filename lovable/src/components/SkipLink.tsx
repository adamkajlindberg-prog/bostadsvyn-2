const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium transition-all focus:ring-2 focus:ring-ring focus:ring-offset-2"
      tabIndex={0}
    >
      Hoppa till huvudinnehåll
    </a>
  );
};

export default SkipLink;
