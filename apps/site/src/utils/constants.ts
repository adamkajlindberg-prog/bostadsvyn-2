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
  LucideIcon
} from "lucide-react";
import  {
  type Project,
} from "@/components/new-production/project-card";
import bgImage from "@/images/bg-image.webp";

export type InfoItem = {
  icon: LucideIcon;
  text: string;
};

export type InfoSection = {
  title: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  items: InfoItem[];
};

export const INFO_SECTIONS: InfoSection[] = [
  {
    title: "Tillstånd & Bygglov",
    icon: FileText,
    iconBgClass: "bg-primary/10",
    iconColorClass: "text-primary",
    items: [
      { icon: CheckCircle, text: "Kontrollera detaljplan och områdesbestämmelser hos kommunen" },
      { icon: CheckCircle, text: "Verifiera byggrätt och maximal byggnadsarea" },
      { icon: CheckCircle, text: "Undersök strandskyddsbestämmelser (minst 100m från strand)" },
      { icon: CheckCircle, text: "Kontrollera allemansrättsliga begränsningar" },
    ],
  },
  {
    title: "Infrastruktur",
    icon: Zap,
    iconBgClass: "bg-blue-500/10",
    iconColorClass: "text-blue-600",
    items: [
      { icon: Zap, text: "Elförsörjning: Finns elnät eller krävs solceller/generator?" },
      { icon: Droplet, text: "Vatten: Kommunalt, egen brunn eller vattentank?" },
      { icon: Building, text: "Avlopp: Kommunalt, egen anläggning eller torrtoalett?" },
      { icon: Wifi, text: "Fiber/Bredband: Kontrollera täckning för uppkoppling" },
    ],
  },
  {
    title: "Ekonomi & Kostnader",
    icon: Euro,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      { icon: TrendingUp, text: "Fastighetsavgift: 0,75% av taxeringsvärdet årligen" },
      { icon: Shield, text: "Försäkring: Särskild för fritidshus, budgetera 3,000-8,000 kr/år" },
      { icon: Clock, text: "Underhåll: Räkna med 1-2% av fastighetsvärdet årligen" },
      { icon: AlertCircle, text: "Driftskostnader: El, snöröjning, sophämtning" },
    ],
  },
  {
    title: "Läge & Tillgänglighet",
    icon: MapPin,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      { icon: CheckCircle, text: "Vägtillgång: Framkomlig året runt eller säsongsvista?" },
      { icon: CheckCircle, text: "Snöröjning: Privat, samfällighet eller kommunal?" },
      { icon: CheckCircle, text: "Avstånd till service: Mataffär, apotek, sjukvård" },
      { icon: CheckCircle, text: "Restid från hemmet: Planera för helgpendling" },
    ],
  },
  {
    title: "Miljö & Natur",
    icon: Leaf,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      { icon: Leaf, text: "Naturvärden: Kontrollera om området är naturreservat" },
      { icon: Leaf, text: "Skyddsområden: Biotopskydd eller Natura 2000-områden" },
      { icon: Leaf, text: "Markegenskaper: Lermark, berg, fuktig eller torr mark?" },
      { icon: Leaf, text: "Radon: Kontrollera radonhalter i området" },
    ],
  },
  {
    title: "Juridik & Avtal",
    icon: Shield,
    iconBgClass: "bg-blue-600/10",
    iconColorClass: "text-blue-600",
    items: [
      { icon: Award, text: "Lantmäterihandlingar: Kontrollera fastighetsgränser" },
      { icon: Award, text: "Servitut: Väg-, vatten-, el-rättigheter för grannar" },
      { icon: Award, text: "Samfälligheter: Avgifter och skyldigheter i områden" },
      { icon: Award, text: "Köpeavtal: Använd Svensk Mäklarstatistik standardavtal" },
    ],
  },
];


export const properties: Project[] = [
  {
    image: bgImage,
    badgeOneText: "Prime Location",
    badgeTwoText: "Uthyres",
    name: "Prestigekontorer City",
    location: "Östermalm, Stockholm",
    description:
      "Exklusiva kontorslokaler i hjärtat av Stockholm. Representativa ytor med modern teknik och service.",
    price: "15,500 kr/m²",
    otherInfo: "450 m² • 8 rum",
    button: {
      text: "Boka visning",
      variant: "outline",
    },
  },
  {
    image: bgImage,
    badgeOneText: "Butik",
    badgeTwoText: "Till salu",
    name: "Butikslokal Avenyn",
    location: "Centrum, Göteborg",
    description:
      "Strategiskt placerad butik på Avenyn med högt fotgängarflöde. Perfekt för detaljhandel.",
    price: "12,5M kr",
    otherInfo: "180 m² • Gatuplan",
    button: {
      text: "Kontakta mäklare",
      variant: "outline",
    },
  },
  {
    image: bgImage,
    badgeOneText: "Logistik",
    badgeTwoText: "Ny byggnad",
    name: "Ny byggnad",
    location: "Arlanda, Stockholm",
    description:
      "Modern logistikfastighet med optimal anslutning till E4 och Arlanda. Flexibla lösningar för distribution.",
    price: "2,800 kr/m²",
    otherInfo: "8,500 m² • Lager",
    button: {
      text: "Begär information",
      variant: "outline",
    },
  },
];

export const searchPropertyTabs = [
  {
    label: "Alla",
    value: "ALL",
  },
  {
    label: "Till salu",
    value: "FOR_SALE",
  },
  {
    label: "Snart till salu",
    value: "COMING_SOON",
  },
  {
    label: "Slutpriser",
    value: "SOLD",
  },
  {
    label: "Uthyrning",
    value: "FOR_RENT",
  },
  {
    label: "Nyproduktion",
    value: "NYPRODUKTION",
  },
  {
    label: "Kommersiellt",
    value: "COMMERCIAL",
  },
]