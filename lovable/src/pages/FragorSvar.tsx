import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import SEOOptimization from '@/components/seo/SEOOptimization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, MessageCircle, Sparkles } from 'lucide-react';
import AISupportChat from '@/components/AISupportChat';

const FragorSvar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);

  const faqCategories = [
    {
      category: 'Allmänt om Bostadsvyn',
      questions: [
        {
          q: 'Vad är Bostadsvyn?',
          a: 'Bostadsvyn är Sveriges modernaste fastighetsplattform som samlar alla bostadstyper på ett ställe - något Sverige tidigare saknat. Plattformen skapades av en tidigare fastighetsmäklare och säljare med 5 års branscherfarenhet som förstår behoven hos alla parter: mäklare, säljare, köpare, investerare och hyresvärdar. Målet är att förenkla bostadsresan från start till slut genom att kombinera personlig erfarenhet med modern teknik, oavsett vilken typ av bostad du söker.'
        },
        {
          q: 'Kostar det något att använda Bostadsvyn?',
          a: 'Att söka och titta på bostäder är helt gratis. För användare finns Pro-prenumerationer med AI-verktyg: Pro (299 kr/mån ink. moms, 50 AI-bilder) och Pro+ (499 kr/mån ink. moms, obegränsat). Företagskonton: Pro (499 kr/mån ex. moms) och Pro+ (699 kr/mån ex. moms). För mäklare finns tre annonspaket: Grundpaket (gratis), Pluspaket (1 995 kr) och Exklusivpaket (3 995 kr). Säljaren betalar för annonsen efter godkännande.'
        },
        {
          q: 'Hur skiljer sig Bostadsvyn från andra bostadssajter?',
          a: 'Vi är Sveriges enda plattform som samlar ALLA bostadstyper (villor, lägenheter, fritidshus, tomter, kommersiella, hyresrätter, nyproduktion) på ett ställe, så du slipper besöka 4-5 olika sajter. Skapad av en tidigare mäklare och säljare som förstår alla parters behov. Unika AI-verktyg som låter besökare visualisera inredning och renoveringar direkt i Exklusivpaket-annonser. Omfattande realtidsstatistik för mäklare, digitala hyreskontrakt med BankID-signering, och automatiska annonsförnyelser.'
        },
        {
          q: 'Är Bostadsvyn säkert att använda?',
          a: 'Ja, säkerhet är vår högsta prioritet. Alla användare som publicerar annonser verifieras med BankID, vilket förhindrar bluffannonser. Betalningar hanteras via Stripe som stödjer Klarna, kort, Swish, Apple Pay och Google Pay. Hyreskontrakt signeras med BankID för juridisk säkerhet. All data krypteras och lagras säkert i EU enligt GDPR. Vi delar aldrig din information med tredje part.'
        }
      ]
    },
    {
      category: 'Köpa bostad',
      questions: [
        {
          q: 'Hur söker jag efter bostäder?',
          a: 'Använd sökfältet på startsidan med filter för område, pris, storlek, bostadstyp och transaktionstyp (köp/hyra). Du kan även bläddra på kartan för att hitta bostäder geografiskt. För nyproduktion finns särskilda projektsidor med alla tillgängliga lägenheter. Spara favoriter genom att klicka på hjärtikonen.'
        },
        {
          q: 'Vad är nyproduktion och hur fungerar det?',
          a: 'Nyproduktion är nya bostadsprojekt som ännu inte är färdigbyggda. Annonser för nyproduktion visas med en "Nyproduktion"-badge. Hela projekt har dedikerade projektsidor som visar projektinformation och alla tillgängliga enheter. Varje enskild lägenhet/enhet har också sin egen detaljsida.'
        },
        {
          q: 'Kan jag spara favoriter?',
          a: 'Ja, logga in och klicka på hjärtikonen på bostäder du gillar. Dina sparade favoriter visas i din profil. Mäklare kan se totalt antal sparade favoriter för sina objekt i mäklarportalen, vilket ger värdefull feedback på intresset.'
        },
        {
          q: 'Hur kontaktar jag en mäklare eller säljare?',
          a: 'Klicka på "Kontakta" eller "Skicka e-post" på bostadsannonsen. Kontaktinformationen visas direkt och du kan skicka e-post som förifylls automatiskt med objektinformation för enkel kommunikation.'
        },
        {
          q: 'Vad är AI-homestyling?',
          a: 'AI-homestyling låter dig visualisera hur tomma eller omöblerade rum kan se ut möblerade. Tillgänglig för Pro-medlemmar (egna verktyg) och besökare på Exklusivpaket-annonser (interaktivt). Verktyget kan möblera rum, ändra golv, väggar och tak, byta färger, renovera badrum och kök, lägga till trappor, garderober, gardiner, belysning och mycket mer. Genererar fotorealistiska bilder i realtid med olika inredningsstilar.'
        },
        {
          q: 'Vad är "bevakare"?',
          a: 'Bevakare är personer som registrerat intresse för att få meddelande när slutpriset för en bostad publiceras. Mäklare ser antalet bevakare i mäklarportalen under statistik för varje objekt, vilket visar hur stort intresset är.'
        }
      ]
    },
    {
      category: 'Sälja bostad (för mäklare)',
      questions: [
        {
          q: 'Hur fungerar annonsprocessen?',
          a: 'Mäklare skapar annonsen i mäklarportalen och fyller i all information. Sedan skickas annonsen som en köplänk till säljaren. Säljaren loggar in i sitt konto, granskar all information, godkänner annonsen och betalar via Stripe Checkout (Klarna, kort, Swish m.m.). Efter betalningen publiceras annonsen automatiskt. Både mäklare och säljare får bekräftelse via e-mail.'
        },
        {
          q: 'Vem betalar för annonsen?',
          a: 'Säljaren betalar för annonsen via Stripe Checkout efter att ha godkänt mäklarens förslag. Mäklaren väljer rekommenderat paket (Exklusivpaket är förvalt), men säljaren kan välja mellan alla tre paket innan betalning. Betalningsmetoder: Klarna (faktura efter 3 månader), kort, Swish, Apple Pay, Google Pay.'
        },
        {
          q: 'Vilka annonspaket finns?',
          a: 'Grundpaket (gratis): Standardannons, 10 bilder, ingen automatisk förnyelse, förnyelse kan köpas för 399 kr. Pluspaket (1 995 kr): 50% större annons, 20 bilder, obegränsade gratis förnyelser varje månad (valfritt betala 699 kr för extra förnyelse), grundstatistik. Exklusivpaket (3 995 kr): Dubbelt så stor annons, obegränsat bilder, AI-verktyg (besökare kan homestyla och bildredigera), obegränsade gratis förnyelser var 3:e vecka (valfritt betala 699 kr för extra), detaljerad statistik.'
        },
        {
          q: 'Vad ingår i AI-verktygen för Exklusivpaket?',
          a: 'Exklusivpaket ger besökare interaktiv tillgång till: 1) AI-homestyling: Inreda rum, möblera/ta bort möbler, renovera badrum/kök, ändra golv/väggar/tak/färger, lägga till trappor, garderober, gardiner, belysning, inomhuspool, spa, bastu. 2) AI-bildredigering: Lägga till pooler, terrasser, balkonger, garage, attefallshus, våningsplan, byta tak/fasad/fönster/dörrar, förbättra trädgårdar, vegetation, staket. Mäklare ser statistik över hur många besökare som använt verktygen.'
        },
        {
          q: 'Måste jag vara mäklare för att sälja?',
          a: 'Ja, för att publicera "Till salu"-annonser måste du vara certifierad fastighetsmäklare och medlem i Fastighetsmäklarinspektionen. Privatpersoner kan däremot hyra ut sin bostad direkt via plattformen med digitala hyreskontrakt och BankID-signering, eller använda Pro-prenumerationer för AI-verktyg.'
        },
        {
          q: 'Hur länge gäller min annons?',
          a: 'Grundpaket: Annonsen ligger ute tills du tar bort den. Ingen automatisk förnyelse men kan förnyas manuellt för 399 kr exakt 30 dagar (beräknat på exakt tidsstämpel) efter publicering/senaste förnyelse. Pluspaket: Obegränsade gratis förnyelser varje 30:e dag (valfritt betala 699 kr för extra förnyelse). Exklusivpaket: Obegränsade gratis förnyelser varje 21:a dag (valfritt betala 699 kr för extra). Förnyelsedatum visas exakt i mäklarportalen. Mäklaren utför alla förnyelser.'
        }
      ]
    },
    {
      category: 'Mäklarportal & Professionella verktyg',
      questions: [
        {
          q: 'Hur blir jag mäklare på Bostadsvyn?',
          a: 'Du måste vara licensierad fastighetsmäklare och medlem i Fastighetsmäklarinspektionen. Ansök via "Mäklare"-knappen i navigationen, verifiera din legitimation med BankID, och få omedelbar tillgång till mäklarportalen med alla professionella verktyg. Plattformen skapades av en tidigare mäklare med 5 års erfarenhet.'
        },
        {
          q: 'Vad ingår i mäklarportalen?',
          a: 'Mäklarportalen innehåller: Annonshantering för alla dina objekt, realtidsstatistik (sidvisningar idag/veckan/totalt, sparade favoriter, bevakare, bildredigerare och redigerade bilder för Exklusiv), unikt AnnonsID för varje objekt, förnyelsedatum för Plus och Exklusiv, lead-hantering, sökning på adress eller AnnonsID, och möjlighet att skicka annonser till säljare för godkännande.'
        },
        {
          q: 'Vilken statistik kan jag se för mina objekt?',
          a: 'För försäljningsobjekt: Sidvisningar (idag/vecka/totalt), sparade favoriter, bevakare (intresserade av slutpris), mäklardetaljer, telefon/e-post-statistik, webbplatsklick, och för Exklusiv-annonser även antal unika bildredigerare och totalt antal redigerade bilder. För uthyrning: Grundstatistik med visningar, chattstatistik (ikoner-klick, nya meddelanden), utan AI-verktyg eller slutprisbevakning.'
        },
        {
          q: 'Vad är ett AnnonsID?',
          a: 'Varje annons får ett unikt AnnonsID som visas i mäklarportalen (format: #abc12345). Du kan använda detta ID för att snabbt hitta och referera till specifika objekt. Sökfunktionen i portalen stödjer sökning på både adress och AnnonsID. ID:t är max 20 tecken långt och visas tydligt på annonskortet.'
        },
        {
          q: 'Hur fungerar annonsprocessen med säljaren?',
          a: 'Mäklaren skapar annonsen i mäklarportalen (annonstitel max 20 tecken, Exklusivpaket förvalt). Kan förhandsgranska annons och justera bildordning. Fyller i säljarens faktureringsadress (autopopuleras från mäklarens affärssystem). Skickar annonsen som köplänk till säljaren. Säljaren loggar in, granskar alla detaljer i tre expanderbara paket-kort (Exklusivpaket öppet först), kan redigera faktureringsadress, väljer paket, och betalar via Stripe Checkout. Efter betalning publiceras annonsen automatiskt och både mäklare och säljare får bekräftelse via e-mail (Resend).'
        },
        {
          q: 'Kostar det något att använda mäklarportalen?',
          a: 'Tillgång till mäklarportalen är gratis för verifierade mäklare. Du betalar endast för de annonspaket säljaren väljer: Grund (gratis), Plus (1 995 kr), eller Exklusiv (3 995 kr). Säljaren betalar via Stripe Checkout efter godkännande. Kontakta maklare@bostadsvyn.se för volymrabatter vid flera objekt.'
        }
      ]
    },
    {
      category: 'Hyra ut bostad',
      questions: [
        {
          q: 'Hur hyr jag ut min bostad?',
          a: 'Skapa ett konto, klicka på "Skapa hyresannons" och fyll i information om bostaden. Ladda upp bilder, sätt hyra och villkor. När annonsen är publicerad kan intressenter kontakta dig. Både privatpersoner och företag kan lägga upp hyresannonser. För uthyrning används separata statistiksidor för "Privatperson" och "Företag" med fokus på visningar och chattstatistik.'
        },
        {
          q: 'Vad är digitala hyreskontrakt?',
          a: 'Våra digitala hyreskontrakt används via Criipto för säker digital hantering. Kontrakten genereras automatiskt baserat på din information och gällande svensk hyreslagstiftning. Både hyresvärd och hyresgäst signerar med BankID-autentisering vilket är juridiskt bindande. Efter signering får båda parter digitala kopior via e-mail, och kontrakten arkiveras automatiskt och säkert i varje parts användarprofil för framtida referens.'
        },
        {
          q: 'Behöver jag själv skriva hyreskontrakt?',
          a: 'Nej, systemet genererar kompletta kontrakt automatiskt enligt svensk hyreslagstiftning. Alla mallar är juristgranskade. Du behöver bara fylla i grunduppgifter som hyra, period och villkor, så genereras ett komplett och juridiskt giltigt kontrakt automatiskt.'
        },
        {
          q: 'Vilken statistik kan jag se för uthyrningsannonser?',
          a: 'Uthyrningsannonser har separata statistiksidor för "Privatperson" och "Företag"-konton. Statistiken fokuserar på: Grundläggande visningar (dagligen/veckovis), detaljerad chattstatistik (ikon-klick, nya meddelanden, chattgränssnittet), och besökaraktivitet. Hyresannonser inkluderar INTE AI-verktyg eller slutprisbevakning som finns för försäljningsobjekt. Layout och struktur är standardiserad mellan alla kontotyper.'
        },
        {
          q: 'Hur får jag betalt för hyran?',
          a: 'Du anger betalmetod i kontraktet. Vi rekommenderar banköverföring eller autogiro. Plattformen kan skicka automatiska påminnelser om betalningar, men själva betalningen sker direkt mellan dig och hyresgästen utan mellanhänder.'
        },
        {
          q: 'Vad händer om hyresgästen inte betalar?',
          a: 'Du får automatiska notiser om försenade betalningar om du aktiverat påminnelser. Kontraktet inkluderar uppsägningsregler enligt hyreslagen. Vid betalningsproblem eller tvister rekommenderar vi kontakt med Hyresnämnden för juridisk vägledning och tvistlösning.'
        }
      ]
    },
    {
      category: 'Konto & Inställningar',
      questions: [
        {
          q: 'Hur skapar jag ett konto?',
          a: 'Klicka på "Logga in" och sedan "Skapa konto". Registrera med e-post och lösenord eller logga in direkt med BankID. BankID krävs för att publicera annonser, godkänna/betala för annonser, och signera hyreskontrakt. Välj mellan "Privatperson" (299 kr/499 kr ink. moms för Pro/Pro+) eller "Företag" (499 kr/699 kr ex. moms för Pro/Pro+). Mäklare måste vara certifierade av Fastighetsmäklarinspektionen och verifieras med BankID.'
        },
        {
          q: 'Varför behövs BankID?',
          a: 'BankID krävs för att säkerställa att alla som skapar annonser och signerar kontrakt är verifierade. Det förhindrar bluffannonser och skapar en säker miljö. BankID krävs specifikt för: publicering av annonser, signering av digitala hyreskontrakt, verifiering som mäklare, och godkännande av annonser före betalning.'
        },
        {
          q: 'Vad är skillnaden mellan Privatperson och Företag-konto?',
          a: 'Funktionerna är identiska men prissättningen skiljer sig. Privatpersoner betalar 299 kr/mån (ink. moms) för Pro och 499 kr/mån (ink. moms) för Pro+. Företag betalar 499 kr/mån (ex. moms) för Pro och 699 kr/mån (ex. moms) för Pro+. Företagskonton får faktura och momshantering anpassad för företag.'
        },
        {
          q: 'Kan jag ändra mina kontaktuppgifter?',
          a: 'Ja, gå till "Profil" via användarmenyn. Där kan du uppdatera e-post, telefonnummer, adress och andra uppgifter. Vissa ändringar kan kräva BankID-verifikation för säkerhet, särskilt ändringar av känslig information eller mäklarstatus. Du kan också hantera din Pro/Pro+-prenumeration via Stripe Customer Portal.'
        },
        {
          q: 'Hur raderar jag mitt konto?',
          a: 'Gå till Profil > Inställningar > Radera konto. Observera att alla dina annonser, meddelanden och sparade favoriter tas bort permanent. Detta kan inte ångras. Kontraktsdata och Stripe-betalningar måste sparas enligt lag i upp till 7 år för bokföring och skatterätt. Avsluta eventuella aktiva prenumerationer först.'
        },
        {
          q: 'Glömt lösenord - hur återställer jag?',
          a: 'Klicka på "Glömt lösenord?" på inloggningssidan. Ange din e-post så skickar vi en återställningslänk direkt. Om du registrerat dig med BankID kan du också logga in direkt med det utan att behöva lösenord överhuvudtaget.'
        }
      ]
    },
    {
      category: 'Pro & Pro+ Prenumerationer',
      questions: [
        {
          q: 'Vad är Pro och Pro+?',
          a: 'Pro och Pro+ är kontoprenumerationer som ger dig personlig tillgång till AI-verktyg (AI-homestyling och AI-bildredigering) för egna projekt. Privatpersoner: Pro 299 kr/mån (ink. moms), Pro+ 499 kr/mån (ink. moms). Företag: Pro 499 kr/mån (ex. moms), Pro+ 699 kr/mån (ex. moms). Ingen bindningstid - avsluta när som helst via Stripe Customer Portal. Skiljer sig från Exklusivpaket som ger besökare tillgång till AI-verktyg i annonser.'
        },
        {
          q: 'Vad ingår i Pro-prenumerationen?',
          a: 'Pro ger dig upp till 50 AI-genererade bilder per månad (kombinerat för AI-homestyling och AI-bildredigering). Du kan använda verktygen för att visualisera inredning och redigera fastighetsbilder. Perfekt för privatpersoner som vill testa AI-verktyg eller planera renoveringar. Ingen bindningstid.'
        },
        {
          q: 'Vad ingår i Pro+?',
          a: 'Pro+ ger obegränsad tillgång till alla AI-verktyg utan begränsningar på antal genererade bilder. Du får full tillgång till AI-homestyling och AI-bildredigering, prioriterad support, och framtida premium-funktioner. Bäst för professionella användare och företag. Ingen bindningstid.'
        },
        {
          q: 'Hur skiljer sig Pro/Pro+ från Exklusivpaket?',
          a: 'Pro/Pro+ är personliga prenumerationer som ger DIG tillgång till AI-verktyg för egna projekt. Exklusivpaket (3 995 kr) är ett annonspaket där BESÖKARE kan använda AI-verktyg interaktivt direkt i din annons. Exklusivpaket inkluderar också större annonsyta, obegränsat bilder, förnyelse var 3:e vecka, och detaljerad statistik.'
        },
        {
          q: 'Kan jag avsluta min prenumeration?',
          a: 'Ja, både Pro och Pro+ har ingen bindningstid. Du kan avsluta när som helst via dina kontoinställningar eller Stripe Customer Portal. Prenumerationen fortsätter till slutet av den betalda perioden och förnyas inte automatiskt efter uppsägning.'
        },
        {
          q: 'Vad är skillnaden mellan privatperson och företagskonto?',
          a: 'Företagskonton betalar 200 kr/mån mer än privatpersoner (499 kr vs 299 kr för Pro, 699 kr vs 499 kr för Pro+). Privatpersoners priser är Ink. moms medan företagspriser är Ex. moms. Funktionerna är identiska - skillnaden ligger endast i prissättning och momshantering.'
        }
      ]
    },
    {
      category: 'AI-verktyg & Funktioner',
      questions: [
        {
          q: 'Vilka AI-verktyg finns tillgängliga?',
          a: 'Vi erbjuder två kraftfulla AI-verktyg: 1) AI-homestyling: Visualisera möblerade rum, renovera badrum/kök, ändra golv/väggar/tak/färger, lägga till möbler, trappor, garderober, gardiner, belysning, inomhuspool, spa, bastu. 2) AI-bildredigering: Lägga till pooler, terrasser, balkonger, garage, attefallshus, våningsplan, byta tak/fasad/fönster/dörrar, förbättra trädgårdar, vegetation, staket. Tillgängligt för Pro/Pro+-medlemmar och för besökare på Exklusivpaket-annonser.'
        },
        {
          q: 'Hur fungerar AI-bildredigering?',
          a: 'AI-bildredigering är tillgängligt för Pro-medlemmar (egna projekt) och besökare på Exklusivpaket-annonser (interaktivt i annonsen). Du kan visualisera omfattande förändringar: Lägga till pooler, spa, terrasser, uteplatser, balkonger, altaner, garage, attefallshus, carport, förråd, våningsplan. Byta tak, fasad, fönster, dörrar, entrè, färger. Förbättra trädgårdar, vegetation, staket, infarter. Ta bort oönskade element. Genererar fotorealistiska resultat. Pro: 50 bilder/mån, Pro+: obegränsat. Mäklare ser besöksstatistik för Exklusiv.'
        },
        {
          q: 'Hur fungerar AI-homestyling?',
          a: 'AI-homestyling visualiserar hur rum kan se ut med olika inredningar och renoveringar. Möjligheter inkluderar: Möblera eller ta bort möbler, renovera badrum och kök, ändra golv, väggar, tak och färger, byta köksluckor och vitvaror, lägga till belysning, trappor, garderober, inomhuspool, spa, bastu, gardiner. Verktyget genererar fotorealistiska resultat i realtid med olika stilar (modern, skandinavisk, klassisk). Tillgängligt för Pro-medlemmar (egna projekt) och besökare på Exklusivpaket-annonser (interaktivt).'
        },
        {
          q: 'Kan AI-homestyling användas kommersiellt?',
          a: 'Ja, bilder genererade med AI-homestyling kan användas kommersiellt av Pro/Pro+-medlemmar och i Exklusivpaket-annonser. Bilderna är avsedda som visualiseringar och bör markeras som "AI-genererad visualisering" för transparens gentemot köpare och enligt marknadsföringsregler.'
        },
        {
          q: 'Sparas mina AI-genererade bilder?',
          a: 'Ja, alla bilder som genereras med AI-verktygen sparas automatiskt och kan återanvändas. För Pro-medlemmar sparas bilder i din profil. För Exklusivpaket får du obegränsad lagring och full statistik över användningen. Mäklarportalen visar detaljerad statistik om vilka AI-verktyg besökare använt mest.'
        },
        {
          q: 'Fungerar AI-verktygen på mobilen?',
          a: 'Ja, alla AI-verktyg är fullt optimerade för mobil och fungerar på alla enheter. AI-homestyling och bildredigering fungerar lika bra på telefon som på dator. För mer avancerad redigering eller större översikt kan en större skärm vara att föredra.'
        }
      ]
    },
    {
      category: 'Betalning & Priser',
      questions: [
        {
          q: 'Vilka betalningsmetoder accepteras?',
          a: 'Säljare betalar för annonser via Stripe Checkout efter godkännande av mäklarens förslag. Betalningsmetoder: Klarna (faktura efter 3 månader), alla svenska kreditkort (Visa, Mastercard, American Express), Swish, Apple Pay och Google Pay. Pro/Pro+-prenumerationer hanteras också via Stripe med automatisk fakturering och Customer Portal för hantering. Alla betalningar är säkra, PCI-certifierade och krypterade. Vi sparar aldrig kortuppgifter.'
        },
        {
          q: 'Hur fungerar betalningen för annonser?',
          a: 'Mäklaren skapar annonsen med Exklusivpaket förvalt och skickar köplänk till säljaren. Säljaren loggar in, ser tre expanderbara paket-kort (Exklusivpaket öppet först med fullständig information, Plus och Grund kollapsade). Säljaren kan expandera kort för att läsa information om alla paket, välja önskat paket, redigera faktureringsadress om behövs, och betalar via Stripe Checkout. Efter slutförd betalning publiceras annonsen automatiskt och både mäklare och säljare får e-mailbekräftelse via Resend. 14 dagars öppet köp.'
        },
        {
          q: 'Vad kostar Pro och Pro+?',
          a: 'Privatpersoner (ink. moms): Pro 299 kr/mån (50 AI-bilder/mån), Pro+ 499 kr/mån (obegränsat). Företag (ex. moms): Pro 499 kr/mån (50 AI-bilder/mån), Pro+ 699 kr/mån (obegränsat). Företag betalar 200 kr/mån mer än privatpersoner. Ingen bindningstid - avsluta när som helst via Stripe Customer Portal. Betalas månadsvis via Stripe med automatisk fakturering. AI-bilder inkluderar både homestyling och bildredigering kombinerat.'
        },
        {
          q: 'Kan jag få återbetalning?',
          a: 'Annonspaket har 14 dagars öppet köp från publiceringsdatum. Om du inte är nöjd får du full återbetalning utan frågor. Pro/Pro+-prenumerationer kan avslutas när som helst utan bindningstid, och fortsätter till slutet av den betalda perioden. Efter 14 dagar (annonser) ges ingen återbetalning.'
        },
        {
          q: 'Vad händer om min annons inte säljs?',
          a: 'Ditt annonspaket gäller under hela perioden oavsett försäljning. Plus förnyas automatiskt varje månad, Exklusiv var 3:e vecka, och Grund ligger ute tills du tar bort den. Du kan när som helst uppgradera till bättre paket för ökad synlighet eller avsluta annonsen.'
        },
        {
          q: 'Finns det rabatter för flera annonser?',
          a: 'Ja, vi erbjuder volymrabatter för flera samtidiga annonser. Kontakta oss på info@bostadsvyn.se för offert. Mäklare och mäklarföretag har även särskilda företagspriser och avtal - kontakta maklare@bostadsvyn.se för mer information.'
        },
        {
          q: 'Hur får jag kvitto på min betalning?',
          a: 'Kvitto skickas automatiskt via e-mail efter genomförd betalning via Stripe. Du hittar också alla kvitton och fakturor i Stripe Customer Portal (tillgänglig via dina kontoinställningar). För prenumerationer kan du hantera betalningar, uppdatera betalmetod och se historik i portalen.'
        }
      ]
    },
    {
      category: 'Säkerhet & Integritet',
      questions: [
        {
          q: 'Hur skyddar ni min personliga information?',
          a: 'Vi följer GDPR strikt. All data krypteras vid överföring och lagring, sparas säkert i EU via Supabase, och delas aldrig med tredje part utan uttryckligt samtycke. Du har full kontroll och kan när som helst begära utdrag eller radering av din data via inställningar.'
        },
        {
          q: 'Är mina betalningsuppgifter säkra?',
          a: 'Ja, vi sparar aldrig dina kortuppgifter. Alla betalningar hanteras av Stripe som är PCI DSS-certifierat (högsta säkerhetsstandard för kortbetalningar). Vi ser aldrig ditt kortnummer, CVV eller säkerhetskod. Endast krypterad bekräftelse av betalningen lagras hos oss för kvitto och bokföring.'
        },
        {
          q: 'Vem kan se mina personuppgifter?',
          a: 'Endast du och de du aktivt delar information med. När du kontaktar mäklare ser de din valda kontaktinformation. Mäklare ser statistik som antal bevakare och favoriter, men inte vem de specifika personerna är. Administratörer har begränsad åtkomst endast för support.'
        },
        {
          q: 'Kan jag använda pseudonym?',
          a: 'Nej, för säkerhet och förtroende måste alla som skapar annonser eller signerar kontrakt verifieras med BankID och använda sitt riktiga namn. Detta förhindrar bedrägerier. Du kan dock välja vad som visas publikt i annonser, t.ex. endast mäklarfirmans kontaktinformation.'
        },
        {
          q: 'Vad händer med mina uppgifter om jag raderar kontot?',
          a: 'Din profildata, aktivitet och meddelanden raderas permanent och omedelbart. Viss data som kontraktshistorik, transaktioner och Stripe-betalningar måste enligt lag sparas i upp till 7 år för bokföring och skatterätt. Efter kontoborttagning kan data inte återställas - beslut är permanent.'
        }
      ]
    },
    {
      category: 'Teknisk Support',
      questions: [
        {
          q: 'Jag får inte upp några bostäder på kartan, vad gör jag?',
          a: 'Försök: Zooma ut på kartan, byt kartvy mellan satellit och karta, uppdatera sidan (F5), eller tillåt platsåtkomst i webbläsaren för "hitta nära mig"-funktionen. Om problemet kvarstår, rensa cache (Ctrl+Shift+Delete) eller prova en annan webbläsare. Kontakta support om det fortsätter.'
        },
        {
          q: 'Bilder laddas inte - hur fixar jag det?',
          a: 'Detta beror ofta på långsam internet eller stora bilder. Försök: Uppdatera sidan (F5), rensa cache (Ctrl+Shift+Delete), eller använd en annan webbläsare. Om problemet fortsätter kan det vara tillfälliga serverproblem - vänta några minuter. Kontakta support vid kvarstående problem.'
        },
        {
          q: 'Min annons publicerades inte, varför?',
          a: 'För mäklare: Annonsen måste godkännas och betalas av säljaren via Stripe Checkout innan publicering. Kontrollera att säljaren fått köplänken och har genomfört betalningen. Vanliga orsaker till problem: otydliga eller för få bilder, ofullständig information, bristande BankID-verifikation, eller brott mot riktlinjer. Båda parter får e-post vid publicering.'
        },
        {
          q: 'Fungerar sajten på mobil och surfplatta?',
          a: 'Ja, Bostadsvyn är helt responsiv och optimerad för alla enheter. Alla funktioner inklusive AI-verktyg (Pro/Pro+), mäklarportalen och statistik fungerar på mobil. Vissa funktioner som bildredigering kan vara enklare på större skärmar, men fungerar fullt ut även på mobil.'
        },
        {
          q: 'Vilka webbläsare stöds?',
          a: 'Vi stödjer senaste versionerna av Chrome, Firefox, Safari och Edge. För bästa upplevelse och säkerhet rekommenderar vi att hålla webbläsaren uppdaterad. Internet Explorer stöds inte då den inte uppfyller moderna säkerhetskrav, webb-standarder, eller Stripe Checkout-krav.'
        },
        {
          q: 'Hur kontaktar jag support?',
          a: 'Chatta med vår AI-supportbot direkt här på sidan för snabba svar 24/7. För mer komplexa ärenden eller personlig hjälp, mejla support@bostadsvyn.se eller ring 08-123 45 67 (vardagar 9-17). Mäklare kan kontakta maklare@bostadsvyn.se för specifika frågor. För prenumerationsfrågor kan du också använda Stripe Customer Portal.'
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      searchQuery === '' || 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization 
        title="Frågor & Svar - Allt om Bostadsvyn | Bostadsvyn"
        description="Hitta svar på vanliga frågor om att köpa, sälja och hyra bostäder via Bostadsvyn. AI-verktyg, priser, säkerhet och mycket mer."
        keywords="frågor och svar, FAQ, bostadsvyn hjälp, support, AI-verktyg, hyreskontrakt, prisanalys"
      />
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="accent" className="mb-4">
            <HelpCircle className="h-4 w-4 mr-1" />
            Support & Hjälp
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Frågor & Svar
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Hittar du inte svaret du söker? Chatta med vår AI-supportbot som kan hjälpa dig direkt!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Sök efter frågor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* AI Chat Button */}
          <button
            onClick={() => setShowChat(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            Chatta med AI-supportbot
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category, idx) => (
            <Card key={idx} className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {filteredCategories.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Inga resultat hittades</h3>
                <p className="text-muted-foreground mb-4">
                  Prova att söka med andra ord eller använd AI-supportboten för att få hjälp!
                </p>
                <button
                  onClick={() => setShowChat(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                >
                  <MessageCircle className="h-5 w-5" />
                  Öppna AI-support
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <Card className="max-w-4xl mx-auto mt-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Behöver du mer hjälp?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Vår AI-supportbot är tillgänglig dygnet runt för att svara på dina frågor. För komplexa ärenden kan du också kontakta vår mänskliga support.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                AI-Support (24/7)
              </button>
              <a
                href="mailto:support@bostadsvyn.se"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
              >
                📧 support@bostadsvyn.se
              </a>
              <a
                href="tel:+46812345 67"
                className="inline-flex items-center gap-2 px-6 py-3 bg-background border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
              >
                📞 08-123 45 67
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* AI Support Chat Component */}
      {showChat && <AISupportChat onClose={() => setShowChat(false)} />}

      <LegalFooter />
    </div>
  );
};

export default FragorSvar;
