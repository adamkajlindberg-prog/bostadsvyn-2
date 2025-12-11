import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  Lock,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: Shield,
    title: "BankID-verifiering",
    description:
      "Vi använder svenskt BankID för användarverifiering för att öka säkerheten och motverka bedrägerier på plattformen.",
    borderColor: "border-success/30",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    icon: Lock,
    title: "GDPR-kompatibel",
    description:
      "Vi efterlever GDPR-regelverket och arbetar för att skydda användarnas personuppgifter med krypterad lagring och transparent hantering.",
    borderColor: "border-premium/30",
    iconBg: "bg-premium/10",
    iconColor: "text-premium",
  },
  {
    icon: CheckCircle2,
    title: "Moderering",
    description:
      "Bostadsannonser granskas för att upprätthålla kvalitet och motverka vilseledande marknadsföring på plattformen.",
    borderColor: "border-accent/30",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Eye,
    title: "Säkerhetsloggning",
    description:
      "Alla säkerhetshändelser loggas och övervakas kontinuerligt för att snabbt kunna upptäcka och åtgärda eventuella hot.",
    borderColor: "border-nordic-aurora/30",
    iconBg: "bg-nordic-aurora/10",
    iconColor: "text-nordic-aurora",
  },
  {
    icon: AlertTriangle,
    title: "Incidenthantering",
    description:
      "Strukturerad process för rapportering och hantering av säkerhetsincidenter, bedrägerier och regelbrott.",
    borderColor: "border-warning/30",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    icon: FileText,
    title: "DAC7-rapportering",
    description:
      "Vi arbetar för att efterleva EU:s DAC7-direktiv för rapportering av hyresintäkter till Skatteverket där det är tillämpligt.",
    borderColor: "border-primary/30",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

const SecurityCompliance = () => {
  return (
    <>
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Säkerhet & Efterlevnad</h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Din säkerhet och integritet är vår högsta prioritet. Vi följer alla
            relevanta lagar och arbetar kontinuerligt för att skydda dina uppgifter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.title} className={item.borderColor}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${item.iconBg} rounded-full p-3`}>
                      <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SecurityCompliance;
