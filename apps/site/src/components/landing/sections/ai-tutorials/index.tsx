import { ImagePlus, MessageSquare, PlayCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tutorials = [
  {
    icon: MessageSquare,
    title: "AI-Chatten",
    description:
      "Lär dig hur du använder vår AI-rådgivare för att få personliga rekommendationer och svar på alla dina fastighetsfrågor.",
    videoUrl: "",
    thumbnail: "",
    duration: "3 min",
    category: "Grundläggande",
  },
  {
    icon: ImagePlus,
    title: "Bildredigeraren",
    description:
      "Upptäck hur du enkelt kan visualisera renoveringar och ändringar med vår AI-bildredigering.",
    videoUrl: "",
    thumbnail: "",
    duration: "4 min",
    category: "Avancerat",
  },
  {
    icon: Sparkles,
    title: "AI-Homestyling",
    description:
      "Se hur du transformerar tomma rum till fullt inredda utrymmen med olika stilar och färger.",
    videoUrl: "",
    thumbnail: "",
    duration: "2 min",
    category: "Grundläggande",
  },
];
const AiTutorials = () => {
  return (
    <section className="py-16 px-6 lg:px-8 mt-20 bg-gradient-to-b from-background to-transparent">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1 bg-accent py-1 px-2.5 rounded-full mb-4 text-accent-foreground">
          <PlayCircle size={16} className="text-primary-foreground" />
          <div className="text-xs font-semibold">Guider & Tutorials</div>
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
          Använd Bostadsvyn på bästa sätt!
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
          Upptäck hur du får ut det mesta av vår marknadsportal och de verktyg
          som gör oss unika på marknaden. Här finns några klipp som visar hur
          smart sidan är.
        </p>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tutorials.map((tutorial, index) => {
          const Icon = tutorial.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-card transition-all duration-300 hover:scale-105 bg-card/60 backdrop-blur-lg border border-border/50 overflow-hidden py-0 pb-6"
            >
              {/* Video Thumbnail Area */}
              <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
                {tutorial.thumbnail ? (
                  <Image
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    fill
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Video kommer snart
                    </span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-4 rounded-full bg-primary/90 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle
                      className="h-10 w-10 text-primary-foreground"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                  {tutorial.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {tutorial.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="px-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {tutorial.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {tutorial.description}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Se guide →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
export default AiTutorials;
