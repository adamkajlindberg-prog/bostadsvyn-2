import { BarChart, Cookie, Settings, Shield, Target } from "lucide-react";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Cookie-policy - Bostadsvyn"
        description="Läs om hur Bostadsvyn använder cookies och liknande tekniker. Hantera dina cookie-inställningar och lär dig om dina valmöjligheter."
        keywords="cookies, cookie-policy, kakor, webbkakor, spårning, samtycke, Bostadsvyn"
        canonicalUrl="https://bostadsvyn.se/cookies"
      />
      <Navigation />
      <main
        id="main-content"
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-foreground">
              Cookie-policy
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Information om cookies och hur vi använder dem
          </p>
          <p className="text-muted-foreground">
            Senast uppdaterad:{" "}
            {new Date().toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section aria-labelledby="what-are-cookies">
            <h2
              id="what-are-cookies"
              className="text-2xl font-semibold text-foreground flex items-center gap-2"
            >
              <Cookie className="h-6 w-6 text-primary" aria-hidden="true" />
              Vad är cookies?
            </h2>
            <p className="text-foreground/90">
              Cookies är små textfiler som lagras på din enhet (dator,
              surfplatta eller mobiltelefon) när du besöker en webbplats. De
              hjälper webbplatsen att komma ihåg information om ditt besök, som
              dina preferenser och inloggningsuppgifter.
            </p>
            <p className="text-foreground/90 mt-3">
              Cookies kan sättas av webbplatsen du besöker (förstapartscookies)
              eller av andra tjänster som används på webbplatsen
              (tredjepartscookies).
            </p>
          </section>

          <section aria-labelledby="why-cookies">
            <h2
              id="why-cookies"
              className="text-2xl font-semibold text-foreground"
            >
              Varför använder vi cookies?
            </h2>
            <p className="text-foreground/90">
              Bostadsvyn använder cookies för att förbättra din upplevelse,
              analysera hur plattformen används och visa relevant innehåll.
              Vissa cookies är nödvändiga för att webbplatsen ska fungera, medan
              andra kräver ditt samtycke enligt lagen om elektronisk
              kommunikation.
            </p>
          </section>

          <section aria-labelledby="cookie-types">
            <h2
              id="cookie-types"
              className="text-2xl font-semibold text-foreground"
            >
              Typer av cookies vi använder
            </h2>

            <div className="space-y-6">
              {/* Nödvändiga cookies */}
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Nödvändiga cookies
                  </h3>
                </div>
                <p className="text-foreground/90 mb-3">
                  Dessa cookies är absolut nödvändiga för att webbplatsen ska
                  fungera och kan inte stängas av. De sätts vanligtvis som svar
                  på dina handlingar, som att logga in eller fylla i formulär.
                </p>
                <div className="bg-background/50 p-4 rounded mt-3">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Exempel på användning:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                    <li>Hålla dig inloggad under ditt besök</li>
                    <li>Komma ihåg vad du lagt i varukorgen</li>
                    <li>Säkerställa säker dataöverföring</li>
                    <li>Verifiera din identitet med BankID</li>
                    <li>Spara dina cookie-preferenser</li>
                  </ul>
                </div>
                <p className="text-sm text-foreground/90 mt-3 italic">
                  <strong>Rättslig grund:</strong> Teknisk nödvändighet - inget
                  samtycke krävs enligt lagen om elektronisk kommunikation.
                </p>
                <p className="text-sm text-foreground/90 mt-2">
                  <strong>Lagringstid:</strong> Session (raderas när du stänger
                  webbläsaren) till 12 månader
                </p>
              </div>

              {/* Funktionella cookies */}
              <div className="bg-muted/50 border-l-4 border-accent p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Settings
                    className="h-6 w-6 text-accent"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold text-foreground">
                    Funktionella cookies
                  </h3>
                </div>
                <p className="text-foreground/90 mb-3">
                  Dessa cookies möjliggör förbättrad funktionalitet och
                  personalisering. De kan sättas av oss eller av
                  tredjepartsleverantörer vars tjänster vi använder.
                </p>
                <div className="bg-background/50 p-4 rounded mt-3">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Exempel på användning:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                    <li>Komma ihåg dina språkinställningar</li>
                    <li>Spara dina sökfilter och preferenser</li>
                    <li>Anpassa användargränssnittet efter dina val</li>
                    <li>Aktivera chatfunktioner</li>
                    <li>Spara dina favoritfastigheter</li>
                  </ul>
                </div>
                <p className="text-sm text-foreground/90 mt-3 italic">
                  <strong>Rättslig grund:</strong> Samtycke enligt lagen om
                  elektronisk kommunikation.
                </p>
                <p className="text-sm text-foreground/90 mt-2">
                  <strong>Lagringstid:</strong> 3 månader till 24 månader
                </p>
              </div>

              {/* Analyscookies */}
              <div className="bg-muted/50 border-l-4 border-accent p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart
                    className="h-6 w-6 text-accent"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold text-foreground">
                    Analyscookies
                  </h3>
                </div>
                <p className="text-foreground/90 mb-3">
                  Dessa cookies hjälper oss att förstå hur besökare interagerar
                  med webbplatsen genom att samla in och rapportera information
                  anonymt.
                </p>
                <div className="bg-background/50 p-4 rounded mt-3">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Exempel på användning:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                    <li>Räkna antal besökare och trafikmönster</li>
                    <li>Se vilka sidor som är mest populära</li>
                    <li>Förstå hur användare navigerar på sajten</li>
                    <li>Identifiera tekniska problem</li>
                    <li>Mäta effektivitet av marknadsföringskampanjer</li>
                  </ul>
                </div>
                <div className="bg-background/50 p-4 rounded mt-3">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Tredjepartstjänster vi använder:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                    <li>
                      Google Analytics (anonymiserat) -{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-foreground/90 mt-3 italic">
                  <strong>Rättslig grund:</strong> Samtycke enligt lagen om
                  elektronisk kommunikation.
                </p>
                <p className="text-sm text-foreground/90 mt-2">
                  <strong>Lagringstid:</strong> 12 månader till 24 månader
                </p>
              </div>

              {/* Marknadsföringscookies */}
              <div className="bg-muted/50 border-l-4 border-accent p-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-foreground">
                    Marknadsföringscookies
                  </h3>
                </div>
                <p className="text-foreground/90 mb-3">
                  Dessa cookies används för att visa annonser som är relevanta
                  för dig och dina intressen. De används också för att begränsa
                  hur många gånger du ser en annons och för att mäta
                  effektiviteten av reklamkampanjer.
                </p>
                <div className="bg-background/50 p-4 rounded mt-3">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Exempel på användning:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                    <li>Visa annonser baserade på dina intressen</li>
                    <li>Begränsa hur ofta du ser samma annons</li>
                    <li>Mäta effektivitet av reklamkampanjer</li>
                    <li>
                      Retargeting - visa annonser baserat på tidigare besök
                    </li>
                    <li>Sociala medier-integration</li>
                  </ul>
                </div>
                <div className="bg-background/50 p-4 rounded mt-3">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Tredjepartstjänster vi kan använda:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                    <li>
                      Facebook Pixel -{" "}
                      <a
                        href="https://www.facebook.com/privacy/explanation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      Google Ads -{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      LinkedIn Insight Tag -{" "}
                      <a
                        href="https://www.linkedin.com/legal/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-foreground/90 mt-3 italic">
                  <strong>Rättslig grund:</strong> Samtycke enligt lagen om
                  elektronisk kommunikation.
                </p>
                <p className="text-sm text-foreground/90 mt-2">
                  <strong>Lagringstid:</strong> 3 månader till 24 månader
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="manage-cookies">
            <h2
              id="manage-cookies"
              className="text-2xl font-semibold text-foreground"
            >
              Hantera dina cookie-inställningar
            </h2>

            <div className="bg-primary/5 border-2 border-primary p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Via vår cookie-banner
              </h3>
              <p className="text-foreground/90 mb-3">
                När du besöker Bostadsvyn för första gången visas en
                cookie-banner där du kan:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>
                  <strong>Acceptera alla:</strong> Tillåt alla cookies
                  (nödvändiga, funktionella, analyser, marknadsföring)
                </li>
                <li>
                  <strong>Avböj alla:</strong> Endast nödvändiga cookies
                  aktiveras
                </li>
                <li>
                  <strong>Hantera inställningar:</strong> Välj exakt vilka
                  kategorier du vill tillåta
                </li>
              </ul>
              <p className="text-foreground/90 mt-4">
                Du kan när som helst ändra dina cookie-inställningar genom att
                klicka på "Cookie-inställningar" i sidfoten.
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Via din webbläsare
              </h3>
              <p className="text-foreground/90 mb-3">
                De flesta webbläsare tillåter dig att kontrollera cookies via
                inställningarna. Du kan:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Se vilka cookies som lagrats</li>
                <li>Radera alla eller specifika cookies</li>
                <li>Blockera cookies från specifika webbplatser</li>
                <li>Blockera alla tredjepartscookies</li>
                <li>Radera alla cookies när du stänger webbläsaren</li>
              </ul>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Instruktioner för populära webbläsare:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/90">
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/sv/kb/kakor-information-webbplatser-lagrar-pa-din-dator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Safari
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/sv-se/microsoft-edge/ta-bort-cookies-i-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-lg mt-4">
                <p className="text-sm text-foreground/90">
                  <strong>OBS!</strong> Om du blockerar alla cookies kan vissa
                  funktioner på webbplatsen sluta fungera. Till exempel kan du
                  inte logga in eller spara dina preferenser.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="third-party">
            <h2
              id="third-party"
              className="text-2xl font-semibold text-foreground"
            >
              Tredjepartscookies
            </h2>
            <p className="text-foreground/90 mb-4">
              Vissa cookies sätts av tredjepartsleverantörer vars tjänster vi
              använder på vår webbplats. Dessa tjänster har sina egna
              integritetspolicyer:
            </p>
            <div className="space-y-3">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold text-foreground">
                  Google (Analytics, Maps, Ads)
                </p>
                <p className="text-sm text-foreground/90 mt-1">
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  |
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-2"
                  >
                    Opt-out
                  </a>
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold text-foreground">
                  Facebook (Pixel, Social Media Plugins)
                </p>
                <p className="text-sm text-foreground/90 mt-1">
                  <a
                    href="https://www.facebook.com/privacy/explanation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold text-foreground">BankID</p>
                <p className="text-sm text-foreground/90 mt-1">
                  <a
                    href="https://www.bankid.com/privat/integritetslamning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Integritetslämning
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="local-storage">
            <h2
              id="local-storage"
              className="text-2xl font-semibold text-foreground"
            >
              Lokal lagring och andra tekniker
            </h2>
            <p className="text-foreground/90">
              Förutom cookies använder vi även andra liknande tekniker för att
              lagra information lokalt på din enhet:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-3">
              <li>
                <strong>Local Storage:</strong> Används för att spara dina
                preferenser och inställningar lokalt
              </li>
              <li>
                <strong>Session Storage:</strong> Temporär lagring som raderas
                när du stänger webbläsaren
              </li>
              <li>
                <strong>IndexedDB:</strong> Används för offline-funktionalitet
                och caching
              </li>
              <li>
                <strong>Web Beacons:</strong> Små transparenta bilder som
                används för att spåra e-postöppningar
              </li>
            </ul>
            <p className="text-foreground/90 mt-3">
              Dessa tekniker behandlas enligt samma principer som cookies och
              omfattas av ditt samtycke.
            </p>
          </section>

          <section aria-labelledby="updates">
            <h2 id="updates" className="text-2xl font-semibold text-foreground">
              Uppdateringar av cookie-policyn
            </h2>
            <p className="text-foreground/90">
              Vi kan komma att uppdatera denna cookie-policy för att återspegla
              ändringar i vår användning av cookies eller förändringar i
              lagstiftningen. Vi rekommenderar att du regelbundet granskar denna
              sida. Datum för senaste uppdateringen visas överst på sidan.
            </p>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="text-2xl font-semibold text-foreground">
              Frågor om cookies?
            </h2>
            <p className="text-foreground/90 mb-4">
              Om du har frågor om vår användning av cookies eller hur du
              hanterar dem, kontakta oss gärna:
            </p>
            <div className="bg-primary/5 p-6 rounded-lg">
              <p className="text-foreground/90">
                <strong>E-post:</strong>{" "}
                <a
                  href="mailto:info@bostadsvyn.se"
                  className="text-primary hover:underline"
                >
                  info@bostadsvyn.se
                </a>
              </p>
              <p className="text-foreground/90 mt-2">
                <strong>Webbplats:</strong>{" "}
                <a
                  href="https://www.bostadsvyn.se"
                  className="text-primary hover:underline"
                >
                  www.bostadsvyn.se
                </a>
              </p>
            </div>
          </section>

          <section aria-labelledby="more-info">
            <h2
              id="more-info"
              className="text-2xl font-semibold text-foreground"
            >
              Mer information
            </h2>
            <p className="text-foreground/90 mb-3">
              För mer information om hur vi behandlar dina personuppgifter, läs
              vår:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                <a href="/privacy" className="text-primary hover:underline">
                  Integritetspolicy
                </a>{" "}
                - Läs om hur vi hanterar dina personuppgifter enligt GDPR
              </li>
              <li>
                <a href="/terms" className="text-primary hover:underline">
                  Användarvillkor
                </a>{" "}
                - Läs om reglerna för att använda Bostadsvyn
              </li>
            </ul>
          </section>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export default Cookies;
