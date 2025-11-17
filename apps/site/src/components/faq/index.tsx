import ContainerWrapper from "@/components/common/container-wrapper"
import { CircleQuestionMarkIcon, MailIcon, MessageCircleIcon, PhoneIcon, SearchIcon, SparklesIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

const faqs = [
    {
        valueKey: "general",
        title: "Allmänt om Bostadsvyn",
        items: [
            {
                question: "Vad är Bostadsvyn?",
                answer: "Bostadsvyn är Sveriges modernaste fastighetsplattform som kombinerar traditionell bostadsförmedling med avancerad AI-teknologi. Vi erbjuder det bredaste utbudet av bostäder i Sverige - från villor och lägenheter till fritidshus, tomter och kommersiella fastigheter."
            },
            {
                question: "Kostar det något att använda Bostadsvyn?",
                answer: "Det är helt gratis att söka och titta på bostäder på Bostadsvyn. För privatpersoner som vill sälja eller hyra ut sin bostad finns olika annonspaket - från gratis grundannons till premiumpaket med AI-verktyg. Mäklare har tillgång till en professionell mäklarportal med särskilda funktioner."
            },
            {
                question: "Hur skiljer sig Bostadsvyn från andra bostadssajter?",
                answer: "Vi är unika genom vår integration av AI-verktyg som homestyling, prisanalys och smart sökassistent. Vi erbjuder också digitala hyreskontrakt med BankID, kostnadskalkylator och en omfattande mäklarportal. Vår plattform täcker alla bostadstyper på samma ställe."
            },
            {
                question: "Är Bostadsvyn säkert att använda?",
                answer: "Ja, säkerhet är vår högsta prioritet. Alla användare verifieras med BankID, vi använder kryptering för känslig data, och alla transaktioner går genom säkra betalningssystem. Vi följer GDPR och har strikta policies för dataskydd."
            }
        ]
    },
    {
        valueKey: "buy-home",
        title: "Köpa bostad",
        items: [
            {
                question: "Hur söker jag efter bostäder?",
                answer: "Du kan söka på flera sätt: använd sökfältet på startsidan, filtrera efter område/pris/storlek, bläddra på kartan, eller låt vår AI-sökassistent rekommendera bostäder baserat på dina preferenser. AI:n lär sig av ditt beteende och föreslår bostäder du kanske missat."
            },
            {
                question: "Vad är AI-sökassistenten?",
                answer: "AI-sökassistenten är en intelligent tjänst som lär sig dina preferenser genom att analysera vilka bostäder du tittar på, sparar och är intresserad av. Den skickar automatiska notiser när nya relevanta bostäder läggs ut och kan upptäcka dolda mönster i vad du söker."
            },
            {
                question: "Hur fungerar prisanalysen?",
                answer: "Vår AI-drivna prisanalys använder historiska transaktionsdata, aktuella marknadsförhållanden och prediktionsmodeller för att ge trovärdiga värderingar. Du får inte bara ett pris utan också ett konfidensintervall och kan se prognoser för framtida värdeutveckling."
            },
            {
                question: "Kan jag spara favoriter?",
                answer: "Ja, logga in och klicka på hjärtikonen på de bostäder du gillar. Du kan också skapa familjegrupper där flera personer kan dela och diskutera favoritbostäder tillsammans."
            },
            {
                question: "Hur kontaktar jag en mäklare eller säljare?",
                answer: `Klicka på "Kontakta" på bostadsannonsen. För annonser från mäklare får du direkt kontaktinformation. För privatannonser kan du skicka meddelanden via plattformen.`
            },
            {
                question: "Vad är AI-homestyling?",
                answer: "AI-homestyling låter dig visualisera hur tomma eller omöblerade rum kan se ut när de är inredda. Verktyget använder avancerad AI för att skapa fotorealistiska bilder med olika inredningsstilar på sekunder."
            }
        ]
    },
    {
        valueKey: "sell-home",
        title: "Sälja bostad",
        items: [
            {
                question: "Hur säljer jag min bostad via Bostadsvyn?",
                answer: "Du har två alternativ: antligen annonserar du direkt som privatperson (välj mellan gratis, Plus eller Premium-paket) eller så anlitar du en av våra certifierade mäklare som får tillgång till professionella verktyg via mäklarportalen."
            },
            {
                question: "Vilka annonspaket finns?",
                answer: "Grundpaket (gratis): standard annonsstorlek, 10 bilder. Pluspaket (1995 kr): 50% större annons, 20 bilder, förnyelse varje månad, grundläggande statistik. Exklusivpaket (3995 kr): dubbelt så stor annons, obegränsat bilder, AI-verktyg (homestyling, bildredigering), förnyelse var 3:e vecka, detaljerad statistik."
            },
            {
                question: "Vad ingår i AI-verktygen?",
                answer: "Exklusivpaket inkluderar: AI-homestyling (inred tomma rum digitalt), AI-bildredigering (lägg till pool, terrass etc), prisanalys, automatisk textgenerering för annonser, och detaljerad besöksstatistik med insights."
            },
            {
                question: "Måste jag använda mäklare?",
                answer: `Nej, du kan lägga upp annonsen själv som privatperson. Men kom ihåg att endast certifierade mäklare kan publicera "Till salu"-annonser med juridisk rådgivning. Som privatperson kan du däremot hyra ut din bostad direkt via plattformen.`
            },
            {
                question: "Hur länge gäller min annons?",
                answer: "Grundpaket: ingen automatisk förnyelse. Pluspaket: förnyas automatiskt varje månad. Exklusivpaket: förnyas var 3:e vecka för maximal synlighet. Du kan när som helst pausa eller ta bort annonsen."
            }
        ]
    },
    {
        valueKey: "rent-home",
        title: "Hyra ut bostad",
        items: [
            {
                question: "Hur hyr jag ut min bostad?",
                answer: `Skapa ett konto, klicka på "Skapa hyresannons" och fyll i information om bostaden. Du kan ladda upp bilder, sätta hyra och villkor. När annonsen är publicerad kan intressenter kontakta dig direkt via plattformen.`
            },
            {
                question: "Vad är digitala hyreskontrakt?",
                answer: "Våra digitala hyreskontrakt skapas automatiskt baserat på din information och gällande hyreslagstiftning. Både du och hyresgästen signerar med BankID vilket är juridiskt bindande. Kontraktet sparas säkert i molnet och är alltid tillgängligt."
            },
            {
                question: "Behöver jag själv skriva hyreskontrakt?",
                answer: "Nej, systemet genererar kompletta kontrakt automatiskt. Alla mallar är granskade av jurister och följer svensk hyreslagstiftning. Du behöver bara fylla i grunduppgifter så tar systemet hand om resten."
            },
            {
                question: "Hur får jag betalt för hyran?",
                answer: "Du kan välja betalmetod i kontraktet. Vi rekommenderar automatiska banköverföringar eller autogiro. Plattformen skickar påminnelser om betalningar automatiskt."
            },
            {
                question: "Vad händer om hyresgästen inte betalar?",
                answer: "Du får automatiska notiser om försenade betalningar. Kontraktet inkluderar uppsägningsregler enligt hyreslagen. Vid tvister rekommenderar vi att kontakta Hyresnämnden."
            }
        ]
    },
    {
        valueKey: "brokers",
        title: "Mäklare & Professionella",
        items: [
            {
                question: "Hur blir jag mäklare på Bostadsvyn?",
                answer: `Du måste vara licensierad fastighetsmäklare och medlem i Fastighetsmäklarinspektionen. Ansök via "Mäklare"-knappen, verifiera din legitimation med BankID, och få tillgång till mäklarportalen med alla professionella verktyg.`
            },
            {
                question: "Vad ingår i mäklarportalen?",
                answer: "Kundhantering, automatisk annonsering, AI-verktyg för homestyling och bildredigering, prisanalysverktyg, visningsschemaläggning, statistik och rapporter, dokumenthantering, och CRM-funktioner för att hålla kontakt med kunder."
            },
            {
                question: "Kostar det något att använda mäklarportalen?",
                answer: "Mäklarportalen har olika prenumerationsplaner beroende på volym och funktioner. Kontakta oss på maklare@bostadsvyn.se för prisuppgifter och demoversion."
            },
            {
                question: "Kan jag importera befintliga annonser?",
                answer: "Ja, mäklarportalen har integrationer med de flesta fastighetssystem. Du kan importera annonser, bilder och kund information automatiskt."
            },
            {
                question: "Hur fungerar samarbetet med andra mäklare?",
                answer: "Du kan dela annonser med kollegor, samarbeta i team och hålla transparens kring kunder. Portalen stödjer multi-office setup för större mäklarkedjor."
            }
        ]
    },
    {
        valueKey: "account",
        title: "Konto & Inställningar",
        items: [
            {
                question: "Hur skapar jag ett konto?",
                answer: `Klicka på "Logga in" och sedan "Skapa konto". Du behöver ange e-post och lösenord eller logga in direkt med BankID. BankID ger dig tillgång till fler funktioner som att skapa annonser och signera kontrakt.`
            },
            {
                question: "Varför behövs BankID?",
                answer: `BankID krävs för att säkerställa att alla användare är verifierade. Det förhindrar bluffannonser och skapar en säker miljö för köpare, säljare och mäklare. BankID krävs för att publicera annonser och signera hyreskontrakt.`
            },
            {
                question: "Kan jag ändra mina kontaktuppgifter?",
                answer: `Ja, gå till "Profil" via användarmenyn. Där kan du uppdatera e-post, telefonnummer, adress och andra uppgifter. Vissa ändringar kan kräva BankID-verifikation för säkerhet.`
            },
            {
                question: "Hur raderar jag mitt konto?",
                answer: "Gå till Profil > Inställningar > Radera konto. Observera att alla dina annonser, meddelanden och sparade favoriter kommer att tas bort. Detta kan inte ångras. Kontraktsdata sparas enligt juridiska krav."
            },
            {
                question: "Glömde lösenord - hur återställer jag?",
                answer: `Klicka på "Glömt lösenord?" på inloggningssidan. Ange din e-post så skickar vi en återställningslänk. Om du har BankID kan du också logga in direkt med det.`
            }
        ]
    },
    {
        valueKey: "ai-tools",
        title: "AI-verktyg & Funktioner",
        items: [
            {
                question: "Vilka AI-verktyg finns tillgängliga?",
                answer: "Vi erbjuder: AI-homestyling (virtuell inredning), AI-bildredigering (lägg till/ta bort element), prisanalys & prognoser, AI-sökassistent (personliga rekommendationer), automatisk textgenerering för annonser, och kostnadskalkylator."
            },
            {
                question: "Hur exakt är AI-prisanalysen?",
                answer: `Vår AI analyserar över 200 parametrar från historisk data, aktuella transaktioner och marknadsförhållanden. Precisionen är typiskt inom 5-10% av faktiskt slutpris. Du får alltid ett konfidensintervall för att förstå osäkerheten.`
            },
            {
                question: "Kan AI-homestyling användas kommersiellt?",
                answer: `Ja, bilder genererade med vår AI kan användas i kommersiella annonser. Observera att bilderna är avsedda som visualiseringar och ska markeras som "AI-genererad virtuell inredning" i annonser.`
            },
            {
                question: "Sparas mina AI-genererade bilder?",
                answer: "Ja, alla bilder du genererar sparas i din profil och kan återanvändas. Premium-användare får obegränsad lagring. Grundanvändare kan spara upp till 50 AI-genererade bilder."
            },
            {
                question: "Fungerar AI-verktygen på mobilen?",
                answer: "Ja, alla AI-verktyg är optimerade för mobil. AI-homestyling och bildredigering fungerar lika bra på telefon som på dator, även om en större skärm ger bättre översikt vid redigering."
            }
        ]
    },
    {
        valueKey: "payment",
        title: "Betalning & Priser",
        items: [
            {
                question: "Vilka betalningsmetoder accepteras?",
                answer: "Vi accepterar alla svenska kreditkort (Visa, Mastercard), Swish, banköverföring och faktura för företag. Alla betalningar är krypterade och säkrade via PCI DSS-certifierade leverantörer."
            },
            {
                question: "Kan jag få återbetalning?",
                answer: "Annonspaket har 14 dagars öppet köp från publiceringsdatum. Om du inte är nöjd får du pengarna tillbaka. Efter 14 dagar ges ingen återbetalning men du kan pausa/ta bort annonsen när som helst."
            },
            {
                question: "Vad händer om min annons inte säljs?",
                answer: "Ditt annonspaket gäller under hela perioden oavsett om bostaden säljs eller inte. Du kan när som helst uppgradera till ett bättre paket eller förlänga annonsen när den löper ut."
            },
            {
                question: "Finns det rabatter för flera annonser?",
                answer: "Ja, om du annonserar flera bostäder samtidigt får du volymrabatt. Kontakta oss på info@bostadsvyn.se för offert. Mäklare har särskilda företagspriser."
            },
            {
                question: "Hur får jag kvitto på min betalning?",
                answer: "Kvitto skickas automatiskt till din e-post efter genomförd betalning. Du hittar också alla dina kvitton under Profil > Betalningar > Kvitton."
            }
        ]
    },
    {
        valueKey: "security",
        title: "Säkerhet & Integritet",
        items: [
            {
                question: "Hur skyddar ni min personliga information?",
                answer: "Vi följer GDPR strikt. All data krypteras, lagras säkert i EU, och delas aldrig med tredje part utan ditt samtycke. Du har full kontroll över dina uppgifter och kan när som helst begära utdrag eller radering."
            },
            {
                question: "Är mina betalningsuppgifter säkra?",
                answer: "Ja, vi sparar aldrig dina kortuppgifter. Alla betalningar hanteras av PCI DSS-certifierade betaltjänster (Stripe/Klarna). Vi ser aldrig ditt kortnum mer eller säkerhetskod."
            },
            {
                question: "Vem kan se mina personuppgifter?",
                answer: "Endast du och de du aktivt delar information med (t.ex. när du kontaktar en mäklare) kan se dina uppgifter. Mäklare ser endast kontaktinformation du valt att dela. Administratörer har begränsad åtkomst för support."
            },
            {
                question: "Kan jag använda pseudonym/falsk identitet?",
                answer: "Nej, för att upprätthålla säkerhet måste alla användare verifieras med BankID. Detta förhindrar bedrägerier och skapar förtroende på plattformen. Du kan dock välja vad som visas publikt i dina annonser."
            },
            {
                question: "Vad händer med mina uppgifter om jag raderar kontot?",
                answer: "Din profildata och aktivitet raderas permanent. Viss data som kontraktshistorik kan behöva sparas enligt lag i upp till 7 år. Efter kontoborttagning kan data inte återställas."
            }
        ]
    },
    {
        valueKey: "technical-support",
        title: "Teknisk Support",
        items: [
            {
                question: "Jag får inte upp någon bostad på kartan, vad gör jag?",
                answer: "Prova att zooma ut, byt kartvy (satellit/karta), eller uppdatera sidan. Kontrollera att du tillåtit platsåtkomst i webbläsaren. Om problemet kvarstår, rensa webbläsarens cache eller prova en annan webbläsare."
            },
            {
                question: "Bilder laddas inte - hur fixar jag det?",
                answer: "Detta beror ofta på långsam internetanslutning. Prova att uppdatera sidan, rensa cache, eller använd en annan webbläsare. Om problemet kvarstår kan det vara tillfälliga serverproblem - vänta några minuter och försök igen."
            },
            {
                question: "Min annons publicerades inte, varför?",
                answer: "Annonser granskas innan publicering (tar max 24h). Vanliga orsaker till avslag: otydliga bilder, felaktig information, bristande BankID-verifikation, eller brott mot våra riktlinjer. Du får alltid ett e-postmeddelande med förklaring."
            },
            {
                question: "Funkar sajten på mobil och surfplatta?",
                answer: "Ja, Bostadsvyn är helt responsiv och fungerar på alla enheter. Vissa AI-funktioner kan vara enklare att använda på större skärmar, men all grundfunktionalitet fungerar på mobil."
            },
            {
                question: "Vilka webbläsare stöds?",
                answer: "Vi stödjer de senaste versionerna av Chrome, Firefox, Safari och Edge. För bästa upplevelse rekommenderar vi att hålla din webbläsare uppdaterad. Internet Explorer stöds inte längre."
            },
            {
                question: "Hur kontaktar jag support?",
                answer: `Du kan chatta med vår AI-supportbot direkt här på sidan för snabba svar. För mer komplexa ärenden, mejla support@bostadsvyn.se eller ring 08-123 45 67 (vardagar 9-17). Inloggade användare kan också skicka meddelanden via "Hjälp"-sektionen.`
            }
        ]
    }
]

const Faq = () => {
    return (
        <div className="@container">
            <ContainerWrapper className="py-10">
                <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5 gap-1.5">
                        <CircleQuestionMarkIcon size={18} />
                        Support & Hjälp
                    </div>
                </div>

                <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">Frågor & Svar</h1>
                <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                    Hittar du inte svaret du söker? Chatta med vår AI-supportbot som kan hjälpa dig direkt!
                </p>

                <div className="flex justify-center mb-10">
                    <InputGroup className="max-w-2xl text-sm h-12">
                        <InputGroupInput placeholder="Sök efter frågor..." />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <div className="flex justify-center mb-14">
                    <Button size="lg" className="rounded-full py-6 w-full max-w-72">
                        <MessageCircleIcon />
                        Chatta med AI-supportbot
                        <SparklesIcon />
                    </Button>
                </div>

                <div className="max-w-4xl flex flex-col mx-auto gap-8 mb-12">
                    {faqs.map((faq) => (
                        <Card key={`faqs-${faq.valueKey}`} className="pt-6 pb-2 shadow-xs">
                            <CardContent className="px-6">
                                <h3 className="text-xl @lg:text-2xl text-primary font-semibold tracking-tight mb-4">{faq.title}</h3>

                                <Accordion type="single" collapsible className="w-full">
                                    {faq.items.map((item, index) => (
                                        <AccordionItem value={`${faq.valueKey}-${index + 1}`} key={`${faq.valueKey}-${index}`}>
                                            <AccordionTrigger className="text-base cursor-pointer">{item.question}</AccordionTrigger>
                                            <AccordionContent className="flex flex-col gap-4">
                                                <p className="text-muted-foreground">{item.answer}</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>            
                            </CardContent>
                        </Card>
                    ))} 
                </div>

                <Card className="py-8 bg-primary/10 shadow-xs max-w-4xl mx-auto">
                    <CardContent className="px-6">
                        <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">Behöver du mer hjälp?</h2>
                        <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
                            Vår AI-supportbot är tillgänglig dygnet runt för att svara på dina frågor. För komplexa ärenden kan du också kontakta vår mänskliga support.
                        </p>
                        <div className="flex flex-col @lg:flex-row flex-wrap gap-4 justify-center">
                            <Button className="text-sm @lg:text-base py-6 w-full @lg:w-52 rounded-full">
                                <MessageCircleIcon />
                                AI-Support (24/7)
                            </Button>
                            <Link href="mailto:support@bostadsvyn.se" className="max-w-96">
                                <Button variant="outline" className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-64 rounded-full">
                                    <MailIcon />
                                    support@bostadsvyn.se
                                </Button>
                            </Link>
                            <Link href="tel:+461234567" className="max-w-96">
                                <Button variant="outline" className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-44 rounded-full">
                                    <PhoneIcon />
                                    08-123 45 67
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </ContainerWrapper>
        </div>
    )
}

export default Faq