// =============================================================================
// TYPE IMPORTS
// =============================================================================

import {
  AlertCircle,
  Award,
  BarChart3,
  Bot,
  Building,
  Calculator,
  CheckCircle,
  Clock,
  Droplet,
  Euro,
  FileText,
  Leaf,
  LucideIcon,
  MapPin,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Wand2,
  Wifi,
  Zap,
} from "lucide-react";
import type { Project } from "@/components/new-production/project-card";
import type { PropertySearchInput } from "@/trpc/routes/property";
import type {
  Advantage,
  ComplianceItem,
  DocumentItem,
  FounderStoryContent,
  HeroContent,
  MissionVisionCard,
  PlatformFeature,
  SectionHeader,
  SecurityItem,
  ValueCategory,
} from "@/components/about-us/types";
import type { AITool } from "@/components/ai-tools/types";
import type { IconName } from "@/components/sell/utils/icons";
import bgImage from "@/images/bg-image.webp";


// =============================================================================
// EXISTING CONSTANTS
// =============================================================================

export type InfoItem = {
  icon: LucideIcon;
  text: string;
};

export type InfoSection = {
  title: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  items: InfoItem[];
};

export const INFO_SECTIONS: InfoSection[] = [
  {
    title: "Tillstånd & Bygglov",
    icon: FileText,
    iconBgClass: "bg-primary/10",
    iconColorClass: "text-primary",
    items: [
      {
        icon: CheckCircle,
        text: "Kontrollera detaljplan och områdesbestämmelser hos kommunen",
      },
      {
        icon: CheckCircle,
        text: "Verifiera byggrätt och maximal byggnadsarea",
      },
      {
        icon: CheckCircle,
        text: "Undersök strandskyddsbestämmelser (minst 100m från strand)",
      },
      {
        icon: CheckCircle,
        text: "Kontrollera allemansrättsliga begränsningar",
      },
    ],
  },
  {
    title: "Infrastruktur",
    icon: Zap,
    iconBgClass: "bg-blue-500/10",
    iconColorClass: "text-blue-600",
    items: [
      {
        icon: Zap,
        text: "Elförsörjning: Finns elnät eller krävs solceller/generator?",
      },
      { icon: Droplet, text: "Vatten: Kommunalt, egen brunn eller vattentank?" },
      {
        icon: Building,
        text: "Avlopp: Kommunalt, egen anläggning eller torrtoalett?",
      },
      { icon: Wifi, text: "Fiber/Bredband: Kontrollera täckning för uppkoppling" },
    ],
  },
  {
    title: "Ekonomi & Kostnader",
    icon: Euro,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      {
        icon: TrendingUp,
        text: "Fastighetsavgift: 0,75% av taxeringsvärdet årligen",
      },
      {
        icon: Shield,
        text: "Försäkring: Särskild för fritidshus, budgetera 3,000-8,000 kr/år",
      },
      {
        icon: Clock,
        text: "Underhåll: Räkna med 1-2% av fastighetsvärdet årligen",
      },
      { icon: AlertCircle, text: "Driftskostnader: El, snöröjning, sophämtning" },
    ],
  },
  {
    title: "Läge & Tillgänglighet",
    icon: MapPin,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      {
        icon: CheckCircle,
        text: "Vägtillgång: Framkomlig året runt eller säsongsvista?",
      },
      {
        icon: CheckCircle,
        text: "Snöröjning: Privat, samfällighet eller kommunal?",
      },
      {
        icon: CheckCircle,
        text: "Avstånd till service: Mataffär, apotek, sjukvård",
      },
      {
        icon: CheckCircle,
        text: "Restid från hemmet: Planera för helgpendling",
      },
    ],
  },
  {
    title: "Miljö & Natur",
    icon: Leaf,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      { icon: Leaf, text: "Naturvärden: Kontrollera om området är naturreservat" },
      {
        icon: Leaf,
        text: "Skyddsområden: Biotopskydd eller Natura 2000-områden",
      },
      {
        icon: Leaf,
        text: "Markegenskaper: Lermark, berg, fuktig eller torr mark?",
      },
      { icon: Leaf, text: "Radon: Kontrollera radonhalter i området" },
    ],
  },
  {
    title: "Juridik & Avtal",
    icon: Shield,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      {
        icon: Award,
        text: "Lantmäterihandlingar: Kontrollera fastighetsgränser",
      },
      { icon: Award, text: "Servitut: Väg-, vatten-, el-rättigheter för grannar" },
      {
        icon: Award,
        text: "Samfälligheter: Avgifter och skyldigheter i områden",
      },
      {
        icon: Award,
        text: "Köpeavtal: Använd Svensk Mäklarstatistik standardavtal",
      },
    ],
  },
];

export const properties: Project[] = [
  {
    image: bgImage,
    badgeOneText: "Prime Location",
    badgeTwoText: "Uthyres",
    name: "Prestigekontorer City",
    location: "Östermalm, Stockholm",
    description:
      "Exklusiva kontorslokaler i hjärtat av Stockholm. Representativa ytor med modern teknik och service.",
    price: "15,500 kr/m²",
    otherInfo: "450 m² • 8 rum",
    button: {
      text: "Boka visning",
      variant: "outline",
    },
  },
  {
    image: bgImage,
    badgeOneText: "Butik",
    badgeTwoText: "Till salu",
    name: "Butikslokal Avenyn",
    location: "Centrum, Göteborg",
    description:
      "Strategiskt placerad butik på Avenyn med högt fotgängarflöde. Perfekt för detaljhandel.",
    price: "12,5M kr",
    otherInfo: "180 m² • Gatuplan",
    button: {
      text: "Kontakta mäklare",
      variant: "outline",
    },
  },
  {
    image: bgImage,
    badgeOneText: "Logistik",
    badgeTwoText: "Ny byggnad",
    name: "Ny byggnad",
    location: "Arlanda, Stockholm",
    description:
      "Modern logistikfastighet med optimal anslutning till E4 och Arlanda. Flexibla lösningar för distribution.",
    price: "2,800 kr/m²",
    otherInfo: "8,500 m² • Lager",
    button: {
      text: "Begär information",
      variant: "outline",
    },
  },
];

export const searchPropertyTabs = [
  { label: "Alla", value: "ALL" },
  { label: "Till salu", value: "FOR_SALE" },
  { label: "Snart till salu", value: "COMING_SOON" },
  { label: "Slutpriser", value: "SOLD" },
  { label: "Uthyrning", value: "FOR_RENT" },
  { label: "Nyproduktion", value: "NYPRODUKTION" },
  { label: "Kommersiellt", value: "COMMERCIAL" },
];

// =============================================================================
// ABOUT US DATA
// =============================================================================

export const heroContent: HeroContent = {
  badge: "Grundat 2025",
  title: "Om Bostadsvyn",
  description:
    "Vi erbjuder en modern fastighetsplattform som kombinerar AI-teknologi med användarvänlig design för att förenkla och förbättra sökandet efter bostad för alla.",
};

export const missionVisionCards: MissionVisionCard[] = [
  {
    id: "mission",
    iconName: "target",
    title: "Vår Mission",
    paragraphs: [
      "Vi revolutionerar fastighetsmarknaden genom att förena avancerad teknologi med djup branschkunskap. Vårt mål är att skapa en transparent, effektiv och användarvänlig plattform som förenklar hela fastighetsprocessen.",
      "Med fokus på tillgänglighet och kvalitet levererar vi professionella verktyg och beslutsunderlag för privatpersoner, företag och fastighetsmäklare – oavsett om det gäller köp, försäljning eller uthyrning.",
    ],
    borderColor: "border-primary/20 hover:border-primary/40",
  },
  {
    id: "vision",
    iconName: "rocket",
    title: "Vår Vision",
    paragraphs: [
      "Att bli den ledande fastighetsplattformen i Sverige genom att sätta nya standarder för användarvänlighet, transparens och professionalism. Vi skapar ett ekosystem där alla parter – köpare, säljare, mäklare och hyresvärdar – får tillgång till samma högkvalitativa verktyg och information.",
      "Genom kontinuerlig innovation och nära kontakt med branschen bygger vi framtidens fastighetsmarknad – en marknad som är mer rättvis, effektiv och tillgänglig för alla.",
    ],
    borderColor: "border-accent/20 hover:border-accent/40",
  },
];

export const founderStoryContent: FounderStoryContent = {
  title: "Grundat och byggt av en fastighetsmäklare med branscherfarenhet",
  subtitle: "Fem års erfarenhet från fastighetsbranschen",
  description:
    "Bostadsvyn är grundat och byggt av en registrerad fastighetsmäklare med gedigen branscherfarenhet men också personlig erfarenhet från bostadsmarknaden. Genom fem års erfarenhet har vi identifierat de verktyg och funktioner som verkligen tillför värde för samtliga aktörer på fastighetsmarknaden – fastighetsmäklare, säljare, köpare, spekulanter och hyresvärdar.",
  quote:
    "Jag har sedan hösten 2024 funderat mycket på varför vi i Sverige inte har EN bostadsportal för alla typer av bostäder utan folk måste söka sig till 4-5 olika sidor, beroende på vad de söker. Det var så jag fick idén för Bostadsvyn! Målet för mig är att ta allt jag har lärt mig från att vara en köpare, säljare och mäklare till att tillsammans med den otroliga teknologin som finns idag, skapa den absolut bästa plattformen för bostäder som finns i Sverige. Alla ska kunna annonsera och alla ska ha nytta av portalen och dessa unika verktyg som vi har tagit fram. Förhoppningsvis så kan jag med detta hårda jobb underlätta för er från början till slut, oavsett vad ni söker för bostad.",
  author: "— Adam",
};

export const platformOverviewHeader: SectionHeader = {
  title: "Vår plattform",
  description:
    "Vi bygger en fastighetsplattform med moderna verktyg och funktioner. Här är våra huvudsakliga fokusområden och planerade funktioner.",
};

export const securityComplianceHeader: SectionHeader = {
  title: "Säkerhet & Efterlevnad",
  description:
    "Din säkerhet och integritet är vår högsta prioritet. Vi följer alla relevanta lagar och arbetar kontinuerligt för att skydda dina uppgifter.",
};

export const legalDocumentsHeader: SectionHeader = {
  title: "Juridiska dokument & policyer",
  description:
    "Läs våra policyer och villkor för att förstå hur vi hanterar dina uppgifter och vilka rättigheter du har som användare.",
};

export const ourValuesHeader: SectionHeader = {
  title: "Våra värderingar",
};

export const advantagesHeader: SectionHeader = {
  title: "Vad gör oss unika?",
};

export const platformFeatures: PlatformFeature[] = [
  {
    id: "broad-housing-offer",
    iconName: "home",
    title: "Brett bostadsutbud",
    description:
      "Vi arbetar för att erbjuda olika typer av bostäder i både Sverige och utlandet på en och samma plattform - från villor och lägenheter till hyresbostäder och kommersiellt.",
    borderColor: "border-accent/20 hover:border-accent/40",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    id: "modern-ai-technology",
    iconName: "brain",
    title: "Modern AI-teknologi",
    description:
      "Vi utvecklar AI-verktyg för bildredigering, homestyling och marknadsanalys som ska ge användare bättre beslutsunderlag för sina fastighetsaffärer.",
    borderColor: "border-primary/20 hover:border-primary/40",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "security-trust",
    iconName: "shield",
    title: "Säkerhet & trygghet",
    description:
      "BankID-verifiering, GDPR-efterlevnad, manuell moderering av annonser och digitala avtal med juridisk säkerhet för alla transaktioner.",
    borderColor: "border-success/20 hover:border-success/40",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
];

export const legalDocuments: DocumentItem[] = [
  {
    id: "terms",
    iconName: "file-text",
    title: "Allmänna villkor",
    description: "Användarvillkor och regler för plattformen",
    link: "/terms",
    iconColor: "text-primary",
  },
  {
    id: "privacy",
    iconName: "eye",
    title: "Integritetspolicy",
    description: "Hur vi hanterar dina personuppgifter",
    link: "/privacy",
    iconColor: "text-premium",
  },
  {
    id: "cookies",
    iconName: "shield",
    title: "Cookie-policy",
    description: "Information om cookies och spårning",
    link: "/cookies",
    iconColor: "text-success",
  },
  {
    id: "support",
    iconName: "users",
    title: "Support & Tvistlösning",
    description: "Kontakta oss eller rapportera problem",
    link: "/support",
    iconColor: "text-accent",
  },
];

export const complianceItems: ComplianceItem[] = [
  { id: "marknadsforingslagen", name: "Marknadsföringslagen (2008:486)" },
  { id: "gdpr", name: "GDPR (EU 2016/679)" },
  { id: "dac7", name: "DAC7-direktivet" },
  { id: "eidas", name: "EU eIDAS-förordningen" },
  { id: "fastighetsmaklarlagen", name: "Fastighetsmäklarlagen" },
  { id: "bokforingslagen", name: "Bokföringslagen" },
];

export const valueCategories: ValueCategory[] = [
  {
    id: "innovation",
    iconName: "brain",
    name: "Innovation",
    description:
      "Vi använder den senaste tekniken för att skapa lösningar som verkligen förbättrar användarupplevelsen inom fastigheter.",
  },
  {
    id: "transparency",
    iconName: "shield",
    name: "Transparens",
    description:
      "Ärlighet och öppenhet i alla våra interaktioner. Användare ska alltid veta vad de kan förvänta sig av oss.",
  },
  {
    id: "user-focus",
    iconName: "users",
    name: "Användarfokus",
    description:
      "Allt vi gör utgår från användarens behov. Vi lyssnar aktivt på feedback och utvecklar våra tjänster därefter.",
  },
  {
    id: "responsibility",
    iconName: "heart",
    name: "Ansvar",
    description:
      "Vi tar ansvar för våra användares upplevelser och arbetar ständigt för att förbättra våra tjänster och processer.",
  },
];

export const advantages: Advantage[] = [
  {
    id: "ai-technology",
    iconName: "brain",
    title: "AI-Driven Teknologi",
    description:
      "Våra AI-algoritmer analyserar marknadsdata, användarpreferenser och fastighetsinformation för att ge personliga rekommendationer och precisa värderingar.",
  },
  {
    id: "virtual-homestyling",
    iconName: "zap",
    title: "Virtuell Homestyling",
    description:
      "Revolutionerande AI-verktyg som låter användare se hur en bostad kan se ut med olika inredningar och renoveringar innan de fattar beslut.",
  },
  {
    id: "secure-digital-contracts",
    iconName: "shield",
    title: "Säkra Digitala Avtal",
    description:
      "Digitala hyres- och köpekontrakt med BankID-signering som följer svensk lagstiftning och ger användarna trygghet i hela processen.",
  },
];

export const securityItems: SecurityItem[] = [
  {
    id: "bankid-verification",
    iconName: "shield",
    title: "BankID-verifiering",
    description:
      "Vi använder svenskt BankID för användarverifiering för att öka säkerheten och motverka bedrägerier på plattformen.",
    borderColor: "border-success/30",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: "gdpr-compliant",
    iconName: "lock",
    title: "GDPR-kompatibel",
    description:
      "Vi efterlever GDPR-regelverket och arbetar för att skydda användarnas personuppgifter med krypterad lagring och transparent hantering.",
    borderColor: "border-premium/30",
    iconBg: "bg-premium/10",
    iconColor: "text-premium",
  },
  {
    id: "moderation",
    iconName: "check-circle-2",
    title: "Moderering",
    description:
      "Bostadsannonser granskas för att upprätthålla kvalitet och motverka vilseledande marknadsföring på plattformen.",
    borderColor: "border-accent/30",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    id: "security-logging",
    iconName: "eye",
    title: "Säkerhetsloggning",
    description:
      "Alla säkerhetshändelser loggas och övervakas kontinuerligt för att snabbt kunna upptäcka och åtgärda eventuella hot.",
    borderColor: "border-nordic-aurora/30",
    iconBg: "bg-nordic-aurora/10",
    iconColor: "text-nordic-aurora",
  },
  {
    id: "incident-handling",
    iconName: "alert-triangle",
    title: "Incidenthantering",
    description:
      "Strukturerad process för rapportering och hantering av säkerhetsincidenter, bedrägerier och regelbrott.",
    borderColor: "border-warning/30",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: "dac7-reporting",
    iconName: "file-text",
    title: "DAC7-rapportering",
    description:
      "Vi arbetar för att efterleva EU:s DAC7-direktiv för rapportering av hyresintäkter till Skatteverket där det är tillämpligt.",
    borderColor: "border-primary/30",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

// =============================================================================
// AI TOOLS DATA
// =============================================================================

export const aiTools: AITool[] = [
  {
    id: "homestyling",
    title: "AI-Homestyling",
    description:
      "Revolutionera hur du marknadsför och visualiserar fastigheter med vår AI-drivna homestyling. Transformera tomma eller daterade rum till fullt inredda, moderna drömhem på sekunder. Perfekt för både säljare som vill visa en bostads potential och köpare som vill visualisera olika inredningsalternativ innan de fattar beslut.",
    icon: Sparkles,
    theme: "accent",
    hasGradient: true,
    features: [
      {
        text: "Renoveringar och tillbyggnader: trappor, garderober, förråd och förvaring",
      },
      {
        text: "Lyxiga tillägg: inomhuspool, spa-avdelning, bastu och relaxutrymmen",
      },
      {
        text: "Ytskikt och finish: byt golv, tak, väggar och färger fotorealistiskt",
      },
      {
        text: "Köksrenovering: nya köksluckor, vitvaror, bänkskivor och känsla",
      },
      {
        text: "Möblering: möblera tomma rum eller ta bort möbler helt digitalt",
      },
      {
        text: "Belysning och atmosfär: lägg till och ändra belysning för perfekt känsla",
      },
    ],
  },
  {
    id: "image-editing",
    title: "AI Bildredigering",
    description:
      "Transformera och förbättra fastighetsbilder med avancerad AI-teknologi. Visualisera renoveringar, tillbyggnader och förändringar innan du genomför dem i verkligheten. Skapa inspirerande bilder som visar en fastighets fulla potential och hjälper köpare att se möjligheterna. Perfekt för att planera investeringar och få fastighetsägare att förstå värdet av förbättringar.",
    icon: Wand2,
    theme: "primary",
    hasGradient: true,
    features: [
      {
        text: "Lyxiga tillägg: pooler, spa, terrasser, uteplatser, balkonger och altaner",
      },
      {
        text: "Utbyggnader: garage, attefallshus, carport, förråd och våningsplan",
      },
      {
        text: "Fasadförändringar: byt tak, fasad, fönster, dörrar, entrè och färger",
      },
      {
        text: "Landskapsdesign: förbättra trädgårdar, lägg till vegetation, staket och infarter",
      },
      { text: "Ta bort eller ändra oönskade element" },
      { text: "Skriv i chatten och få resultat på någon sekund" },
    ],
  },
  {
    id: "valuation",
    title: "AI Fastighetsvärdering",
    description:
      "Få exakta och datadrivna värderingar baserade på avancerad maskinlärning som analyserar miljontals datapunkter. Vår AI kombinerar realtidsdata från hela Sverige, historiska priser, områdesutveckling, infrastruktur, och marknadsanalyser för att ge dig den mest korrekta värderingen. Inklusive konfidensintervall, prisutvecklingsprognoser och detaljerade jämförelser med liknande försäljningar.",
    icon: Calculator,
    theme: "premium",
    hasGradient: false,
    features: [
      {
        text: "Realtidsvärderingar med 95% noggrannhet baserat på aktuell marknadsdata",
      },
      { text: "Prisförutsägelser 6-12 månader framåt med trendanalys" },
      { text: "Jämförelser med liknande objekt i närområdet" },
      { text: "Detaljerad områdesanalys och infrastrukturutveckling" },
      { text: "Konfidensintervall som visar värderingssäkerhet" },
      { text: "Kontinuerlig uppdatering när ny marknadsdata tillkommer" },
    ],
  },
  {
    id: "advisor",
    title: "AI Fastighetsrådgivare",
    description:
      "Din personliga AI-assistent med djup kunskap om svensk fastighetsmarknad, juridik och ekonomi. Få professionell vägledning genom hela köp-, sälj- eller uthyrningsprocessen med expertråd och personliga rekommendationer anpassade efter din unika situation. Rådgivaren lär sig dina preferenser och blir bättre för varje interaktion, och kan svara på allt från enkla frågor till komplexa juridiska och ekonomiska scenarier.",
    icon: Bot,
    theme: "success",
    hasGradient: false,
    features: [
      { text: "24/7 tillgänglig expertis - få svar när du behöver dem" },
      {
        text: "Personliga rekommendationer baserade på din ekonomi och behov",
      },
      { text: "Hjälp med budgivning, finansiering och juridiska frågor" },
      { text: "Skatteoptimering och investeringsstrategier" },
      { text: "Analys av hyreskontrakt och villkor" },
      { text: "Kostnadsprognoser och budgetplanering" },
    ],
  },
  {
    id: "market-analysis",
    title: "AI Marknadsanalys",
    description:
      "Avancerad marknadsanalys som ger dig konkurrensfördel i din fastighetsaffär. Vår AI analyserar miljontals transaktioner, demografisk data, infrastrukturutveckling och ekonomiska indikatorer för att ge dig djupgående insikter om marknaden. Identifiera framtida tillväxtområden, förstå priscykler och få exakta prognoser för att fatta de bästa investeringsbesluten.",
    icon: BarChart3,
    theme: "nordic-aurora",
    hasGradient: false,
    features: [
      { text: "Detaljerade områdesanalyser med 10 års prishistorik" },
      { text: "Jämför med tusentals liknande försäljningar i realtid" },
      { text: "Prognoser för framtida prisutveckling per område" },
      { text: "Demografisk analys och befolkningstrender" },
      {
        text: "Identifiera undervärderade områden med hög tillväxtpotential",
      },
      { text: "Analys av liggdagar och försäljningshastighet" },
    ],
  },
  {
    id: "search-assistant",
    title: "AI Sökassistent",
    description:
      "En intelligent sökmotor som revolutionerar hur du hittar din drömbostad. Vår AI lär sig kontinuerligt från ditt beteende, dina klick, sparade objekt och sökhistorik för att automatiskt förstå vad som är viktigt för dig. Den upptäcker mönster du kanske inte ens är medveten om själv och rekommenderar bostäder som perfekt matchar dina behov innan du ens hinner söka efter dem.",
    icon: Search,
    theme: "nordic-fjord",
    hasGradient: false,
    features: [
      {
        text: "Maskinlärning som förstår dolda preferenser från ditt beteende",
      },
      { text: "Proaktiva notifikationer när perfekta bostäder läggs ut" },
      { text: "Semantisk sökning - beskriv med egna ord vad du söker" },
      {
        text: "Prioritering baserad på sannolikhet att du gillar objektet",
      },
      { text: "Hitta dolda pärlor som andra missar i sökresultaten" },
      { text: "Automatiska sparade sökningar med intelligent matchning" },
    ],
  },
];

// =============================================================================
// FAQ DATA
// =============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  valueKey: string;
  title: string;
  items: FAQItem[];
}

export const faqs: FAQSection[] = [
  {
    valueKey: "general",
    title: "Allmänt om Bostadsvyn",
    items: [
      {
        question: "Vad är Bostadsvyn?",
        answer:
          "Bostadsvyn är Sveriges modernaste fastighetsplattform som kombinerar traditionell bostadsförmedling med avancerad AI-teknologi. Vi erbjuder det bredaste utbudet av bostäder i Sverige - från villor och lägenheter till fritidshus, tomter och kommersiella fastigheter.",
      },
      {
        question: "Kostar det något att använda Bostadsvyn?",
        answer:
          "Det är helt gratis att söka och titta på bostäder på Bostadsvyn. För privatpersoner som vill sälja eller hyra ut sin bostad finns olika annonspaket - från gratis grundannons till premiumpaket med AI-verktyg. Mäklare har tillgång till en professionell mäklarportal med särskilda funktioner.",
      },
      {
        question: "Hur skiljer sig Bostadsvyn från andra bostadssajter?",
        answer:
          "Vi är unika genom vår integration av AI-verktyg som homestyling, prisanalys och smart sökassistent. Vi erbjuder också digitala hyreskontrakt med BankID, kostnadskalkylator och en omfattande mäklarportal. Vår plattform täcker alla bostadstyper på samma ställe.",
      },
      {
        question: "Är Bostadsvyn säkert att använda?",
        answer:
          "Ja, säkerhet är vår högsta prioritet. Alla användare verifieras med BankID, vi använder kryptering för känslig data, och alla transaktioner går genom säkra betalningssystem. Vi följer GDPR och har strikta policies för dataskydd.",
      },
    ],
  },
  {
    valueKey: "buy-home",
    title: "Köpa bostad",
    items: [
      {
        question: "Hur söker jag efter bostäder?",
        answer:
          "Du kan söka på flera sätt: använd sökfältet på startsidan, filtrera efter område/pris/storlek, bläddra på kartan, eller låt vår AI-sökassistent rekommendera bostäder baserat på dina preferenser. AI:n lär sig av ditt beteende och föreslår bostäder du kanske missat.",
      },
      {
        question: "Vad är AI-sökassistenten?",
        answer:
          "AI-sökassistenten är en intelligent tjänst som lär sig dina preferenser genom att analysera vilka bostäder du tittar på, sparar och är intresserad av. Den skickar automatiska notiser när nya relevanta bostäder läggs ut och kan upptäcka dolda mönster i vad du söker.",
      },
      {
        question: "Hur fungerar prisanalysen?",
        answer:
          "Vår AI-drivna prisanalys använder historiska transaktionsdata, aktuella marknadsförhållanden och prediktionsmodeller för att ge trovärdiga värderingar. Du får inte bara ett pris utan också ett konfidensintervall och kan se prognoser för framtida värdeutveckling.",
      },
      {
        question: "Kan jag spara favoriter?",
        answer:
          "Ja, logga in och klicka på hjärtikonen på de bostäder du gillar. Du kan också skapa familjegrupper där flera personer kan dela och diskutera favoritbostäder tillsammans.",
      },
      {
        question: "Hur kontaktar jag en mäklare eller säljare?",
        answer: `Klicka på "Kontakta" på bostadsannonsen. För annonser från mäklare får du direkt kontaktinformation. För privatannonser kan du skicka meddelanden via plattformen.`,
      },
      {
        question: "Vad är AI-homestyling?",
        answer:
          "AI-homestyling låter dig visualisera hur tomma eller omöblerade rum kan se ut när de är inredda. Verktyget använder avancerad AI för att skapa fotorealistiska bilder med olika inredningsstilar på sekunder.",
      },
    ],
  },
  {
    valueKey: "sell-home",
    title: "Sälja bostad",
    items: [
      {
        question: "Hur säljer jag min bostad via Bostadsvyn?",
        answer:
          "Du har två alternativ: antligen annonserar du direkt som privatperson (välj mellan gratis, Plus eller Premium-paket) eller så anlitar du en av våra certifierade mäklare som får tillgång till professionella verktyg via mäklarportalen.",
      },
      {
        question: "Vilka annonspaket finns?",
        answer:
          "Grundpaket (gratis): standard annonsstorlek, 10 bilder. Pluspaket (1995 kr): 50% större annons, 20 bilder, förnyelse varje månad, grundläggande statistik. Exklusivpaket (3995 kr): dubbelt så stor annons, obegränsat bilder, AI-verktyg (homestyling, bildredigering), förnyelse var 3:e vecka, detaljerad statistik.",
      },
      {
        question: "Vad ingår i AI-verktygen?",
        answer:
          "Exklusivpaket inkluderar: AI-homestyling (inred tomma rum digitalt), AI-bildredigering (lägg till pool, terrass etc), prisanalys, automatisk textgenerering för annonser, och detaljerad besöksstatistik med insights.",
      },
      {
        question: "Måste jag använda mäklare?",
        answer: `Nej, du kan lägga upp annonsen själv som privatperson. Men kom ihåg att endast certifierade mäklare kan publicera "Till salu"-annonser med juridisk rådgivning. Som privatperson kan du däremot hyra ut din bostad direkt via plattformen.`,
      },
      {
        question: "Hur länge gäller min annons?",
        answer:
          "Grundpaket: ingen automatisk förnyelse. Pluspaket: förnyas automatiskt varje månad. Exklusivpaket: förnyas var 3:e vecka för maximal synlighet. Du kan när som helst pausa eller ta bort annonsen.",
      },
    ],
  },
  {
    valueKey: "rent-home",
    title: "Hyra ut bostad",
    items: [
      {
        question: "Hur hyr jag ut min bostad?",
        answer: `Skapa ett konto, klicka på "Skapa hyresannons" och fyll i information om bostaden. Du kan ladda upp bilder, sätta hyra och villkor. När annonsen är publicerad kan intressenter kontakta dig direkt via plattformen.`,
      },
      {
        question: "Vad är digitala hyreskontrakt?",
        answer:
          "Våra digitala hyreskontrakt skapas automatiskt baserat på din information och gällande hyreslagstiftning. Både du och hyresgästen signerar med BankID vilket är juridiskt bindande. Kontraktet sparas säkert i molnet och är alltid tillgängligt.",
      },
      {
        question: "Behöver jag själv skriva hyreskontrakt?",
        answer:
          "Nej, systemet genererar kompletta kontrakt automatiskt. Alla mallar är granskade av jurister och följer svensk hyreslagstiftning. Du behöver bara fylla i grunduppgifter så tar systemet hand om resten.",
      },
      {
        question: "Hur får jag betalt för hyran?",
        answer:
          "Du kan välja betalmetod i kontraktet. Vi rekommenderar automatiska banköverföringar eller autogiro. Plattformen skickar påminnelser om betalningar automatiskt.",
      },
      {
        question: "Vad händer om hyresgästen inte betalar?",
        answer:
          "Du får automatiska notiser om försenade betalningar. Kontraktet inkluderar uppsägningsregler enligt hyreslagen. Vid tvister rekommenderar vi att kontakta Hyresnämnden.",
      },
    ],
  },
  {
    valueKey: "brokers",
    title: "Mäklare & Professionella",
    items: [
      {
        question: "Hur blir jag mäklare på Bostadsvyn?",
        answer: `Du måste vara licensierad fastighetsmäklare och medlem i Fastighetsmäklarinspektionen. Ansök via "Mäklare"-knappen, verifiera din legitimation med BankID, och få tillgång till mäklarportalen med alla professionella verktyg.`,
      },
      {
        question: "Vad ingår i mäklarportalen?",
        answer:
          "Kundhantering, automatisk annonsering, AI-verktyg för homestyling och bildredigering, prisanalysverktyg, visningsschemaläggning, statistik och rapporter, dokumenthantering, och CRM-funktioner för att hålla kontakt med kunder.",
      },
      {
        question: "Kostar det något att använda mäklarportalen?",
        answer:
          "Mäklarportalen har olika prenumerationsplaner beroende på volym och funktioner. Kontakta oss på maklare@bostadsvyn.se för prisuppgifter och demoversion.",
      },
      {
        question: "Kan jag importera befintliga annonser?",
        answer:
          "Ja, mäklarportalen har integrationer med de flesta fastighetssystem. Du kan importera annonser, bilder och kund information automatiskt.",
      },
      {
        question: "Hur fungerar samarbetet med andra mäklare?",
        answer:
          "Du kan dela annonser med kollegor, samarbeta i team och hålla transparens kring kunder. Portalen stödjer multi-office setup för större mäklarkedjor.",
      },
    ],
  },
  {
    valueKey: "account",
    title: "Konto & Inställningar",
    items: [
      {
        question: "Hur skapar jag ett konto?",
        answer: `Klicka på "Logga in" och sedan "Skapa konto". Du behöver ange e-post och lösenord eller logga in direkt med BankID. BankID ger dig tillgång till fler funktioner som att skapa annonser och signera kontrakt.`,
      },
      {
        question: "Varför behövs BankID?",
        answer: `BankID krävs för att säkerställa att alla användare är verifierade. Det förhindrar bluffannonser och skapar en säker miljö för köpare, säljare och mäklare. BankID krävs för att publicera annonser och signera hyreskontrakt.`,
      },
      {
        question: "Kan jag ändra mina kontaktuppgifter?",
        answer: `Ja, gå till "Profil" via användarmenyn. Där kan du uppdatera e-post, telefonnummer, adress och andra uppgifter. Vissa ändringar kan kräva BankID-verifikation för säkerhet.`,
      },
      {
        question: "Hur raderar jag mitt konto?",
        answer:
          "Gå till Profil > Inställningar > Radera konto. Observera att alla dina annonser, meddelanden och sparade favoriter kommer att tas bort. Detta kan inte ångras. Kontraktsdata sparas enligt juridiska krav.",
      },
      {
        question: "Glömde lösenord - hur återställer jag?",
        answer: `Klicka på "Glömt lösenord?" på inloggningssidan. Ange din e-post så skickar vi en återställningslänk. Om du har BankID kan du också logga in direkt med det.`,
      },
    ],
  },
  {
    valueKey: "ai-tools",
    title: "AI-verktyg & Funktioner",
    items: [
      {
        question: "Vilka AI-verktyg finns tillgängliga?",
        answer:
          "Vi erbjuder: AI-homestyling (virtuell inredning), AI-bildredigering (lägg till/ta bort element), prisanalys & prognoser, AI-sökassistent (personliga rekommendationer), automatisk textgenerering för annonser, och kostnadskalkylator.",
      },
      {
        question: "Hur exakt är AI-prisanalysen?",
        answer: `Vår AI analyserar över 200 parametrar från historisk data, aktuella transaktioner och marknadsförhållanden. Precisionen är typiskt inom 5-10% av faktiskt slutpris. Du får alltid ett konfidensintervall för att förstå osäkerheten.`,
      },
      {
        question: "Kan AI-homestyling användas kommersiellt?",
        answer: `Ja, bilder genererade med vår AI kan användas i kommersiella annonser. Observera att bilderna är avsedda som visualiseringar och ska markeras som "AI-genererad virtuell inredning" i annonser.`,
      },
      {
        question: "Sparas mina AI-genererade bilder?",
        answer:
          "Ja, alla bilder du genererar sparas i din profil och kan återanvändas. Premium-användare får obegränsad lagring. Grundanvändare kan spara upp till 50 AI-genererade bilder.",
      },
      {
        question: "Fungerar AI-verktygen på mobilen?",
        answer:
          "Ja, alla AI-verktyg är optimerade för mobil. AI-homestyling och bildredigering fungerar lika bra på telefon som på dator, även om en större skärm ger bättre översikt vid redigering.",
      },
    ],
  },
  {
    valueKey: "payment",
    title: "Betalning & Priser",
    items: [
      {
        question: "Vilka betalningsmetoder accepteras?",
        answer:
          "Vi accepterar alla svenska kreditkort (Visa, Mastercard), Swish, banköverföring och faktura för företag. Alla betalningar är krypterade och säkrade via PCI DSS-certifierade leverantörer.",
      },
      {
        question: "Kan jag få återbetalning?",
        answer:
          "Annonspaket har 14 dagars öppet köp från publiceringsdatum. Om du inte är nöjd får du pengarna tillbaka. Efter 14 dagar ges ingen återbetalning men du kan pausa/ta bort annonsen när som helst.",
      },
      {
        question: "Vad händer om min annons inte säljs?",
        answer:
          "Ditt annonspaket gäller under hela perioden oavsett om bostaden säljs eller inte. Du kan när som helst uppgradera till ett bättre paket eller förlänga annonsen när den löper ut.",
      },
      {
        question: "Finns det rabatter för flera annonser?",
        answer:
          "Ja, om du annonserar flera bostäder samtidigt får du volymrabatt. Kontakta oss på info@bostadsvyn.se för offert. Mäklare har särskilda företagspriser.",
      },
      {
        question: "Hur får jag kvitto på min betalning?",
        answer:
          "Kvitto skickas automatiskt till din e-post efter genomförd betalning. Du hittar också alla dina kvitton under Profil > Betalningar > Kvitton.",
      },
    ],
  },
  {
    valueKey: "security",
    title: "Säkerhet & Integritet",
    items: [
      {
        question: "Hur skyddar ni min personliga information?",
        answer:
          "Vi följer GDPR strikt. All data krypteras, lagras säkert i EU, och delas aldrig med tredje part utan ditt samtycke. Du har full kontroll över dina uppgifter och kan när som helst begära utdrag eller radering.",
      },
      {
        question: "Är mina betalningsuppgifter säkra?",
        answer:
          "Ja, vi sparar aldrig dina kortuppgifter. Alla betalningar hanteras av PCI DSS-certifierade betaltjänster (Stripe/Klarna). Vi ser aldrig ditt kortnum mer eller säkerhetskod.",
      },
      {
        question: "Vem kan se mina personuppgifter?",
        answer:
          "Endast du och de du aktivt delar information med (t.ex. när du kontaktar en mäklare) kan se dina uppgifter. Mäklare ser endast kontaktinformation du valt att dela. Administratörer har begränsad åtkomst för support.",
      },
      {
        question: "Kan jag använda pseudonym/falsk identitet?",
        answer:
          "Nej, för att upprätthålla säkerhet måste alla användare verifieras med BankID. Detta förhindrar bedrägerier och skapar förtroende på plattformen. Du kan dock välja vad som visas publikt i dina annonser.",
      },
      {
        question: "Vad händer med mina uppgifter om jag raderar kontot?",
        answer:
          "Din profildata och aktivitet raderas permanent. Viss data som kontraktshistorik kan behöva sparas enligt lag i upp till 7 år. Efter kontoborttagning kan data inte återställas.",
      },
    ],
  },
  {
    valueKey: "technical-support",
    title: "Teknisk Support",
    items: [
      {
        question: "Jag får inte upp någon bostad på kartan, vad gör jag?",
        answer:
          "Prova att zooma ut, byt kartvy (satellit/karta), eller uppdatera sidan. Kontrollera att du tillåtit platsåtkomst i webbläsaren. Om problemet kvarstår, rensa webbläsarens cache eller prova en annan webbläsare.",
      },
      {
        question: "Bilder laddas inte - hur fixar jag det?",
        answer:
          "Detta beror ofta på långsam internetanslutning. Prova att uppdatera sidan, rensa cache, eller använd en annan webbläsare. Om problemet kvarstår kan det vara tillfälliga serverproblem - vänta några minuter och försök igen.",
      },
      {
        question: "Min annons publicerades inte, varför?",
        answer:
          "Annonser granskas innan publicering (tar max 24h). Vanliga orsaker till avslag: otydliga bilder, felaktig information, bristande BankID-verifikation, eller brott mot våra riktlinjer. Du får alltid ett e-postmeddelande med förklaring.",
      },
      {
        question: "Funkar sajten på mobil och surfplatta?",
        answer:
          "Ja, Bostadsvyn är helt responsiv och fungerar på alla enheter. Vissa AI-funktioner kan vara enklare att använda på större skärmar, men all grundfunktionalitet fungerar på mobil.",
      },
      {
        question: "Vilka webbläsare stöds?",
        answer:
          "Vi stödjer de senaste versionerna av Chrome, Firefox, Safari och Edge. För bästa upplevelse rekommenderar vi att hålla din webbläsare uppdaterad. Internet Explorer stöds inte längre.",
      },
      {
        question: "Hur kontaktar jag support?",
        answer: `Du kan chatta med vår AI-supportbot direkt här på sidan för snabba svar. För mer komplexa ärenden, mejla support@bostadsvyn.se eller ring 08-123 45 67 (vardagar 9-17). Inloggade användare kan också skicka meddelanden via "Hjälp"-sektionen.`,
      },
    ],
  },
];

// =============================================================================
// PROPERTY SEARCH DATA
// =============================================================================

export interface SortOption {
  value: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { value: "created_desc", label: "Nyast först" },
  { value: "created_asc", label: "Äldst först" },
  { value: "price_asc", label: "Billigast först" },
  { value: "price_desc", label: "Dyrast först" },
  { value: "living_area_desc", label: "Störst först (m²)" },
  { value: "living_area_asc", label: "Minst först (m²)" },
  { value: "plot_area_desc", label: "Tomt – störst först (m²)" },
  { value: "plot_area_asc", label: "Tomt – minst först (m²)" },
  { value: "price_sqm_desc", label: "Lägst kvadratmeterpris (kr/m²)" },
  { value: "price_sqm_asc", label: "Högst kvadratmeterpris (kr/m²)" },
  { value: "rooms_desc", label: "Flest rum först" },
  { value: "rooms_asc", label: "Minst antal rum först" },
  { value: "fee_desc", label: "Lägst avgift (kr/mån)" },
  { value: "fee_asc", label: "Högst avgift (kr/mån)" },
  { value: "address_desc", label: "Adress A–Ö" },
  { value: "address_asc", label: "Adress Ö–A" },
];

export const commonFeatures = [
  "Balkong",
  "Balkong/Terrass",
  "Terrass",
  "Garage",
  "Parkering",
  "Hiss",
  "Vind",
  "Källare",
  "El inkluderat",
  "Värme inkluderat",
  "Internet inkluderat",
];

export const energyClasses = ["A", "B", "C", "D", "E", "F", "G"];

export const propertyTypeLabels: Record<string, string> = {
  APARTMENT: "Lägenheter",
  HOUSE: "Villor",
  TOWNHOUSE: "Radhus/Parhus/Kedjehus",
  COTTAGE: "Fritidshus",
  PLOT: "Tomter",
  COMMERCIAL: "Kommersiellt",
};

export const defaultFilters: PropertySearchInput = {
  query: "",
  propertyType: "",
  listingType: "",
  minPrice: 0,
  maxPrice: 20000000,
  minArea: 0,
  maxArea: 1000,
  minRooms: 0,
  maxRooms: 10,
  city: "",
  features: [],
  energyClass: [],
  sortBy: "created_desc",
  minRent: 0,
  maxRent: 50000,
  minMonthlyFee: 0,
  maxMonthlyFee: 10000,
  minPlotArea: 0,
  maxPlotArea: 10000,
};

// =============================================================================
// SELL COMPONENT DATA
// =============================================================================

export type AdTier = "premium" | "plus" | "free";

export interface TierFeature {
  title: string;
  items: string[];
}

export interface AdTierData {
  tier: AdTier;
  iconName: IconName;
  iconColorClass: string;
  iconBgClass: string;
  title: string;
  price: string;
  description: string;
  cardBgClass: string;
  cardBorderClass: string;
  features: TierFeature[];
}

export const AD_TIERS: readonly AdTierData[] = [
  {
    tier: "premium",
    iconName: "crown",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
    title: "Exklusivpaket",
    price: "3995 kr",
    description:
      "Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad",
    cardBgClass: "bg-gradient-to-br from-blue-500/10 to-card",
    cardBorderClass: "border-blue-500/30",
    features: [
      {
        title: "Maximerad synlighet",
        items: [
          "Allt som ingår i Pluspaketet + största annonsen",
          "Hamnar över Pluspaketet i publiceringslistan",
          "Exklusiv-badge som sticker ut",
          "Kostnadsfri förnyelse varje månad",
        ],
      },
      {
        title: "Exklusiva AI-verktyg",
        items: [
          "AI-Bildredigering som levererar otroliga resultat",
          "Unik AI-statistik i mäklarens och säljarens kundportal",
          "Detaljerad intressestatistik för mäklare och säljare",
          "Mest trafik till annonsen",
        ],
      },
    ],
  },
  {
    tier: "plus",
    iconName: "trendingUp",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
    title: "Pluspaket",
    price: "1995 kr",
    description: "Större annons med kostnadsfri förnyelse varje månad",
    cardBgClass: "bg-gradient-to-br from-blue-500/10 to-card",
    cardBorderClass: "border-blue-500/30",
    features: [
      {
        title: "Ökad synlighet",
        items: [
          "Allt som ingår i Grundpaketet + större annons",
          "Hamnar över Grundpaketet i publiceringslistan",
          "Plus-badge",
          "Kostnadsfri förnyelse varje månad",
        ],
      },
    ],
  },
  {
    tier: "free",
    iconName: "star",
    iconColorClass: "text-foreground",
    iconBgClass: "bg-gradient-to-br from-muted/20 to-muted/10",
    title: "Grundpaket",
    price: "Gratis",
    description: "Kostnadsfri grundannons för alla",
    cardBgClass: "",
    cardBorderClass: "",
    features: [
      {
        title: "Grundläggande publicering",
        items: [
          "Standard annonsformat",
          "Tillhörande statistik för mäklare och säljare",
          "Bläddra genom alla bilder utan att gå in på annonsen",
          "Fri publicering för alla säljare",
        ],
      },
    ],
  },
] as const;

export interface SellingStep {
  iconName: IconName;
  iconColorClass: string;
  iconBgClass: string;
  title: string;
  description: string;
  showArrow: boolean;
}

export const SELLING_STEPS: readonly SellingStep[] = [
  {
    iconName: "gauge",
    iconColorClass: "text-primary",
    iconBgClass: "bg-gradient-to-br from-primary/20 to-primary/10",
    title: "Värdera din bostad",
    description:
      "Få en kostnadsfri AI-driven värdering baserad på aktuella marknadsdata, jämförbara försäljningar och områdesfaktorer",
    showArrow: true,
  },
  {
    iconName: "award",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
    title: "Hitta rätt mäklare",
    description:
      "Få rekommendationer baserat på mäklarens specialisering, tidigare försäljningar, kundbetyg och lokalkännedom i ditt område",
    showArrow: true,
  },
  {
    iconName: "sparkles",
    iconColorClass: "text-amber-600",
    iconBgClass: "bg-gradient-to-br from-amber-500/20 to-amber-500/10",
    title: "Skapa professionell annons",
    description:
      "Din mäklare skapar en attraktiv annons med professionella bilder, säljande texter och all nödvändig information om bostaden",
    showArrow: true,
  },
  {
    iconName: "network",
    iconColorClass: "text-green-600",
    iconBgClass: "bg-gradient-to-br from-green-500/20 to-green-500/10",
    title: "Bred exponering",
    description:
      "Din bostad marknadsförs till aktiva bostadssökare genom smart matchning och notifikationer till användare som söker liknande bostäder",
    showArrow: true,
  },
  {
    iconName: "trendingUp",
    iconColorClass: "text-emerald-600",
    iconBgClass: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/10",
    title: "Optimera försäljningen",
    description:
      "Följ intresse i realtid och få statistik över visningar, sparade annonser och AI användning för att optimera din försäljningsstrategi",
    showArrow: false,
  },
] as const;

export interface BrokerFeature {
  iconName: IconName;
  iconColorClass: string;
  iconBgClass: string;
  title: string;
  description: string;
}

export const BROKER_FEATURES: readonly BrokerFeature[] = [
  {
    iconName: "landmark",
    iconColorClass: "text-green-600",
    iconBgClass: "bg-green-600/10",
    title: "Certifierade fastighetsmäklare",
    description:
      "Alla mäklare är licensierade med registrering hos Fastighetsmäklarinspektionen och fullständig ansvarsförsäkring",
  },
  {
    iconName: "zap",
    iconColorClass: "text-amber-600",
    iconBgClass: "bg-amber-600/10",
    title: "AI-verktyg för alla",
    description:
      "Tillgång till AI-verktyg för homestyling, bildredigering, pris och marknadsanalys för att hjälpa alla parter",
  },
  {
    iconName: "mapPin",
    iconColorClass: "text-blue-600",
    iconBgClass: "bg-blue-600/10",
    title: "Smart matchning",
    description:
      "Vi hjälper dig hitta mäklare baserat på deras specialområde, tidigare försäljningar, kundbetyg och lokalkännedom i ditt område",
  },
  {
    iconName: "fileCheck",
    iconColorClass: "text-emerald-600",
    iconBgClass: "bg-emerald-600/10",
    title: "Verifierade omdömen",
    description:
      "Mäklare har kundrecensioner och betyg från tidigare försäljningar för ökad transparens och trygghet",
  },
  {
    iconName: "barChart3",
    iconColorClass: "text-primary",
    iconBgClass: "bg-primary/10",
    title: "Transparent statistik",
    description:
      "Se statistik över mäklarens tidigare försäljningar, genomsnittlig försäljningstid och prisnivåer i området",
  },
  {
    iconName: "heartHandshake",
    iconColorClass: "text-green-600",
    iconBgClass: "bg-green-600/10",
    title: "Personlig rådgivning",
    description:
      "Få individuell konsultation med råd om styling, prispositionering och marknadsföring anpassat efter din bostad",
  },
] as const;

export const BROKER_INTRO_TEXT =
  "På Bostadsvyn kan endast certifierade och auktoriserade fastighetsmäklare publicera försäljningsannonser. Detta säkerställer professionell hantering enligt fastighetsförmedlingslagen och att du får kvalificerad support genom hela processen. Mäklarna, säljarna och spekulanterna får tillgång till våra AI-verktyg för att enkelt kunna göra försäljnings och köpprocessen mer njutbar för alla parter.";

export interface PlanFeature {
  name: string;
  description: string;
}

export interface PricingPlan {
  iconName: IconName;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  buttonIsDisabled: boolean;
  buttonText: string;
  footerText?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    iconName: "star",
    name: "Grundpaket",
    price: 0,
    description:
      "Perfekt för alla som vill annonsera sin fastighet kostnadsfritt",
    features: [
      {
        name: "Grundläggande annons",
        description: "Standard storlek på annons",
      },
      {
        name: "Enkel publicering",
        description: "Lägg ut din fastighet på plattformen",
      },
      {
        name: "Synlighet i sökresultat",
        description: "Din annons visas i vanliga sökningar",
      },
    ],
    buttonIsDisabled: true,
    buttonText: "Nuvarande paket",
  },
  {
    iconName: "trendingUp",
    name: "Pluspaket",
    price: 1495,
    isRecommended: true,
    description:
      "Större annons med månatlig förnyelse. Hamnar över Grundpaketet i publiceringslistan",
    features: [
      {
        name: "Större annons",
        description: "Din annons får mer utrymme och syns bättre",
      },
      {
        name: "Prioriterad placering",
        description: "Hamnar över Grundpaketet i publiceringslistan",
      },
      {
        name: "Månatlig förnyelse",
        description: "Förnya annonsen varje månad kostnadsfritt",
      },
      {
        name: "Fler bilder",
        description: "Visa upp till 15 bilder",
      },
      {
        name: "Utökad beskrivning",
        description: "Mer plats för detaljerad beskrivning",
      },
    ],
    buttonIsDisabled: false,
    buttonText: "Uppgradera till Plus",
    footerText: "Förnyelse varje månad kostnadsfritt",
    isPopular: true,
  },
  {
    iconName: "crown",
    name: "Exklusivpaket",
    price: 2995,
    description:
      "Störst annons med AI-verktyg. Förnyelse var 3:e vecka. Hamnar högst i publiceringslistan",
    features: [
      {
        name: "Störst annons",
        description: "Maximal storlek och synlighet",
      },
      {
        name: "Högsta prioritet",
        description: "Hamnar högst i publiceringslistan över alla andra",
      },
      {
        name: "AI-bildredigering",
        description: "AI-verktyg för professionell bildredigering ingår",
      },
      {
        name: "Snabb förnyelse",
        description: "Förnya annonsen var 3:e vecka",
      },
      {
        name: "Utvalda sektionen",
        description: 'Visas i "Utvalda fastigheter"',
      },
      {
        name: "Obegränsat med bilder",
        description: "Visa hur många bilder du vill",
      },
      {
        name: "Avancerad analys",
        description: "Detaljerad statistik och insikter",
      },
      {
        name: "Prioriterad support",
        description: "Snabb och dedikerad hjälp",
      },
    ],
    buttonIsDisabled: false,
    buttonText: "Uppgradera till Exklusiv",
    footerText: "AI-bildredigering ingår • Förnyelse var 3:e vecka",
  },
] as const;

export interface SectionHeaderData {
  badgeIconName: IconName;
  badgeText: string;
  badgeColorClass: string;
  title: string;
  description: string;
}

export const SECTION_HEADERS = {
  adTierComparison: {
    badgeIconName: "eye",
    badgeText: "Jämför paketen",
    badgeColorClass: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Se skillnaden mellan våra paket",
    description:
      "Samma bostad, samma text och bild - men stor skillnad i synlighet och funktioner",
  },
  sellingProcess: {
    badgeIconName: "target",
    badgeText: "Försäljningsprocessen",
    badgeColorClass: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Din väg till en framgångsrik försäljning",
    description:
      "En strukturerad process i 5 steg som kombinerar moderna AI-verktyg med professionella mäklares expertis",
  },
  brokerSection: {
    badgeIconName: "shield",
    badgeText: "Certifierat mäklarnätverk",
    badgeColorClass: "bg-green-50 text-green-700 border-green-200",
    title: "Professionella mäklare med dokumenterad erfarenhet",
    description:
      "Samarbeta med certifierade fastighetsmäklare som är specialiserade på att maximera försäljningsvärdet",
  },
} as const satisfies Record<string, SectionHeaderData>;
