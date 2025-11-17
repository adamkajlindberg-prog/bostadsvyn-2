import { UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BrowseMore = () => {
  return (
    <Card className="py-8 bg-primary-deep border-none shadow-none">
      <CardContent className="px-6">
        <h2 className="text-2xl @lg:text-3xl text-center text-primary-foreground font-semibold mb-4">
          Vill du veta mer?
        </h2>
        <p className="text-sm @lg:text-base text-primary-foreground/90 text-center max-w-2xl mx-auto mb-8">
          Har du frågor om Bostadsvyn, våra tjänster eller vill diskutera
          partnerskap? Vi hör gärna från dig och berättar mer om vår resa och
          framtidsplaner.
        </p>
        <div className="flex flex-col @lg:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"
          >
            <UsersIcon /> Kontakta oss
          </Button>
          <Button
            variant="outline"
            className="text-sm @lg:text-base py-6 hover:border-transparent w-full @lg:w-auto"
          >
            Läs våra nyheter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowseMore;
