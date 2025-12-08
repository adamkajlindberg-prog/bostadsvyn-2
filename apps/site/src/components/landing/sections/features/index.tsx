import {
  Brain,
  Calculator,
  FileText,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Homestyling",
    description:
      "Transformera tomma rum till inredda drömhem med vår avancerade AI-teknik",
    badge: "Populär",
    color: "text-nordic-aurora",
    benefits: ["Fotorealistiska resultat", "Olika stilar", "Snabb rendering"],
    link: "/ai-homestyling",
  },
  {
    icon: TrendingUp,
    title: "Prisanalys & Prognoser",
    description:
      "Få exakta värderingar och framtida prisförutsägelser baserat på marknadsdata",
    badge: "AI-driven",
    color: "text-accent",
    benefits: ["Realtidsdata", "Konfidensintervall", "Områdesanalys"],
    link: "/prisanalys",
  },
  {
    icon: Users,
    title: "Mäklarportal",
    description:
      "Professionella verktyg för mäklare att hantera kunder, visningar och annonser",
    badge: "Professionell",
    color: "text-primary",
    benefits: ["Kundhantering", "Statistik & rapporter", "Automatisering"],
    link: "/mäklarportal",
  },
  {
    icon: FileText,
    title: "Digitala Hyreskontrakt",
    description:
      "Säkra signeringar med BankID och automatiserade juridiska dokument",
    badge: "Säker",
    color: "text-nordic-forest",
    benefits: ["BankID-integration", "Automatisering", "Juridisk säkerhet"],
    link: "/digitala-hyreskontrakt",
  },
  {
    icon: Calculator,
    title: "Kostnadskalkylator",
    description:
      "Beräkna totala kostnader inklusive skatter, avgifter och låneinformation",
    color: "text-nordic-fjord",
    benefits: ["Lånekalkyler", "Skatteinfo", "Månadsbudget"],
    link: "/kostnadskalkylator",
  },
  {
    icon: Search,
    title: "AI Sökassistent",
    description:
      "Lär sig dina preferenser och rekommenderar nya bostäder baserat på din sökhistorik",
    badge: "Smart",
    color: "text-accent",
    benefits: ["Personliga tips", "Lärandealgoritm", "Endast för medlemmar"],
    link: "/ai-sokassistent",
  },
];

const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16 bg-gradient-to-b from-background to-transparent">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Link key={index} href={feature.link} className="block">
            <Card className="group shadow-xs hover:shadow transition-all duration-300 hover:scale-105 bg-card/40 backdrop-blur-lg border border-primary-foreground/20 cursor-pointer h-full py-6">
              <CardContent className="px-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-muted ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-foreground font-medium mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-foreground font-medium"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {benefit}
                    </div>
                  ))}
                </div>

                <div className="w-full mt-6 pt-4 border-t border-primary-foreground/10 text-center">
                  <span className="text-primary group-hover:underline font-medium">
                    Läs mer →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
export default Features;
