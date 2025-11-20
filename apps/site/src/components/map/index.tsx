"use client";

import ContainerWrapper from "@/components/common/container-wrapper";
import PropertyMap from "@/components/property-map";
import PropertySearch from "@/components/property-search";

const Map = () => {
  return (
    <ContainerWrapper className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Karta</h1>
        <p className="text-xl text-muted-foreground">
          Utforska bostäder på kartan
        </p>
      </div>
      <div className="h-[600px] mb-8">
        <PropertyMap properties={[]} />
      </div>
      <PropertySearch />
    </ContainerWrapper>
  );
};

export default Map;
