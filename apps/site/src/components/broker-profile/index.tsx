"use client";

import ContainerWrapper from "@/components/common/container-wrapper";

interface BrokerProfileProps {
  brokerId: string;
}

const BrokerProfile = ({ brokerId }: BrokerProfileProps) => {
  return (
    <ContainerWrapper className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Mäklare: {brokerId}</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Mäklarprofil kommer snart
        </p>
      </div>
    </ContainerWrapper>
  );
};

export default BrokerProfile;

