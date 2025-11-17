"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const terms = [
  {
    title: "1. Introduktion",
    contents: () => {
      return (
        <>
          <p className="text-sm @lg:text-base mb-4">
            Dessa allmänna villkor ("Villkoren") gäller för användning av
            bostadsvyn.se samt Bostadsvyns vid var tid aktuella mobila
            applikationer och andra kanaler ("Plattformen"). Plattformen
            tillhandahålls av Bostadsvyn AB, org.nr [ORG-NUMMER] ("Bostadsvyn")
            och har bindande verkan mot den som använder Plattformen
            ("Användaren").
          </p>
          <p className="text-sm @lg:text-base mb-4">
            Bostadsvyn är en marknadsplats för bostäder där alla försäljningar
            sker via licensierade fastighetsmäklare. Bostadsvyn är inte själv
            mäklare och förmedlar inte fastigheter.
          </p>
          <p className="text-sm @lg:text-base">
            Bostadsvyn förbehåller sig rätten att från tid till annan ändra
            Villkoren. Sådan ändring träder i kraft när den publicerats på
            bostadsvyn.se.
          </p>
        </>
      );
    },
  },
  {
    title: "2. Konto och verifiering",
    contents: () => {
      return (
        <>
          <div className="font-semibold mb-4">
            2.1 Registrering och BankID-verifiering
          </div>
          <p className="text-sm @lg:text-base mb-4">
            För att använda Plattformens funktioner krävs att du skapar ett
            användarkonto. Vid registrering krävs verifiering via svenskt BankID
            för att säkerställa din identitet och motverka bedrägerier.
          </p>
          <p className="text-sm @lg:text-base mb-6">
            Du förbinder dig att tillhandahålla korrekta och uppdaterade
            uppgifter vid registrering och att omedelbart uppdatera
            informationen om den ändras.
          </p>
          <div className="font-semibold mb-4">2.2 Kontosäkerhet</div>
          <p className="text-sm @lg:text-base">
            Du är ansvarig för att hålla dina inloggningsuppgifter säkra och för
            all aktivitet som sker via ditt konto. Du ska omedelbart meddela
            Bostadsvyn om obehörig användning av ditt konto.
          </p>
        </>
      );
    },
  },
  {
    title: "3. Annonser och moderering",
    contents: () => {
      return (
        <>
          <div className="font-semibold mb-4">3.1 Publicering av annonser</div>
          <p className="text-sm @lg:text-base mb-6">
            Alla bostadsannonser på Plattformen modereras innan publicering.
            Bostadsvyn förbehåller sig rätten att godkänna, neka eller ta bort
            annonser som inte uppfyller våra krav eller som strider mot lag,
            förordning eller god sed.
          </p>
          <div className="font-semibold mb-4">3.2 Ansvarig mäklare</div>
          <p className="text-sm @lg:text-base mb-6">
            Alla försäljningsannonser måste vara kopplade till en licensierad
            fastighetsmäklare som ansvarar för transaktionen. Mäklarens
            kontaktuppgifter ska tydligt framgå i annonsen.
          </p>
          <div className="font-semibold mb-4">3.3 Annonsörens ansvar</div>
          <p className="text-sm @lg:text-base mb-4">
            Annonsören garanterar att:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-6">
            <li>All information i annonsen är korrekt och inte vilseledande</li>
            <li>
              Annonsen inte strider mot marknadsföringslagen eller annan
              tillämplig lag
            </li>
            <li>Annonsören har rätt att marknadsföra objektet</li>
            <li>
              Bilder och text inte kränker tredje parts upphovsrätt eller andra
              rättigheter
            </li>
          </ul>
          <div className="font-semibold mb-4">3.4 Hyresannonser och DAC7</div>
          <p className="text-sm @lg:text-base">
            För hyresannonser krävs att annonsören tillhandahåller uppgifter i
            enlighet med DAC7-direktivet för rapportering till Skatteverket.
            Detta inkluderar personlig information och uppgifter om
            hyresintäkter.
          </p>
        </>
      );
    },
  },
  {
    title: "4. Användarens ansvar",
    contents: () => {
      return (
        <>
          <p className="text-sm @lg:text-base mb-4">
            Användaren förbinder dig att:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base">
            <li>
              Använda Plattformen i enlighet med dessa Villkor och tillämplig
              lag
            </li>
            <li>
              Inte använda Plattformen för olagliga ändamål eller på sätt som
              kan skada Bostadsvyn
            </li>
            <li>
              Inte försöka kringgå säkerhetsåtgärder eller få obehörig åtkomst
              till system
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
        </>
      );
    },
  },
  {
    title: "5. Personuppgifter och integritet",
    contents: () => {
      return (
        <>
          <div className="font-semibold mb-4">5.1 Personuppgiftsbehandling</div>
          <p className="text-sm @lg:text-base mb-6">
            Bostadsvyn är personuppgiftsansvarig för behandling av dina
            personuppgifter. Behandlingen sker i enlighet med GDPR och annan
            tillämplig dataskyddslagstiftning. Läs vår fullständiga
            integritetspolicy för mer information.
          </p>
          <div className="font-semibold mb-4">5.2 BankID-information</div>
          <p className="text-sm @lg:text-base mb-6">
            Personnummer och annan information från BankID-verifiering lagras
            krypterat och används endast för identitetsverifiering och
            säkerhetsändamål.
          </p>
          <div className="font-semibold mb-4">5.3 Dina rättigheter</div>
          <p className="text-sm @lg:text-base mb-4">Du har rätt att:</p>
          <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-4">
            <li>Få tillgång till dina personuppgifter</li>
            <li>Rätta felaktiga uppgifter</li>
            <li>Radera dina uppgifter (med vissa undantag)</li>
            <li>Invända mot behandling</li>
            <li>Få dataportabilitet</li>
            <li>Klaga till Integritetsskyddsmyndigheten (IMY)</li>
          </ul>
          <p className="text-sm @lg:text-base">
            Kontakta integritet@bostadsvyn.se för frågor om personuppgifter.
          </p>
        </>
      );
    },
  },
  {
    title: "6. Immateriella rättigheter",
    contents: () => {
      return (
        <>
          <p className="text-sm @lg:text-base mb-4">
            Allt innehåll på Plattformen, inklusive text, grafik, logotyper,
            bilder, programvara och datasamlingar, ägs av Bostadsvyn eller dess
            licensgivare och skyddas av upphovsrätt och andra lagar om
            immateriella rättigheter.
          </p>
          <p className="text-sm @lg:text-base">
            Genom att ladda upp innehåll till Plattformen ger du Bostadsvyn en
            icke-exklusiv, global, royaltyfri licens att använda, visa,
            reproducera och distribuera innehållet i syfte att tillhandahålla
            och marknadsföra Plattformen.
          </p>
        </>
      );
    },
  },
  {
    title: "7. Ansvarsbegränsning",
    contents: () => {
      return (
        <>
          <p className="text-sm @lg:text-base mb-4">
            Bostadsvyn tillhandahåller Plattformen "som den är" och lämnar inga
            garantier avseende tillgänglighet, funktionalitet eller lämplighet
            för särskilt ändamål.
          </p>
          <p className="text-sm @lg:text-base mb-4">
            Bostadsvyn ansvarar inte för:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-4">
            <li>Skador som uppstår till följd av användning av Plattformen</li>
            <li>Innehåll som publiceras av användare eller tredje part</li>
            <li>Transaktioner mellan användare och mäklare</li>
            <li>Förlust av data eller affärsmöjligheter</li>
            <li>Tekniska avbrott eller säkerhetsincidenter</li>
          </ul>
          <p className="text-sm @lg:text-base">
            Ansvarsbegränsningen gäller inte för skada som orsakats av
            Bostadsvyns uppsåt eller grov vårdslöshet, eller i fall där
            tvingande konsumentskyddslag inte tillåter begränsning.
          </p>
        </>
      );
    },
  },
  {
    title: "8. Incidentrapportering och support",
    contents: () => {
      return (
        <>
          <p className="text-sm @lg:text-base mb-4">
            Användare kan rapportera missbruk, bedrägerier, felaktigheter eller
            andra problem via Plattformens supportfunktion. Alla rapporter
            granskas och åtgärdas enligt våra rutiner.
          </p>
          <p className="text-sm @lg:text-base">
            För support, kontakta support@bostadsvyn.se eller ring 010-123 45 67
            (vardagar 09:00-17:00).
          </p>
        </>
      );
    },
  },
  {
    title: "9. Tvistlösning",
    contents: () => {
      return (
        <>
          <div className="font-semibold mb-4">
            9.1 Tvister mellan användare och mäklare
          </div>
          <p className="text-sm @lg:text-base mb-6">
            Tvister mellan köpare/säljare och fastighetsmäklare hanteras enligt
            fastighetsmäklarlagen och kan prövas av Hyresnämnden eller allmän
            domstol.
          </p>
          <div className="font-semibold mb-4">9.2 Tvister med Bostadsvyn</div>
          <p className="text-sm @lg:text-base mb-4">
            För tvister mellan Användare och Bostadsvyn gäller svensk lag. Tvist
            ska i första hand lösas genom förhandling. Om förhandling inte leder
            till lösning kan du som konsument vända dig till Allmänna
            reklamationsnämnden (ARN).
          </p>
          <p className="text-sm @lg:text-base">
            Företagskunder: Tvister ska slutligt avgöras genom
            skiljedomsförfarande enligt Stockholms Handelskammares
            Skiljedomsinstituts regler, med Stockholm som skiljeförfarandets
            säte och svenska som språk.
          </p>
        </>
      );
    },
  },
  {
    title: "10. Uppsägning och avslutande av konto",
    contents: () => {
      return (
        <>
          <p className="text-sm @lg:text-base mb-4">
            Du kan när som helst avsluta ditt konto genom att kontakta support.
            Vid avslutande raderas dina personuppgifter i enlighet med vår
            datalagringsrutin, med undantag för uppgifter som måste sparas
            enligt lag (t.ex. bokföringslagen, DAC7).
          </p>
          <p className="text-sm @lg:text-base">
            Bostadsvyn förbehåller sig rätten att omedelbart stänga av eller
            avsluta konto vid misstanke om missbruk, bedrägeri eller brott mot
            dessa Villkor.
          </p>
        </>
      );
    },
  },
  {
    title: "11. Force majeure",
    contents: () => {
      return (
        <p className="text-sm @lg:text-base">
          Bostadsvyn är inte ansvarig för dröjsmål eller utebliven prestation
          till följd av omständigheter utanför vår kontroll, såsom
          naturkatastrofer, krig, terroristattacker, arbetskonflikt,
          myndighetsbeslut, avbrott i eltillförsel eller kommunikationsnät,
          eller omfattande cybersäkerhetsincident.
        </p>
      );
    },
  },
  {
    title: "12. Ändringar av Plattformen",
    contents: () => {
      return (
        <p className="text-sm @lg:text-base">
          Bostadsvyn förbehåller sig rätten att när som helst ändra, uppdatera
          eller avsluta delar av eller hela Plattformen. Vi eftersträvar att
          meddela användare om väsentliga ändringar i god tid.
        </p>
      );
    },
  },
  {
    title: "13. Kontaktuppgifter",
    contents: () => {
      return (
        <>
          <div className="font-semibold mb-4">Bostadsvyn AB</div>
          <ul className="space-y-2 text-sm @lg:text-base">
            <li>Organisationsnummer: 559000-0000</li>
            <li>E-post: info@bostadsvyn.se</li>
            <li>Telefon: 010-123 45 67</li>
            <li>Integritetsfrågor: integritet@bostadsvyn.se</li>
            <li>Support: support@bostadsvyn.se</li>
          </ul>
        </>
      );
    },
  },
];

const Terms = () => {
  const router = useRouter();

  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex flex-col @2xl:flex-row @2xl:justify-between mb-10 gap-6">
          <div className="order-2 @2xl:order-1">
            <h2 className="text-2xl @lg:text-3xl font-semibold mb-2">
              Allmänna villkor för Bostadsvyn
            </h2>
            <div className="text-sm @lg:text-base text-muted-foreground">
              Senast uppdaterad:{" "}
              {new Date().toLocaleDateString("sv-SE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <Button
            variant="outline"
            className="order-1 @2xl:order-2 self-start"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon /> Tillbaka
          </Button>
        </div>

        <div className="space-y-6 mb-6">
          {terms.map((term) => (
            <Card key={term.title} className="py-6 shadow-xs">
              <CardContent className="px-6">
                <h3 className="text-xl @lg:text-2xl font-semibold mb-6">
                  {term.title}
                </h3>
                {term.contents()}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="py-6 shadow-none border-none bg-primary/10">
          <CardContent className="px-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Observera</span>: Genom att
              använda Bostadsvyn accepterar du dessa allmänna villkor. Om du
              inte godkänner villkoren ska du inte använda Plattformen. Vi
              rekommenderar att du sparar eller skriver ut en kopia av dessa
              villkor för framtida referens.
            </p>
          </CardContent>
        </Card>
      </ContainerWrapper>
    </div>
  );
};

export default Terms;
