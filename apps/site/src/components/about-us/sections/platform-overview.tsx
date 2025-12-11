import { Brain, Home, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PlatformOverview = () => {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Vår plattform</h2>
        <p className="text-foreground max-w-3xl mx-auto text-lg">
          Vi bygger en fastighetsplattform med moderna verktyg och funktioner.
          Här är våra huvudsakliga fokusområden och planerade funktioner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-accent/10 rounded-lg p-3">
                <Home className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Brett bostadsutbud</h3>
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-3">
              Vi arbetar för att erbjuda olika typer av bostäder i både Sverige och utlandet på en och samma plattform - från villor och lägenheter till hyresbostäder och kommersiellt.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 rounded-lg p-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Modern AI-teknologi</h3>
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-3">
              Vi utvecklar AI-verktyg för bildredigering, homestyling och marknadsanalys
              som ska ge användare bättre beslutsunderlag för sina fastighetsaffärer.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/20 hover:border-success/40 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-success/10 rounded-lg p-3">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold">Säkerhet & trygghet</h3>
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-3">
              BankID-verifiering, GDPR-efterlevnad, manuell moderering av annonser och
              digitala avtal med juridisk säkerhet för alla transaktioner.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformOverview;
