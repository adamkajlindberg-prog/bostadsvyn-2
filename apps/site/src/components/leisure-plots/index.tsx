import CategoryAISearch from "@/components/category-ai-search";
import ContainerWrapper from "@/components/common/container-wrapper";
import BrowseHomes from "./sections/browse-homes";
import FritidsMap from "./sections/fritids-map";
import Hero from "./sections/hero";
import HolidayHomes from "./sections/holiday-homes";
import ImportantInfo from "./sections/important-info";
import LeisureCategories from "./sections/leisure-categories";
import SearchPlots from "./sections/search-plots";
import TipsForBuyer from "./sections/tips-for-buyer";

const LeisurePlots = () => (
  <div className="@container">
    <ContainerWrapper className="py-10">
      {/* Hero Section */}
      <Hero />

      {/* Categories Overview */}
      <LeisureCategories />

      {/* Interactive Map */}
      <FritidsMap />

      {/* AI-Powered Search */}
      <CategoryAISearch
        categoryType="fritid"
        categoryLabel="Fritidshus & Tomter"
        categoryDescription="Vår AI förstår din sökning och prioriterar fritidshus och tomter. Om inga exakta matchningar finns visas liknande fritidsobjekt baserat på dina kriterier."
        placeholder="Exempel: Sommarstuga vid sjö i Dalarna, 3 sovrum, egen brygga"
      />

      {/* Manual Search Filters */}
      <SearchPlots />

      {/* Featured Holiday Homes */}
      <HolidayHomes />

      {/* Buyer Tips */}
      <TipsForBuyer />

      {/* Important Information for Buyers */}
      <ImportantInfo />

      {/* Call to Action */}
      <BrowseHomes />
    </ContainerWrapper>
  </div>
);

export default LeisurePlots;
