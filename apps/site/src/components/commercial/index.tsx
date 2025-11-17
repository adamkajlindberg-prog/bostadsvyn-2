import ContainerWrapper from "@/components/common/container-wrapper";
import BrowseCommercials from "./sections/browse-commercials";
import CommercialProperties from "./sections/commercial-properties";
import Hero from "./sections/hero";
import Highlights from "./sections/highlights";
import SearchCommercial from "./sections/search-commercial";
import Services from "./sections/services";

const Commercial = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <Hero />
        <SearchCommercial />
        <Highlights />
        <CommercialProperties />
        <Services />
        <BrowseCommercials />
      </ContainerWrapper>
    </div>
  );
};

export default Commercial;
