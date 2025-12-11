import type { PlatformFeature } from "../types";

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
