import {
  BrainIcon,
  CircleCheckBigIcon,
  HomeIcon,
  PaletteIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import homestylingImg from "@/images/ai-homestyling.webp";

const features = [
  {
    icon: <ZapIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Snabb rendering",
    description:
      "Få fotorealistiska resultat på bara några sekunder. Ingen lång väntetid - se resultatet omedelbart.",
  },
  {
    icon: <PaletteIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Olika stilar",
    description:
      "Välj mellan skandinavisk, modern, klassisk, minimalistisk och många fler inredningsstilar.",
  },
  {
    icon: <HomeIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Automatisk anpassning",
    description:
      "AI:n anpassar automatiskt möbler och inredning till rummets storlek och form.",
  },
  {
    icon: <SparklesIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Fotorealistisk kvalitet",
    description:
      "Resultat som ser ut som professionella interiörfoton med korrekt ljussättning och skuggor.",
  },
  {
    icon: <CircleCheckBigIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Flera alternativ",
    description:
      "Generera flera olika förslag för samma rum och jämför olika inredningslösningar.",
  },
  {
    icon: <BrainIcon className="h-7 w-7 @lg:h-9 @lg:w-9" />,
    title: "Smart AI-analys",
    description:
      "AI:n förstår rummets funktion och föreslår relevant inredning - sovrum får säng, kök får köksinredning.",
  },
];

const benefits = [
  {
    icon: (
      <HomeIcon
        size={48}
        className="text-primary p-3 rounded-lg bg-primary/10"
      />
    ),
    title: "För bostadsköpare",
    description:
      "Gör smartare köpbeslut genom att visualisera bostadspotentialen innan du investerar.",
    items: [
      {
        name: "Se bostadspotentialen",
        description:
          "Visualisera hur tomma eller dåligt inredda rum kan se ut när de är professionellt inredda",
      },
      {
        name: "Testa din egen stil",
        description:
          "Prova olika inredningsstilar för att se vad som passar dina preferenser bäst",
      },
      {
        name: "Få designinspiration",
        description:
          "Använd AI-genererad inredningen som inspiration för ditt eget inredningsprojekt",
      },
      {
        name: "Jämför alternativ",
        description:
          "Generera flera olika förslag och jämför vilken stil och layout som tilltalar dig mest",
      },
    ],
  },
  {
    icon: (
      <UsersIcon
        size={48}
        className="text-primary p-3 rounded-lg bg-primary/10"
      />
    ),
    title: "För säljare och mäklare",
    description:
      "Sälj snabbare och till högre priser genom professionell digital homestaging.",
    items: [
      {
        name: "Öka försäljningspriset",
        description:
          "Studier visar att homestagade bostäder säljs för 5–15% högre pris än omöblerade alternativ",
      },
      {
        name: "Spara tid och pengar",
        description:
          "Digital homestaging kostar en bråkdel av fysisk staging och tar bara sekunder att genomföra",
      },
      {
        name: "Nå fler köpare",
        description:
          "Visa flera olika inredningsstilar för att tilltala olika målgrupper och öka räckvidden",
      },
      {
        name: "Sälj snabbare",
        description:
          "Professionellt stagade bostäder får fler visningar och säljs i genomsnitt 30–50% snabbare",
      },
    ],
  },
];

const Homestyling = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5 gap-1.5">
            <BrainIcon size={18} />
            AI-Powered
          </div>
        </div>

        <h1 className="text-4xl @lg:text-5xl text-center font-semibold tracking-tight leading-tight mb-4">
          AI-Homestyling
        </h1>
        <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
          Transformera tomma rum till inredda drömhem med vår avancerade
          AI-teknik
        </p>

        <div className="relative h-60 @lg:h-96 @2xl:h-96 @4xl:h-[500px] @6xl:h-[800px] overflow-hidden rounded-md mb-16">
          <Image
            src={homestylingImg}
            alt="AI Homestyling"
            fill
            className="object-cover"
          />
        </div>

        <div className="inline-flex items-center border text-sm font-semibold rounded-full px-3 py-1.5 gap-1.5 mb-4">
          <SparklesIcon size={18} />
          Avancerad teknologi
        </div>
        <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">
          Vad är AI-Homestyling?
        </h2>
        <div className="max-w-4xl mb-16">
          <p className="text-sm @lg:text-base text-muted-foreground mb-4">
            AI-Homestyling är en banbrytande teknik som revolutionerar hur vi
            visualiserar bostäder. Genom avancerad artificiell intelligens och
            djupinlärning kan vi transformera tomma eller omöbleraderum till
            fullt inredda, fotorealistiska miljöer på några sekunder.
          </p>
          <p className="text-sm @lg:text-base text-muted-foreground mb-8">
            Vår proprietära AI-motor analyserar över{" "}
            <span className="font-semibold">200 parametrar</span> i varje bild -
            från rummets dimensioner och ljusförhållanden till arkitektoniska
            detaljer som fönsterplacering, takhöjd och golvmaterial. Detta gör
            att vi kan skapa visualiseringar som inte bara ser professionella
            ut, utan också är arkitektoniskt korrekta och realistiska.
          </p>

          <Card className="py-6 shadow-xs bg-gradient-to-br from-primary/5 to-success/5">
            <CardContent className="px-6">
              <div className="flex flex-col @lg:flex-row gap-2 @lg:gap-4 items-start">
                <BrainIcon className="text-primary" />
                <div className="flex-1">
                  <div className="text-base @lg:text-lg font-semibold mb-2">
                    Forskningsbaserad teknologi
                  </div>
                  <p className="text-sm @lg:text-base text-muted-foreground">
                    Vår AI-teknologi bygger på flera års forskninginom computer
                    vision och generativ AI. Vi använder neurala nätverk tränade
                    på miljontals professionella interiörbilder för att
                    säkerställa högsta kvalitet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl @lg:text-3xl font-semibold mb-4 @lg:mb-8">
          Kraftfulla funktioner
        </h2>
        <p className="text-sm @lg:text-base text-muted-foreground max-w-4xl mb-8">
          Vår AI-homestyling levererar professionella resultat med funktioner
          som tidigare endast var tillgängliga för stora fastighetsbolag och
          designbyråer.
        </p>
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

        <h2 className="text-2xl @lg:text-3xl font-semibold mb-6 @lg:mb-8">
          Fördelar för olika användare
        </h2>
        <div className="space-y-8 mb-12">
          {benefits.map((benefit, index) => (
            <Card
              key={`benefits-set-${index}`}
              className="py-6 bg-primary/5 border-primary/40 shadow-xs"
            >
              <CardContent className="px-6">
                <div className="flex items-center flex-wrap mb-6 gap-4 @lg:gap-2">
                  {benefit.icon}
                  <div className="text-lg @lg:text-xl font-semibold">
                    {benefit.title}
                  </div>
                </div>
                <p className="text-sm @lg:text-base text-muted-foreground mb-6">
                  {benefit.description}
                </p>

                <ul className="space-y-4">
                  {benefit.items.map((item, idx) => (
                    <li
                      key={`benefits-set-${index}-item-${idx}`}
                      className="flex items-start gap-3"
                    >
                      <CircleCheckBigIcon className="text-primary h-5 w-5 @lg:h-6 @lg:w-6" />
                      <div className="flex-1">
                        <div className="text-sm @lg:text-base font-medium mb-1">
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="py-8 bg-primary/10 shadow-xs">
          <CardContent className="px-6">
            <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-4">
              Redo att prova AI-Homestyling?
            </h2>
            <p className="text-sm @lg:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Börja visualisera din drömbostad idag. Logga in eller skapa ett
              konto för att komma igång.
            </p>

            <div className="flex justify-center">
              <Link href="/login">
                <Button className="py-6 hover:border-transparent w-full @lg:w-auto">
                  Logga in / Registrera
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </ContainerWrapper>
    </div>
  );
};

export default Homestyling;
