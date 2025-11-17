import ContainerWrapper from "@/components/common/container-wrapper"
import { ChartNoAxesColumnIcon, CookieIcon, SettingsIcon, ShieldIcon, TargetIcon } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { WEB_URL } from "@/../env-client"

const cookieTypes = [
    {
        icon: <ShieldIcon className="text-primary" />,
        title: "Nödvändiga cookies",
        description: "Dessa cookies är absolut nödvändiga för att webbplatsen ska fungera och kan inte stängas av. De sätts vanligtvis som svar på dina handlingar, som att logga in eller fylla i formulär.",
        otherContent: () => {
            return (
                <>
                    <div className="bg-background/50 rounded-md p-4 mb-4">
                        <div className="text-sm font-semibold mb-2">Exempel på användning:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Hålla dig inloggad under ditt besök</li>
                            <li>Komma ihåg vad du lagt i varukorgen</li>
                            <li>Säkerställa säker dataöverföring</li>
                            <li>Verifiera din identitet med BankID</li>
                            <li>Spara dina cookie-preferenser</li>
                        </ul>
                    </div>

                    <p className="text-sm italic mb-2"><span className="font-semibold">Rättslig grund</span>: Teknisk nödvändighet - inget samtycke krävs enligt lagen om elektronisk kommunikation.</p>
                    <p className="text-sm"><span className="font-semibold">Lagringstid</span>: Session (raderas när du stänger webbläsaren) till 12 månader</p>
                </>
            )
        }
    },
    {
        icon: <SettingsIcon className="text-primary" />,
        title: "Funktionella cookies",
        description: "Dessa cookies möjliggör förbättrad funktionalitet och personalisering. De kan sättas av oss eller av tredjepartsleverantörer vars tjänster vi använder.",
        otherContent: () => {
            return (
                <>
                    <div className="bg-background/50 rounded-md p-4 mb-4">
                        <div className="text-sm font-semibold mb-2">Exempel på användning:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Komma ihåg dina språkinställningar</li>
                            <li>Spara dina sökfilter och preferenser</li>
                            <li>Anpassa användargränssnittet efter dina val</li>
                            <li>Aktivera chatfunktioner</li>
                            <li>Spara dina cookie-preferenser</li>
                        </ul>
                    </div>

                    <p className="text-sm italic mb-2"><span className="font-semibold">Rättslig grund</span>: Samtycke enligt lagen om elektronisk kommunikation.</p>
                    <p className="text-sm"><span className="font-semibold">Lagringstid</span>: 3 månader till 24 månader</p>
                </>
            )
        }
    },
    {
        icon: <ChartNoAxesColumnIcon className="text-primary" />,
        title: "Analyscookies",
        description: "Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in och rapportera information anonymt.",
        otherContent: () => {
            return (
                <>
                    <div className="bg-background/50 rounded-md p-4 mb-4">
                        <div className="text-sm font-semibold mb-2">Exempel på användning:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Räkna antal besökare och trafikmönster</li>
                            <li>Se vilka sidor som är mest populära</li>
                            <li>Förstå hur användare navigerar på sajten</li>
                            <li>Identifiera tekniska problem</li>
                            <li>Mäta effektivitet av marknadsföringskampanjer</li>
                        </ul>
                    </div>

                    <div className="bg-background/50 rounded-md p-4 mb-4">
                        <div className="text-sm font-semibold mb-2">Tredjepartstjänster vi använder:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>
                                Google Analytics (anonymiserat) -{' '}
                                <Link href="https://policies.google.com/privacy" target="_blank" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    <p className="text-sm italic mb-2"><span className="font-semibold">Rättslig grund</span>: Samtycke enligt lagen om elektronisk kommunikation.</p>
                    <p className="text-sm"><span className="font-semibold">Lagringstid</span>: 12 månader till 24 månader</p>
                </>
            )
        }
    },
    {
        icon: <TargetIcon className="text-primary" />,
        title: "Marknadsföringscookies",
        description: "Dessa cookies används för att visa annonser som är relevanta för dig och dina intressen. De används också för att begränsa hur många gånger du ser en annons och för att mäta effektiviteten av reklamkampanjer.",
        otherContent: () => {
            return (
                <>
                    <div className="bg-background/50 rounded-md p-4 mb-4">
                        <div className="text-sm font-semibold mb-2">Exempel på användning:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Visa annonser baserade på dina intressen</li>
                            <li>Begränsa hur ofta du ser samma annons</li>
                            <li>Mäta effektivitet av reklamkampanjer</li>
                            <li>Retargeting - visa annonser baserat på tidigare besök</li>
                            <li>Sociala medier-integration</li>
                        </ul>
                    </div>

                    <div className="bg-background/50 rounded-md p-4 mb-4">
                        <div className="text-sm font-semibold mb-2">Tredjepartstjänster vi kan använda:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>
                                Facebook Pixel -{' '}
                                <Link href="https://www.facebook.com/privacy/explanation" target="_blank" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>
                            </li>
                            <li>
                                Google Ads -{' '}
                                <Link href="https://policies.google.com/privacy" target="_blank" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>
                            </li>
                            <li>
                                LinkedIn Insight Tag -{' '}
                                <Link href="https://www.linkedin.com/legal/privacy-policy" target="_blank" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    <p className="text-sm italic mb-2"><span className="font-semibold">Rättslig grund</span>: Samtycke enligt lagen om elektronisk kommunikation.</p>
                    <p className="text-sm"><span className="font-semibold">Lagringstid</span>: 3 månader till 24 månader</p>
                </>
            )
        }
    }
]

const CookiePolicy = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-2">
                    <CookieIcon size={30} className="text-primary" />
                    <h2 className="text-2xl @lg:text-3xl font-semibold">
                        Cookie-policy
                    </h2>
                </div>
                <div className="text-base @lg:text-lg text-muted-foreground">Information om cookies och hur vi använder dem</div>
                <div className="text-sm @lg:text-base text-muted-foreground mb-10">Senast uppdaterad: {new Date().toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" })}</div>

                <div className="flex flex-col @lg:flex-row @lg:items-center flex-wrap gap-2 mb-2">
                    <CookieIcon className="text-primary" />
                    <h3 className="text-xl @lg:text-2xl font-semibold">Vad är cookies?</h3>
                </div>
                <p className="text-sm @lg:text-base mb-4">Cookies är små textfiler som lagras på din enhet (dator, surfplatta eller mobiltelefon) när du besöker en webbplats. De hjälper webbplatsen att komma ihåg information om ditt besök, som dina preferenser och inloggningsuppgifter.</p>
                <p className="text-sm @lg:text-base mb-10">Cookies kan sättas av webbplatsen du besöker (förstapartscookies) eller av andra tjänster som används på webbplatsen (tredjepartscookies).</p>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Varför använder vi cookies?</h3>
                <p className="text-sm @lg:text-base mb-10">Bostadsvyn använder cookies för att förbättra din upplevelse, analysera hur plattformen används och visa relevant innehåll. Vissa cookies är nödvändiga för att webbplatsen ska fungera, medan andra kräver ditt samtycke enligt lagen om elektronisk kommunikation.</p>
            
                <h3 className="text-xl @lg:text-2xl font-semibold mb-4">Typer av cookies vi använder</h3>
                <div className="space-y-6 mb-10">
                    {cookieTypes.map((cookieType) => (
                        <div key={cookieType.title} className="bg-primary/10 border-l-4 border-primary p-6">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {cookieType.icon}
                                <div className="text-lg @lg:text-xl font-semibold">{cookieType.title}</div>
                            </div>
                            <p className="text-sm @lg:text-base mb-4">{cookieType.description}</p>
                            {cookieType.otherContent()}
                        </div>
                    ))}
                </div>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-4">Hantera dina cookie-inställningar</h3>
                <Card className="py-6 shadow-none border-2 border-primary bg-primary/10 mb-6">
                    <CardContent className="px-6">
                        <div className="text-base @lg:text-lg font-semibold mb-4">Via vår cookie-banner</div>
                        <p className="text-sm @lg:text-base mb-4">När du besöker Bostadsvyn för första gången visas en cookie-banner där du kan:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-4">
                            <li>
                                <span className="font-semibold">Acceptera alla</span>:{' '}
                                Tillåt alla cookies (nödvändiga, funktionella, analyser, marknadsföring)
                            </li>
                            <li>
                                <span className="font-semibold">Avböj alla</span>:{' '}
                                Endast nödvändiga cookies aktiveras
                            </li>
                            <li>
                                <span className="font-semibold">Hantera inställningar</span>:{' '}
                                Välj exakt vilka kategorier du vill tillåta
                            </li>
                        </ul>
                        <p className="text-sm @lg:text-base">Du kan när som helst ändra dina cookie-inställningar genom att klicka på "Cookie-inställningar" i sidfoten.</p>
                    </CardContent>
                </Card>

                <Card className="py-6 shadow-none border-none bg-primary/5 mb-10">
                    <CardContent className="px-6">
                        <div className="text-base @lg:text-lg font-semibold mb-4">Via din webbläsare</div>
                        <p className="text-sm @lg:text-base mb-4">De flesta webbläsare tillåter dig att kontrollera cookies via inställningarna. Du kan:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-4">
                            <li>Se vilka cookies som lagrats</li>
                            <li>Radera alla eller specifika cookies</li>
                            <li>Blockera cookies från specifika webbplatser</li>
                            <li>Blockera alla tredjepartscookies</li>
                            <li>Radera alla cookies när du stänger webbläsaren</li>
                        </ul>
                        
                        <div className="text-sm font-semibold mb-2">Instruktioner för populära webbläsare:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                            <li>
                                <Link href="https://support.google.com/chrome/answer/95647" target="_blank" className="text-primary hover:underline underline-offset-2">Google Chrome</Link>
                            </li>
                            <li>
                                <Link href="https://support.mozilla.org/sv/kb/kakor-information-webbplatser-lagrar-pa-din-dator" target="_blank" className="text-primary hover:underline underline-offset-2">Mozilla Firefox</Link>
                            </li>
                            <li>
                                <Link href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" className="text-primary hover:underline underline-offset-2">Safari</Link>
                            </li>
                            <li>
                                <Link href="https://support.microsoft.com/sv-se/microsoft-edge/ta-bort-cookies-i-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" className="text-primary hover:underline underline-offset-2">Microsoft Edge</Link>
                            </li>
                        </ul>

                        <div  className="bg-amber-50 border-l-4 border-amber-500 p-4">
                            <p className="text-sm">
                                <span className="font-semibold">OBS!</span> Om du blockerar alla cookies kan vissa funktioner på webbplatsen sluta fungera. Till exempel kan du inte logga in eller spara dina preferenser.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                
                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Tredjepartscookies</h3>
                <p className="text-sm @lg:text-base mb-4">Vissa cookies sätts av tredjepartsleverantörer vars tjänster vi använder på vår webbplats. Dessa tjänster har sina egna integritetspolicyer:</p>
                <Card className="py-6 shadow-none bg-primary/10 mb-4 border-none">
                    <CardContent className="px-6">
                        <div className="text-sm @lg:text-base font-semibold mb-2">Google (Analytics, Maps, Ads)</div>
                        <div className="text-sm">
                            <Link href="https://policies.google.com/privacy" target="_blank" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>
                            {' '}|{' '}
                            <Link href="https://tools.google.com/dlpage/gaoptout" target="_blank" className="text-primary hover:underline underline-offset-2">Opt-out</Link>
                        </div>
                    </CardContent>
                </Card>
                <Card className="py-6 shadow-none bg-primary/10 mb-4 border-none">
                    <CardContent className="px-6">
                        <div className="text-sm @lg:text-base font-semibold mb-2">Facebook (Pixel, Social Media Plugins)</div>
                        <div className="text-sm">
                            <Link href="https://www.facebook.com/privacy/explanation" target="_blank" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>
                        </div>
                    </CardContent>
                </Card>
                <Card className="py-6 shadow-none bg-primary/10 mb-10 border-none">
                    <CardContent className="px-6">
                        <div className="text-sm @lg:text-base font-semibold mb-2">BankID</div>
                        <div className="text-sm">
                            <Link href="https://www.bankid.com/privat/integritetslamning" target="_blank" className="text-primary hover:underline underline-offset-2">Integritetslämning</Link>
                        </div>
                    </CardContent>
                </Card>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Lokal lagring och andra tekniker</h3>
                <p className="text-sm @lg:text-base mb-4">Förutom cookies använder vi även andra liknande tekniker för att lagra information lokalt på din enhet:</p>
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base mb-4">
                    <li>
                        <span className="font-semibold">Local Storage</span>:{' '}
                        Används för att spara dina preferenser och inställningar lokalt
                    </li>
                    <li>
                        <span className="font-semibold">Session Storage</span>:{' '}
                        Temporär lagring som raderas när du stänger webbläsaren
                    </li>
                    <li>
                        <span className="font-semibold">IndexedDB</span>:{' '}
                        Används för offline-funktionalitet och caching
                    </li>
                    <li>
                        <span className="font-semibold">Web Beacons</span>:{' '}
                        Små transparenta bilder som används för att spåra e-postöppningar
                    </li>
                </ul>
                <p className="text-sm @lg:text-base mb-10">Dessa tekniker behandlas enligt samma principer som cookies och omfattas av ditt samtycke.</p>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Uppdateringar av cookie-policyn</h3>
                <p className="text-sm @lg:text-base mb-10">
                    Vi kan komma att uppdatera denna cookie-policy för att återspegla ändringar i vår användning av cookies eller förändringar i lagstiftningen. 
                    Vi rekommenderar att du regelbundet granskar denna sida. Datum för senaste uppdateringen visas överst på sidan.
                </p>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Frågor om cookies?</h3>
                <p className="text-sm @lg:text-base mb-4">Om du har frågor om vår användning av cookies eller hur du hanterar dem, kontakta oss gärna:</p>
                <Card className="py-6 shadow-none bg-primary/10 mb-10 border-none">
                    <CardContent className="px-6">
                        <div className="text-sm @lg:text-base mb-2"><span className="font-semibold">E-post</span>:{' '}
                            <Link href="mailto:info@bostadsvyn.se" className="text-primary hover:underline underline-offset-2">
                            info@bostadsvyn.se
                            </Link>
                        </div>
                        <div className="text-sm @lg:text-base"><span className="font-semibold">Webbplats</span>:{' '}
                            <Link href={WEB_URL} className="text-primary hover:underline underline-offset-2">
                            www.bostadsvyn.se
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <h3 className="text-xl @lg:text-2xl font-semibold mb-2">Mer information</h3>
                <p className="text-sm @lg:text-base mb-4">För mer information om hur vi behandlar dina personuppgifter, läs vår:</p>
                <ul className="list-disc list-inside space-y-2 text-sm @lg:text-base">
                    <li>
                        <Link href="/privacy" className="text-primary hover:underline underline-offset-2">Integritetspolicy</Link> -{' '}
                        Läs om hur vi hanterar dina personuppgifter enligt GDPR
                    </li>
                    <li>
                        <Link href="/terms" className="text-primary hover:underline underline-offset-2">Användarvillkor</Link> -{' '}
                        Läs om reglerna för att använda Bostadsvyn
                    </li>
                </ul>
            </ContainerWrapper>
        </div>
    )
}

export default CookiePolicy