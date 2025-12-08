"use client";

import {
  FunnelIcon,
  Grid3X3Icon,
  ListIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import propertyImageOne from "@/images/property-image-1.webp";
import propertyImageTwo from "@/images/property-image-2.webp";
import propertyImageThree from "@/images/property-image-3.webp";
import propertyImageFour from "@/images/property-image-4.webp";
import PropertyCard, { type AdTier, type PropertyCardProps } from "./property-card";

const filterOptions = [
  { value: "all", label: "Alla fastigheter" },
  { value: "premium", label: "Premium" },
  { value: "plus", label: "Plus" },
  { value: "villa", label: "Villor" },
  { value: "apartment", label: "Lägenheter" },
  { value: "leisure-house", label: "Fritidshus" },
];

const sortOptions = [
  { value: "tier", label: "Relevans" },
  { value: "recent", label: "Senast tillagda" },
  { value: "price-lowest", label: "Pris: Lägst först" },
  { value: "price-highest", label: "Pris: Högst först" },
  { value: "living-area", label: "Boarea" },
];

// Property data with tiers and priority scores
const allProperties: (PropertyCardProps & { priorityScore: number })[] = [
  {
    image: propertyImageOne,
    name: "Exklusiv penthouse med takterrass och panoramautsikt",
    location: {
      street: "Strandvägen 12",
      city: "Östermalm, Stockholm",
    },
    price: 25000000,
    areaSize: 180,
    rooms: 5,
    tier: "premium",
    propertyId: "1",
    priorityScore: 100,
  },
  {
    image: propertyImageTwo,
    name: "Arkitektritad sekelskiftesvåning med originaldetaljer",
    location: {
      street: "Karlavägen 45",
      city: "Stockholm",
    },
    price: 18500000,
    areaSize: 198,
    rooms: 7,
    tier: "plus",
    propertyId: "2",
    priorityScore: 80,
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
    tier: "plus",
    propertyId: "3",
    priorityScore: 75,
  },
  {
    image: propertyImageFour,
    name: "Charmig lägenhet i populärt kvarter",
    location: {
      street: "Södermalmsvägen 8",
      city: "Södermalm, Stockholm",
    },
    price: 4200000,
    areaSize: 68,
    rooms: 3,
    tier: "free",
    propertyId: "4",
    priorityScore: 50,
  },
  {
    image: propertyImageOne,
    name: "Familjevänlig villa med trädgård",
    location: {
      street: "Villavägen 22",
      city: "Täby",
    },
    price: 9500000,
    areaSize: 200,
    rooms: 6,
    tier: "free",
    propertyId: "5",
    priorityScore: 40,
  },
  {
    image: propertyImageTwo,
    name: "Studio i centrala Vasastan",
    location: {
      street: "Odengatan 12",
      city: "Vasastan, Stockholm",
    },
    price: 3200000,
    areaSize: 32,
    rooms: 1,
    tier: "free",
    propertyId: "6",
    priorityScore: 30,
  },
];

// Tier order for sorting
const tierOrder: Record<AdTier, number> = {
  premium: 3,
  plus: 2,
  free: 1,
};

const Properties = () => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("tier");

  // Filter and sort properties
  const displayedProperties = useMemo(() => {
    let filtered = [...allProperties];

    // Apply filter
    if (filter !== "all") {
      if (filter === "premium" || filter === "plus") {
        filtered = filtered.filter((p) => p.tier === filter);
      }
      // Add other filter logic for property types when needed
    }

    // Apply sorting
    switch (sort) {
      case "tier":
        filtered.sort((a, b) => {
          const tierDiff =
            tierOrder[b.tier || "free"] - tierOrder[a.tier || "free"];
          if (tierDiff !== 0) return tierDiff;
          return (b.priorityScore || 0) - (a.priorityScore || 0);
        });
        break;
      case "price-lowest":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-highest":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "living-area":
        filtered.sort((a, b) => b.areaSize - a.areaSize);
        break;
      case "recent":
      default:
        // Keep original order for recent
        break;
    }

    return filtered;
  }, [filter, sort]);

  return (
    <div className="container mx-auto max-w-7xl">
      <Card className="border shadow-none bg-card py-5 @lg:py-7">
        <CardContent className="px-4 @lg:px-7">
          {/* Header */}
          <div className="flex flex-col @4xl:flex-row @4xl:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg @lg:text-xl @4xl:text-2xl font-semibold mb-1">
                Tillgängliga fastigheter
              </h3>
              <p className="text-sm text-muted-foreground">
                {displayedProperties.length} fastigheter hittades
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col @xl:flex-row gap-2 @lg:gap-3">
              {/* View toggle - hidden on small screens */}
              <Tabs defaultValue="grid" className="hidden @2xl:block">
                <TabsList className="bg-primary/20">
                  <TabsTrigger value="grid" aria-label="Visa som rutnät">
                    <Grid3X3Icon className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" aria-label="Visa som lista">
                    <ListIcon className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2 @lg:gap-3">
                {/* Filter */}
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full @xl:w-[160px]">
                    <FunnelIcon className="h-4 w-4 mr-1.5" />
                    <SelectValue placeholder="Filtrera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-full @xl:w-[160px]">
                    <SlidersHorizontalIcon className="h-4 w-4 mr-1.5" />
                    <SelectValue placeholder="Sortera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 gap-4 @lg:gap-6">
            {displayedProperties.map((property, index) => (
              <PropertyCard
                key={`property-${property.propertyId}-${index}`}
                image={property.image}
                name={property.name}
                location={property.location}
                price={property.price}
                areaSize={property.areaSize}
                rooms={property.rooms}
                tier={property.tier}
                propertyId={property.propertyId}
              />
            ))}
          </div>

          {/* Empty state */}
          {displayedProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Inga fastigheter matchade ditt filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Properties;
