import {
  Brain,
  Calculator,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import livingRoomAfter from "@/assets/living-room-after.jpg";
import livingRoomBefore from "@/assets/living-room-before.jpg";
import villaAfterEdit from "@/assets/villa-after-with-pool.jpg";
import villaBeforeEdit from "@/assets/villa-before-clean.jpg";
import AITutorialsSection from "@/components/AITutorialsSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
const FeatureSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-nordic-ice to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intro Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bostadsvyn
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg text-foreground font-medium leading-relaxed">
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
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Vår vision är att revolutionera bostadsmarknaden genom att
              kombinera cutting-edge AI-teknologi med personlig service och
              rådgivning. Vi är här för att hjälpa dig genom hela processen och
              göra din största affär till en trygg och smidig upplevelse –
              oavsett om du köper, säljer eller hyr.{" "}
            </p>
          </div>
        </div>

        {/* Founder Story */}
        <div className="mb-16">
          <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
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
              <p className="text-foreground leading-relaxed mb-4 text-lg">
                Bostadsvyn är grundat och byggt av en registrerad
                fastighetsmäklare med gedigen branscherfarenhet men också
                personlig erfarenhet från bostadsmarknaden. Genom fem års
                erfarenhet har vi identifierat de verktyg och funktioner som
                verkligen tillför värde för samtliga aktörer på
                fastighetsmarknaden – fastighetsmäklare, säljare, köpare,
                spekulanter och hyresvärdar.
              </p>

              <blockquote className="mt-6 border-l-4 border-accent pl-6 italic text-foreground text-lg">
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

        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="accent" className="mb-4">
            <Sparkles className="h-4 w-4 mr-1" />
            AI-verktyg
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
            Smarta verktyg för modern fastighetshantering
          </h2>
          <p className="text-base text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
            AI-drivna lösningar som gör bostadsprocessen enklare och mer
            transparent.
          </p>
        </div>

        {/* Featured AI Staging Preview */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-elevated bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
            <div className="p-8 lg:p-12">
              <Badge variant="accent" className="mb-4">
                <Brain className="h-4 w-4 mr-1" />
                AI-Homestyling
              </Badge>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                Se potentialen i varje rum
              </h3>
              <p className="text-foreground text-base font-medium mb-5 leading-relaxed">
                Transformera rum med AI – visualisera nya golv, väggar, färger
                och inredning. Renovera badrum och kök, möblera tomma rum eller
                ta bort möbler för att se rummets fulla potential. Perfekt för
                att planera renoveringar och inredning.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-7">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Inredning & Design:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Möblera och ta bort möbler
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Olika inredningsstilar
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Gardiner och belysning
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Garderober och förvaring
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Trappor och nivåskillnader
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Renovering & Finish:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Golv, väggar och tak
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Färger och material
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Badrum och kök
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Fotorealistiska resultat
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Och mycket mer
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={livingRoomBefore}
                  alt="Vardagsrum före AI-homestyling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-background/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  Före
                </div>
              </div>
              <div className="relative">
                <img
                  src={livingRoomAfter}
                  alt="Vardagsrum efter AI-homestyling med nya färger"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Efter
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured AI Property Editor Preview */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-elevated bg-card/40 backdrop-blur-lg border border-primary-foreground/20">
            <div className="p-8 lg:p-12">
              <Badge variant="accent" className="mb-4">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Bildredigering
              </Badge>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                Visualisera renoveringar, förändringar och tillbyggnader
              </h3>
              <p className="text-foreground text-base font-medium mb-5 leading-relaxed">
                Vårt AI-verktyg låter dig enkelt lägga till eller ta bort
                element från fastighetbilder. Visa potentialen i både utomhus-
                och exteriörutrymmen genom att visualisera förändringar och
                tillbyggnader. Via chatten på det specifika objektet får du
                resultatet på sekunder.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-7">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Lägg till:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Pooler och terrasser
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Våningsplan och tillbyggnader
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Uteplatser och staket
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Infarter och garage
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Balkonger och attefallshus
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Byt ut:
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Tak och fasad
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Färger och material
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Fönster och dörrar
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Entré och yttermiljö
                    </li>
                    <li className="flex items-center gap-2 text-foreground text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Och mycket mer
                    </li>
                  </ul>
                </div>
              </div>
              <Button
                variant="nordic"
                size="lg"
                className="w-fit"
                asChild
              ></Button>
            </div>
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={villaBeforeEdit}
                  alt="Villa före redigering"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-background/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  Före
                </div>
              </div>
              <div className="relative">
                <img
                  src={villaAfterEdit}
                  alt="Villa efter redigering med terrass och pool"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Efter
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Tutorials Section */}
        <div className="my-20">
          <AITutorialsSection />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link} className="block">
                <Card className="group hover:shadow-card transition-all duration-300 hover:scale-105 bg-card/40 backdrop-blur-lg border border-primary-foreground/20 cursor-pointer h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-3 rounded-xl bg-muted ${feature.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      {feature.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
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

        {/* CTA */}
      </div>
    </section>
  );
};
export default FeatureSection;
