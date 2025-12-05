import About from "./sections/about";
import AiTutorials from "./sections/ai-tutorials";
import Feature from "./sections/features";
import Hero from "./sections/hero";

const LandingContent = () => {
  return (
    <div className="@container">
      <Hero />
      <div className="pt-20 pb-14 bg-gradient-to-b from-nordic-ice to-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <About />
          <AiTutorials />
          <Feature />
        </div>
      </div>
    </div>
  );
};

export default LandingContent;
