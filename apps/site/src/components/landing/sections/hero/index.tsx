import {
  BrainIcon,
  FilePenIcon,
  HouseIcon,
  InfoIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const features = [
  {
    title: "AI-Rekommendationer",
    description:
      "Personliga tips och rekommendationer baserade på din sökhistorik och önskemål",
    icon: <BrainIcon className="text-primary-foreground" size={32} />,
  },
  {
    title: "Marknadsanalys",
    description:
      "Värderingar och förväntningar baserade på marknadsdata och avancerad AI-teknologi",
    icon: <TrendingUpIcon className="text-primary-foreground" size={32} />,
  },
  {
    title: "Digitala hyreskontrakt",
    description:
      "Efter vald hyresbostad hjälper vi med digitala hyreskontrakt och säker signering med BankID",
    icon: <FilePenIcon className="text-primary-foreground" size={32} />,
  },
  {
    title: "Brett utbud av bostäder",
    description:
      "Första portalen i Sverige som erbjuder alla typer av bostäder på en och samma plattform",
    icon: <HouseIcon className="text-primary-foreground" size={32} />,
  },
];

const popularSearches = [
  "3 rum Stockholm under 5M",
  "Lägenhet nära tunnelbana Göteborg",
  "Villa med trädgård Malmö",
];

const Hero = () => {
  return (
    <div
      id="11-9-14-14-5-20-8"
      className="relative min-h-screen h-auto w-full py-10 @lg:py-12 @6xl:py-16 bg-[url('../images/bg-image.webp')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-primary/40" />
      <div className="container mx-auto max-w-7xl px-6 @lg:px-8 @8xl:px-0 relative z-10">
        <h1 className="text-center text-4xl @4xl:text-6xl font-semibold tracking-tight text-primary-foreground mb-8">
          Välkommen till Bostadsvyn!
        </h1>

        <div className="grid grid-cols-1 @lg:grid-cols-2 @6xl:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card
              key={`feature-${index}`}
              className="bg-white/5 border border-primary-foreground/10 backdrop-blur-sm"
            >
              <CardContent>
                <div className="flex justify-center mb-2">{feature.icon}</div>
                <h6 className="text-lg text-primary-foreground text-center font-semibold mb-1">
                  {feature.title}
                </h6>
                <p className="text-sm text-neutral-200 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="bg-card/40 border border-primary-foreground/20 backdrop-blur-lg py-4 @lg:py-8 shadow-2xl text-primary-foreground">
            <CardContent className="px-4 @lg:px-8">
              <div className="bg-accent/10 border border-accent/40 rounded-lg p-6">
                <div className="flex flex-wrap flex-row @lg:items-center gap-3 mb-4 justify-between @lg:justify-start">
                  <BrainIcon size={28} className="text-primary/90 order-1" />
                  <h4 className="text-lg font-semibold order-3 @lg:order-2 mx-auto @lg:mx-0">
                    Smart bostadssökning
                  </h4>
                  <div className="flex items-center gap-x-2 @lg:gap-x-3 order-2 @lg:order-3">
                    <InfoIcon className="bg-accent/30 h-5 w-5 rounded-full p-1" />
                    <div className="bg-accent/20 text-xs font-semibold rounded-full border border-accent px-2.5 py-0.5">
                      Beta
                    </div>
                  </div>
                </div>

                <p className="text-sm text-center text-primary-foreground/90 max-w-5xl mx-auto mb-6">
                  Med hjälp av vår unika AI-sökning kan du enkelt skriva en
                  liten text om vad du söker, vilka attribut som den nya
                  bostaden ska ha och vilken gata, område eller kommun som
                  önskas. Vår AI kommer sen att matcha de bostäderna i vårt
                  system som bäst passar dina önskemål.
                </p>

                <div className="grid grid-cols-1 @lg:grid-cols-12 @lg:items-center gap-4 mb-6">
                  <Input
                    className="@lg:col-span-8 @4xl:col-span-10 bg-background/80 border border-accent/30 px-4 text-sm h-12 text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    placeholder="Beskriv din önskade bostad eller sök på gata, område, kommun eller stad..."
                  />
                  <Button
                    variant="secondary"
                    className="@lg:col-span-4 @4xl:col-span-2 h-12 bg-background/80 border border-accent/30"
                  >
                    <SlidersHorizontalIcon />
                    Filter?
                  </Button>
                </div>

                <div className="flex justify-center mb-8">
                  <Link href="/search">
                    <Button className="w-full @lg:w-auto h-12 has-[>svg]:px-10">
                      <SearchIcon /> Sök bostäder
                    </Button>
                  </Link>
                </div>

                <div className="border-t border-accent/40 pt-6">
                  <div className="text-center text-sm text-primary-foreground/90 mb-4">
                    Populära sökningar:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {popularSearches.map((search, index) => (
                      <Button
                        key={`popular-search-${index}`}
                        size="sm"
                        variant="ghost"
                        className="text-xs text-primary-foreground bg-primary/30 hover:bg-primary/40 hover:text-primary-foreground"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hero;
