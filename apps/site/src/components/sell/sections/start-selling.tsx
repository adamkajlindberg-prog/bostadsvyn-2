import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StartSelling = () => {
  return (
    <Card className="py-8 mt-8 bg-primary-deep border-none shadow-none">
      <CardContent className="px-6">
        <h2 className="text-2xl @lg:text-3xl text-center text-primary-foreground font-semibold mb-4">
          Börja sälja idag
        </h2>
        <p className="text-sm @lg:text-base text-primary-foreground/90 text-center max-w-2xl mx-auto mb-8">
          Få en kostnadsfri värdering av din bostad, upptäck vilka mäklare som
          är bäst i ditt område, och se hur våra AI-verktyg kan hjälpa dig uppnå
          högsta möjliga slutpris.
        </p>
        <div className="flex flex-col @lg:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"
          >
            <PlusIcon /> Starta kostnadsfri värdering
          </Button>
          <Button
            variant="outline"
            className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"
          >
            <SearchIcon /> Hitta din mäklare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StartSelling;
