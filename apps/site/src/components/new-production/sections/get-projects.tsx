import { Building2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GetProjects = () => {
  return (
    <Card className="py-8 bg-primary-deep border-none shadow-none">
      <CardContent className="px-6">
        <h2 className="text-2xl @lg:text-3xl text-center text-primary-foreground font-semibold mb-4">
          Få exklusiv förtur till nya projekt
        </h2>
        <p className="text-sm @lg:text-base text-primary-foreground/90 text-center max-w-2xl mx-auto mb-8">
          Registrera dig för att få information om kommande nyproduktionsprojekt
          innan de lanseras officiellt. Ingen kostnad och inga förpliktelser.
        </p>
        <div className="flex flex-col @lg:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"
          >
            <Building2Icon /> Registrera intresse
          </Button>
          <Button
            variant="outline"
            className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"
          >
            Se alla projekt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GetProjects;
