import {
  BarChart3,
  Bot,
  Brain,
  Calculator,
  CheckCircle2,
  Home,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const AITools = () => {
  const { user, userRoles } = useAuth();
  // Brokers don't get access to AI tools - they use their broker portal tools
  const isBroker = userRoles.includes("broker");
  const _canAccessTools = user && !isBroker;
  const _tools = [
    {
      id: "advisor",
      title: "AI Fastighetrådgivare",
      description: "Få expertråd om fastighetsmarknaden dygnet runt",
      icon: Bot,
      available: true,
      premium: false,
    },
    {
      id: "editor",
      title: "AI Bildredigering",
      description:
        "Redigera fastighetsbilder med AI - ändra färger, möbler och mer",
      icon: Wand2,
      available: true,
      premium: false,
      comingSoon: false,
    },
    {
      id: "homestyling",
      title: "AI Homestyling",
      description: "Visualisera olika inredningsstilar för dina rum med AI",
      icon: Home,
      available: true,
      premium: false,
      comingSoon: false,
    },
    {
      id: "analysis",
      title: "Marknadsanalys",
      description: "AI-drivna marknadsinsikter och prognoser",
      icon: BarChart3,
      available: true,
      premium: false,
      comingSoon: true,
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}

        {/* AI Tools Detailed Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <Badge className="bg-accent text-accent-foreground mb-4">
              <Brain className="h-4 w-4 mr-2" />
              Artificiell Intelligens
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Våra AI-verktyg
            </h2>
            <p className="text-foreground font-medium max-w-3xl mx-auto text-lg">
              Vi har utvecklat en omfattande svit av AI-verktyg som
              revolutionerar hur du köper, säljer och hyr fastigheter. Alla
              verktyg är integrerade för en sömlös upplevelse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-accent/10 rounded-lg p-3">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">AI-Homestyling</h3>
                  </div>
                </div>
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  Revolutionera hur du marknadsför och visualiserar fastigheter
                  med vår AI-drivna homestyling. Transformera tomma eller
                  daterade rum till fullt inredda, moderna drömhem på sekunder.
                  Perfekt för både säljare som vill visa en bostads potential
                  och köpare som vill visualisera olika inredningsalternativ
                  innan de fattar beslut.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>
                      Renoveringar och tillbyggnader: trappor, garderober,
                      förråd och förvaring
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>
                      Lyxiga tillägg: inomhuspool, spa-avdelning, bastu och
                      relaxutrymmen
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>
                      Ytskikt och finish: byt golv, tak, väggar och färger
                      fotorealistiskt
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>
                      Köksrenovering: nya köksluckor, vitvaror, bänkskivor och
                      känsla
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>
                      Möblering: möblera tomma rum eller ta bort möbler helt
                      digitalt
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>
                      Belysning och atmosfär: lägg till och ändra belysning för
                      perfekt känsla
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">AI Bildredigering</h3>
                  </div>
                </div>
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  Transformera och förbättra fastighetsbilder med avancerad
                  AI-teknologi. Visualisera renoveringar, tillbyggnader och
                  förändringar innan du genomför dem i verkligheten. Skapa
                  inspirerande bilder som visar en fastighets fulla potential
                  och hjälper köpare att se möjligheterna. Perfekt för att
                  planera investeringar och få fastighetsägare att förstå värdet
                  av förbättringar.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Lyxiga tillägg: pooler, spa, terrasser, uteplatser,
                      balkonger och altaner
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Utbyggnader: garage, attefallshus, carport, förråd och
                      våningsplan
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Fasadförändringar: byt tak, fasad, fönster, dörrar, entrè
                      och färger
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Landskapsdesign: förbättra trädgårdar, lägg till
                      vegetation, staket och infarter
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Ta bort eller ändra oönskade element</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Skriv i chatten och få resultat på någon sekund</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-premium/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-premium/10 rounded-lg p-3">
                    <Calculator className="h-6 w-6 text-premium" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    AI Fastighetsvärdering
                  </h3>
                </div>
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  Få exakta och datadrivna värderingar baserade på avancerad
                  maskinlärning som analyserar miljontals datapunkter. Vår AI
                  kombinerar realtidsdata från hela Sverige, historiska priser,
                  områdesutveckling, infrastruktur, och marknadsanalyser för att
                  ge dig den mest korrekta värderingen. Inklusive
                  konfidensintervall, prisutvecklingsprognoser och detaljerade
                  jämförelser med liknande försäljningar.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-premium" />
                    <span>
                      Realtidsvärderingar med 95% noggrannhet baserat på aktuell
                      marknadsdata
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-premium" />
                    <span>
                      Prisförutsägelser 6-12 månader framåt med trendanalys
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-premium" />
                    <span>Jämförelser med liknande objekt i närområdet</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-premium" />
                    <span>
                      Detaljerad områdesanalys och infrastrukturutveckling
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-premium" />
                    <span>Konfidensintervall som visar värderingssäkerhet</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-premium" />
                    <span>
                      Kontinuerlig uppdatering när ny marknadsdata tillkommer
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success/10 rounded-lg p-3">
                    <Bot className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    AI Fastighetsrådgivare
                  </h3>
                </div>
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  Din personliga AI-assistent med djup kunskap om svensk
                  fastighetsmarknad, juridik och ekonomi. Få professionell
                  vägledning genom hela köp-, sälj- eller uthyrningsprocessen
                  med expertråd och personliga rekommendationer anpassade efter
                  din unika situation. Rådgivaren lär sig dina preferenser och
                  blir bättre för varje interaktion, och kan svara på allt från
                  enkla frågor till komplexa juridiska och ekonomiska scenarier.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>
                      24/7 tillgänglig expertis - få svar när du behöver dem
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>
                      Personliga rekommendationer baserade på din ekonomi och
                      behov
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>
                      Hjälp med budgivning, finansiering och juridiska frågor
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Skatteoptimering och investeringsstrategier</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Analys av hyreskontrakt och villkor</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Kostnadsprognoser och budgetplanering</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-nordic-aurora/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-nordic-aurora/10 rounded-lg p-3">
                    <BarChart3 className="h-6 w-6 text-nordic-aurora" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Marknadsanalys</h3>
                </div>
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  Avancerad marknadsanalys som ger dig konkurrensfördel i din
                  fastighetsaffär. Vår AI analyserar miljontals transaktioner,
                  demografisk data, infrastrukturutveckling och ekonomiska
                  indikatorer för att ge dig djupgående insikter om marknaden.
                  Identifiera framtida tillväxtområden, förstå priscykler och få
                  exakta prognoser för att fatta de bästa investeringsbesluten.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-aurora" />
                    <span>
                      Detaljerade områdesanalyser med 10 års prishistorik
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-aurora" />
                    <span>
                      Jämför med tusentals liknande försäljningar i realtid
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-aurora" />
                    <span>
                      Prognoser för framtida prisutveckling per område
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-aurora" />
                    <span>Demografisk analys och befolkningstrender</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-aurora" />
                    <span>
                      Identifiera undervärderade områden med hög
                      tillväxtpotential
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-aurora" />
                    <span>Analys av liggdagar och försäljningshastighet</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-nordic-fjord/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-nordic-fjord/10 rounded-lg p-3">
                    <Search className="h-6 w-6 text-nordic-fjord" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Sökassistent</h3>
                </div>
                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  En intelligent sökmotor som revolutionerar hur du hittar din
                  drömbostad. Vår AI lär sig kontinuerligt från ditt beteende,
                  dina klick, sparade objekt och sökhistorik för att automatiskt
                  förstå vad som är viktigt för dig. Den upptäcker mönster du
                  kanske inte ens är medveten om själv och rekommenderar
                  bostäder som perfekt matchar dina behov innan du ens hinner
                  söka efter dem.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-fjord" />
                    <span>
                      Maskinlärning som förstår dolda preferenser från ditt
                      beteende
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-fjord" />
                    <span>
                      Proaktiva notifikationer när perfekta bostäder läggs ut
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-fjord" />
                    <span>
                      Semantisk sökning - beskriv med egna ord vad du söker
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-fjord" />
                    <span>
                      Prioritering baserad på sannolikhet att du gillar objektet
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-fjord" />
                    <span>
                      Hitta dolda pärlor som andra missar i sökresultaten
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-nordic-fjord" />
                    <span>
                      Automatiska sparade sökningar med intelligent matchning
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};
export default AITools;
