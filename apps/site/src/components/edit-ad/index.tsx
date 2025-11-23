"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface EditAdProps {
  adId: string;
}

const EditAd = ({ adId }: EditAdProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Redigera annons: {adId}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Redigera annons kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default EditAd;

