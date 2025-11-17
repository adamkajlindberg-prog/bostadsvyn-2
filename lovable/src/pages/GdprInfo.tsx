import { Download, Eye, Lock, Shield, Trash2, UserCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GdprInfo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>GDPR & Din Data - Bostadsvyn</title>
        <meta
          name="description"
          content="Läs om hur Bostadsvyn hanterar dina personuppgifter enligt GDPR. Information om dataskydd, rättigheter och säkerhet."
        />
        <meta
          name="keywords"
          content="GDPR, dataskydd, personuppgifter, integritet, datasäkerhet"
        />
      </Helmet>

      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield
              className="h-16 w-16 text-primary mx-auto mb-4"
              aria-hidden="true"
            />
            <h1 className="text-4xl font-bold mb-4">GDPR & Din Data</h1>
            <p className="text-lg text-muted-foreground">
              Din integritet är viktig för oss - här förklarar vi hur vi skyddar
              dina uppgifter
            </p>
          </div>

          {/* What is GDPR */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" aria-hidden="true" />
                Vad är GDPR?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                GDPR (General Data Protection Regulation) är EU:s
                dataskyddsförordning som trädde i kraft 2018. Den ger dig som
                användare större kontroll över dina personuppgifter och ställer
                höga krav på hur företag hanterar persondata.
              </p>
              <div className="bg-nordic-ice p-4 rounded-lg border border-border">
                <h3 className="font-semibold mb-2">
                  Dina rättigheter enligt GDPR:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>Rätt till information</strong> - Veta vilka
                    uppgifter vi samlar in
                  </li>
                  <li>
                    • <strong>Rätt till tillgång</strong> - Få en kopia av dina
                    uppgifter
                  </li>
                  <li>
                    • <strong>Rätt till rättelse</strong> - Korrigera felaktiga
                    uppgifter
                  </li>
                  <li>
                    • <strong>Rätt till radering</strong> - "Rätten att bli
                    glömd"
                  </li>
                  <li>
                    • <strong>Rätt till dataportabilitet</strong> - Flytta dina
                    uppgifter till annan tjänst
                  </li>
                  <li>
                    • <strong>Rätt att invända</strong> - Säga nej till viss
                    behandling
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* What data we collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" aria-hidden="true" />
                Vilka uppgifter samlar vi in?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  Nödvändiga uppgifter för kontofunktion
                </h3>
                <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                  <p>
                    <strong>Via BankID:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Namn (från folkbokföringen)</li>
                    <li>Personnummer (krypterat)</li>
                    <li>Verifieringstidpunkt</li>
                  </ul>
                  <p className="mt-3">
                    <strong>Kontaktuppgifter:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-2">
                    <li>E-postadress</li>
                    <li>Telefonnummer (frivilligt)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Fastighetsannonser (för säljare/mäklare)
                </h3>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Fastighetsadress och beskrivning</li>
                    <li>Bilder och dokument du laddar upp</li>
                    <li>Prisinformation</li>
                    <li>Kontaktinformation för visningar</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tekniska uppgifter</h3>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>IP-adress (anonymiserad efter 90 dagar)</li>
                    <li>Webbläsare och enhet</li>
                    <li>Användarstatistik (anonymiserad)</li>
                    <li>Cookies (med ditt samtycke)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How we protect data */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" aria-hidden="true" />
                Hur skyddar vi dina uppgifter?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Kryptering</h3>
                  <p className="text-sm text-muted-foreground">
                    All kommunikation använder TLS 1.3-kryptering. Känsliga data
                    som personnummer lagras krypterat i databasen.
                  </p>
                </div>
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">
                    Åtkomstkontroll
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Endast behörig personal har tillgång till personuppgifter.
                    All åtkomst loggas och granskas regelbundet.
                  </p>
                </div>
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">Säkra servrar</h3>
                  <p className="text-sm text-muted-foreground">
                    Data lagras på säkra servrar inom EU med regelbundna
                    säkerhetskopior och övervakning.
                  </p>
                </div>
                <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm">
                    Incidenthantering
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vi har rutiner för att snabbt upptäcka och hantera
                    eventuella säkerhetsincidenter.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your rights in action */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" aria-hidden="true" />
                Utöva dina rättigheter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Begär ut dina uppgifter
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Du kan när som helst begära en kopia av alla personuppgifter
                  vi har om dig. Vi besvarar din begäran inom 30 dagar.
                </p>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Så gör du:</strong>
                  <ol className="mt-2 space-y-1 list-decimal list-inside">
                    <li>Logga in på ditt konto</li>
                    <li>Gå till Inställningar → Integritet</li>
                    <li>Klicka på "Ladda ner mina uppgifter"</li>
                  </ol>
                  <p className="mt-2 text-muted-foreground">
                    Eller kontakta{" "}
                    <a
                      href="mailto:gdpr@bostadsvyn.se"
                      className="text-primary hover:underline"
                    >
                      gdpr@bostadsvyn.se
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Ta bort dina uppgifter
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Du kan begära att vi raderar dina personuppgifter. Observera
                  att vissa uppgifter kan behöva sparas av juridiska skäl (t.ex.
                  bokföring).
                </p>
                <div className="bg-muted p-3 rounded text-sm">
                  <strong>Så gör du:</strong>
                  <ol className="mt-2 space-y-1 list-decimal list-inside">
                    <li>Logga in på ditt konto</li>
                    <li>Gå till Inställningar → Radera konto</li>
                    <li>Följ instruktionerna för kontoradering</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Korrigera uppgifter</h3>
                <p className="text-sm text-muted-foreground">
                  Om dina uppgifter är felaktiga kan du när som helst uppdatera
                  dem under "Min profil" eller kontakta oss för hjälp.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data retention */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Hur länge sparar vi uppgifter?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <ul className="space-y-3 text-sm">
                  <li>
                    <strong>Kontouppgifter:</strong> Sparas så länge ditt konto
                    är aktivt + 12 månader efter radering
                  </li>
                  <li>
                    <strong>Fastighetsannonser:</strong> Raderas automatiskt 90
                    dagar efter att annonsen tagits bort
                  </li>
                  <li>
                    <strong>Meddelanden:</strong> Sparas i 24 månader, sedan
                    raderas automatiskt
                  </li>
                  <li>
                    <strong>IP-adresser:</strong> Anonymiseras efter 90 dagar
                  </li>
                  <li>
                    <strong>Bokföringsunderlag:</strong> Sparas i 7 år enligt
                    bokföringslagen
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Complaints */}
          <Card>
            <CardHeader>
              <CardTitle>Frågor eller klagomål?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-nordic-ice p-4 rounded-lg border border-border">
                <h3 className="font-semibold mb-2">Kontakta oss</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Har du frågor om hur vi hanterar dina personuppgifter?
                </p>
                <p className="text-sm">
                  <strong>E-post:</strong>{" "}
                  <a
                    href="mailto:gdpr@bostadsvyn.se"
                    className="text-primary hover:underline"
                  >
                    gdpr@bostadsvyn.se
                  </a>
                  <br />
                  <strong>Personuppgiftsansvarig:</strong> Bostadsvyn AB (se{" "}
                  <a href="/om-oss" className="text-primary hover:underline">
                    Om oss
                  </a>
                  )
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Klagomål till tillsynsmyndighet
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Om du inte är nöjd med hur vi hanterar dina personuppgifter
                  har du rätt att lämna klagomål till:
                </p>
                <p className="text-sm">
                  <strong>Integritetsskyddsmyndigheten (IMY)</strong>
                  <br />
                  <a
                    href="https://www.imy.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.imy.se
                  </a>
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Läs vår fullständiga{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  integritetspolicy
                </a>{" "}
                för mer detaljerad information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default GdprInfo;
