import { ArrowDown, ArrowUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryAISearch from "@/components/CategoryAISearch";
import LegalFooter from "@/components/LegalFooter";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import Navigation from "@/components/Navigation";
import RentalMap from "@/components/RentalMap";
import RentalProperties from "@/components/RentalProperties";
import SEOOptimization from "@/components/seo/SEOOptimization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Rentals = () => {
  const [search, setSearch] = useState("");
  const [minRent, setMinRent] = useState<string>("");
  const [maxRent, setMaxRent] = useState<string>("");
  const [type, setType] = useState<string>("ALL");
  const [sort, setSort] = useState<
    | "latest"
    | "price_asc"
    | "price_desc"
    | "area_asc"
    | "area_desc"
    | "rooms_asc"
    | "rooms_desc"
  >("latest");
  const [count, setCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<
    | {
        center_lat?: number;
        center_lng?: number;
        name?: string;
        type?: string;
      }
    | undefined
  >(undefined);

  const minRentNum = useMemo(
    () => (minRent ? Number(minRent) : undefined),
    [minRent],
  );
  const maxRentNum = useMemo(
    () => (maxRent ? Number(maxRent) : undefined),
    [maxRent],
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization
        title="Hyresbostäder - Bostadsvyn"
        description="Hitta din perfekta hyresbostad. Bläddra bland tusentals lägenheter och hus att hyra i hela Sverige."
        keywords="hyresbostäder, hyra lägenhet, hyra hus, uthyrning, hyresmarknaden, Stockholm, Göteborg, Malmö"
        canonicalUrl="https://bostadsvyn.se/hyresbostader"
      />
      <Navigation />
      <main id="main-content">
        <div className="container mx-auto px-4 py-8">
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge className="px-3 py-1">Hyresbostäder</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Hitta din perfekta{" "}
              <span className="text-primary">hyresbostad</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Bläddra bland tusentals bostäder att hyra. Kontakta uthyraren via
              vår säkra chatt och signera digitala hyreskontrakt.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/skapa-hyresannons">+ Skapa hyresannons</Link>
              </Button>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <RentalMap
              search={search}
              minRent={minRentNum}
              maxRent={maxRentNum}
              type={type}
              sort={sort}
              selectedLocation={selectedLocation}
            />
          </div>

          {/* AI Search Section */}
          <CategoryAISearch
            categoryType="rental"
            categoryLabel="Hyresbostäder"
            categoryDescription="Vår AI förstår din sökning och prioriterar hyresbostäder. Om inga exakta matchningar finns visas liknande hyresobjekt baserat på dina kriterier."
            placeholder="Exempel: 3 rum och kök med balkong i Stockholm, max 15000 kr/mån"
          />

          {/* Filters + Count */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <h2 className="text-xl font-semibold text-foreground">
                Tillgängliga hyresbostäder
              </h2>
              <div className="text-sm text-muted-foreground">
                {count} hyresbostäder hittades
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <LocationAutocomplete
                  placeholder="Sök stad, kommun, område..."
                  onSelect={(location) => {
                    setSelectedLocation({
                      center_lat: location.center_lat,
                      center_lng: location.center_lng,
                      name: location.name,
                      type: location.type,
                    });
                    setSearch(location.name);
                  }}
                />
              </div>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Min hyra (kr/mån)"
                value={minRent}
                onChange={(e) => setMinRent(e.target.value)}
              />
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Max hyra (kr/mån)"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
              />
              <div className="flex gap-3">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Alla typer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Alla typer</SelectItem>
                    <SelectItem value="APARTMENT">Lägenhet</SelectItem>
                    <SelectItem value="HOUSE">Hus/Villa</SelectItem>
                    <SelectItem value="TOWNHOUSE">Radhus</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sortera efter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Senaste först</SelectItem>
                    <SelectItem value="price_asc">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4" />
                        Lägst hyra
                      </div>
                    </SelectItem>
                    <SelectItem value="price_desc">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4" />
                        Högst hyra
                      </div>
                    </SelectItem>
                    <SelectItem value="area_asc">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4" />
                        Minsta yta
                      </div>
                    </SelectItem>
                    <SelectItem value="area_desc">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4" />
                        Största yta
                      </div>
                    </SelectItem>
                    <SelectItem value="rooms_asc">
                      <div className="flex items-center gap-2">
                        <ArrowDown className="h-4 w-4" />
                        Minst antal rum
                      </div>
                    </SelectItem>
                    <SelectItem value="rooms_desc">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="h-4 w-4" />
                        Flest antal rum
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <RentalProperties
            search={search}
            minRent={minRentNum}
            maxRent={maxRentNum}
            type={type}
            sort={sort}
            onCountChange={setCount}
          />
        </div>
      </main>
      <LegalFooter />
    </div>
  );
};

export default Rentals;
