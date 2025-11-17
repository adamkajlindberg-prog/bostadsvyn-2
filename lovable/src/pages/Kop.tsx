import {
  Building,
  Filter,
  Home,
  MapPin,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Kop = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Köp bostad - Lägenheter, villor och bostadsrätter till salu | Bostadsvyn"
        description="Hitta din drömbostad bland tusentals lägenheter, villor och bostadsrätter. AI-drivna rekommendationer och marknadsanalys hjälper dig att fatta rätt beslut."
        keywords="köp bostad, lägenheter till salu, villor, bostadsrätter, fastigheter, Stockholm, Göteborg, Malmö"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary rounded-lg p-3">
              <ShoppingCart className="h-8 w-8 text-primary-foreground" />
            </div>
            <Badge className="bg-success text-success-foreground">
              Över 125,000 annonser
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
            Köp din drömbostad
          </h1>
          <p className="text-xl text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
            Upptäck tusentals lägenheter, villor och bostadsrätter i hela
            Sverige. Våra AI-drivna verktyg hjälper dig att hitta perfekta
            bostaden och fatta smarta beslut.
          </p>
        </div>

        {/* Advanced Search Filters */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Avancerad sökning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Område</label>
                <Input placeholder="Stockholm, Göteborg, Malmö..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Bostadstyp
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Lägenhet</SelectItem>
                    <SelectItem value="house">Villa</SelectItem>
                    <SelectItem value="townhouse">Radhus</SelectItem>
                    <SelectItem value="condo">Bostadsrätt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Prisintervall
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj pris" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2000000">Under 2 miljoner</SelectItem>
                    <SelectItem value="2000000-4000000">
                      2-4 miljoner
                    </SelectItem>
                    <SelectItem value="4000000-6000000">
                      4-6 miljoner
                    </SelectItem>
                    <SelectItem value="6000000+">Över 6 miljoner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Antal rum
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj rum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 rum</SelectItem>
                    <SelectItem value="2">2 rum</SelectItem>
                    <SelectItem value="3">3 rum</SelectItem>
                    <SelectItem value="4">4 rum</SelectItem>
                    <SelectItem value="5+">5+ rum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="bg-primary hover:bg-primary-deep">
                <Filter className="h-4 w-4 mr-2" />
                Sök fastigheter
              </Button>
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Visa på karta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-accent/20">
            <CardContent className="p-6 text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Prisanalys</h3>
              <p className="text-muted-foreground text-sm">
                Få AI-drivna värderingar och marknadsanalyser för att fatta
                smarta köpbeslut
              </p>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardContent className="p-6 text-center">
              <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Personliga Rekommendationer
              </h3>
              <p className="text-muted-foreground text-sm">
                AI-algoritmer som lär sig dina preferenser och föreslår perfekta
                bostäder
              </p>
            </CardContent>
          </Card>

          <Card className="border-premium/20">
            <CardContent className="p-6 text-center">
              <div className="bg-premium/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-premium" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Virtuell Homestyling
              </h3>
              <p className="text-muted-foreground text-sm">
                Se hur bostaden kan se ut med AI-genererad inredning och
                renoveringar
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
};

export default Kop;
