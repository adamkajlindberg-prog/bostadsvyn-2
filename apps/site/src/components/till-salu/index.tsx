"use client";

import ContainerWrapper from "@/components/common/container-wrapper";
import PropertySearch from "@/components/property-search";

const TillSalu = () => {
  return (
    <ContainerWrapper className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Till salu</h1>
        <p className="text-xl text-muted-foreground">
          Sök efter bostäder till salu
        </p>
      </div>
      <PropertySearch />
    </ContainerWrapper>
  );
};

export default TillSalu;

