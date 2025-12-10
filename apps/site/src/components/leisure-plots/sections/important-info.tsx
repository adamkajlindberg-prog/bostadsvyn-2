import {
  AlertCircle,
  Award,
  Building,
  CheckCircle,
  Clock,
  Droplet,
  Euro,
  FileText,
  Leaf,
  MapPin,
  Shield,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImportantInfo = () => {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Viktig information för fritidshusköpare
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Allt du behöver veta innan du investerar i en fritidsbostad eller tomt
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Regulations & Permits */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Tillstånd & Bygglov</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Kontrollera detaljplan och områdesbestämmelser hos kommunen
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Verifiera byggrätt och maximal byggnadsarea
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Undersök strandskyddsbestämmelser (minst 100m från strand)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Kontrollera allemansrättsliga begränsningar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/10 rounded-lg p-2">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <CardTitle className="text-lg">Infrastruktur</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Elförsörjning: Finns elnät eller krävs solceller/generator?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Droplet className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Vatten: Kommunalt, egen brunn eller vattentank?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Avlopp: Kommunalt, egen anläggning eller torrtoalett?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Wifi className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Fiber/Bredband: Kontrollera täckning för uppkoppling
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Economics */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-600/10 rounded-lg p-2">
                <Euro className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Ekonomi & Kostnader</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Fastighetsavgift: 0,75% av taxeringsvärdet årligen
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Försäkring: Särskild för fritidshus, budgetera 3,000-8,000 kr/år
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Underhåll: Räkna med 1-2% av fastighetsvärdet årligen
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Driftskostnader: El, snöröjning, sophämtning
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access & Location */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-purple-600/10 rounded-lg p-2">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Läge & Tillgänglighet</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Vägtillgång: Framkomlig året runt eller säsongsvista?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Snöröjning: Privat, samfällighet eller kommunal?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Avstånd till service: Mataffär, apotek, sjukvård
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Restid från hemmet: Planera för helgpendling
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Environment */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-600/10 rounded-lg p-2">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-lg">Miljö & Natur</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Naturvärden: Kontrollera om området är naturreservat
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Skyddsområden: Biotopskydd eller Natura 2000-områden
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Markegenskaper: Lermark, berg, fuktig eller torr mark?
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Radon: Kontrollera radonhalter i området
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Aspects */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-red-600/10 rounded-lg p-2">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-lg">Juridik & Avtal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Lantmäterihandlingar: Kontrollera fastighetsgränser
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Servitut: Väg-, vatten-, el-rättigheter för grannar
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Samfälligheter: Avgifter och skyldigheter i områden
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Köpeavtal: Använd Svensk Mäklarstatistik standardavtal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportantInfo;
