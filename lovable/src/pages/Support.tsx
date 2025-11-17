import { ArrowLeft, HelpCircle, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";
import IncidentReportForm from "@/components/support/IncidentReportForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Support & Hjälp - Bostadsvyn"
        description="Kontakta oss eller rapportera problem. Vi hjälper dig med dina frågor om bostadsplattformen."
        keywords="support, hjälp, kontakt, rapportera problem"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Support & Hjälp</h1>
              <p className="text-muted-foreground">
                Vi finns här för att hjälpa dig
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Vanliga frågor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Hitta svar på de vanligaste frågorna om plattformen
                </p>
                <Button variant="outline" className="w-full">
                  Se FAQ
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  E-post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Kontakta oss via e-post för icke-brådskande ärenden
                </p>
                <a href="mailto:support@bostadsvyn.se">
                  <Button variant="outline" className="w-full">
                    support@bostadsvyn.se
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Telefon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ring oss vardagar 09:00-17:00
                </p>
                <a href="tel:+46101234567">
                  <Button variant="outline" className="w-full">
                    010-123 45 67
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IncidentReportForm />

            <Card>
              <CardHeader>
                <CardTitle>Tvistlösning</CardTitle>
                <CardDescription>
                  Information om hur olika typer av tvister hanteras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    Tvister mellan köpare/säljare och fastighetsmäklare
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tvister mellan köpare, säljare och fastighetsmäklare
                    hanteras enligt fastighetsmäklarlagen. Vi rekommenderar att
                    först försöka lösa konflikten genom dialog med mäklaren.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Fastighetsmäklarnämnden</strong> kan hjälpa till vid
                    klagomål mot mäklare och bedöma om mäklaren brutit mot
                    fastighetsmäklarlagen eller god fastighetsmäklarsed.
                  </p>
                  <a
                    href="https://www.fmn.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Besök Fastighetsmäklarnämndens webbplats →
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">
                    Hyrestvister mellan hyresvärdar och hyresgäster
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Tvister mellan hyresvärd och hyresgäst hanteras enligt
                    hyreslagen. Vi rekommenderar att först försöka lösa
                    konflikten genom direkt dialog.
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Hyresnämnden</strong> kan medla i hyrestvister och
                    hjälpa till att hitta en lösning vid oenighet om hyra,
                    besittningsskydd, underhåll och andra hyresfrågor.
                  </p>
                  <a
                    href="https://www.hyresnamnden.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Besök Hyresnämndens webbplats →
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Tvister med Bostadsvyn</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Om du har en tvist med Bostadsvyn kan du kontakta oss först
                    för att försöka lösa konflikten. Om det inte fungerar kan du
                    vända dig till Allmänna reklamationsnämnden (ARN).
                  </p>
                  <a
                    href="https://www.arn.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Besök ARN:s webbplats →
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">
                    EU:s plattform för onlinetvistlösning
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    EU-kommissionen erbjuder en plattform för onlinetvistlösning
                    (ODR) som kan användas för tvister om onlineköp.
                  </p>
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Besök EU:s ODR-plattform →
                  </a>
                </div>

                <div className="pt-4 border-t bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Viktig information:</strong> Bostadsvyn Sverige AB
                    fungerar som en marknadsplatsplattform och ansvarar inte för
                    transaktioner mellan användare. Alla försäljningar av
                    bostäder sker via licensierad fastighetsmäklare som bär
                    huvudansvaret för transaktionen. För hyreskontrakt signerade
                    via vår plattform tillhandahåller vi enbart den digitala
                    infrastrukturen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export default Support;
