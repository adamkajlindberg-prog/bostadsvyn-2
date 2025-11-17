import { SelectValue } from "@radix-ui/react-select";
import {
  FunnelIcon,
  Grid3X3Icon,
  ListIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import propertyImageOne from "@/images/property-image-1.webp";
import propertyImageTwo from "@/images/property-image-2.webp";
import propertyImageThree from "@/images/property-image-3.webp";
import PropertyCard from "./property-card";

const filterOptions = [
  {
    value: "all",
    label: "Alla fastigheter",
  },
  {
    value: "for-sale",
    label: "Till salu",
  },
  {
    value: "rental",
    label: "Uthyrning",
  },
  {
    value: "villa",
    label: "Villor",
  },
  {
    value: "appartment",
    label: "Lägenheter",
  },
  {
    value: "leisure-house",
    label: "Fritidshus",
  },
];

const sortOptions = [
  {
    value: "recent",
    label: "Senast tillagda",
  },
  {
    value: "price-lowest",
    label: "Pris: Lägst först",
  },
  {
    value: "price-highest",
    label: "Pris: Högst först",
  },
  {
    value: "living-area",
    label: "Living area",
  },
];

const exclusiveProperties = [
  {
    image: propertyImageOne,
    name: "Exklusiv villa med havsutsikt",
    location: {
      street: "Strandvägen 12",
      city: "Djursholm",
    },
    price: 18500000,
    areaSize: 285,
    rooms: 8,
  },
  {
    image: propertyImageTwo,
    name: "Arkitektritad sekelskiftesvåning",
    location: {
      street: "Östermalmsvägen 12",
      city: "Stockholm",
    },
    price: 24900000,
    areaSize: 198,
    rooms: 7,
  },
  {
    image: propertyImageThree,
    name: "Modern lyxvilla med pool och spa",
    location: {
      street: "Alphyddevägen 15",
      city: "Lidingö",
    },
    price: 32500000,
    areaSize: 420,
    rooms: 10,
  },
];

const Properties = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <Card className="border shadow-none bg-card py-7">
        <CardContent className="px-7">
          <div className="flex flex-col @4xl:flex-row justify-between mb-6">
            <div>
              <h3 className="text-xl @lg:text-2xl font-semibold mb-1">
                Tillgängliga fastigheter
              </h3>
              <p className="text-muted-foreground">9 fastigheter hittades</p>
            </div>

            <div className="flex flex-col @2xl:flex-row gap-3 @2xl:gap-4 mt-6 @4xl:mt-0">
              <Tabs defaultValue="grid">
                <TabsList className="bg-primary/20">
                  <TabsTrigger value="grid">
                    <Grid3X3Icon />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <ListIcon />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select defaultValue="all">
                <SelectTrigger>
                  <FunnelIcon />
                  <SelectValue placeholder="Filtrera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filterOptions.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select defaultValue="recent">
                <SelectTrigger>
                  <SlidersHorizontalIcon />
                  <SelectValue placeholder="Sortera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortOptions.map((sort) => (
                      <SelectItem key={sort.value} value={sort.value}>
                        {sort.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {exclusiveProperties.map((property, index) => (
              <PropertyCard key={`exclusive-property-${index}`} {...property} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Properties;
