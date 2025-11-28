import {
  BrainIcon,
  FileSignatureIcon,
  HomeIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import bgImage from "@/images/bg-image.webp";

const features = [
  {
    title: "AI-Rekommendationer",
    description:
      "Personliga tips och rekommendationer baserade på din sökhistorik och önskemål",
    icon: <BrainIcon className="h-7 w-7 text-white" />,
  },
  {
    title: "AI-verktyg",
    description:
      "Avancerad bildgenerering för att se objekts potential och exklusiv rådgivning från vår AI-rådgivare",
    icon: <SparklesIcon className="h-7 w-7 text-white" />,
  },
  {
    title: "Digitala hyreskontrakt",
    description:
      "Efter vald hyresbostad hjälper vi med digitala hyreskontrakt och säker signering med BankID",
    icon: <FileSignatureIcon className="h-7 w-7 text-white" />,
  },
  {
    title: "Brett utbud av bostäder",
    description:
      "Vi erbjuder alla typer av bostäder i både Sverige och utlandet på en och samma plattform",
    icon: <HomeIcon className="h-7 w-7 text-white" />,
  },
];

const popularSearches = [
  "3 rum Stockholm under 5M",
  "Lägenhet nära tunnelbana Göteborg",
  "Villa med trädgård Malmö",
];

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-nordic-fjord to-accent">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={bgImage}
            alt="High quality aerial drone view of Stockholm city with historic districts and archipelago"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center w-full">
        <div className="space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
              <span className="block text-white drop-shadow-2xl">
                Välkommen till Bostadsvyn!
              </span>
            </h1>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all"
              >
                <div className="flex justify-center mb-3">{feature.icon}</div>
                <h3 className="text-base font-medium text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-sm font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Search Interface */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20 shadow-2xl">
              <CardContent className="p-8">
                {/* Unified Search Interface */}
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
                  <div className="mb-5">
                    <div className="flex items-center gap-2.5 mb-2">
                      <BrainIcon className="h-6 w-6 text-primary" />
                      <h3 className="text-base font-medium text-white">
                        Smart bostadssökning
                      </h3>
                    </div>
                    <p className="text-sm text-white font-normal leading-relaxed antialiased [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                      Med hjälp av vår unika AI-sökning kan du enkelt skriva en
                      liten text om vad du söker, vilka attribut som den nya
                      bostaden ska ha och vilken gata, område eller kommun som
                      önskas. Vår AI kommer sen att matcha de bostäderna i vårt
                      system som bäst passar dina önskemål.
                    </p>
                  </div>

                  <div className="flex gap-4 mb-6">
                    {/* Main Search Input */}
                    <div className="flex-1">
                      <Input
                        placeholder="Beskriv din önskade bostad eller sök på gata, område, kommun eller stad..."
                        className="bg-background/80 border-accent/30 text-foreground placeholder:text-muted-foreground focus:border-accent h-12 text-base"
                      />
                    </div>

                    {/* Filter Button */}
                    <Link href="/search">
                      <Button variant="outline" size="lg" className="w-32">
                        <SlidersHorizontalIcon className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </Link>
                  </div>

                  {/* Search Button */}
                  <div className="text-center">
                    <Link href="/search">
                      <Button size="lg">
                        <SearchIcon className="h-5 w-5 mr-2" />
                        Sök bostäder
                      </Button>
                    </Link>
                  </div>

                  {/* Quick Search Suggestions */}
                  <div className="mt-6 pt-4 border-t border-accent/20">
                    <p className="text-sm text-primary-foreground/70 mb-3">
                      Populära sökningar:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <Link key={`popular-search-${index}`} href="/search">
                          <Button variant="ghost" size="sm">
                            {search}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-32 h-32 bg-nordic-aurora/20 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
