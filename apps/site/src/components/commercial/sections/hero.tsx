import { BriefcaseIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-primary rounded-lg p-3">
          <BriefcaseIcon className="h-8 w-8 text-primary-foreground" />
        </div>
        <Badge className="bg-accent text-accent-foreground">
          Professionella lösningar
        </Badge>
      </div>
      <h1 className="text-3xl @lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Kommersiella fastigheter
      </h1>
      <p className="text-lg text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
        Hitta den perfekta kommersiella fastigheten för ditt företag. Från
        moderna kontor och strategiskt placerade butiker till industrilokaler
        och investeringsobjekt.
      </p>
    </div>
  );
};

export default Hero;
