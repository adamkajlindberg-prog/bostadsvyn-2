import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Award,
  Building,
  CheckCircle,
  Clock,
  Droplet,
  Euro,
  FileText,
  Leaf,
  MapPin,
  Shield,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";

export type InfoCardItem = {
  icon: LucideIcon;
  text: string;
};

export type InfoCardData = {
  icon: LucideIcon;
  iconColorClass: string;
  bgColorClass: string;
  title: string;
  items: InfoCardItem[];
};

export const INFO_CARDS: InfoCardData[] = [
  {
    icon: FileText,
    iconColorClass: "text-primary",
    bgColorClass: "bg-primary/10",
    title: "Tillstånd & Bygglov",
    items: [
      {
        icon: CheckCircle,
        text: "Kontrollera detaljplan och områdesbestämmelser hos kommunen",
      },
      {
        icon: CheckCircle,
        text: "Verifiera byggrätt och maximal byggnadsarea",
      },
      {
        icon: CheckCircle,
        text: "Undersök strandskyddsbestämmelser (minst 100m från strand)",
      },
      {
        icon: CheckCircle,
        text: "Kontrollera allemansrättsliga begränsningar",
      },
    ],
  },
  {
    icon: Zap,
    iconColorClass: "text-amber-500",
    bgColorClass: "bg-amber-500/10",
    title: "Infrastruktur",
    items: [
      {
        icon: Zap,
        text: "Elförsörjning: Finns elnät eller krävs solceller/generator?",
      },
      {
        icon: Droplet,
        text: "Vatten: Kommunalt, egen brunn eller vattentank?",
      },
      {
        icon: Building,
        text: "Avlopp: Kommunalt, egen anläggning eller torrtoalett?",
      },
      {
        icon: Wifi,
        text: "Fiber/Bredband: Kontrollera täckning för uppkoppling",
      },
    ],
  },
  {
    icon: Euro,
    iconColorClass: "text-green-600",
    bgColorClass: "bg-green-600/10",
    title: "Ekonomi & Kostnader",
    items: [
      {
        icon: TrendingUp,
        text: "Fastighetsavgift: 0,75% av taxeringsvärdet årligen",
      },
      {
        icon: Shield,
        text: "Försäkring: Särskild för fritidshus, budgetera 3,000-8,000 kr/år",
      },
      {
        icon: Clock,
        text: "Underhåll: Räkna med 1-2% av fastighetsvärdet årligen",
      },
      {
        icon: AlertCircle,
        text: "Driftskostnader: El, snöröjning, sophämtning",
      },
    ],
  },
  {
    icon: MapPin,
    iconColorClass: "text-purple-600",
    bgColorClass: "bg-purple-600/10",
    title: "Läge & Tillgänglighet",
    items: [
      {
        icon: CheckCircle,
        text: "Vägtillgång: Framkomlig året runt eller säsongsvista?",
      },
      {
        icon: CheckCircle,
        text: "Snöröjning: Privat, samfällighet eller kommunal?",
      },
      {
        icon: CheckCircle,
        text: "Avstånd till service: Mataffär, apotek, sjukvård",
      },
      {
        icon: CheckCircle,
        text: "Restid från hemmet: Planera för helgpendling",
      },
    ],
  },
  {
    icon: Leaf,
    iconColorClass: "text-green-600",
    bgColorClass: "bg-green-600/10",
    title: "Miljö & Natur",
    items: [
      {
        icon: Leaf,
        text: "Naturvärden: Kontrollera om området är naturreservat",
      },
      {
        icon: Leaf,
        text: "Skyddsområden: Biotopskydd eller Natura 2000-områden",
      },
      {
        icon: Leaf,
        text: "Markegenskaper: Lermark, berg, fuktig eller torr mark?",
      },
      {
        icon: Leaf,
        text: "Radon: Kontrollera radonhalter i området",
      },
    ],
  },
  {
    icon: Shield,
    iconColorClass: "text-red-600",
    bgColorClass: "bg-red-600/10",
    title: "Juridik & Avtal",
    items: [
      {
        icon: Award,
        text: "Lantmäterihandlingar: Kontrollera fastighetsgränser",
      },
      {
        icon: Award,
        text: "Servitut: Väg-, vatten-, el-rättigheter för grannar",
      },
      {
        icon: Award,
        text: "Samfälligheter: Avgifter och skyldigheter i områden",
      },
      {
        icon: Award,
        text: "Köpeavtal: Använd Svensk Mäklarstatistik standardavtal",
      },
    ],
  },
];
