import CategoryAISearch from "@/components/category-ai-search";
import ContainerWrapper from "@/components/common/container-wrapper";
import FritidsMap from "./sections/fritids-map";
import Hero from "./sections/hero";
import ImportantInfo from "./sections/important-info";

const LeisurePlots = () => (
  <div className="@container">
    <ContainerWrapper className="py-10">
      {/* Hero Section */}
      <Hero />

      {/* Interactive Map */}
      <FritidsMap />

      {/* AI-Powered Search */}
      <CategoryAISearch
        categoryType="fritid"
        categoryLabel="Fritidshus & Tomter"
        categoryDescription="Vår AI förstår din sökning och prioriterar fritidshus och tomter. Om inga exakta matchningar finns visas liknande fritidsobjekt baserat på dina kriterier."
        placeholder="Exempel: Sommarstuga vid sjö i Dalarna, 3 sovrum, egen brygga"
      />

      {/* Important Information for Buyers */}
      <ImportantInfo />
    </ContainerWrapper>
  </div>
);

export default LeisurePlots;
