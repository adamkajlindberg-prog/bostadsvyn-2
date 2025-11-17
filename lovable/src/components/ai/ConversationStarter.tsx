import {
  ArrowRight,
  BarChart3,
  Calculator,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const conversationStarters = [
  {
    id: "market-analysis",
    icon: TrendingUp,
    title: "Marknadsanalys Stockholm 2025",
    description: "Djupgående analys av fastighetspriser, trender och prognoser",
    prompt:
      "Ge mig en omfattande marknadsanalys för Stockholm med fokus på prisutveckling, kommande trender och bästa köptillfällen för 2025.",
    category: "marknad",
    complexity: "avancerad",
    estimatedTime: "3-4 min",
  },
  {
    id: "area-comparison",
    icon: MapPin,
    title: "Områdesjämförelse & Analys",
    description:
      "Jämför flera områden baserat på skolor, trygghet och framtidsutsikter",
    prompt:
      "Jämför och analysera Danderyd, Nacka och Täby ur ett familjeperspektiv. Fokusera på skolor, trygghet, kommunikationer och fastighetspriser.",
    category: "områden",
    complexity: "avancerad",
    estimatedTime: "4-5 min",
  },
  {
    id: "investment-strategy",
    icon: BarChart3,
    title: "Investeringsstrategi 2025",
    description: "Optimala strategier för fastighetsinvesteringar",
    prompt:
      "Vilka fastighetstyper och områden har bäst avkastningspotential de kommande 3-5 åren? Ge mig en detaljerad investeringsstrategi.",
    category: "investering",
    complexity: "expert",
    estimatedTime: "5-6 min",
  },
  {
    id: "financing-guide",
    icon: Calculator,
    title: "Finansieringsguide & Lånestrategi",
    description: "Personlig finansieringsrådgivning och låneoptimering",
    prompt:
      "Jag har 50 000 kr i månadsintäkt och 200 000 kr i kontantinsats. Ge mig en detaljerad finansieringsguide med optimala lånestrategier.",
    category: "lån",
    complexity: "avancerad",
    estimatedTime: "3-4 min",
  },
];

interface ConversationStarterProps {
  onSelectStarter: (prompt: string, category: string) => void;
}

export default function ConversationStarter({
  onSelectStarter,
}: ConversationStarterProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "grundläggande":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "avancerad":
        return "bg-nordic-ice text-primary";
      case "expert":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Kom igång med avancerade analyser
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Välj en förberedd analystyp för att få djupgående insikter om svenska
          fastighetsmarknaden. Alla analyser baseras på realtidsdata från
          myndigheter och marknadsaktörer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conversationStarters.map((starter) => {
          const IconComponent = starter.icon;
          return (
            <Card
              key={starter.id}
              className="hover:shadow-md transition-shadow duration-200 border-border/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {starter.title}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs px-2 py-1 ${getComplexityColor(starter.complexity)}`}
                  >
                    {starter.complexity}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {starter.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{starter.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏱️ {starter.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    onSelectStarter(starter.prompt, starter.category)
                  }
                  className="w-full justify-between group hover:bg-primary/90 transition-colors"
                  size="sm"
                >
                  <span>Starta analys</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          💡 Alla analyser använder realtidsdata från Skolverket, SCB, Polisen
          och andra officiella källor
        </p>
      </div>
    </div>
  );
}
