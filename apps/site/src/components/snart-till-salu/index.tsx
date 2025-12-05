"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

// Temporarily commented some code out to fix build issues that has something to do with <PropertySearch /> component
// import PropertySearch from "@/components/property-search";

const SnartTillSalu = () => {
  return (
    <ContainerWrapper className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Snart till salu</h1>
        <p className="text-xl text-muted-foreground">
          Bostäder som snart kommer att säljas
        </p>
      </div>
      {/* <PropertySearch /> */}
    </ContainerWrapper>
  );
};

export default SnartTillSalu;
