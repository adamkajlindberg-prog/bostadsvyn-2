import { Building2Icon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Aktiva projekt",
    value: "847",
  },
  {
    title: "Kommande lägenheter",
    value: "23 500",
  },
  {
    title: "Byggare & utvecklare",
    value: "156",
  },
  {
    title: "Slutsålda inom 1 år",
    value: "89%",
  },
];

const Hero = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-wrap gap-4 mb-4">
        <div className="bg-primary text-primary-foreground rounded-md p-3">
          <Building2Icon className="h-6 w-6 @lg:h-8 @lg:w-8" />
        </div>
        <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">
          Exklusiv förtur
        </div>
      </div>

      <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">
        Nyproduktion & kommande projekt
      </h1>
      <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
        Bli först med att upptäcka och reservera din plats i Sveriges mest
        efterfrågade nyproduktionsprojekt. Från moderna lägenheter till
        exklusiva villor.
      </p>

      <div className="grid grid-cols-1 @lg:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-14">
        {stats.map((stat) => (
          <Card key={stat.title} className="py-6 shadow-xs">
            <CardContent className="px-6">
              <div className="text-3xl text-primary text-center font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {stat.title}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Hero;
