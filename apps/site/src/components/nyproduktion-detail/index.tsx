"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface NyproduktionDetailProps {
  projectId: string;
}

const NyproduktionDetail = ({ projectId }: NyproduktionDetailProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Nyproduktion: {projectId}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Nyproduktionsdetaljer kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default NyproduktionDetail;
