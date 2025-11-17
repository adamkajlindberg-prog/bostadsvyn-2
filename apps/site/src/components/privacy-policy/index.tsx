import ContainerWrapper from "@/components/common/container-wrapper"
import { CheckIcon, DatabaseIcon, EyeIcon, FileTextIcon, LockIcon, ShieldIcon, UserCheckIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const personalData = [
    {
        title: "Uppgifter du själv lämnar",
        contents: () => {
            return (
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base">
                    <li>Namn, e-postadress och telefonnummer vid registrering</li>
                    <li>BankID-verifiering för säkra transaktioner och hyreskontrakt</li>
                    <li>Profiluppgifter och preferenser</li>
                    <li>Fastighetsinformation vid annonsering</li>
                    <li>Meddelanden och kommunikation på plattformen</li>
                    <li>Betalningsinformation (hanteras säkert via tredjepartsleverantörer)</li>
                </ul>
            )
        } 
    },
    {
        title: "Automatiskt insamlade uppgifter",
        contents: () => {
            return (
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base">
                    <li>IP-adress och geografisk plats</li>
                    <li>Enhetsinformation (webbläsare, operativsystem)</li>
                    <li>Cookies och liknande tekniker (se vår <Link href="/cookies" className="text-primary hover:underline underline-offset-2">Cookie-policy</Link>)</li>
                    <li>Användarstatistik och beteendedata</li>
                    <li>Sökhistorik och preferenser</li>
                </ul>
            )
        }
    }
]

const personalDataReasons = [
    {
        title: "Fullgöra avtal (GDPR Art. 6.1.b)",
        reasons: [
            "Tillhandahålla marknadsplatstjänster",
            "Möjliggöra kontakt mellan köpare, säljare och mäklare",
            "Skapa och administrera digitala hyreskontrakt",
            "Hantera användarkonton"
        ]
    },
    {
        title: "Berättigat intresse (GDPR Art. 6.1.f)",
        reasons: [
            "Förbättra och utveckla våra tjänster",
            "Analysera användarbeteende för bättre användarupplevelse",
            "Säkerhetsövervakning och bedrägeribekämpning",
            "Marknadsföring av liknande tjänster"
        ]
    },
    {
        title: "Samtycke (GDPR Art. 6.1.a)",
        reasons: [
            "Personaliserad marknadsföring",
            "Icke-nödvändiga cookies och analyser",
            "Nyhetsbrev och kampanjer"
        ]
    },
    {
        title: "Rättsliga förpliktelser (GDPR Art. 6.1.c)",
        reasons: [
            "Bokföring och skattelagstiftning",
            "Rapportering enligt DAC 7 (om tillämpligt)",
            "Efterlevnad av fastighetsmäklarinspektionens krav"
        ]
    }
]

const rights = [
    {
        right: "Rätt till tillgång (Art. 15)",
        description: "Du kan begära en kopia av alla dina personuppgifter"
    },
    {
        right: "Rätt till rättelse (Art. 16)",
        description: "Du kan korrigera felaktiga uppgifter"
    },
    {
        right: "Rätt till radering (Art. 17)",
        description: "Du kan begära att vi raderar dina uppgifter (med vissa undantag)"
    },
    {
        right: "Rätt till dataportabilitet (Art. 20)",
        description: "Du kan få dina uppgifter i maskinläsbart format"
    },
    {
        right: "Rätt att invända (Art. 21)",
        description: "Du kan invända mot behandling baserad på berättigat intresse"
    },
    {
        right: "Rätt att återkalla samtycke (Art. 7.3)",
        description: "Du kan när som helst återkalla ditt samtycke för marknadsföring eller cookies"
    }
]

const PrivacyPolicy = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-2">
                    <ShieldIcon size={30} className="text-primary" />
                    <h2 className="text-2xl @lg:text-3xl font-semibold">
                        Integritetspolicy
                    </h2>
                </div>
                <div className="text-sm @lg:text-base text-muted-foreground mb-10">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" })}</div>

                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-2">
                    <EyeIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold">Introduktion</h3>
                </div>
                <p className="text-sm @lg:text-base mb-4">Bostadsvyn AB (org.nr 559000-0000) värnar om din integritet och skyddar dina personuppgifter. Denna integritetspolicy beskriver hur vi samlar in, använder, lagrar och delar dina personuppgifter i enlighet med EU:s dataskyddsförordning (GDPR) och svensk lag.</p>
                <p className="text-sm @lg:text-base mb-10">Vi är personuppgiftsansvariga för den behandling av personuppgifter som sker på vår plattform.</p> 

                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-4">
                    <UserCheckIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold">Personuppgiftsansvarig</h3>
                </div>
                <Card className="py-6 shadow-none border-none bg-primary/10 mb-10">
                    <CardContent className="px-6">
                        <div className="font-semibold mb-4">Bostadsvyn AB</div>
                        <ul className="space-y-2 text-sm @lg:text-base">
                            <li>Organisationsnummer: 559000-0000</li>
                            <li>E-post: info@bostadsvyn.se</li>
                            <li>Webbplats: www.bostadsvyn.se</li>
                        </ul>
                    </CardContent>
                </Card>

                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-4">
                    <DatabaseIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold">Vilka personuppgifter samlar vi in?</h3>
                </div>
                <div className="space-y-4 mb-10">
                    {personalData.map((data, index) => (
                        <div key={`personal-data-collect-${index}`}>
                            <div className="text-base @lg:text-lg font-semibold mb-2">{data.title}</div>
                            {data.contents()}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-4">
                    <FileTextIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold">Varför samlar vi in dina uppgifter?</h3>
                </div>
                <div className="space-y-6 mb-10">
                    {personalDataReasons.map((dataReason, index) => (
                        <Card key={`personal-data-reasons-${index}`} className="py-6 shadow-none border-none bg-primary/10">
                            <CardContent className="px-6">
                                <div className="text-sm @lg:text-base font-semibold mb-2">{dataReason.title}</div>
                                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base">
                                    {dataReason.reasons.map((reason, index) => (
                                        <li key={`personal-data-reason-${index}`}>{reason}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-3">
                    <LockIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold">Hur länge sparar vi dina uppgifter?</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-10">
                    <li><span className="font-semibold">Kontoinformation</span>: Så länge ditt konto är aktivt och upp till 12 månader efter avslutning</li>
                    <li><span className="font-semibold">Hyreskontrakt</span>: 7 år enligt bokföringslagen</li>
                    <li><span className="font-semibold">Marknadsföringssamtycke</span>: Tills du återkallar ditt samtycke</li>
                    <li><span className="font-semibold">Analysdata</span>: Anonymiseras efter 24 månader</li>
                    <li><span className="font-semibold">Meddelanden</span>: 24 månader efter sista aktivitet</li>
                </ul>
                
                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Delar vi dina uppgifter?</h3>
                <p className="text-sm @lg:text-base mb-4">Vi säljer aldrig dina personuppgifter. Vi delar uppgifter endast när det är nödvändigt:</p>
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-10">
                    <li><span className="font-semibold">Fastighetsmäklare</span>: När du kontaktar en mäklare genom plattformen</li>
                    <li><span className="font-semibold">BankID</span>: För autentisering och signering av hyreskontrakt</li>
                    <li><span className="font-semibold">Betalningsleverantörer</span>: För säker hantering av transaktioner</li>
                    <li><span className="font-semibold">Molntjänstleverantörer</span>: För hosting och lagring (inom EU/EES)</li>
                    <li><span className="font-semibold">Myndighetskrav</span>: När lagen kräver det (t.ex. Skatteverket, Polisen)</li>
                </ul>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Dina rättigheter</h3>
                <p className="text-sm @lg:text-base mb-4">Enligt GDPR har du följande rättigheter:</p>
                <div className="space-y-3.5 mb-4">
                    {rights.map((item, index) => (
                        <div key={`right-${index}`} className="bg-primary/10 border-l-4 border-primary p-4">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <CheckIcon size={16} />
                                <div className="text-sm @lg:text-base font-semibold">{item.right}</div>
                            </div>
                            <p className="text-sm @lg:text-base">{item.description}</p>
                        </div>
                    ))}
                </div>
                <p className="text-sm @lg:text-base mb-10">
                    För att utöva dina rättigheter, kontakta oss på {' '} 
                    <Link href="mailto:info@bostadsvyn.se" className="text-primary hover:underline underline-offset-2">
                     info@bostadsvyn.se
                    </Link>.{' '}
                    Vi besvarar din begäran inom 30 dagar.
                </p>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Säkerhet och dataskydd</h3>
                <p className="text-sm @lg:text-base mb-4">Vi använder moderna säkerhetsåtgärder för att skydda dina personuppgifter:</p>
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-10">
                    <li>SSL/TLS-kryptering för all datatrafik</li>
                    <li>BankID-integration för säker autentisering</li>
                    <li>Regelbundna säkerhetsgranskningar och uppdateringar</li>
                    <li>Begränsad åtkomst till personuppgifter (need-to-know-princip)</li>
                    <li>Datalagring inom EU/EES</li>
                    <li>Automatisk anonymisering av äldre data</li>
                </ul>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Klagomål</h3>
                <p className="text-sm @lg:text-base mb-4">Om du inte är nöjd med hur vi hanterar dina personuppgifter har du rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY):</p>
                <Card className="py-6 shadow-none border-none bg-primary/10 mb-10">
                    <CardContent className="px-6">
                        <div className="font-semibold mb-4">Integritetsskyddsmyndigheten</div>
                        <ul className="space-y-2 text-sm @lg:text-base">
                            <li>Box 8114, 104 20 Stockholm</li>
                            <li>Telefon: 08-657 61 00</li>
                            <li>E-post: imy@imy.se</li>
                            <li>
                                Webbplats:{' '}
                                <Link href="https://www.imy.se/" className="text-primary hover:underline underline-offset-2">
                                    www.imy.se
                                </Link>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Ändringar av integritetspolicyn</h3>
                <p className="text-sm @lg:text-base mb-10">Vi kan komma att uppdatera denna integritetspolicy. Vid väsentliga ändringar kommer vi att informera dig via e-post eller genom en tydlig notis på webbplatsen. Vi rekommenderar att du regelbundet granskar denna sida.</p>
                
                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Kontakta oss</h3>
                <p className="text-sm @lg:text-base mb-4">Har du frågor om hur vi behandlar dina personuppgifter? Kontakta oss gärna:</p>
                <Card className="py-6 shadow-none border-none bg-primary/10">
                    <CardContent className="px-6">
                        <ul className="space-y-2 text-sm @lg:text-base">
                            <li>
                                <span className="font-semibold">E-post</span>:{' '}
                                <Link href="mailto:info@bostadsvyn.se" className="text-primary hover:underline underline-offset-2">
                                info@bostadsvyn.se
                                </Link>
                            </li>
                            <li>
                                <span className="font-semibold">Postadress</span>:{' '}
                                Bostadsvyn AB, [Adress], [Postnummer] [Stad]
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </ContainerWrapper>
        </div>
    )
}

export default PrivacyPolicy