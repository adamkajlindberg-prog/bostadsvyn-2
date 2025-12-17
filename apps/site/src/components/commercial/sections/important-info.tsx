import {
  ScaleIcon,
  CalculatorIcon,
  TargetIcon,
  EuroIcon,
  FileTextIcon,
  TrendingUpIcon,
  ClockIcon,
  AlertCircleIcon,
  ShieldIcon,
  MapPinIcon,
  UsersIcon,
  BuildingIcon,
  ZapIcon,
  CheckCircleIcon,
  BarChart3Icon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const infoCards = [
  {
    icon: ScaleIcon,
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
    title: "Juridik & Avtal",
    items: [
      {
        icon: FileTextIcon,
        text: "Hyresavtal: Standard, Triple Net eller Turnover-baserad hyra",
      },
      {
        icon: ClockIcon,
        text: "Hyrestid: Kommersiella avtal vanligen 3-10 år med option",
      },
      {
        icon: AlertCircleIcon,
        text: "Besittningsskydd: Begränsat för kommersiella hyresgäster",
      },
      {
        icon: ShieldIcon,
        text: "Due diligence: Grundlig granskning av fastighet och avtal",
      },
    ],
  },
  {
    icon: CalculatorIcon,
    iconBgClass: "bg-green-600/10",
    iconClass: "text-green-600",
    title: "Ekonomisk Kalkyl",
    items: [
      {
        icon: EuroIcon,
        text: "Direktavkastning: Nettodriftsintäkt / Köpeskilling (4-8% typiskt)",
      },
      {
        icon: TrendingUpIcon,
        text: "Driftsnetton: Hyresintäkter minus driftskostnader",
      },
      {
        icon: CalculatorIcon,
        text: "Kassaflödesanalys: Prognostisera inkomster och utgifter",
      },
      {
        icon: BarChart3Icon,
        text: "Värdering: Ortsprismetod, avkastningsmetod, produktionskostnad",
      },
    ],
  },
  {
    icon: TargetIcon,
    iconBgClass: "bg-accent/10",
    iconClass: "text-accent-foreground",
    title: "Läge & Marknad",
    items: [
      {
        icon: MapPinIcon,
        text: "Lägesanalys: Trafik, synlighet, konkurrenter, tillväxtpotential",
      },
      {
        icon: UsersIcon,
        text: "Demografi: Målgrupp, köpkraft och befolkningsutveckling",
      },
      {
        icon: TrendingUpIcon,
        text: "Vakansgrad: Lokalt utbud och efterfrågan i området",
      },
      {
        icon: BuildingIcon,
        text: "Konkurrensanalys: Befintliga och planerade objekt",
      },
    ],
  },
  {
    icon: EuroIcon,
    iconBgClass: "bg-primary/10",
    iconClass: "text-primary",
    title: "Driftskostnader",
    items: [
      {
        icon: ZapIcon,
        text: "Energi: Värme, el, ventilation (ofta 15-25% av driftsnetto)",
      },
      {
        icon: BuildingIcon,
        text: "Underhåll: Planerat och akut, 10-15% av hyresintäkter",
      },
      {
        icon: ShieldIcon,
        text: "Försäkring: Fastighet, ansvar och hyresförlust",
      },
      {
        icon: FileTextIcon,
        text: "Administration: Förvaltning, revision, ekonomi (3-5%)",
      },
    ],
  },
  {
    icon: FileTextIcon,
    iconBgClass: "bg-destructive/10",
    iconClass: "text-destructive",
    title: "Tillstånd & Regler",
    items: [
      {
        icon: CheckCircleIcon,
        text: "Detaljplan: Tillåten användning och byggrätt",
      },
      {
        icon: CheckCircleIcon,
        text: "Bygglov: Krävs för om- eller tillbyggnad",
      },
      {
        icon: CheckCircleIcon,
        text: "Miljötillstånd: För verksamheter med miljöpåverkan",
      },
      {
        icon: CheckCircleIcon,
        text: "Serveringstillstånd: För restauranger och caféer",
      },
    ],
  },
  {
    icon: TrendingUpIcon,
    iconBgClass: "bg-accent/10",
    iconClass: "text-accent-foreground",
    title: "Investeringsstrategi",
    items: [
      {
        icon: TargetIcon,
        text: "Core: Stabila objekt i bra lägen, låg risk (4-6% avkastning)",
      },
      {
        icon: TargetIcon,
        text: "Value-add: Förbättringspotential, medelhög risk (8-12%)",
      },
      {
        icon: TargetIcon,
        text: "Opportunistic: Utvecklingsprojekt, hög risk (15%+)",
      },
      {
        icon: BarChart3Icon,
        text: "Diversifiering: Sprid risk över olika segment och geografier",
      },
    ],
  },
];

const ImportantInfo = () => {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Viktig information för företag och investerare
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Allt du behöver veta för att göra rätt kommersiella
          fastighetsinvestering
        </p>
      </div>

      <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6">
        {infoCards.map((card) => (
          <Card
            key={card.title}
            className="shadow-xs hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`${card.iconBgClass} rounded-lg p-2`}>
                  <card.icon className={`h-5 w-5 ${card.iconClass}`} />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {card.items.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <item.icon
                    className={`h-4 w-4 ${card.iconClass} mt-0.5 flex-shrink-0`}
                  />
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImportantInfo;
