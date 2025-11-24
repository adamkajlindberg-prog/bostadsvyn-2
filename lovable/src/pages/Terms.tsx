import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Allmänna villkor - Bostadsvyn"
        description="Läs våra allmänna villkor för användning av Bostadsvyn - plattform för bostadsköp och hyresannonser"
        keywords="allmänna villkor, användarvillkor, integritet, GDPR"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Allmänna villkor för Bostadsvyn
              </h1>
              <p className="text-muted-foreground">
                Senast uppdaterad: 13 oktober 2025
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Introduktion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Dessa allmänna villkor ("Villkoren") gäller för användning av
                bostadsvyn.se samt Bostadsvyns vid var tid aktuella mobila
                applikationer och andra kanaler ("Plattformen"). Plattformen
                tillhandahålls av Bostadsvyn Sverige AB, org.nr 559551-3176
                ("Bostadsvyn") och har bindande verkan mot den som använder
                Plattformen ("Användaren").
              </p>
              <p>
                Bostadsvyn är en marknadsplats för bostäder där alla
                försäljningar sker via licensierade fastighetsmäklare.
                Bostadsvyn är inte själv mäklare och förmedlar inte fastigheter.
              </p>
              <p>
                Bostadsvyn förbehåller sig rätten att från tid till annan ändra
                Villkoren. Sådan ändring träder i kraft när den publicerats på
                bostadsvyn.se.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Konto och verifiering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">
                2.1 Registrering och BankID-verifiering
              </h3>
              <p>
                För att använda Plattformens funktioner krävs att du skapar ett
                användarkonto. Vid registrering krävs verifiering via svenskt
                BankID för att säkerställa din identitet och motverka
                bedrägerier.
              </p>
              <p>
                Du förbinder dig att tillhandahålla korrekta och uppdaterade
                uppgifter vid registrering och att omedelbart uppdatera
                informationen om den ändras.
              </p>

              <h3 className="font-semibold mt-4">2.2 Kontosäkerhet</h3>
              <p>
                Du är ansvarig för att hålla dina inloggningsuppgifter säkra och
                för all aktivitet som sker via ditt konto. Du ska omedelbart
                meddela Bostadsvyn om obehörig användning av ditt konto.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Annonser och moderering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">3.1 Publicering av annonser</h3>
              <p>
                Alla bostadsannonser på Plattformen modereras innan publicering.
                Bostadsvyn förbehåller sig rätten att godkänna, neka eller ta
                bort annonser som inte uppfyller våra krav eller som strider mot
                lag, förordning eller god sed.
              </p>

              <h3 className="font-semibold mt-4">3.2 Ansvarig mäklare</h3>
              <p>
                Alla försäljningsannonser måste vara kopplade till en
                licensierad fastighetsmäklare som ansvarar för transaktionen.
                Mäklarens kontaktuppgifter ska tydligt framgå i annonsen.
              </p>

              <h3 className="font-semibold mt-4">3.3 Annonsörens ansvar</h3>
              <p>Annonsören garanterar att:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All information i annonsen är korrekt och inte vilseledande
                </li>
                <li>
                  Annonsen inte strider mot marknadsföringslagen eller annan
                  tillämplig lag
                </li>
                <li>Annonsören har rätt att marknadsföra objektet</li>
                <li>
                  Bilder och text inte kränker tredje parts upphovsrätt eller
                  andra rättigheter
                </li>
              </ul>

              <h3 className="font-semibold mt-4">3.4 Hyresannonser och DAC7</h3>
              <p>
                För hyresannonser krävs att annonsören tillhandahåller uppgifter
                i enlighet med DAC7-direktivet för rapportering till
                Skatteverket. Detta inkluderar personlig information och
                uppgifter om hyresintäkter.
              </p>

              <h3 className="font-semibold mt-4">3.5 Förnyelse av annonser</h3>
              <p>Annonser kan förnyas enligt följande regler:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Grundannonser kan förnyas mot en kostnad på 399 SEK per
                  förnyelse
                </li>
                <li>
                  Plus- och Premiumannonser inkluderar obegränsade kostnadsfria
                  förnyelser
                </li>
                <li>
                  Förnyelse blir tillgänglig exakt en månad (30 dagar) efter
                  publiceringsdatum eller senaste förnyelse
                </li>
                <li>Mäklaren utför förnyelsen i mäklarportalen</li>
                <li>
                  Säljare med Plus/Premium-annonser kan även välja en frivillig
                  betald förnyelse för 699 SEK för snabbare exponering
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Prenumerationer och AI-verktyg</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">
                4.1 Pro och Pro+ prenumerationer
              </h3>
              <p>
                Användare kan uppgradera till Pro eller Pro+ prenumerationer för
                tillgång till AI-verktyg:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Pro:</strong> 299 SEK/månad för privatpersoner, 499
                  SEK/månad för företag (ex. moms). Inkluderar upp till 50
                  AI-genererade bilder per månad.
                </li>
                <li>
                  <strong>Pro+:</strong> 499 SEK/månad för privatpersoner, 699
                  SEK/månad för företag (ex. moms). Inkluderar obegränsad
                  tillgång till AI-verktyg.
                </li>
                <li>Ingen bindningstid - avsluta när som helst</li>
                <li>AI-homestyling och AI-bildredigering ingår</li>
                <li>Prioriterad support för Pro+ medlemmar</li>
              </ul>

              <h3 className="font-semibold mt-4">4.2 AI-verktyg</h3>
              <p>
                AI-verktyg tillhandahålls "som de är" och resultaten kan
                variera. Användaren ansvarar för att:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Endast använda AI-verktyg med bilder som användaren har rätt
                  till
                </li>
                <li>Granska AI-genererade resultat innan publicering</li>
                <li>
                  Inte använda AI-verktyg för olagliga eller vilseledande
                  ändamål
                </li>
                <li>Inte försöka kringgå begränsningar i användningskvoten</li>
              </ul>

              <h3 className="font-semibold mt-4">
                4.3 Återbetalning av prenumerationer
              </h3>
              <p>
                Prenumerationsavgifter återbetalas inte vid uppsägning mitt i en
                period. Prenumerationen förblir aktiv till slutet av den betalda
                perioden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Gruppkonton</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Gruppkontofunktionen möjliggör samarbete mellan användare för
                bostadssökning:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Gruppmedlemmar kan spara favoriter och rösta på fastigheter
                  tillsammans
                </li>
                <li>
                  Röstningsresultat (Ja, Kanske, Nej) delas mellan
                  gruppmedlemmar
                </li>
                <li>
                  Majoritetsröstning avgör om en fastighet ska behållas eller
                  tas bort
                </li>
                <li>
                  Alla medlemmar ansvarar för sitt eget beteende inom gruppen
                </li>
                <li>
                  Gruppägare kan ta bort medlemmar som bryter mot villkoren
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Användarens ansvar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Användaren förbinder sig att:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Använda Plattformen i enlighet med dessa Villkor och
                  tillämplig lag
                </li>
                <li>
                  Inte använda Plattformen för olagliga ändamål eller på sätt
                  som kan skada Bostadsvyn
                </li>
                <li>
                  Inte försöka kringgå säkerhetsåtgärder eller få obehörig
                  åtkomst till system
                </li>
                <li>
                  Inte sprida skadlig kod, virus eller annan skadlig programvara
                </li>
                <li>Inte trakassera, hota eller kränka andra användare</li>
                <li>
                  Rapportera missbruk, bedrägerier eller regelbrott via
                  supportfunktionen
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Personuppgifter och integritet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">7.1 Personuppgiftsbehandling</h3>
              <p>
                Bostadsvyn är personuppgiftsansvarig för behandling av dina
                personuppgifter. Behandlingen sker i enlighet med GDPR och annan
                tillämplig dataskyddslagstiftning. Läs vår fullständiga
                integritetspolicy för mer information.
              </p>

              <h3 className="font-semibold mt-4">
                7.2 BankID och digital signering
              </h3>
              <p>
                Personnummer och annan information från BankID-verifiering
                lagras krypterat och används för:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identitetsverifiering vid registrering</li>
                <li>Säker inloggning på kontot</li>
                <li>Digital signering av hyreskontrakt via Idura</li>
                <li>Verifiering vid publicering av annonser</li>
              </ul>

              <h3 className="font-semibold mt-4">7.3 Betalningshantering</h3>
              <p>
                All betalningshantering sker via Stripe, som stödjer Klarna,
                kort, Swish, Apple Pay och Google Pay. Bostadsvyn lagrar inte
                dina kortuppgifter.
              </p>

              <h3 className="font-semibold mt-4">7.4 Dina rättigheter</h3>
              <p>Du har rätt att:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Få tillgång till dina personuppgifter</li>
                <li>Rätta felaktiga uppgifter</li>
                <li>Radera dina uppgifter (med vissa undantag)</li>
                <li>Invända mot behandling</li>
                <li>Få dataportabilitet</li>
                <li>Klaga till Integritetsskyddsmyndigheten (IMY)</li>
              </ul>
              <p className="mt-4">
                Kontakta integritet@bostadsvyn.se för frågor om personuppgifter.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Immateriella rättigheter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Allt innehåll på Plattformen, inklusive text, grafik, logotyper,
                bilder, programvara och datasamlingar, ägs av Bostadsvyn eller
                dess licensgivare och skyddas av upphovsrätt och andra lagar om
                immateriella rättigheter.
              </p>
              <p>
                Genom att ladda upp innehåll till Plattformen ger du Bostadsvyn
                en icke-exklusiv, global, royaltyfri licens att använda, visa,
                reproducera och distribuera innehållet i syfte att
                tillhandahålla och marknadsföra Plattformen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Ansvarsbegränsning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bostadsvyn tillhandahåller Plattformen "som den är" och lämnar
                inga garantier avseende tillgänglighet, funktionalitet eller
                lämplighet för särskilt ändamål.
              </p>
              <p>Bostadsvyn ansvarar inte för:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Skador som uppstår till följd av användning av Plattformen
                </li>
                <li>Innehåll som publiceras av användare eller tredje part</li>
                <li>Transaktioner mellan användare och mäklare</li>
                <li>Förlust av data eller affärsmöjligheter</li>
                <li>Tekniska avbrott eller säkerhetsincidenter</li>
              </ul>
              <p className="mt-4">
                Ansvarsbegränsningen gäller inte för skada som orsakats av
                Bostadsvyns uppsåt eller grov vårdslöshet, eller i fall där
                tvingande konsumentskyddslag inte tillåter begränsning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Incidentrapportering och support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Användare kan rapportera missbruk, bedrägerier, felaktigheter
                eller andra problem via Plattformens supportfunktion. Alla
                rapporter granskas och åtgärdas enligt våra rutiner.
              </p>
              <p>
                För support, kontakta support@bostadsvyn.se eller ring 010-123
                45 67 (vardagar 09:00-17:00).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Tvistlösning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">
                11.1 Tvister mellan användare och mäklare
              </h3>
              <p>
                Tvister mellan köpare/säljare och fastighetsmäklare hanteras
                enligt fastighetsmäklarlagen och kan prövas av allmän domstol
                eller Fastighetsmäklarnämnden.
              </p>

              <h3 className="font-semibold mt-4">11.2 Hyrestvister</h3>
              <p>
                Tvister mellan hyresvärd och hyresgäst hanteras enligt
                hyreslagen och kan prövas av Hyresnämnden. Vi rekommenderar att
                först försöka lösa konflikter genom dialog.
              </p>

              <h3 className="font-semibold mt-4">
                11.3 Tvister med Bostadsvyn
              </h3>
              <p>
                För tvister mellan Användare och Bostadsvyn gäller svensk lag.
                Tvist ska i första hand lösas genom förhandling. Om förhandling
                inte leder till lösning kan du som konsument vända dig till
                Allmänna reklamationsnämnden (ARN).
              </p>
              <p>
                Företagskunder: Tvister ska slutligt avgöras genom
                skiljedomsförfarande enligt Stockholms Handelskammares
                Skiljedomsinstituts regler, med Stockholm som skiljeförfarandets
                säte och svenska som språk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Uppsägning och avslutande av konto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Du kan när som helst avsluta ditt konto genom att kontakta
                support. Vid avslutande raderas dina personuppgifter i enlighet
                med vår datalagringsrutin, med undantag för uppgifter som måste
                sparas enligt lag (t.ex. bokföringslagen, DAC7).
              </p>
              <p>
                Bostadsvyn förbehåller sig rätten att omedelbart stänga av eller
                avsluta konto vid misstanke om missbruk, bedrägeri eller brott
                mot dessa Villkor.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Force majeure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bostadsvyn är inte ansvarig för dröjsmål eller utebliven
                prestation till följd av omständigheter utanför vår kontroll,
                såsom naturkatastrofer, krig, terroristattacker, arbetskonflikt,
                myndighetsbeslut, avbrott i eltillförsel eller
                kommunikationsnät, eller omfattande cybersäkerhetsincident.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Ändringar av Plattformen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bostadsvyn förbehåller sig rätten att när som helst ändra,
                uppdatera eller avsluta delar av eller hela Plattformen. Vi
                eftersträvar att meddela användare om väsentliga ändringar i god
                tid.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Kontaktuppgifter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">Bostadsvyn Sverige AB</p>
              <p>
                Organisationsnummer: 559551-3176
                <br />
                E-post: info@bostadsvyn.se
                <br />
                Telefon: 010-123 45 67
                <br />
                Integritetsfrågor: integritet@bostadsvyn.se
                <br />
                Support: support@bostadsvyn.se
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted p-6 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Observera:</strong> Genom att använda Bostadsvyn
              accepterar du dessa allmänna villkor. Om du inte godkänner
              villkoren ska du inte använda Plattformen. Vi rekommenderar att du
              sparar eller skriver ut en kopia av dessa villkor för framtida
              referens.
            </p>
          </div>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export default Terms;
