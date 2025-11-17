import {
  BrainIcon,
  HeartIcon,
  ShieldIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    icon: <BrainIcon size={32} />,
    name: "Innovation",
    description:
      "Vi använder den senaste tekniken för att skapa lösningar som verkligen förbättrar användarupplevelsen inom fastigheter.",
  },
  {
    icon: <ShieldIcon size={32} />,
    name: "Transparens",
    description:
      "Ärlighet och öppenhet i alla våra interaktioner. Användare ska alltid veta vad de kan förvänta sig av oss.",
  },
  {
    icon: <UsersIcon size={32} />,
    name: "Användarfokus",
    description:
      "Allt vi gör utgår från användarens behov. Vi lyssnar aktivt på feedback och utvecklar våra tjänster därefter.",
  },
  {
    icon: <HeartIcon size={32} />,
    name: "Ansvar",
    description:
      "Vi tar ansvar för våra användares upplevelser och arbetar ständigt för att förbättra våra tjänster och processer.",
  },
];

const advantages = [
  {
    icon: <BrainIcon />,
    title: "AI-Driven Teknologi",
    description:
      "Våra AI-algoritmer analyserar marknadsdata, användarpreferenser och fastighetsinformation för att ge personliga rekommendationer och precisa värderingar.",
  },
  {
    icon: <ZapIcon />,
    title: "Virtuell Homestyling",
    description:
      "Revolutionerande AI-verktyg som låter användare se hur en bostad kan se ut med olika inredningar och renoveringar innan de fattar beslut.",
  },
  {
    icon: <ShieldIcon />,
    title: "Säkra Digitala Avtal",
    description:
      "Digitala hyres- och köpekontrakt med BankID-signering som följer svensk lagstiftning och ger användarna trygghet i hela processen.",
  },
];

const OurValues = () => {
  return (
    <>
      <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-10">
        Våra värderingar
      </h2>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-14">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="py-6 shadow-xs border-primary/40"
          >
            <CardContent className="px-6">
              <div className="flex justify-center mb-4">
                <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                  {category.icon}
                </div>
              </div>

              <h5 className="text-lg text-center font-semibold mb-2">
                {category.name}
              </h5>
              <p className="text-sm text-center text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl @lg:text-3xl text-center font-semibold mb-10">
        Vad gör oss unika?
      </h2>
      <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 pb-16 mb-14 border-b-2">
        {advantages.map((advantage) => (
          <Card key={advantage.title} className="py-6 shadow-xs">
            <CardContent className="px-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex text-primary">{advantage.icon}</div>
                <div className="text-base @lg:text-lg font-semibold">
                  {advantage.title}
                </div>
              </div>
              <p className="text-sm @lg:text-base text-muted-foreground">
                {advantage.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default OurValues;
