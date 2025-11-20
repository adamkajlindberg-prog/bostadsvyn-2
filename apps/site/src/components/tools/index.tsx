"use client";

import { BarChart3, Calculator } from "lucide-react";
import ContainerWrapper from "@/components/common/container-wrapper";
import PropertyComparison from "@/components/comparison/PropertyComparison";
import MortgageCalculator from "@/components/mortgage/MortgageCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Tools = () => {
  return (
    <ContainerWrapper className="py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Verktyg & Tjänster</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Kraftfulla verktyg för att hjälpa dig i din fastighetsresa
        </p>
      </div>

      <Tabs defaultValue="comparison" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Jämför fastigheter
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Lånekalkylator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <PropertyComparison />
        </TabsContent>

        <TabsContent value="calculator">
          <MortgageCalculator />
        </TabsContent>
      </Tabs>
    </ContainerWrapper>
  );
};

export default Tools;
