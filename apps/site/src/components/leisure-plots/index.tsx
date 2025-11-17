import ContainerWrapper from "@/components/common/container-wrapper";
import BrowseHomes from "./sections/browse-homes";
import Hero from "./sections/hero";
import HolidayHomes from "./sections/holiday-homes";
import LeisureCategories from "./sections/leisure-categories";
import SearchPlots from "./sections/search-plots";
import TipsForBuyer from "./sections/tips-for-buyer";

const LeisurePlots = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <Hero />
        <SearchPlots />
        <LeisureCategories />
        <HolidayHomes />
        <TipsForBuyer />
        <BrowseHomes />
      </ContainerWrapper>
    </div>
  );
};

export default LeisurePlots;
