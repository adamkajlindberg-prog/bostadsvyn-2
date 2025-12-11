import { Card, CardContent } from "@/components/ui/card";

const FounderStory = () => {
  return (
    <div className="mb-16">
      <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Grundat och byggt av en fastighetsmäklare med branscherfarenhet
              </h2>
              <p className="text-accent font-semibold">
                Fem års erfarenhet från fastighetsbranschen
              </p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed mb-4 text-lg">
            Bostadsvyn är grundat och byggt av en registrerad fastighetsmäklare med gedigen branscherfarenhet men också personlig erfarenhet från bostadsmarknaden. Genom fem års erfarenhet har vi identifierat de verktyg och funktioner som verkligen tillför värde för samtliga aktörer på fastighetsmarknaden – fastighetsmäklare, säljare, köpare, spekulanter och hyresvärdar.
          </p>

          <blockquote className="mt-6 border-l-4 border-accent pl-6 italic text-foreground text-lg">
            <p className="leading-relaxed mb-2">
              "Jag har sedan hösten 2024 funderat mycket på varför vi i Sverige inte har EN bostadsportal för alla typer av bostäder utan folk måste söka sig till 4-5 olika sidor, beroende på vad de söker. Det var så jag fick idén för Bostadsvyn! Målet för mig är att ta allt jag har lärt mig från att vara en köpare, säljare och mäklare till att tillsammans med den otroliga teknologin som finns idag, skapa den absolut bästa plattformen för bostäder som finns i Sverige. Alla ska kunna annonsera och alla ska ha nytta av portalen och dessa unika verktyg som vi har tagit fram. Förhoppningsvis så kan jag med detta hårda jobb underlätta för er från början till slut, oavsett vad ni söker för bostad."
            </p>
            <p className="text-sm font-semibold not-italic text-accent">— Adam</p>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
};

export default FounderStory;
