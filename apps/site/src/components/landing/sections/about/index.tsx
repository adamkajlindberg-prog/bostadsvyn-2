import { Brain, Sparkles } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import livingRoomAfter from "@/images/living-room-after.webp";
import livingRoomBefore from "@/images/living-room-before.webp";
import villaAfter from "@/images/villa-after-with-pool.webp";
import villaBefore from "@/images/villa-before-edit.webp";

const highlights = [
  {
    badgeIcon: <Brain className="h-4 w-4" />,
    badgeText: "AI-Homestyling",
    title: "Se potentialen i varje rum",
    description:
      "Transformera rum med AI – visualisera nya golv, väggar, färger och inredning. Renovera badrum och kök, möblera tomma rum eller ta bort möbler för att se rummets fulla potential. Perfekt för att planera renoveringar och inredning.",
    features: [
      {
        title: "Inredning & Design:",
        items: [
          "Möblera och ta bort möbler",
          "Olika inredningsstilar",
          "Gardiner och belysning",
          "Garderober och förvaring",
          "Trappor och nivåskillnader",
        ],
      },
      {
        title: "Renovering & Finish:",
        items: [
          "Golv, väggar och tak",
          "Färger och material",
          "Badrum och kök",
          "Fotorealistiska resultat",
          "Och mycket mer",
        ],
      },
    ],
    imageBefore: livingRoomBefore,
    imageBeforeAlt: "Vardagsrum före AI-homestyling",
    imageAfter: livingRoomAfter,
    imageAfterAlt: "Vardagsrum efter AI-homestyling med nya färger",
  },
  {
    badgeIcon: <Sparkles className="h-4 w-4" />,
    badgeText: "AI Bildredigering",
    title: "Visualisera renoveringar, förändringar och tillbyggnader",
    description:
      "Vårt AI-verktyg låter dig enkelt lägga till eller ta bort element från fastighetbilder. Visa potentialen i både utomhus- och exteriörutrymmen genom att visualisera förändringar och tillbyggnader. Via chatten på det specifika objektet får du resultatet på sekunder.",
    features: [
      {
        title: "Lägg till:",
        items: [
          "Pooler och terrasser",
          "Våningsplan och tillbyggnader",
          "Uteplatser och staket",
          "Infarter och garage",
          "Balkonger och attefallshus",
        ],
      },
      {
        title: "Byt ut:",
        items: [
          "Tak och fasad",
          "Färger och material",
          "Fönster och dörrar",
          "Entré och yttermiljö",
          "Och mycket mer",
        ],
      },
    ],
    imageBefore: villaBefore,
    imageBeforeAlt: "Villa före redigering",
    imageAfter: villaAfter,
    imageAfterAlt: "Villa efter redigering med terrass och pool",
  },
];

const About = () => {
  return (
    <section className="pt-20 pb-12 bg-gradient-to-b from-nordic-ice to-background w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Intro Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bostadsvyn
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-base md:text-lg text-foreground font-medium leading-relaxed">
              Välkommen till framtidens bostadsportal med det bredaste utbudet
              av bostäder i både Sverige och utlandet. Hos oss hittar du allt
              från <span className="font-semibold">villor</span>,{" "}
              <span className="font-semibold">gårdar</span>,{" "}
              <span className="font-semibold">lägenheter</span>,{" "}
              <span className="font-semibold">tomter</span> och{" "}
              <span className="font-semibold">fritidshus</span> till{" "}
              <span className="font-semibold">radhus</span>,{" "}
              <span className="font-semibold">kedjehus</span>,{" "}
              <span className="font-semibold">parhus</span>,{" "}
              <span className="font-semibold">hyresbostäder</span>,{" "}
              <span className="font-semibold">nyproduktion</span> och{" "}
              <span className="font-semibold">kommersiella fastigheter</span> –
              allt på samma plattform.
            </p>
            <p className="text-sm md:text-lg text-foreground font-medium leading-relaxed">
              Vår vision är att revolutionera bostadsmarknaden genom att
              kombinera cutting-edge AI-teknologi med personlig service och
              rådgivning. Vi är här för att hjälpa dig genom hela processen och
              göra din största affär till en trygg och smidig upplevelse –
              oavsett om du köper, säljer eller hyr.
            </p>
          </div>
        </div>

        {/* Founder Story */}
        <div className="mb-16">
          <Card className="rounded-lg bg-card text-card-foreground shadow-sm border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Grundat och byggt av en fastighetsmäklare med
                    branscherfarenhet
                  </h2>
                  <p className="text-accent font-semibold">
                    Fem års erfarenhet från fastighetsbranschen
                  </p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed mb-4 text-sm md:text-lg">
                Bostadsvyn är grundat och byggt av en registrerad
                fastighetsmäklare med gedigen branscherfarenhet men också
                personlig erfarenhet från bostadsmarknaden. Genom fem års
                erfarenhet har vi identifierat de verktyg och funktioner som
                verkligen tillför värde för samtliga aktörer på
                fastighetsmarknaden – fastighetsmäklare, säljare, köpare,
                spekulanter och hyresvärdar.
              </p>

              <blockquote className="mt-6 border-l-4 border-accent pl-6 italic text-foreground text-sm md:text-lg">
                <p className="leading-relaxed mb-2">
                  "Jag har sedan hösten 2024 funderat mycket på varför vi i
                  Sverige inte har EN bostadsportal för alla typer av bostäder
                  utan folk måste söka sig till 4-5 olika sidor, beroende på vad
                  de söker. Det var så jag fick idén för Bostadsvyn! Målet för
                  mig är att ta allt jag har lärt mig från att vara en köpare,
                  säljare och mäklare till att tillsammans med den otroliga
                  teknologin som finns idag, skapa den absolut bästa plattformen
                  för bostäder som finns i Sverige. Alla ska kunna annonsera och
                  alla ska ha nytta av portalen och dessa unika verktyg som vi
                  har tagit fram. Förhoppningsvis så kan jag med detta hårda
                  jobb underlätta för er från början till slut, oavsett vad ni
                  söker för bostad."
                </p>
                <p className="text-sm font-semibold not-italic text-accent">
                  — Adam
                </p>
              </blockquote>
            </CardContent>
          </Card>
        </div>

        {/* AI Feature Cards */}
        <div className="space-y-16 mb-16">
          {highlights.map((highlight) => (
            <Card
              key={highlight.badgeText}
              className="overflow-hidden shadow-elevated bg-card/40 backdrop-blur-lg border border-primary-foreground/20"
            >
              <div className="p-8 lg:p-12">
                <Badge variant="accent" className="mb-4">
                  {highlight.badgeIcon}
                  {highlight.badgeText}
                </Badge>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                  {highlight.title}
                </h3>
                <p className="text-foreground text-base font-medium mb-5 leading-relaxed">
                  {highlight.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-7">
                  {highlight.features.map((feature) => (
                    <div key={feature.title}>
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        {feature.title}
                      </h4>

                      <ul className="space-y-2">
                        {feature.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-foreground text-sm font-medium"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={highlight.imageBefore}
                    alt={highlight.imageBeforeAlt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-background/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    Före
                  </div>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={highlight.imageAfter}
                    alt={highlight.imageAfterAlt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Efter
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
