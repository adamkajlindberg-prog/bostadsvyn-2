import { Building2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-premium rounded-lg p-3">
          <Building2Icon className="h-8 w-8 text-premium-foreground" />
        </div>
        <Badge className="bg-accent text-accent-foreground">
          Exklusiv förtur
        </Badge>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#134194]">
        Nyproduktion & kommande projekt
      </h1>
      <p className="text-lg text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
        Bli först med att upptäcka och reservera din plats i Sveriges mest
        efterfrågade nyproduktionsprojekt. Från moderna lägenheter till
        exklusiva villor.
      </p>
    </div>
  );
};

export default Hero;
