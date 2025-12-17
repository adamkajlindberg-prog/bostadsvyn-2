import ContainerWrapper from "@/components/common/container-wrapper";
import AISearch from "./sections/ai-search";
import CommercialMap from "./sections/commercial-map";
import CommercialProperties from "./sections/commercial-properties";
import Hero from "./sections/hero";
import Highlights from "./sections/highlights";
import ImportantInfo from "./sections/important-info";
import Stats from "./sections/stats";

const Commercial = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <Hero />
        <CommercialMap />
        <AISearch />
        <Stats />
        <Highlights />
        <CommercialProperties />
        <ImportantInfo />
      </ContainerWrapper>
    </div>
  );
};

export default Commercial;
