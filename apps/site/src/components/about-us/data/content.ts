import type {
  HeroContent,
  FounderStoryContent,
  MissionVisionCard,
  SectionHeader,
} from "../types";

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
