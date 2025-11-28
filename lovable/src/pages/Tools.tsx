import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import PropertyComparison from '@/components/comparison/PropertyComparison';
import MortgageCalculator from '@/components/mortgage/MortgageCalculator';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Calculator
} from 'lucide-react';

const Tools = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
            Verktyg & Tjänster
          </h1>
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
      </main>
      <LegalFooter />
    </div>
  );
};

export default Tools;