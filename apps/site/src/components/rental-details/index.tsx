"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface RentalDetailsProps {
  id: string;
}

const RentalDetails = ({ id }: RentalDetailsProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Hyresobjekt: {id}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Hyresobjektdetaljer kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default RentalDetails;

