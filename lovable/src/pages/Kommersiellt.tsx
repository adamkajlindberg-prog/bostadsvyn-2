import {
  AlertCircle,
  BarChart3,
  Briefcase,
  Building,
  Calculator,
  CheckCircle,
  Clock,
  Euro,
  Factory,
  FileText,
  MapPin,
  Scale,
  Shield,
  Store,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import CategoryAISearch from "@/components/CategoryAISearch";
import CommercialMap from "@/components/CommercialMap";
import CommercialProperties from "@/components/CommercialProperties";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Kommersiellt = () => {
  const [search, _setSearch] = useState("");
  const [type, _setType] = useState<string>("ALL");
  const [minArea, _setMinArea] = useState<string>("");
  const [maxArea, _setMaxArea] = useState<string>("");
  const [status, _setStatus] = useState<string>("ALL");
  const minAreaNum = useMemo(
    () => (minArea ? Number(minArea) : undefined),
    [minArea],
  );
  const maxAreaNum = useMemo(
    () => (maxArea ? Number(maxArea) : undefined),
    [maxArea],
  );
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Kommersiella fastigheter - Kontor, butiker och industrilokaler | Bostadsvyn"
        description="Hitta kommersiella fastigheter för ditt företag. Kontor, butiker, lager, industrilokaler och investeringsobjekt i hela Sverige."
        keywords="kommersiella fastigheter, kontor, butiker, lager, industrilokaler, investeringsfastigheter, näringsfastigheter"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-premium rounded-lg p-3">
              <Briefcase className="h-8 w-8 text-premium-foreground" />
            </div>
            <Badge className="bg-accent text-accent-foreground">
              Professionella lösningar
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-premium bg-clip-text text-transparent">
            Kommersiella fastigheter
          </h1>
          <p className="text-lg text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
            Hitta den perfekta kommersiella fastigheten för ditt företag. Från
            moderna kontor och strategiskt placerade butiker till
            industrilokaler och investeringsobjekt.
          </p>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <CommercialMap />
        </div>

        {/* AI Search Section */}
        <CategoryAISearch
          categoryType="kommersiell"
          categoryLabel="Kommersiella fastigheter"
          categoryDescription="Vår AI förstår din sökning och prioriterar kommersiella fastigheter. Om inga exakta matchningar finns visas liknande kommersiella objekt baserat på dina kriterier."
          placeholder="Exempel: Kontorslokal 200 kvm i centrala Stockholm, moderna faciliteter"
        />

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-premium mb-2">8,450</div>
              <p className="text-sm text-muted-foreground">
                Kommersiella objekt
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2">
                1,2M m²
              </div>
              <p className="text-sm text-muted-foreground">Tillgänglig yta</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-accent mb-2">340</div>
              <p className="text-sm text-muted-foreground">Aktiva mäklare</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-nordic-aurora mb-2">
                94%
              </div>
              <p className="text-sm text-muted-foreground">Klientnöjdhet</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Filters */}

        {/* Property Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-premium/20 hover:border-premium/40 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-premium/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-premium" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Kontor</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Moderna kontorslokaler i attraktiva lägen
              </p>
              <Badge className="bg-premium/20 text-premium">
                3,240 lokaler
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Butiker & Handel</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Butikslokaler i stadskärnor och köpcentrum
              </p>
              <Badge className="bg-accent/20 text-accent">2,180 lokaler</Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-success/20 hover:border-success/40 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Factory className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lager & Industri</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Stora ytor för produktion och logistik
              </p>
              <Badge className="bg-success/20 text-success">
                1,890 lokaler
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-2 border-nordic-aurora/20 hover:border-nordic-aurora/40 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-nordic-aurora/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-nordic-aurora" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Investering</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Lönsamma investeringsobjekt för portföljer
              </p>
              <Badge className="bg-nordic-aurora/20 text-nordic-aurora">
                1,140 objekt
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Featured Properties */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Utvalda kommersiella fastigheter
            </h2>
            <Badge variant="outline">Exklusiva objekt</Badge>
          </div>

          <CommercialProperties
            search={search}
            type={type}
            status={status}
            minArea={minAreaNum}
            maxArea={maxAreaNum}
          />
        </div>

        {/* Important Information Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">
              Viktig information för företag och investerare
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Allt du behöver veta för att göra rätt kommersiella
              fastighetsinvestering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Legal Aspects */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Juridik & Avtal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Hyresavtal: Standard, Triple Net eller Turnover-baserad hyra
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Hyrestid: Kommersiella avtal vanligen 3-10 år med option
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Besittningsskydd: Begränsat för kommersiella hyresgäster
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Due diligence: Grundlig granskning av fastighet och avtal
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Economic Analysis */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 rounded-lg p-2">
                    <Calculator className="h-5 w-5 text-success" />
                  </div>
                  <CardTitle className="text-lg">Ekonomisk Kalkyl</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Euro className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Direktavkastning: Nettodriftsintäkt / Köpeskilling (4-8%
                    typiskt)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Driftsnetton: Hyresintäkter minus driftskostnader
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Calculator className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Kassaflödesanalys: Prognostisera inkomster och utgifter
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Värdering: Ortsprismetod, avkastningsmetod,
                    produktionskostnad
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location Analysis */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Läge & Marknad</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Lägesanalys: Trafik, synlighet, konkurrenter,
                    tillväxtpotential
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Demografi: Målgrupp, köpkraft och befolkningsutveckling
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Vakansgrad: Lokalt utbud och efterfrågan i området
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Konkurrensanalys: Befintliga och planerade objekt
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Operating Costs */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-premium/10 rounded-lg p-2">
                    <Euro className="h-5 w-5 text-premium" />
                  </div>
                  <CardTitle className="text-lg">Driftskostnader</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Energi: Värme, el, ventilation (ofta 15-25% av driftsnetto)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Underhåll: Planerat och akut, 10-15% av hyresintäkter
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Försäkring: Fastighet, ansvar och hyresförlust
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Administration: Förvaltning, revision, ekonomi (3-5%)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Permits & Regulations */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-critical/10 rounded-lg p-2">
                    <FileText className="h-5 w-5 text-critical" />
                  </div>
                  <CardTitle className="text-lg">Tillstånd & Regler</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Detaljplan: Tillåten användning och byggrätt
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Bygglov: Krävs för om- eller tillbyggnad
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Miljötillstånd: För verksamheter med miljöpåverkan
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Serveringstillstånd: För restauranger och caféer
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Investment Strategy */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">
                    Investeringsstrategi
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Core: Stabila objekt i bra lägen, låg risk (4-6% avkastning)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Value-add: Förbättringspotential, medelhög risk (8-12%)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Opportunistic: Utvecklingsprojekt, hög risk (15%+)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Diversifiering: Sprid risk över olika segment och geografier
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expert Tips */}

        {/* Services Section */}

        {/* CTA Section */}
      </main>

      <LegalFooter />
    </div>
  );
};
export default Kommersiellt;
