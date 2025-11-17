import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import propertyImageOne from "@/images/property-image-1.webp";
import propertyImageTwo from "@/images/property-image-2.webp";
import propertyImageThree from "@/images/property-image-3.webp";
import PropertyCard from "./property-card";

const filters = [
  { value: "all", label: "Alla (57)" },
  { value: "for_sale", label: "Till salu (19)" },
  { value: "coming_soon", label: "Snart till salu (23)" },
  { value: "sold", label: "Slutpriser (13)" },
  { value: "for_rent", label: "Uthyrning (2)" },
  { value: "new_production", label: "Nyproduktion (12)" },
  { value: "commercial", label: "Kommersiellt (8)" },
];

const exclusiveProperties = [
  {
    image: propertyImageOne,
    name: "Exklusiv villa med havsutsikt",
    address: "Strandvägen 12, Djursholm",
    price: 18500000,
    areaSize: 285,
    rooms: 8,
  },
  {
    image: propertyImageTwo,
    name: "Arkitektritad sekelskiftesvåning",
    address: "Östermalmsvägen 12, Stockholm",
    price: 24900000,
    areaSize: 198,
    rooms: 7,
  },
  {
    image: propertyImageThree,
    name: "Modern lyxvilla med pool och spa",
    address: "Alphyddevägen 15, Lidingö",
    price: 32500000,
    areaSize: 420,
    rooms: 10,
  },
];

const Properties = () => {
  return (
    <div className="@4xl:col-span-8 @5xl:col-span-9">
      <Card className="py-0 shadow-xs mb-6 overflow-hidden">
        <CardContent className="px-0">
          {/* <div>
                        <AlertCircleIcon className="h-16 w-16 mx-auto mb-4 text-destructive" />
                        <h3 className="text-base @lg:text-lg text-center font-semibold mb-2">Google Maps API-nyckel saknas</h3>
                        <p className="text-sm text-muted-foreground text-center">
                        Kontakta administratören för att konfigurera Google Maps.
                        </p>
                    </div> */}

          <iframe
            className="w-full"
            height="400"
            id="gmap_canvas"
            title="Google Maps showing Östersund"
            src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=%20%C3%96stersund+(bostadsvyn-map)&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 bg-primary/10 p-2.5 mb-4 rounded-xl">
        {filters.map((filter, index) => (
          <Button
            key={`filter-${index}`}
            variant={filter.value === "all" ? "default" : "outline"}
            className="hover:border-transparent"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col @lg:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Checkbox className="border-primary" />
          <Label className="text-sm font-normal">Visa ej hyresbostäder</Label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox className="border-primary" />
          <Label className="text-sm font-normal">Visa ej kommersiellt</Label>
        </div>
        <Button>
          <ArrowDownUpIcon />
          Sortera efter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {exclusiveProperties.map((property, index) => (
          <PropertyCard key={`exclusive-property-${index}`} {...property} />
        ))}
      </div>
    </div>
  );
};

export default Properties;
