"use client";

import ContainerWrapper from "@/components/common/container-wrapper";
import PropertySearch from "@/components/property-search";

const EnhancedSearch = () => {
  return (
    <ContainerWrapper className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Smart sökning</h1>
        <p className="text-xl text-muted-foreground">
          Använd avancerade sökfilter för att hitta din drömbostad
        </p>
      </div>
      <PropertySearch />
    </ContainerWrapper>
  );
};

export default EnhancedSearch;
