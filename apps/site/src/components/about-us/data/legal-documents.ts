import type { DocumentItem, ComplianceItem } from "../types";

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
  {
    id: "marknadsforingslagen",
    name: "Marknadsföringslagen (2008:486)",
  },
  {
    id: "gdpr",
    name: "GDPR (EU 2016/679)",
  },
  {
    id: "dac7",
    name: "DAC7-direktivet",
  },
  {
    id: "eidas",
    name: "EU eIDAS-förordningen",
  },
  {
    id: "fastighetsmaklarlagen",
    name: "Fastighetsmäklarlagen",
  },
  {
    id: "bokforingslagen",
    name: "Bokföringslagen",
  },
];
