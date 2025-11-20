"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface RentalAdManagementProps {
  id: string;
}

const RentalAdManagement = ({ id }: RentalAdManagementProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Hantera uthyrning: {id}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Uthyrningshantering kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default RentalAdManagement;
