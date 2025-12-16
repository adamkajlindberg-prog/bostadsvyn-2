import LazyLoadWrapper from "@/components/common/lazy-load-wrapper";
import About from "./sections/about";
import AiTutorials from "./sections/ai-tutorials";
import Feature from "./sections/features";
import Hero from "./sections/hero";
import Properties from "./sections/properties";
import Tutorials from "./sections/tutorials";

const LandingContent = () => {
  return (
    <div className="@container w-full overflow-x-hidden">
      <Hero />
      <About />
      <LazyLoadWrapper minHeight={400}>
        <Tutorials />
      </LazyLoadWrapper>
      <LazyLoadWrapper minHeight={600}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <Feature />
        </div>
      </LazyLoadWrapper>
      <LazyLoadWrapper minHeight={600}>
        <div className="bg-nordic-ice py-14 @lg:py-16 px-4 sm:px-6 @lg:px-8 @8xl:px-0 hidden w-full">
          <Properties />
        </div>
      </LazyLoadWrapper>
    </div>
  );
};

export default LandingContent;
