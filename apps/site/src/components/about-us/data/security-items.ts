import type { SecurityItem } from "../types";

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
