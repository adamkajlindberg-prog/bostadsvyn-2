import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { heroContent, missionVisionCards } from "../data/content";
import { getIcon } from "../utils/icon-map";

const Hero = () => {
  return (
    <>
      <header className="text-center mb-16">
        <Badge className="bg-accent text-accent-foreground mb-4">
          {heroContent.badge}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          {heroContent.title}
        </h1>
        <p className="text-xl text-foreground font-medium max-w-4xl mx-auto leading-relaxed">
          {heroContent.description}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {missionVisionCards.map((card) => {
          const IconComponent = getIcon(card.iconName);
          return (
            <Card
              key={card.id}
              className={`border-2 ${card.borderColor} transition-all`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconComponent
                    className={`h-6 w-6 ${card.id === "mission" ? "text-primary" : "text-accent"
                      }`}
                  />
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {card.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-foreground leading-relaxed ${index < card.paragraphs.length - 1 ? "mb-4" : ""
                      }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Hero;
