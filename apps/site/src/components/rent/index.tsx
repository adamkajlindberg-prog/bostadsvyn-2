import { MessageCircleIcon, PlusIcon, UsersIcon } from "lucide-react";
import ContainerWrapper from "@/components/common/container-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Rentals from "./rentals";

const otherInfo = [
  {
    icon: <MessageCircleIcon className="text-primary" />,
    title: "Säker kommunikation",
    description:
      "Chatta säkert med uthyraren genom vår plattform. Alla konversationer sparas för transparens och säkerhet.",
  },
  {
    icon: <UsersIcon className="text-primary" />,
    title: "Juridiska hyresavtal",
    description:
      "När ni kommit överens hjälper vi er med juridiskt korrekta hyresavtal som kan signeras digitalt med BankID.",
  },
];

const Rent = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">
            Hyresbostäder
          </div>
        </div>

        <h1 className="text-4xl @lg:text-5xl text-center font-semibold tracking-tight leading-tight mb-4">
          Hitta din perfekta <span className="text-primary">hyresbostad</span>
        </h1>
        <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Bläddra bland tusentals bostäder att hyra. Kontakta uthyraren direkt
          genom vår säkra chattfunktion.
        </p>

        <div className="flex justify-center mb-12">
          <Button size="lg" className="w-56">
            <PlusIcon /> Skapa hyresannons
          </Button>
        </div>

        <Rentals />

        <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-8 mt-12">
          {otherInfo.map((info) => (
            <Card key={info.title} className="py-6 shadow-xs">
              <CardContent className="px-6">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  {info.icon}
                  <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
                    {info.title}
                  </h3>
                </div>
                <p className="text-sm @lg:text-base text-muted-foreground">
                  {info.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContainerWrapper>
    </div>
  );
};

export default Rent;
