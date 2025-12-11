import type { ValueCategory, Advantage } from "../types";

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
