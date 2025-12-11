import { Rocket, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Hero = () => {
  return (
    <>
      <div className="text-center mb-16">
        <Badge className="bg-accent text-accent-foreground mb-4">Grundat 2025</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Om Bostadsvyn
        </h1>
        <p className="text-xl text-foreground font-medium max-w-4xl mx-auto leading-relaxed">
          Vi erbjuder en modern fastighetsplattform som kombinerar AI-teknologi med användarvänlig design för att förenkla och förbättra sökandet efter bostad för alla.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Vår Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed mb-4">
              Vi revolutionerar fastighetsmarknaden genom att förena avancerad teknologi med djup
              branschkunskap. Vårt mål är att skapa en transparent, effektiv och användarvänlig
              plattform som förenklar hela fastighetsprocessen.
            </p>
            <p className="text-foreground leading-relaxed">
              Med fokus på tillgänglighet och kvalitet levererar vi professionella verktyg och
              beslutsunderlag för privatpersoner, företag och fastighetsmäklare – oavsett om det
              gäller köp, försäljning eller uthyrning.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Rocket className="h-6 w-6 text-accent" />
              Vår Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed mb-4">
              Att bli den ledande fastighetsplattformen i Sverige genom att sätta nya standarder
              för användarvänlighet, transparens och professionalism. Vi skapar ett ekosystem där
              alla parter – köpare, säljare, mäklare och hyresvärdar – får tillgång till samma
              högkvalitativa verktyg och information.
            </p>
            <p className="text-foreground leading-relaxed">
              Genom kontinuerlig innovation och nära kontakt med branschen bygger vi framtidens
              fastighetsmarknad – en marknad som är mer rättvis, effektiv och tillgänglig för alla.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Hero;
