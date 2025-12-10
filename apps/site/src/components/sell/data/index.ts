import type { IconName } from "../utils/icons";

// =============================================================================
// AD TIER COMPARISON DATA
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
    iconColorClass: "text-amber-600",
    iconBgClass: "bg-gradient-to-br from-amber-500/20 to-amber-500/10",
    title: "Exklusivpaket",
    price: "3995 kr",
    description:
      "Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad",
    cardBgClass: "bg-gradient-to-br from-amber-500/10 to-card",
    cardBorderClass: "border-amber-500/30",
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

// =============================================================================
// SELLING PROCESS DATA
// =============================================================================

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

// =============================================================================
// BROKER SECTION DATA
// =============================================================================

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

// =============================================================================
// PRICING PLANS DATA
// =============================================================================

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

// =============================================================================
// SECTION HEADER DATA
// =============================================================================

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
    badgeColorClass: "bg-amber-50 text-amber-700 border-amber-200",
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
