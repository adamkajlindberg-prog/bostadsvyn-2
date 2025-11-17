import {
  BrainIcon,
  CalculatorIcon,
  ChartColumnIcon,
  ChartLineIcon,
  MapPinIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <ChartLineIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Realtidsdata",
    description:
      "Prisanalyser baserade på de senaste transaktionerna och marknadsförändringar i realtid.",
  },
  {
    icon: <TargetIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Konfidensintervall",
    description:
      "Se inte bara ett pris utan ett intervall med sannolikhet för att förstå osäkerheten.",
  },
  {
    icon: <MapPinIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Områdesanalys",
    description:
      "Djupgående analys av hur området påverkar priset och framtida värdeutveckling.",
  },
  {
    icon: <TrendingUpIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Prisförutsägelser",
    description:
      "AI-baserade prognoser för hur priset förväntas utvecklas de kommande 6-12 månaderna.",
  },
  {
    icon: <ChartColumnIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Jämförbar analys",
    description:
      "Jämför med liknande objekt i området för att se hur prisvärt objektet är.",
  },
  {
    icon: <CalculatorIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Detaljerad uppdelning",
    description:
      "Förstå exakt vilka faktorer som påverkar priset och hur mycket varje faktor väger.",
  },
];

const analyzeTypes = [
  {
    title: "Objektspecifika faktorer",
    items: [
      "Bostadstyp (lägenhet, villa, radhus)",
      "Storlek (yta och antal rum)",
      "Ålder och skick",
      "Våningsplan och utsikt",
      "Balkong, uteplats eller trädgård",
      "Standard på kök och badrum",
    ],
  },
  {
    title: "Områdesspecifika faktorer",
    items: [
      "Läge och närhet till stadskärna",
      "Kollektivtrafik och kommunikationer",
      "Skolor och barnomsorg",
      "Service och butiker",
      "Historisk prisutveckling i området",
      "Kommande stadsplanering och utveckling",
    ],
  },
];

const benefits = [
  {
    icon: <ZapIcon className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary" />,
    title: "Områdesanalys",
    description:
      "Djupgående analys av hur området påverkar priset och framtida värdeutveckling.",
  },
  {
    icon: <TargetIcon className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary" />,
    title: "Bättre förhandlingsposition",
    description:
      "Med detaljerad prisanalys och jämförelser kan du förhandla mer effektivt oavsett om du köper eller säljer.",
  },
  {
    icon: <TrendingUpIcon className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary" />,
    title: "Långsiktig planering",
    description:
      "Prisförutsägelser hjälper dig att planera när det är bäst att köpa eller sälja för maximal avkastning.",
  },
  {
    icon: <BrainIcon className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary" />,
    title: "Objektivt beslutsunderlag",
    description:
      "AI-baserade analyser ger dig objektiva siffror utan känslomässiga bedömningar eller säljintresse.",
  },
];
const PriceAnalysis = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5 gap-1.5">
            <BrainIcon size={18} />
            AI-Driven
          </div>
        </div>

        <h1 className="text-4xl @lg:text-5xl text-center font-semibold tracking-tight leading-tight mb-4">
          Prisanalys & Prognoser
        </h1>
        <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
          Få trovärdiga värderingar och framtida prisförutsägelser baserat på
          marknadsdata och avancerad AI
        </p>

        <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">
          Vad är AI-driven prisanalys?
        </h2>
        <p className="text-sm @lg:text-base text-muted-foreground mb-4">
          Vår AI-drivna prisanalys kombinerar historiska transaktionsdata,
          aktuella marknadsförhållanden och avancerade prediktionsmodeller för
          att ge dig de mest trovärdiga värderingarna på bostadsmarknaden. Vi
          analyserar tusentals datapunkter för att förstå vad som påverkar
          priset på just din bostad.
        </p>
        <p className="text-sm @lg:text-base text-muted-foreground mb-16">
          Med realtidsdata från hela svenska bostadsmarknaden kan vi inte bara
          berätta vad en bostad är värd idag, utan också prognostisera hur
          värdet kommer att utvecklas framåt. Detta ger dig ett tydligt
          beslutsunderlag oavsett om du ska köpa eller sälja.
        </p>

        <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">
          Huvudfunktioner
        </h2>
        <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="py-6 shadow border-none">
              <CardContent className="px-6">
                <div className="text-primary mb-4">{feature.icon}</div>

                <h5 className="text-base @lg:text-lg font-semibold mb-2">
                  {feature.title}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">
          Vad analyserar vi?
        </h2>
        <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-6 mb-16">
          {analyzeTypes.map((type) => (
            <Card key={type.title} className="py-6 shadow border-none">
              <CardContent className="px-6">
                <div className="text-base @lg:text-lg font-semibold mb-2">
                  {type.title}
                </div>
                <ul className="list-disc list-inside marker:text-primary space-y-2 text-sm @lg:text-base text-muted-foreground">
                  {type.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">
          Fördelar med vår prisanalys
        </h2>
        <div className="space-y-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={`benefit-${index}`} className="py-6 shadow border-none">
              <CardContent className="px-6">
                <div className="flex flex-col @lg:flex-row gap-2 @lg:gap-4 items-start">
                  {benefit.icon}

                  <div className="flex-1">
                    <div className="text-base @lg:text-lg font-semibold mb-2">
                      {benefit.title}
                    </div>
                    <p className="text-sm @lg:text-base text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="py-8 bg-primary/10 shadow-xs">
          <CardContent className="px-6">
            <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">
              Få en värdering idag
            </h2>
            <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Börja analysera priser och få värdefulla insikter om
              bostadsmarknaden. Skapa ett konto för att komma igång.
            </p>

            <div className="flex flex-col @lg:flex-row gap-4 justify-center">
              <Link href="/ai-tools">
                <Button className="py-5 border-2 border-transparent hover:border-transparent w-full @lg:w-auto">
                  Testa prisanalys
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  variant="outline"
                  className="text-sm @lg:text-base py-5 border-2 border-primary hover:border-transparent w-full @lg:w-auto"
                >
                  Sök bostäder
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ContainerWrapper>
    </div>
  );
};

export default PriceAnalysis;
