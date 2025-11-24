"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface AdManagementProps {
  id: string;
}

const AdManagement = ({ id }: AdManagementProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Hantera annons: {id}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Annonshantering kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default AdManagement;
