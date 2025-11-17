import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Crown,
  Eye,
  FileCheck,
  Gauge,
  HeartHandshake,
  Landmark,
  MapPin,
  Network,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import PricingPlans from "@/components/ads/PricingPlans";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TEST_LISTING_PROPERTIES } from "@/data/testProperties";

const Salj = () => {
  // Använd samma property för alla tre exempel så att skillnaden mellan paketen blir tydlig
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const baseProperty = {
    ...TEST_LISTING_PROPERTIES[0],
    viewing_times: [
      {
        date: tomorrowStr,
        time: "18:00-19:00",
        status: "scheduled" as const,
        spots_available: 8,
      },
    ],
  } as unknown as Property;
  const premiumExample = {
    ...baseProperty,
    ad_tier: "premium",
  } as Property;
  const plusExample = {
    ...baseProperty,
    ad_tier: "plus",
  } as Property;
  const freeExample = {
    ...baseProperty,
    ad_tier: "free",
  } as Property;
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Sälj din bostad - AI-verktyg och professionella mäklare | Bostadsvyn"
        description="Sälj din bostad snabbt och till bästa pris. AI-drivna verktyg för homestyling, prissättning och marknadsföring. Anslut till Sveriges bästa mäklare."
        keywords="sälja bostad, mäklare, AI homestyling, bostad värdering, fastighetsannons, sälja villa, sälja lägenhet"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Ad Tier Comparison Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="gold" className="mb-5 px-5 py-2 text-base">
              <Eye className="h-5 w-5 mr-2" />
              Jämför paketen
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Se skillnaden mellan våra paket
            </h2>
            <p className="text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Samma bostad, samma text och bild - men stor skillnad i synlighet
              och funktioner
            </p>
          </div>

          <div className="space-y-16">
            {/* Premium/Exklusiv Example */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-premium/20 to-premium/10 rounded-xl p-3 shadow-md">
                  <Crown className="h-6 w-6 text-premium" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    Exklusivpaket - 3995 kr
                  </h3>
                  <p className="text-muted-foreground">
                    Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse
                    varje månad
                  </p>
                </div>
              </div>
              <Card className="shadow-xl bg-gradient-to-br from-premium/10 to-card border-premium/30">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Maximerad synlighet
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>
                          • Allt som ingår i Pluspaketet + största annonsen
                        </li>
                        <li>• Hamnar över Pluspaketet i publiceringslistan</li>
                        <li>• Exklusiv-badge som sticker ut</li>
                        <li>• Kostnadsfri förnyelse varje månad</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Exklusiva AI-verktyg
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>
                          • AI-Bildredigering som levererar otroliga resultat
                        </li>
                        <li>
                          • Unik AI-statistik i mäklarens och säljarens
                          kundportal
                        </li>
                        <li>
                          • Detaljerad intressestatistik för mäklare och säljare
                        </li>
                        <li>• Mest trafik till annonsen</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <PropertyCard
                      property={premiumExample}
                      size="large"
                      disableClick={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plus Example */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-3 shadow-md">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Pluspaket - 1995 kr</h3>
                  <p className="text-muted-foreground">
                    Större annons med kostnadsfri förnyelse varje månad
                  </p>
                </div>
              </div>
              <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-card border-accent/30">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Ökad synlighet
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Allt som ingår i Grundpaketet + större annons</li>
                        <li>• Hamnar över Grundpaketet i publiceringslistan</li>
                        <li>• Plus-badge</li>
                        <li>• Kostnadsfri förnyelse varje månad</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <PropertyCard property={plusExample} disableClick={true} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Free/Grund Example */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl p-3 shadow-md">
                  <Star className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Grundpaket - Gratis</h3>
                  <p className="text-muted-foreground">
                    Kostnadsfri grundannons för alla
                  </p>
                </div>
              </div>
              <Card className="shadow-xl">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Grundläggande publicering
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Standard annonsformat</li>
                        <li>• Tillhörande statistik för mäklare och säljare</li>
                        <li>
                          • Bläddra genom alla bilder utan att gå in på annonsen
                        </li>
                        <li>• Fri publicering för alla säljare</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <PropertyCard property={freeExample} disableClick={true} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 text-center"></div>
        </div>

        {/* Selling Process */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-5 px-5 py-2 text-base">
              <Target className="h-5 w-5 mr-2" />
              Försäljningsprocessen
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Din väg till en framgångsrik försäljning
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              En strukturerad process i 5 steg som kombinerar moderna AI-verktyg
              med professionella mäklares expertis
            </p>
          </div>
          <Card className="shadow-2xl border-primary/30 bg-gradient-to-br from-card to-card/50">
            <CardContent className="py-10 px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="text-center relative">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Gauge className="text-primary h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">Värdera din bostad</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Få en kostnadsfri AI-driven värdering baserad på aktuella
                    marknadsdata, jämförbara försäljningar och områdesfaktorer
                  </p>
                  <div className="absolute -right-4 top-8 hidden lg:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                </div>

                <div className="text-center relative">
                  <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Award className="text-accent h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">Hitta rätt mäklare</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Få rekommendationer baserat på mäklarens specialisering,
                    tidigare försäljningar, kundbetyg och lokalkännedom i ditt
                    område
                  </p>
                  <div className="absolute -right-4 top-8 hidden lg:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                </div>

                <div className="text-center relative">
                  <div className="bg-gradient-to-br from-premium/20 to-premium/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Sparkles className="text-premium h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">
                    Skapa professionell annons
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Din mäklare skapar en attraktiv annons med professionella
                    bilder, säljande texter och all nödvändig information om
                    bostaden
                  </p>
                  <div className="absolute -right-4 top-8 hidden lg:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                </div>

                <div className="text-center relative">
                  <div className="bg-gradient-to-br from-success/20 to-success/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Network className="text-success h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">Bred exponering</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Din bostad marknadsförs till aktiva bostadssökare genom
                    smart matchning och notifikationer till användare som söker
                    liknande bostäder
                  </p>
                  <div className="absolute -right-4 top-8 hidden lg:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-nordic-aurora/20 to-nordic-aurora/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <TrendingUp className="text-nordic-aurora h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">
                    Optimera försäljningen
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Följ intresse i realtid och få statistik över visningar,
                    sparade annonser och AI användning för att optimera din
                    försäljningsstrategi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Broker Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-5 px-5 py-2 text-base">
              <Shield className="h-5 w-5 mr-2" />
              Certifierat mäklarnätverk
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Professionella mäklare med dokumenterad erfarenhet
            </h2>
            <p className="text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Samarbeta med certifierade fastighetsmäklare som är specialiserade
              på att maximera försäljningsvärdet
            </p>
          </div>
          <Card className="shadow-2xl bg-gradient-to-br from-accent/10 via-success/5 to-card border-accent/30">
            <CardContent className="p-10">
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                På Bostadsvyn kan endast certifierade och auktoriserade
                fastighetsmäklare publicera försäljningsannonser. Detta
                säkerställer professionell hantering enligt
                fastighetsförmedlingslagen och att du får kvalificerad support
                genom hela processen. Mäklarna, säljarna och spekulanterna får
                tillgång till våra AI-verktyg för att enkelt kunna göra
                försäljnings och köpprocessen mer njutbar för alla parter.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-success/10 rounded-xl p-3 shadow-md">
                    <Landmark className="h-6 w-6 text-success flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">
                      Certifierade fastighetsmäklare
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Alla mäklare är licensierade med registrering hos
                      Fastighetsmäklarinspektionen och fullständig
                      ansvarsförsäkring
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-premium/10 rounded-xl p-3 shadow-md">
                    <Zap className="h-6 w-6 text-premium flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">
                      AI-verktyg för alla
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Tillgång till AI-verktyg för homestyling, bildredigering,
                      pris och marknadsanalys för att hjälpa alla parter 
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 rounded-xl p-3 shadow-md">
                    <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">
                      Smart matchning
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Vi hjälper dig hitta mäklare baserat på deras
                      specialområde, tidigare försäljningar, kundbetyg och
                      lokalkännedom i ditt område
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-nordic-aurora/10 rounded-xl p-3 shadow-md">
                    <FileCheck className="h-6 w-6 text-nordic-aurora flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">
                      Verifierade omdömen
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Mäklare har kundrecensioner och betyg från tidigare
                      försäljningar för ökad transparens och trygghet
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-xl p-3 shadow-md">
                    <BarChart3 className="h-6 w-6 text-primary flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">
                      Transparent statistik
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Se statistik över mäklarens tidigare försäljningar,
                      genomsnittlig försäljningstid och prisnivåer i området
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-success/10 rounded-xl p-3 shadow-md">
                    <HeartHandshake className="h-6 w-6 text-success flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-2">
                      Personlig rådgivning
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Få individuell konsultation med råd om styling,
                      prispositionering och marknadsföring anpassat efter din
                      bostad
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans Section */}
        <div className="mb-20">
          <PricingPlans />
        </div>

        {/* Detailed AI Tools Section */}

        {/* Why Choose Section */}

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-success via-accent to-primary text-white text-center shadow-2xl border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
        </Card>
      </main>

      <LegalFooter />
    </div>
  );
};
export default Salj;
