import {
  BuildingIcon,
  FunnelIcon,
  HouseIcon,
  MapPinIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
} from "lucide-react";
import ContainerWrapper from "@/components/common/container-wrapper";
import Properties from "@/components/landing/sections/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const houseTypes = [
  { value: "apartment", label: "Lägenhet" },
  { value: "villa", label: "Villa" },
  { value: "radhus", label: "Radhus" },
  { value: "condo", label: "Bostadsrätt" },
];

const priceRanges = [
  { value: "under-2m", label: "Under 2 miljoner" },
  { value: "2-4m", label: "2-4 miljoner" },
  { value: "4-6m", label: "4-6 miljoner" },
  { value: "over-6m", label: "Över 6 miljoner" },
];

const roomCounts = [
  { value: "1", label: "1 rum" },
  { value: "2", label: "2 rum" },
  { value: "3", label: "3 rum" },
  { value: "4", label: "4 rum" },
  { value: "5-and-above", label: "5+ rum" },
];

const features = [
  {
    icon: <TrendingUpIcon size={32} />,
    title: "AI Prisanalys",
    description:
      "Få AI-drivna värderingar och marknadsanalyser för att fatta smarta köpbeslut",
  },
  {
    icon: <HouseIcon size={32} />,
    title: "Personliga Rekommendationer",
    description:
      "AI‑algoritmer som lär sig dina preferenser och föreslår perfekta bostäder",
  },
  {
    icon: <BuildingIcon size={32} />,
    title: "Virtuell Homestyling",
    description:
      "Se hur bostaden kan se ut med AI‑genererad inredning och renoveringar",
  },
];

const Buy = () => {
  return (
    <div className="@container">
      <ContainerWrapper className="py-10">
        <div className="flex items-center justify-center flex-wrap gap-4 mb-4">
          <div className="bg-primary text-primary-foreground rounded-md p-3">
            <ShoppingCartIcon className="h-6 w-6 @lg:h-8 @lg:w-8" />
          </div>
          <div className="bg-primary text-xs text-primary-foreground rounded-full px-3 py-1.5">
            Över 125,000 annonser
          </div>
        </div>

        <h1 className="text-4xl @lg:text-5xl text-primary text-center font-semibold tracking-tight leading-tight mb-4">
          Köp din drömbostad
        </h1>
        <p className="text-lg @lg:text-xl text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
          Upptäck tusentals lägenheter, villor och bostadsrätter i hela Sverige.
          Våra AI-drivna verktyg hjälper dig att hitta perfekta bostaden och
          fatta smarta beslut.
        </p>

        <Card className="py-6 shadow-xs mb-8">
          <CardContent className="px-6">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <FunnelIcon size={20} />
              <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
                Avancerad sökning
              </h3>
            </div>

            <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-4 gap-4 mb-7">
              <div>
                <Label className="text-sm font-medium mb-2">Område</Label>
                <Input
                  type="text"
                  className="text-sm"
                  placeholder="Stockholm, Göteborg, Malmö..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">Bostadstyp</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {houseTypes.map((houseType) => (
                        <SelectItem
                          key={houseType.value}
                          value={houseType.value}
                        >
                          {houseType.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">
                  Prisintervall
                </Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj pris" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {priceRanges.map((priceRange) => (
                        <SelectItem
                          key={priceRange.value}
                          value={priceRange.value}
                        >
                          {priceRange.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">Antal rum</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj rum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roomCounts.map((roomCount) => (
                        <SelectItem
                          key={roomCount.value}
                          value={roomCount.value}
                        >
                          {roomCount.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col @lg:flex-row gap-4">
              <Button size="lg">
                <FunnelIcon />
                Sök fastigheter
              </Button>

              <Button size="lg" variant="outline">
                <MapPinIcon />
                Visa på karta
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-6 mb-14">
          {features.map((feature) => (
            <Card key={feature.title} className="py-6 shadow-xs">
              <CardContent className="px-6">
                <div className="flex justify-center mb-4">
                  <div className="inline-flex bg-accent/10 rounded-full p-4 text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h5 className="text-lg text-center font-semibold mb-2">
                  {feature.title}
                </h5>
                <p className="text-sm text-center text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col @lg:flex-row @lg:justify-between @lg:items-center mb-6">
          <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight mb-4 @lg:mb-0">
            Aktuella fastigheter
          </h3>
          <div className="flex flex-col @lg:flex-row @lg:items-center gap-3 @lg:gap-2">
            <div className="text-xs text-primary-deep text-center font-semibold bg-primary/20 rounded-full px-3 py-1">
              125,000+ aktiva annonser
            </div>
            <div className="text-xs text-primary-foreground text-center font-semibold bg-primary rounded-full px-3 py-1">
              Uppdateras varje minut
            </div>
          </div>
        </div>

        <div className="@lg:bg-nordic-ice @lg:py-16 px-0 @lg:px-8">
          <Properties />
        </div>
      </ContainerWrapper>
    </div>
  );
};

export default Buy;
