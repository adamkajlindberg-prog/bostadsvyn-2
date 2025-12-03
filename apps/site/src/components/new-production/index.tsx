import CategoryAISearch from "@/components/category-ai-search";
import ContainerWrapper from "@/components/common/container-wrapper";
import Hero from "./sections/hero";
import ImportantInformation from "./sections/important-information";
import NyproduktionMap from "./sections/map";
import Projects from "./sections/projects";
import Properties from "./sections/properties";

const NewProduction = () => {
  return (
    <div className="min-h-screen bg-background">
      <ContainerWrapper className="py-8">
        <Hero />

        {/* Map Section */}
        <div className="mb-8">
          <NyproduktionMap />
        </div>

        {/* AI Search Section */}
        <CategoryAISearch
          categoryType="nyproduktion"
          categoryLabel="Nyproduktion"
          categoryDescription="Vår AI förstår din sökning och prioriterar nyproduktionsprojekt. Om inga exakta matchningar finns visas liknande nybyggnadsobjekt baserat på dina kriterier."
          placeholder="Exempel: 4 rum och kök i Göteborg, inflyttning 2025, modern stil"
        />

        {/* All Properties Section */}
        <div className="mb-12">
          <Properties />
        </div>

        {/* Featured Projects */}
        <div className="mb-12">
          <Projects />
        </div>

        {/* Important Information Section */}
        <ImportantInformation />
      </ContainerWrapper>
    </div>
  );
};

export default NewProduction;
