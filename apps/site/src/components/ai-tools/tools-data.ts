import {
  Bot,
  BarChart3,
  Calculator,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { AITool } from "./types";

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
      {
        text: "Ta bort eller ändra oönskade element",
      },
      {
        text: "Skriv i chatten och få resultat på någon sekund",
      },
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
      {
        text: "Prisförutsägelser 6-12 månader framåt med trendanalys",
      },
      {
        text: "Jämförelser med liknande objekt i närområdet",
      },
      {
        text: "Detaljerad områdesanalys och infrastrukturutveckling",
      },
      {
        text: "Konfidensintervall som visar värderingssäkerhet",
      },
      {
        text: "Kontinuerlig uppdatering när ny marknadsdata tillkommer",
      },
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
      {
        text: "24/7 tillgänglig expertis - få svar när du behöver dem",
      },
      {
        text: "Personliga rekommendationer baserade på din ekonomi och behov",
      },
      {
        text: "Hjälp med budgivning, finansiering och juridiska frågor",
      },
      {
        text: "Skatteoptimering och investeringsstrategier",
      },
      {
        text: "Analys av hyreskontrakt och villkor",
      },
      {
        text: "Kostnadsprognoser och budgetplanering",
      },
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
      {
        text: "Detaljerade områdesanalyser med 10 års prishistorik",
      },
      {
        text: "Jämför med tusentals liknande försäljningar i realtid",
      },
      {
        text: "Prognoser för framtida prisutveckling per område",
      },
      {
        text: "Demografisk analys och befolkningstrender",
      },
      {
        text: "Identifiera undervärderade områden med hög tillväxtpotential",
      },
      {
        text: "Analys av liggdagar och försäljningshastighet",
      },
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
      {
        text: "Proaktiva notifikationer när perfekta bostäder läggs ut",
      },
      {
        text: "Semantisk sökning - beskriv med egna ord vad du söker",
      },
      {
        text: "Prioritering baserad på sannolikhet att du gillar objektet",
      },
      {
        text: "Hitta dolda pärlor som andra missar i sökresultaten",
      },
      {
        text: "Automatiska sparade sökningar med intelligent matchning",
      },
    ],
  },
];
