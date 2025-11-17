import {
  AlertCircle,
  Award,
  Building2,
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Clock,
  Euro,
  Home,
  MapPin,
  PiggyBank,
  Ruler,
  Shield,
  Star,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryAISearch from "@/components/CategoryAISearch";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import NyproduktionMap from "@/components/NyproduktionMap";
import NyproduktionProperties from "@/components/NyproduktionProperties";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Nyproduktion = () => {
  const [search, _setSearch] = useState("");
  const [minPrice, _setMinPrice] = useState<string>("");
  const [maxPrice, _setMaxPrice] = useState<string>("");
  const [type, _setType] = useState<string>("ALL");
  const [sort, _setSort] = useState<"latest" | "price_asc" | "price_desc">(
    "latest",
  );
  const [_count, setCount] = useState(0);
  const minPriceNum = useMemo(
    () => (minPrice ? Number(minPrice) : undefined),
    [minPrice],
  );
  const maxPriceNum = useMemo(
    () => (maxPrice ? Number(maxPrice) : undefined),
    [maxPrice],
  );
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Nyproduktion - Nya lägenheter och villor | Bostadsvyn"
        description="Upptäck nya bostadsprojekt och kommande nyproduktion i hela Sverige. Få förtur och boka visning redan innan projekten lanseras officiellt."
        keywords="nyproduktion, nya lägenheter, nya villor, bostadsprojekt, kommande projekt, förtur, nybygge"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-premium rounded-lg p-3">
              <Building2 className="h-8 w-8 text-premium-foreground" />
            </div>
            <Badge className="bg-accent text-accent-foreground">
              Exklusiv förtur
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-premium bg-clip-text text-transparent">
            Nyproduktion & kommande projekt
          </h1>
          <p className="text-lg text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
            Bli först med att upptäcka och reservera din plats i Sveriges mest
            efterfrågade nyproduktionsprojekt. Från moderna lägenheter till
            exklusiva villor.
          </p>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <NyproduktionMap />
        </div>

        {/* AI Search Section */}
        <CategoryAISearch
          categoryType="nyproduktion"
          categoryLabel="Nyproduktion"
          categoryDescription="Vår AI förstår din sökning och prioriterar nyproduktionsprojekt. Om inga exakta matchningar finns visas liknande nybyggnadsobjekt baserat på dina kriterier."
          placeholder="Exempel: 4 rum och kök i Göteborg, inflyttning 2025, modern stil"
        />

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-premium mb-2">847</div>
              <p className="text-sm text-muted-foreground">Aktiva projekt</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2">23,500</div>
              <p className="text-sm text-muted-foreground">
                Kommande lägenheter
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">156</div>
              <p className="text-sm text-muted-foreground">
                Byggare & utvecklare
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-nordic-aurora mb-2">
                89%
              </div>
              <p className="text-sm text-muted-foreground">
                Slutsålda inom 1 år
              </p>
            </CardContent>
          </Card>
        </div>

        {/* All Properties Section */}
        <div className="mb-12">
          <NyproduktionProperties
            search={search}
            minPrice={minPriceNum}
            maxPrice={maxPriceNum}
            type={type}
            sort={sort}
            onCountChange={setCount}
          />
        </div>

        {/* Featured Projects */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Utvalda projekt</h2>
            <Badge className="bg-premium text-premium-foreground">
              Lanseras snart
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project 1 */}
            <Link to="/nyproduktion/nya-kajen" className="block">
              <Card className="overflow-hidden border-premium/20 hover:shadow-hover transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src="/lovable-uploads/6460350a-4407-412d-802c-ca99c2bfd9e3.png"
                    alt="Nya Kajen - Modernt bostadsprojekt vid vattnet"
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-premium text-premium-foreground">
                    Lanseras Q2 2025
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                    15% sålt
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Nya Kajen</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>Hammarby Sjöstad, Stockholm</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    127 moderna lägenheter med spektakulär sjöutsikt. Från 2-5
                    rum med egen balkong eller terrass.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Från 4,2M kr</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="text-sm">A+ energiklass</span>
                    </div>
                  </div>
                  <Button className="w-full bg-premium hover:bg-premium-dark">
                    <Calendar className="h-4 w-4 mr-2" />
                    Boka visning
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Project 2 */}
            <Link to="/nyproduktion/villastad-syd" className="block">
              <Card className="overflow-hidden border-accent/20 hover:shadow-hover transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src="/lovable-uploads/6460350a-4407-412d-802c-ca99c2bfd9e3.png"
                    alt="Villastad Syd - Exklusiva villor i naturnära miljö"
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Bygger nu
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-critical text-critical-foreground">
                    68% sålt
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Villastad Syd</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>Nacka, Stockholm</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    45 exklusiva villor i naturnära miljö. Moderna
                    arkitektoniska lösningar med hållbarhetsfokus.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Från 8,9M kr</span>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-success" />
                      <span className="text-sm">Solceller inkl.</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent/10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Intresseanmälan
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Project 3 */}
            <Link to="/nyproduktion/centrum-park" className="block">
              <Card className="overflow-hidden border-success/20 hover:shadow-hover transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src="/lovable-uploads/6460350a-4407-412d-802c-ca99c2bfd9e3.png"
                    alt="Centrum Park - Moderna lägenheter i hjärtat av Göteborg"
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-success text-success-foreground">
                    Inflyttning 2025
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    42% sålt
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Centrum Park</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>Centrum, Göteborg</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    89 lägenheter i hjärtat av Göteborg. Närhet till
                    kollektivtrafik och stadens alla faciliteter.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Från 3,1M kr</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">BRF bildad</span>
                    </div>
                  </div>
                  <Button className="w-full bg-success hover:bg-success-light">
                    <Clock className="h-4 w-4 mr-2" />
                    Se tillgängliga
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Important Information Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">
              Viktig information för nyproduktionsköpare
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Allt du behöver veta innan du investerar i nyproduktion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Purchase Process */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Köpprocess & Avtal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Förhandsavtal: Bindande efter 2 veckors ångerrätt
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Handpenning: Vanligen 10-15% vid avtalstecknande
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Slutbetalning: Vid överlämnande när projektet färdigställts
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Besiktning: Granska objektet innan slutbesiktning
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* BRF Information */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <Home className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">BRF & Avgifter</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Föreningen bildas under byggprocessen
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Euro className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Månadsavgift: Täcker drift, underhåll och eventuellt lån
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <PiggyBank className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Insatskapital: Initial avgift vid föreningsbildning
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Andelstal: Din andel av föreningens kostnader
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Financing */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 rounded-lg p-2">
                    <PiggyBank className="h-5 w-5 text-success" />
                  </div>
                  <CardTitle className="text-lg">Finansiering</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Bolån: Max 85% av köpesumman enligt Bolånelokket
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Euro className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Kontantinsats: Minst 15% av köpesumman
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Amorteringskrav: 2% vid belåning över 70%
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Lånelöfte: Säkra finansieringen innan avtalsteckning
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Warranties */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-premium/10 rounded-lg p-2">
                    <Shield className="h-5 w-5 text-premium" />
                  </div>
                  <CardTitle className="text-lg">Garantier</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Bygggaranti: 10 år på konstruktion och stomme
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Konsumentköplagen: 5 år på fel och brister
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Vitvaror: 2-5 år fabriksgaranti beroende på tillverkare
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Byggfelsförsäkring: Täcker större byggfel i 10 år
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <Ruler className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Val & Anpassningar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Standardval: Inkluderade val enligt byggbeskrivning
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Tillval: Uppgraderingar mot merkostnad
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Timer className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Tidsfrist: Oftast 6-12 månader innan inflyttning
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Begränsningar: Konstruktiva ändringar sällan tillåtna
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Energy & Environment */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 rounded-lg p-2">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                  <CardTitle className="text-lg">Energi & Miljö</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Energiklass: Nybyggnation kräver minst energiklass B
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Värmepump: Många projekt har bergvärme eller fjärrvärme
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Solceller: Allt vanligare i nyproduktion för
                    självförsörjning
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Laddning: Många projekt förbereds för elbilsladdning
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expert Tips */}

        {/* Benefits Section */}
      </main>

      <LegalFooter />
    </div>
  );
};
export default Nyproduktion;
