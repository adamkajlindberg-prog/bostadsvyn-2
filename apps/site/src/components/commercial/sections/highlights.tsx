import {
  BuildingIcon,
  FactoryIcon,
  StoreIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    icon: <BuildingIcon size={32} />,
    title: "Kontor",
    description: "Moderna kontorslokaler i attraktiva lägen",
    badgeText: "3,240 lokaler",
  },
  {
    icon: <StoreIcon size={32} />,
    title: "Butiker & Handel",
    description: "Butikslokaler i stadskärnor och köpcentrum",
    badgeText: "2,180 lokaler",
  },
  {
    icon: <FactoryIcon size={32} />,
    title: "Lager & Industri",
    description: "Stora ytor för produktion och logistik",
    badgeText: "1,890 lokaler",
  },
  {
    icon: <TrendingUpIcon size={32} />,
    title: "Investering",
    description: "Lönsamma investeringsobjekt för portföljer",
    badgeText: "1,140 objekt",
  },
];

const Highlights = () => {
  return (
    <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-4 gap-6 mb-14">
      {highlights.map((highlight) => (
        <Card
          key={highlight.title}
          className="py-6 shadow-xs border-primary/40"
        >
          <CardContent className="px-6">
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                {highlight.icon}
              </div>
            </div>

            <h5 className="text-lg text-center font-semibold mb-2">
              {highlight.title}
            </h5>
            <p className="text-sm text-center text-muted-foreground mb-4">
              {highlight.description}
            </p>

            <div className="flex justify-center">
              <div className="bg-primary/10 text-xs text-center text-primary font-medium rounded-full px-3 py-1">
                {highlight.badgeText}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Highlights;
