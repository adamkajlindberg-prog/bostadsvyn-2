"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { searchPropertyTabs, sortOptions } from "@/utils/constants";

type ListingType =
  | "ALL"
  | "FOR_SALE"
  | "FOR_RENT"
  | "COMING_SOON"
  | "SOLD"
  | "COMMERCIAL"
  | "NYPRODUKTION";

interface PropertyTabsProps {
  activeTab: ListingType;
  activeSearchTab: string;
  counts?: {
    ALL?: number;
    FOR_SALE?: number;
    FOR_RENT?: number;
    COMING_SOON?: number;
    SOLD?: number;
    COMMERCIAL?: number;
    NYPRODUKTION?: number;
  };
  sortBy?: string;
  hideRental: boolean;
  hideCommercial: boolean;
  hideNyproduktion: boolean;
  onTabChange: (value: string) => void;
  onSortChange: (sortBy: string) => void;
  onHideRentalChange: (hide: boolean) => void;
  onHideCommercialChange: (hide: boolean) => void;
  onHideNyproduktionChange: (hide: boolean) => void;
}

export const PropertyTabs = ({
  activeTab,
  activeSearchTab,
  counts,
  sortBy,
  hideRental,
  hideCommercial,
  hideNyproduktion,
  onTabChange,
  onSortChange,
  onHideRentalChange,
  onHideCommercialChange,
  onHideNyproduktionChange,
}: PropertyTabsProps) => {
  const searchParams = useSearchParams();
  const listingType = searchParams.get("listingType");

  return (
    <div className="mb-6 space-y-4">
      {/* Property Type Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Tabs
          value={listingType || activeTab}
          className="hidden md:block overflow-x-auto"
          onValueChange={onTabChange}
        >
          <TabsList className="grid grid-cols-7">
            <TabsTrigger value="ALL">
              Alla {`(${counts?.ALL ?? 0})`}
            </TabsTrigger>
            <TabsTrigger value="FOR_SALE">
              Till salu {`(${counts?.FOR_SALE ?? 0})`}
            </TabsTrigger>
            <TabsTrigger value="COMING_SOON">
              Snart till salu {`(${counts?.COMING_SOON ?? 0})`}
            </TabsTrigger>
            <TabsTrigger value="SOLD">
              Slutpriser {`(${counts?.SOLD ?? 0})`}
            </TabsTrigger>
            <TabsTrigger value="FOR_RENT">
              Uthyrning {`(${counts?.FOR_RENT ?? 0})`}
            </TabsTrigger>
            <TabsTrigger value="NYPRODUKTION">
              Nyproduktion {`(${counts?.NYPRODUKTION ?? 0})`}
            </TabsTrigger>
            <TabsTrigger value="COMMERCIAL">
              Kommersiellt {`(${counts?.COMMERCIAL ?? 0})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="sm:hidden w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-muted hover:bg-muted/80 border-0"
              >
                <span className="flex items-center gap-2">
                  {searchPropertyTabs.find(
                    (item) => item.value === activeSearchTab,
                  )?.label || "Alla"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[var(--radix-dropdown-menu-trigger-width)]"
              align="start"
            >
              {searchPropertyTabs.map((item) => {
                const isActive = activeSearchTab === item.value;
                return (
                  <DropdownMenuItem key={item.value} asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isActive && "bg-accent font-medium",
                      )}
                      onClick={() => onTabChange(item.value)}
                    >
                      {item.label}
                    </button>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Checkbox
              id="hideRental"
              checked={hideRental}
              onCheckedChange={(checked) =>
                onHideRentalChange(checked === true)
              }
            />
            <Label htmlFor="hideRental" className="text-sm cursor-pointer">
              Visa ej hyresbostäder
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="hideCommercial"
              checked={hideCommercial}
              onCheckedChange={(checked) =>
                onHideCommercialChange(checked === true)
              }
            />
            <Label htmlFor="hideCommercial" className="text-sm cursor-pointer">
              Visa ej kommersiellt
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="hideNyproduktion"
              checked={hideNyproduktion}
              onCheckedChange={(checked) =>
                onHideNyproduktionChange(checked === true)
              }
            />
            <Label
              htmlFor="hideNyproduktion"
              className="text-sm cursor-pointer"
            >
              Visa ej nyproduktion
            </Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sortera efter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={sortBy === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
