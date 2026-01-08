"use client";

import { Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AreaRangeFilter } from "../filter-sections/area-range-filter";
import { EnergyClassFilter } from "../filter-sections/energy-class-filter";
import { FeaturesFilter } from "../filter-sections/features-filter";
import { PriceRangeFilter } from "../filter-sections/price-range-filter";
import { PropertyTypeFilter } from "../filter-sections/property-type-filter";
import { RoomsRangeFilter } from "../filter-sections/rooms-range-filter";
import type { usePropertySearchFilters } from "../hooks/use-property-search-filters";
import { AISearchInput } from "../search-inputs/ai-search-input";
import { BasicSearchInput } from "../search-inputs/basic-search-input";
import { LocationSearchInput } from "../search-inputs/location-search-input";

type FilterHookReturn = ReturnType<typeof usePropertySearchFilters>;

interface FilterSidebarProps {
  filters: FilterHookReturn["filters"];
  inputValues: FilterHookReturn["inputValues"];
  setInputValues: FilterHookReturn["setInputValues"];
  handleBasicSearch: FilterHookReturn["handleBasicSearch"];
  handleSearch: FilterHookReturn["handleSearch"];
  handleLocationSearch: FilterHookReturn["handleLocationSearch"];
  handlePropertyType: FilterHookReturn["handlePropertyType"];
  handlePriceRange: FilterHookReturn["handlePriceRange"];
  handleAreaRange: FilterHookReturn["handleAreaRange"];
  handleRoomsRange: FilterHookReturn["handleRoomsRange"];
  handleEnergyClass: FilterHookReturn["handleEnergyClass"];
  handleFeatures: FilterHookReturn["handleFeatures"];
  clearFilters: FilterHookReturn["clearFilters"];
}

export const FilterSidebar = ({
  filters,
  inputValues,
  setInputValues,
  handleBasicSearch,
  handleSearch,
  handleLocationSearch,
  handlePropertyType,
  handlePriceRange,
  handleAreaRange,
  handleRoomsRange,
  handleEnergyClass,
  handleFeatures,
  clearFilters,
}: FilterSidebarProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="w-full lg:w-80">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Rensa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* AI Smart Search */}
          <AISearchInput
            value={inputValues.aiSearch}
            onChange={(value) =>
              setInputValues((prev) => ({ ...prev, aiSearch: value }))
            }
            onSearch={(value) => handleSearch(value, "ai")}
          />

          <Separator />

          {/* Basic Search */}
          <BasicSearchInput
            value={inputValues.basicSearch}
            onChange={handleBasicSearch}
          />

          <Separator />

          {/* Location Search */}
          <LocationSearchInput
            value={inputValues.location}
            onChange={handleLocationSearch}
          />

          <Separator />

          {/* Property Type */}
          <PropertyTypeFilter
            selectedType={filters.propertyType || ""}
            onTypeChange={handlePropertyType}
          />

          {/* Price Range */}
          <PriceRangeFilter
            minPrice={inputValues.minPrice}
            maxPrice={inputValues.maxPrice}
            onPriceChange={handlePriceRange}
            show={filters.listingType !== "FOR_RENT"}
          />

          {/* Area Range */}
          <AreaRangeFilter
            minArea={inputValues.minArea}
            maxArea={inputValues.maxArea}
            onValueChange={(min, max) => {
              setInputValues((prev) => ({
                ...prev,
                minArea: min,
                maxArea: max,
              }));
            }}
            onValueCommit={handleAreaRange}
          />

          {/* Rooms */}
          <RoomsRangeFilter
            minRooms={inputValues.minRooms}
            maxRooms={inputValues.maxRooms}
            onValueChange={(min, max) => {
              setInputValues((prev) => ({
                ...prev,
                minRooms: min,
                maxRooms: max,
              }));
            }}
            onValueCommit={handleRoomsRange}
          />

          <Separator />

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showAdvancedFilters ? "Dölj utökade filter" : "Utökade filter"}
          </Button>

          {showAdvancedFilters && (
            <>
              <Separator />

              {/* Features */}
              <FeaturesFilter
                selectedFeatures={filters.features || []}
                onFeatureToggle={handleFeatures}
              />

              {/* Energy Class */}
              <EnergyClassFilter
                selectedClasses={inputValues.energyClass}
                onClassToggle={handleEnergyClass}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
