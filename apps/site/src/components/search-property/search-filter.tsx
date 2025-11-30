"use client";

import {
  BrainIcon,
  CalendarIcon,
  ClockIcon,
  FunnelIcon,
  HomeIcon,
  Loader2Icon,
  SlidersHorizontalIcon,
  SparklesIcon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LocationAutocomplete } from "@/components/location-autocomplete";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const propertyTypes = [
  { value: "all", label: "Alla typer" },
  { value: "apartment", label: "Lägenheter" },
  { value: "villa", label: "Villor" },
  { value: "townhouse", label: "Radhus/Parhus/Kedjehus" },
  { value: "vacation_home", label: "Fritidshus" },
  { value: "plot", label: "Tomter" },
  { value: "commercial", label: "Kommersiellt" },
  { value: "farm", label: "Gård" },
  { value: "other", label: "Övrigt" },
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
  { value: "1", label: "Senaste dygnet" },
  { value: "3", label: "Max 3 dagar" },
  { value: "7", label: "Max 1 vecka" },
  { value: "14", label: "Max 2 veckor" },
  { value: "30", label: "Max 1 månad" },
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
  const [listingType, setListingType] = useState<string>("all");
  const [naturalSearchQuery, setNaturalSearchQuery] = useState<string>("");
  const [isSearchInputExpanded, setIsSearchInputExpanded] =
    useState<boolean>(false);
  const [isAISearching, setIsAISearching] = useState<boolean>(false);

  // Rental-specific filter states
  const [minRent, setMinRent] = useState<number>(0);
  const [maxRent, setMaxRent] = useState<number>(50000);
  const [furnished, setFurnished] = useState<string>("");
  const [utilities, setUtilities] = useState<string[]>([]);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [shortTerm, setShortTerm] = useState<boolean>(false);

  // Sale-specific filter states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(20000000);
  const [minArea, setMinArea] = useState<number>(0);
  const [maxArea, setMaxArea] = useState<number>(1000);
  const [minRooms, setMinRooms] = useState<number>(0);
  const [maxRooms, setMaxRooms] = useState<number>(10);

  const handleNaturalSearch = async () => {
    if (!naturalSearchQuery || naturalSearchQuery.trim().length === 0) {
      return;
    }

    setIsAISearching(true);
    // TODO: Implement AI search functionality
    // This would call a server action or API endpoint
    setTimeout(() => {
      setIsAISearching(false);
      setIsSearchInputExpanded(false);
    }, 1000);
  };

  const toggleUtility = (utility: string) => {
    setUtilities((prev) =>
      prev.includes(utility)
        ? prev.filter((u) => u !== utility)
        : [...prev, utility],
    );
  };

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

        {/* AI Smart Search */}
        <div
          className={`bg-accent/10 border border-accent/20 rounded-xl p-4 transition-all duration-300 mb-6 ${
            isSearchInputExpanded
              ? "fixed inset-0 z-50 backdrop-blur-md bg-background/30 flex items-center justify-center"
              : ""
          }`}
        >
          {isSearchInputExpanded && (
            <button
              type="button"
              tabIndex={0}
              aria-label="Stäng smart AI-sökning"
              className="absolute inset-0"
              onClick={() => setIsSearchInputExpanded(false)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " " ||
                  e.key === "Spacebar"
                ) {
                  setIsSearchInputExpanded(false);
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
              }}
            />
          )}
          <div
            className={`relative ${
              isSearchInputExpanded ? "w-full max-w-4xl mx-auto p-8" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <BrainIcon className="h-5 w-5 text-primary" />
              <Label className="text-sm font-medium">Smart AI-sökning</Label>
            </div>
            <p
              className={`text-xs text-muted-foreground mb-3 ${
                isSearchInputExpanded ? "text-base" : ""
              }`}
            >
              Beskriv din drömbostad i naturligt språk. Vår AI tolkar
              automatiskt dina önskemål.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="T.ex. '3 rum lägenhet i Stockholm med balkong under 5 miljoner'"
                value={naturalSearchQuery}
                onChange={(e) => setNaturalSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNaturalSearch();
                    setIsSearchInputExpanded(false);
                  }
                }}
                onFocus={() => setIsSearchInputExpanded(true)}
                disabled={isAISearching}
                className={`text-sm transition-all duration-300 ${
                  isSearchInputExpanded ? "text-lg p-6" : ""
                }`}
              />
              <Button
                onClick={() => {
                  handleNaturalSearch();
                  setIsSearchInputExpanded(false);
                }}
                disabled={isAISearching}
                size={isSearchInputExpanded ? "lg" : "sm"}
              >
                {isAISearching ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <SparklesIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2">Fastighetstyp</Label>
          <div className="mt-2 space-y-2">
            {propertyTypes
              .filter((type) => type.value !== "all")
              .map((type) => {
                const propertyTypeMap: Record<string, string> = {
                  apartment: "APARTMENT",
                  villa: "HOUSE",
                  townhouse: "TOWNHOUSE",
                  vacation_home: "COTTAGE",
                  plot: "PLOT",
                  commercial: "COMMERCIAL",
                  farm: "FARM",
                  other: "OTHER",
                };
                const _typeValue = propertyTypeMap[type.value] || type.value;
                return (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={false}
                      onCheckedChange={() => {
                        // TODO: Implement property type selection
                      }}
                    />
                    <Label
                      htmlFor={type.value}
                      className="text-sm cursor-pointer"
                    >
                      {type.label}
                    </Label>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2">Typ av annons</Label>
          <div className="mt-2 space-y-2">
            {adTypes
              .filter((type) => type.value !== "all")
              .map((type) => {
                const listingTypeMap: Record<string, string> = {
                  for_sale: "FOR_SALE",
                  for_rent: "FOR_RENT",
                  coming_soon: "COMING_SOON",
                };
                const _mappedValue =
                  listingTypeMap[type.value] || type.value.toUpperCase();
                return (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={listingType === type.value}
                      onCheckedChange={() =>
                        setListingType(
                          listingType === type.value ? "all" : type.value,
                        )
                      }
                    />
                    <Label
                      htmlFor={type.value}
                      className="text-sm cursor-pointer"
                    >
                      {type.label}
                    </Label>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Rental-specific filters - only show when FOR_RENT is selected */}
        {listingType === "for_rent" && (
          <>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5 text-accent" />
                <Label className="font-semibold">Hyresfilter</Label>
                <Badge variant="outline" className="text-xs">
                  Endast hyresbostäder
                </Badge>
              </div>

              {/* Rent Range */}
              <div>
                <Label className="text-sm font-medium mb-2">
                  Hyresintervall (SEK/månad)
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Från"
                    value={minRent || ""}
                    onChange={(e) => setMinRent(Number(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Till"
                    value={maxRent === 50000 ? "" : maxRent}
                    onChange={(e) =>
                      setMaxRent(Number(e.target.value) || 50000)
                    }
                  />
                </div>
              </div>

              {/* Furnished */}
              <div>
                <Label className="text-sm font-medium mb-2">Möblering</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="furnished"
                      checked={furnished === "furnished"}
                      onCheckedChange={() =>
                        setFurnished(
                          furnished === "furnished" ? "" : "furnished",
                        )
                      }
                    />
                    <Label
                      htmlFor="furnished"
                      className="text-sm cursor-pointer"
                    >
                      Möblerad
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unfurnished"
                      checked={furnished === "unfurnished"}
                      onCheckedChange={() =>
                        setFurnished(
                          furnished === "unfurnished" ? "" : "unfurnished",
                        )
                      }
                    />
                    <Label
                      htmlFor="unfurnished"
                      className="text-sm cursor-pointer"
                    >
                      Omöblerad
                    </Label>
                  </div>
                </div>
              </div>

              {/* Utilities Included */}
              <div>
                <Label className="text-sm font-medium mb-2">
                  Inkluderat i hyran
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["El", "Värme", "Internet", "Parkering"].map((utility) => (
                    <div key={utility} className="flex items-center space-x-2">
                      <Checkbox
                        id={utility}
                        checked={utilities.includes(utility)}
                        onCheckedChange={() => toggleUtility(utility)}
                      />
                      <Label htmlFor={utility} className="text-sm">
                        {utility}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional rental options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pets"
                    checked={petsAllowed}
                    onCheckedChange={(checked) =>
                      setPetsAllowed(checked === true)
                    }
                  />
                  <Label htmlFor="pets" className="text-sm">
                    Husdjur tillåtet
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shortTerm"
                    checked={shortTerm}
                    onCheckedChange={(checked) =>
                      setShortTerm(checked === true)
                    }
                  />
                  <Label htmlFor="shortTerm" className="text-sm">
                    Korttidsuthyrning (&lt;12 månader)
                  </Label>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />
          </>
        )}

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2">Sök plats</Label>
          <LocationAutocomplete
            placeholder="Ange stad, kommun eller område"
            className="mb-2"
          />
          <Input
            type="text"
            className="text-sm"
            placeholder="T.ex. Stockholm"
          />
        </div>

        <Separator className="mb-6" />

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
            <Separator className="mb-6" />

            {/* Price Range - only show for non-rental properties */}
            {listingType !== "for_rent" && (
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2">
                  {listingType === "for_sale"
                    ? "Köpesumma (SEK)"
                    : "Prisintervall (SEK)"}
                </Label>
                <div className="grid grid-cols-2 gap-2.5 mt-2">
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Från"
                    value={minPrice || ""}
                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    min={0}
                    className="text-sm"
                    placeholder="Till"
                    value={maxPrice === 20000000 ? "" : maxPrice}
                    onChange={(e) =>
                      setMaxPrice(Number(e.target.value) || 20000000)
                    }
                  />
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <div className="mb-6">
                <Label className="text-sm font-medium mb-4">Boarea (m²)</Label>
                <Slider
                  value={[minArea, maxArea]}
                  onValueChange={([min, max]) => {
                    setMinArea(min);
                    setMaxArea(max);
                  }}
                  max={1000}
                  step={10}
                  className="mb-3.5"
                />
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {minArea} m<sup>2</sup>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {maxArea} m<sup>2</sup>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-4">Antal rum</Label>
                <Slider
                  value={[minRooms, maxRooms]}
                  onValueChange={([min, max]) => {
                    setMinRooms(min);
                    setMaxRooms(max);
                  }}
                  max={10}
                  step={1}
                  className="mb-3.5"
                />
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {minRooms} rum
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {maxRooms}+ rum
                  </div>
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

            {/* Sale-specific filters - only show when NOT renting */}
            {listingType !== "for_rent" && (
              <>
                <Separator className="mb-6" />

                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2">
                    Våningsplan
                  </Label>
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
                  <Label className="text-sm font-medium mb-2">
                    Nyproduktion
                  </Label>
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

                <Separator className="mb-6" />
              </>
            )}

            {/* Days Listed - only show when NOT renting */}
            {listingType !== "for_rent" && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon size={16} />
                  <Label className="text-sm font-medium">
                    Dagar på plattformen
                  </Label>
                </div>

                <RadioGroup defaultValue="all" className="mt-2 space-y-2">
                  {platformDays.map((day) => (
                    <div key={day.value} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={day.value}
                        id={`days-${day.value}`}
                      />
                      <Label
                        htmlFor={`days-${day.value}`}
                        className="font-normal cursor-pointer"
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Viewing Time - only show when NOT renting */}
            {listingType !== "for_rent" && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ClockIcon size={16} />
                  <Label className="text-sm font-medium">Visningstid</Label>
                </div>

                <RadioGroup defaultValue="all" className="mt-2 space-y-2 mb-4">
                  {viewingDays.map((day) => (
                    <div key={day.value} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={day.value}
                        id={`view-${day.value}`}
                      />
                      <Label
                        htmlFor={`view-${day.value}`}
                        className="font-normal cursor-pointer"
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex items-center gap-2.5">
                  <Checkbox id="hideBeforeViewing" />
                  <Label
                    htmlFor="hideBeforeViewing"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Dölj borttagen före visning
                  </Label>
                </div>
              </div>
            )}

            {/* Water Distance - only show when NOT renting */}
            {listingType !== "for_rent" && (
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
                  <Checkbox id="nearSea" />
                  <Label
                    htmlFor="nearSea"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Endast nära hav
                  </Label>
                </div>
              </div>
            )}

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

                  <p className="text-sm text-muted-foreground mb-4 whitespace-normal">
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
