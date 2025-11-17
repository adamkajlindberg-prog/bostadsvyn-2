"use client";

import {
  BrainIcon,
  CalendarIcon,
  ClockIcon,
  FunnelIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const propertyTypes = [
  { value: "all", label: "Alla typer" },
  { value: "apartment", label: "Lägenheter" },
  { value: "villa", label: "Villor" },
  { value: "townhouse", label: "Radhus" },
  { value: "vacation_home", label: "Fritidshus" },
  { value: "plot", label: "Tomter" },
  { value: "commercial", label: "Kommersiellt" },
];

const adTypes = [
  { value: "all", label: "Alla annonser" },
  { value: "for_sale", label: "Till salu" },
  { value: "for_rent", label: "Uthyrning" },
  { value: "coming_soon", label: "Kommer snart" },
];

const characteristics = [
  { value: "balcony", label: "Balkong" },
  { value: "terrace", label: "Terrass" },
  { value: "garden", label: "Trädgård" },
  { value: "garage", label: "Garage" },
  { value: "parking", label: "Parkering" },
  { value: "elevator", label: "Hiss" },
  { value: "pool", label: "Pool" },
  { value: "sauna", label: "Bastu" },
];

const energyClasses = ["A", "B", "C", "D", "E", "F", "G"];

const floorPlans = [
  { value: "all", label: "Visa alla" },
  { value: "ground", label: "Bottenvåning" },
  { value: "1-3", label: "Våning 1-3" },
  { value: "4plus", label: "Våning 4+" },
];

const productionOptions = [
  { value: "show_new_production", label: "Visa nyproduktion" },
  { value: "only_new_production", label: "Endast nyproduktion" },
  { value: "exclude_new_production", label: "Uteslut nyproduktion" },
];

const minYears = [
  { value: "none", label: "Inget minimum" },
  { value: "2020", label: "2020" },
  { value: "2010", label: "2010" },
  { value: "2000", label: "2000" },
  { value: "1990", label: "1990" },
  { value: "1980", label: "1980" },
];

const maxYears = [
  { value: "none", label: "Inget maximum" },
  { value: "2020", label: "2020" },
  { value: "2010", label: "2010" },
  { value: "2000", label: "2000" },
];

const platformDays = [
  { value: "all", label: "Visa alla" },
  { value: "last_24h", label: "Senaste dygnet" },
  { value: "max_3_days", label: "Max 3 dagar" },
  { value: "max_1_week", label: "Max 1 vecka" },
  { value: "max_2_weeks", label: "Max 2 veckor" },
  { value: "max_1_month", label: "Max 1 månad" },
];

const viewingDays = [
  { value: "all", label: "Visa alla" },
  { value: "today", label: "Idag" },
  { value: "tomorrow", label: "Imorgon" },
  { value: "weekend", label: "I helgen (lör–mån)" },
];

const waterDistances = [
  { value: "all", label: "Alla" },
  { value: "100", label: "Inom 100 m" },
  { value: "500", label: "Inom 500 m" },
  { value: "1000", label: "Inom 1 km" },
];

const sortOptions = [
  { value: "newest", label: "Nyast först" },
  { value: "oldest", label: "Äldst först" },
  { value: "cheapest", label: "Billigast först" },
  { value: "most_expensive", label: "Dyrast först" },
  { value: "largest_area", label: "Störst först (m²)" },
  { value: "smallest_area", label: "Minst först (m²)" },
  { value: "largest_plot", label: "Tomt - störst först (m²)" },
  { value: "smallest_plot", label: "Tomt - minst först (m²)" },
  { value: "lowest_price_per_m2", label: "Lägst kvadratmeterpris (kr/m²)" },
  { value: "highest_price_per_m2", label: "Högst kvadratmeterpris (kr/m²)" },
  { value: "most_rooms", label: "Flest rum först" },
  { value: "fewest_rooms", label: "Minst antal rum först" },
  { value: "lowest_fee", label: "Lägst avgift (kr/mån)" },
  { value: "highest_fee", label: "Högst avgift (kr/mån)" },
  { value: "address_az", label: "Adress A-Ö" },
  { value: "address_za", label: "Adress Ö-A" },
];

const SearchFilter = () => {
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  return (
    <Card className="@4xl:col-span-4 @5xl:col-span-3 py-6 shadow-xs">
      <CardContent className="px-6">
        <div className="flex justify-between pb-6 border-b mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            <h3 className="text-lg @lg:text-xl font-semibold">Filter</h3>
          </div>

          <Button variant="outline">Rensa</Button>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2">Fastighetstyp</Label>
          <Select defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Välj typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2">Typ av annons</Label>
          <Select defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Välj typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {adTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2">Stad</Label>
          <Input
            type="text"
            className="text-sm"
            placeholder="T.ex. Stockholm"
          />
        </div>

        <Button
          variant="outline"
          className="border-2 border-primary hover:border-transparent w-full"
          onClick={() => setAdvancedOpen((state) => !state)}
        >
          <SlidersHorizontalIcon />
          {advancedOpen ? "Dölj utökade filter" : "Utökade filter"}
        </Button>

        {advancedOpen && (
          <>
            <div className="mt-6 pt-6 border-t">
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">
                  Prisintervall (SEK)
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Från"
                  />
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Till"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-4">Boarea (m²)</Label>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="mb-3.5"
                />
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    0 m<sup>2</sup>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    1000 m<sup>2</sup>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-4">Antal rum</Label>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="mb-3.5"
                />
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">0 rum</div>
                  <div className="text-sm text-muted-foreground">10+ rum</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Label className="text-sm font-medium mb-2">Egenskaper</Label>
              <div className="flex flex-col gap-2 mb-6">
                {characteristics.map((characteristic) => (
                  <div
                    key={characteristic.value}
                    className="flex items-center gap-2.5"
                  >
                    <Checkbox value={characteristic.value} />
                    <Label className="text-sm font-normal">
                      {characteristic.label}
                    </Label>
                  </div>
                ))}
              </div>

              <Label className="text-sm font-medium mb-2">Energiklass</Label>
              <div className="flex flex-wrap gap-2">
                {energyClasses.map((energyClass) => (
                  <div key={energyClass}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 border-primary hover:border-transparent w-full"
                    >
                      {energyClass}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">Våningsplan</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj våningsplan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {floorPlans.map((floorPlan) => (
                        <SelectItem
                          key={floorPlan.value}
                          value={floorPlan.value}
                        >
                          {floorPlan.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">Nyproduktion</Label>
                <Select defaultValue="show_new_production">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj nyproduktion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {productionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">Byggår</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <Select defaultValue="none">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Välj minimiår" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {minYears.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="none">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Välj maximiår" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {maxYears.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">
                  Avgift (kr/mån)
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">
                  Tomtarea (m²)
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon size={16} />
                  <Label className="text-sm font-medium">
                    Dagar på plattformen
                  </Label>
                </div>

                <RadioGroup defaultValue="all">
                  {platformDays.map((day) => (
                    <div key={day.value} className="flex items-center gap-3">
                      <RadioGroupItem value={day.value} />
                      <Label className="font-normal">{day.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ClockIcon size={16} />
                  <Label className="text-sm font-medium">Visningstid</Label>
                </div>

                <RadioGroup defaultValue="all" className="mb-4">
                  {viewingDays.map((day) => (
                    <div key={day.value} className="flex items-center gap-3">
                      <RadioGroupItem value={day.value} />
                      <Label className="font-normal">{day.label}</Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex items-center gap-2.5">
                  <Checkbox />
                  <Label className="text-sm font-normal">
                    Dölj borttagen före visning
                  </Label>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <WavesIcon size={16} />
                  <Label className="text-sm font-medium">
                    Avstånd till vatten
                  </Label>
                </div>

                <Select defaultValue="all">
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Välj avstånd" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {waterDistances.map((distance) => (
                        <SelectItem key={distance.value} value={distance.value}>
                          {distance.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2.5">
                  <Checkbox />
                  <Label className="text-sm font-normal">Endast nära hav</Label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Card className="py-4 shadow-xs bg-accent/10 border border-accent/40">
                <CardContent className="px-4">
                  <div className="flex justify-end mb-4">
                    <div className="text-xs text-white font-medium bg-primary py-0.5 px-2.5 rounded-full">
                      Kräver konto
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <BrainIcon size={16} className="text-primary" />
                    <div className="text-sm font-semibold">
                      AI-Rekommendationer
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 break-words whitespace-normal">
                    Få personliga fastighetsrekommendationer baserade på dina
                    tidigare sökningar.
                  </p>

                  <Link href="/login">
                    <Button size="sm" className="w-full">
                      <SparklesIcon style={{ width: 14, height: 14 }} />
                      Logga in
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div>
                <Label className="text-sm font-medium mb-2">Sortera</Label>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj sortering" />
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
