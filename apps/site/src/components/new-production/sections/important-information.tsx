import {
  AlertCircle,
  Award,
  CheckCircle,
  ClipboardCheck,
  Home,
  PiggyBank,
  Ruler,
  Shield,
  Star,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImportantInformation = () => {
  return (
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
              <TrendingUp className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
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
              <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
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
                Solceller: Allt vanligare i nyproduktion för självförsörjning
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
  );
};

export default ImportantInformation;
