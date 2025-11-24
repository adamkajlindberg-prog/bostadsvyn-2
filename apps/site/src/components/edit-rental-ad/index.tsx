"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface EditRentalAdProps {
  adId: string;
}

const EditRentalAd = ({ adId }: EditRentalAdProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Redigera hyresannons: {adId}
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Redigera hyresannons kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default EditRentalAd;
