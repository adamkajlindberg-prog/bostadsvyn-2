import { CircleCheckBigIcon, StarIcon, UsersIcon, ZapIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const advantages = [
  {
    icon: <ZapIcon size={30} />,
    title: "Energieffektivt",
    description:
      "Moderna byggnader med låga driftskostnader och hög energiklassning",
  },
  {
    icon: <CircleCheckBigIcon size={30} />,
    title: "10 års garanti",
    description:
      "Fullständig garanti på alla byggkomponenter och installationer",
  },
  {
    icon: <UsersIcon size={30} />,
    title: "Påverka utformning",
    description: "Möjlighet att välja material, färger och vissa planlösningar",
  },
  {
    icon: <StarIcon size={30} />,
    title: "Förstahands",
    description: "Vara första ägare i ett splitternytt hem med modern teknik",
  },
];

const Advantages = () => {
  return (
    <Card className="py-6 mb-12 shadow-xs bg-gradient-to-br from-primary/5 to-success/5">
      <CardContent className="px-6">
        <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-6">
          Fördelar med nyproduktion
        </h3>

        <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={`step-${index + 1}`}>
              <div className="flex justify-center mb-4">
                <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                  {advantage.icon}
                </div>
              </div>
              <h5 className="text-base text-center font-semibold mb-2">
                {advantage.title}
              </h5>
              <p className="text-sm text-center text-muted-foreground">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Advantages;
