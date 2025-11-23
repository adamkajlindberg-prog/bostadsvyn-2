"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface SalesAdManagementProps {
  id: string;
}

const SalesAdManagement = ({ id }: SalesAdManagementProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Hantera försäljning: {id}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Försäljningshantering kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default SalesAdManagement;

