import { Database, Eye, FileText, Lock, Shield, UserCheck } from "lucide-react";
import LegalFooter from "@/components/LegalFooter";
import Navigation from "@/components/Navigation";
import SEOOptimization from "@/components/seo/SEOOptimization";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Integritetspolicy - Bostadsvyn"
        description="Läs om hur Bostadsvyn samlar in, använder och skyddar dina personuppgifter enligt GDPR. Vi värnar om din integritet och dataskydd."
        keywords="integritetspolicy, GDPR, personuppgifter, dataskydd, cookies, Bostadsvyn"
        canonicalUrl="https://bostadsvyn.se/privacy"
      />
      <Navigation />
      <main
        id="main-content"
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-foreground">
              Integritetspolicy
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Senast uppdaterad:{" "}
            {new Date().toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section aria-labelledby="intro">
            <h2
              id="intro"
              className="text-2xl font-semibold text-foreground flex items-center gap-2"
            >
              <Eye className="h-6 w-6 text-primary" aria-hidden="true" />
              Introduktion
            </h2>
            <p className="text-foreground/90">
              Bostadsvyn Sverige AB (org.nr 559551-3176) värnar om din
              integritet och skyddar dina personuppgifter. Denna
              integritetspolicy beskriver hur vi samlar in, använder, lagrar och
              delar dina personuppgifter i enlighet med EU:s
              dataskyddsförordning (GDPR) och svensk lag.
            </p>
            <p className="text-foreground/90">
              Vi är personuppgiftsansvariga för den behandling av
              personuppgifter som sker på vår plattform.
            </p>
          </section>

          <section aria-labelledby="data-controller">
            <h2
              id="data-controller"
              className="text-2xl font-semibold text-foreground flex items-center gap-2"
            >
              <UserCheck className="h-6 w-6 text-primary" aria-hidden="true" />
              Personuppgiftsansvarig
            </h2>
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-foreground/90 mb-2">
                <strong>Bostadsvyn Sverige AB</strong>
              </p>
              <p className="text-foreground/90">
                Organisationsnummer: 559551-3176
              </p>
              <p className="text-foreground/90">E-post: info@bostadsvyn.se</p>
              <p className="text-foreground/90">Webbplats: www.bostadsvyn.se</p>
            </div>
          </section>

          <section aria-labelledby="what-data">
            <h2
              id="what-data"
              className="text-2xl font-semibold text-foreground flex items-center gap-2"
            >
              <Database className="h-6 w-6 text-primary" aria-hidden="true" />
              Vilka personuppgifter samlar vi in?
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Uppgifter du själv lämnar
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                  <li>Namn, e-postadress och telefonnummer vid registrering</li>
                  <li>
                    BankID-verifiering för säkra transaktioner och hyreskontrakt
                  </li>
                  <li>Profiluppgifter och preferenser</li>
                  <li>Fastighetsinformation vid annonsering</li>
                  <li>Meddelanden och kommunikation på plattformen</li>
                  <li>Betalningsinformation (hanteras säkert via Stripe)</li>
                  <li>Prenumerationsinformation för Pro och Pro+ medlemskap</li>
                  <li>
                    Bilder uppladdade till AI-verktyg för homestyling och
                    bildredigering
                  </li>
                  <li>Gruppkontoinformation och röstningsdata</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Automatiskt insamlade uppgifter
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                  <li>IP-adress och geografisk plats</li>
                  <li>Enhetsinformation (webbläsare, operativsystem)</li>
                  <li>
                    Cookies och liknande tekniker (se vår{" "}
                    <a href="/cookies" className="text-primary hover:underline">
                      Cookie-policy
                    </a>
                    )
                  </li>
                  <li>Användarstatistik och beteendedata</li>
                  <li>Sökhistorik och preferenser</li>
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="why-data">
            <h2
              id="why-data"
              className="text-2xl font-semibold text-foreground flex items-center gap-2"
            >
              <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
              Varför samlar vi in dina uppgifter?
            </h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Fullgöra avtal (GDPR Art. 6.1.b)
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                  <li>Tillhandahålla marknadsplatstjänster</li>
                  <li>Möjliggöra kontakt mellan köpare, säljare och mäklare</li>
                  <li>
                    Skapa och administrera digitala hyreskontrakt via Criipto
                    och BankID
                  </li>
                  <li>Hantera användarkonten och prenumerationer</li>
                  <li>Behandla betalningar via Stripe</li>
                  <li>
                    Tillhandahålla AI-verktyg för homestyling och bildredigering
                  </li>
                  <li>Administrera gruppkontofunktionalitet</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Berättigat intresse (GDPR Art. 6.1.f)
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                  <li>Förbättra och utveckla våra tjänster</li>
                  <li>
                    Analysera användarbeteende för bättre användarupplevelse
                  </li>
                  <li>Säkerhetsövervakning och bedrägeribekämpning</li>
                  <li>Marknadsföring av liknande tjänster</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Samtycke (GDPR Art. 6.1.a)
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                  <li>Personaliserad marknadsföring</li>
                  <li>Icke-nödvändiga cookies och analyser</li>
                  <li>Nyhetsbrev och kampanjer</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Rättsliga förpliktelser (GDPR Art. 6.1.c)
                </h3>
                <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                  <li>Bokföring och skattelagstiftning</li>
                  <li>Rapportering enligt DAC 7 (om tillämpligt)</li>
                  <li>Efterlevnad av fastighetsmäklarinspektionens krav</li>
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="how-long">
            <h2
              id="how-long"
              className="text-2xl font-semibold text-foreground flex items-center gap-2"
            >
              <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
              Hur länge sparar vi dina uppgifter?
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                <strong>Kontoinformation:</strong> Så länge ditt konto är aktivt
                och upp till 12 månader efter avslutning
              </li>
              <li>
                <strong>Hyreskontrakt:</strong> 7 år enligt bokföringslagen
              </li>
              <li>
                <strong>Transaktionsdata:</strong> 7 år enligt bokföringslagen
              </li>
              <li>
                <strong>Prenumerationsdata:</strong> Under prenumerationsperiod
                och 12 månader efter avslut
              </li>
              <li>
                <strong>AI-genererade bilder:</strong> Raderas omedelbart efter
                bearbetning, originalbild behålls i ditt konto
              </li>
              <li>
                <strong>Marknadsföringssamtycke:</strong> Tills du återkallar
                ditt samtycke
              </li>
              <li>
                <strong>Analysdata:</strong> Anonymiseras efter 24 månader
              </li>
              <li>
                <strong>Meddelanden:</strong> 24 månader efter sista aktivitet
              </li>
            </ul>
          </section>

          <section aria-labelledby="sharing">
            <h2 id="sharing" className="text-2xl font-semibold text-foreground">
              Delar vi dina uppgifter?
            </h2>
            <p className="text-foreground/90">
              Vi säljer aldrig dina personuppgifter. Vi delar uppgifter endast
              när det är nödvändigt:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>
                <strong>Fastighetsmäklare:</strong> När du kontaktar en mäklare
                genom plattformen
              </li>
              <li>
                <strong>BankID/Criipto:</strong> För autentisering och digital
                signering av hyreskontrakt
              </li>
              <li>
                <strong>Stripe:</strong> För säker hantering av betalningar och
                prenumerationer (PCI DSS-certifierad)
              </li>
              <li>
                <strong>Resend:</strong> För att skicka transaktions- och
                bekräftelsemail
              </li>
              <li>
                <strong>AI-tjänster:</strong> För bearbetning av bilder i
                AI-verktyg (data raderas omedelbart efter bearbetning)
              </li>
              <li>
                <strong>Supabase:</strong> För hosting och lagring (inom EU/EES)
              </li>
              <li>
                <strong>Gruppmedlemmar:</strong> Delar röstningsdata och
                favoriter inom ditt gruppkonto
              </li>
              <li>
                <strong>Myndighetskrav:</strong> När lagen kräver det (t.ex.
                Skatteverket, Polisen)
              </li>
            </ul>
          </section>

          <section aria-labelledby="your-rights">
            <h2
              id="your-rights"
              className="text-2xl font-semibold text-foreground"
            >
              Dina rättigheter
            </h2>
            <p className="text-foreground/90 mb-4">
              Enligt GDPR har du följande rättigheter:
            </p>
            <div className="space-y-3">
              <div className="bg-primary/5 border-l-4 border-primary p-4">
                <h3 className="font-semibold text-foreground">
                  ✓ Rätt till tillgång (Art. 15)
                </h3>
                <p className="text-foreground/90">
                  Du kan begära en kopia av alla dina personuppgifter
                </p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-4">
                <h3 className="font-semibold text-foreground">
                  ✓ Rätt till rättelse (Art. 16)
                </h3>
                <p className="text-foreground/90">
                  Du kan korrigera felaktiga uppgifter
                </p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-4">
                <h3 className="font-semibold text-foreground">
                  ✓ Rätt till radering (Art. 17)
                </h3>
                <p className="text-foreground/90">
                  Du kan begära att vi raderar dina uppgifter (med vissa
                  undantag)
                </p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-4">
                <h3 className="font-semibold text-foreground">
                  ✓ Rätt till dataportabilitet (Art. 20)
                </h3>
                <p className="text-foreground/90">
                  Du kan få dina uppgifter i maskinläsbart format
                </p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-4">
                <h3 className="font-semibold text-foreground">
                  ✓ Rätt att invända (Art. 21)
                </h3>
                <p className="text-foreground/90">
                  Du kan invända mot behandling baserad på berättigat intresse
                </p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary p-4">
                <h3 className="font-semibold text-foreground">
                  ✓ Rätt att återkalla samtycke (Art. 7.3)
                </h3>
                <p className="text-foreground/90">
                  Du kan när som helst återkalla ditt samtycke för
                  marknadsföring eller cookies
                </p>
              </div>
            </div>
            <p className="text-foreground/90 mt-4">
              För att utöva dina rättigheter, kontakta oss på{" "}
              <a
                href="mailto:info@bostadsvyn.se"
                className="text-primary hover:underline"
              >
                info@bostadsvyn.se
              </a>
              . Vi besvarar din begäran inom 30 dagar.
            </p>
          </section>

          <section aria-labelledby="security">
            <h2
              id="security"
              className="text-2xl font-semibold text-foreground"
            >
              Säkerhet och dataskydd
            </h2>
            <p className="text-foreground/90 mb-4">
              Vi använder moderna säkerhetsåtgärder för att skydda dina
              personuppgifter:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>SSL/TLS-kryptering för all datatrafik</li>
              <li>
                BankID-integration via Criipto för säker autentisering och
                digital signering
              </li>
              <li>Stripe för PCI DSS-kompatibel betalningshantering</li>
              <li>
                AI-bilder behandlas säkert och raderas omedelbart efter
                bearbetning
              </li>
              <li>Krypterad lagring av känslig data (t.ex. personnummer)</li>
              <li>Regelbundna säkerhetsgranskningar och penetrationstester</li>
              <li>
                Begränsad åtkomst till personuppgifter (need-to-know-princip)
              </li>
              <li>Datalagring inom EU/EES (Supabase)</li>
              <li>Automatisk anonymisering av äldre data</li>
              <li>Tvåfaktorsautentisering för mäklarkonton</li>
            </ul>
          </section>

          <section aria-labelledby="complaint">
            <h2
              id="complaint"
              className="text-2xl font-semibold text-foreground"
            >
              Klagomål
            </h2>
            <p className="text-foreground/90">
              Om du inte är nöjd med hur vi hanterar dina personuppgifter har du
              rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY):
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mt-4">
              <p className="text-foreground/90 mb-2">
                <strong>Integritetsskyddsmyndigheten</strong>
              </p>
              <p className="text-foreground/90">Box 8114, 104 20 Stockholm</p>
              <p className="text-foreground/90">Telefon: 08-657 61 00</p>
              <p className="text-foreground/90">E-post: imy@imy.se</p>
              <p className="text-foreground/90">
                Webbplats:{" "}
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
          </section>

          <section aria-labelledby="changes">
            <h2 id="changes" className="text-2xl font-semibold text-foreground">
              Ändringar av integritetspolicyn
            </h2>
            <p className="text-foreground/90">
              Vi kan komma att uppdatera denna integritetspolicy. Vid väsentliga
              ändringar kommer vi att informera dig via e-post eller genom en
              tydlig notis på webbplatsen. Vi rekommenderar att du regelbundet
              granskar denna sida.
            </p>
          </section>

          <section aria-labelledby="contact">
            <h2 id="contact" className="text-2xl font-semibold text-foreground">
              Kontakta oss
            </h2>
            <p className="text-foreground/90 mb-4">
              Har du frågor om hur vi behandlar dina personuppgifter? Kontakta
              oss gärna:
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
                <strong>Postadress:</strong> Bostadsvyn Sverige AB, [Adress],
                [Postnummer] [Stad]
              </p>
            </div>
          </section>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export default Privacy;
