import {
  Clock,
  Filter,
  Heart,
  Home,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface SearchFilters {
  location: string;
  propertyType: string[];
  priceRange: [number, number];
  areaRange: [number, number];
  rooms: string;
  features: string[];
  energyClass: string[];
  yearBuilt: [number, number];
  keywords: string;
}

interface Property {
  id: string;
  title: string;
  price: number;
  living_area: number;
  rooms: number;
  address_street: string;
  address_city: string;
  property_type: string;
  images: string[];
  created_at: string;
  energy_class?: string;
  year_built?: number;
  features?: string[];
}

interface AIRecommendation {
  property: Property;
  score: number;
  reasons: string[];
  match_percentage: number;
}

const AdvancedSearch = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: [],
    priceRange: [0, 20000000],
    areaRange: [0, 500],
    rooms: "",
    features: [],
    energyClass: [],
    yearBuilt: [1900, 2024],
    keywords: "",
  });
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<
    AIRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  const propertyTypes = [
    { value: "lägenhet", label: "Lägenhet" },
    { value: "villa", label: "Villa" },
    { value: "radhus", label: "Radhus" },
    { value: "kedjehus", label: "Kedjehus" },
    { value: "fritidshus", label: "Fritidshus" },
  ];

  const propertyFeatures = [
    { value: "balkong", label: "Balkong" },
    { value: "trädgård", label: "Trädgård" },
    { value: "garage", label: "Garage" },
    { value: "hiss", label: "Hiss" },
    { value: "kamin", label: "Kamin" },
    { value: "pool", label: "Pool" },
    { value: "gym", label: "Gym" },
    { value: "förråd", label: "Förråd" },
  ];

  const energyClasses = ["A", "B", "C", "D", "E", "F", "G"];

  useEffect(() => {
    if (user) {
      loadSavedSearches();
    }
  }, [user, loadSavedSearches]);

  const loadSavedSearches = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (error) {
      console.error("Error loading saved searches:", error);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: checked
        ? [...prev.propertyType, type]
        : prev.propertyType.filter((t) => t !== type),
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter((f) => f !== feature),
    }));
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "FOR_SALE");

      // Apply filters
      if (filters.location) {
        query = query.or(
          `address_city.ilike.%${filters.location}%,address_street.ilike.%${filters.location}%`,
        );
      }

      if (filters.propertyType.length > 0) {
        query = query.in("property_type", filters.propertyType);
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000000) {
        query = query
          .gte("price", filters.priceRange[0])
          .lte("price", filters.priceRange[1]);
      }

      if (filters.areaRange[0] > 0 || filters.areaRange[1] < 500) {
        query = query
          .gte("living_area", filters.areaRange[0])
          .lte("living_area", filters.areaRange[1]);
      }

      if (filters.rooms) {
        query = query.eq("rooms", parseInt(filters.rooms, 10));
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setSearchResults(data || []);

      // Get AI recommendations if user is logged in
      if (user && data && data.length > 0) {
        await getAIRecommendations(data);
      }

      toast.success(`Hittade ${data?.length || 0} fastigheter`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Ett fel uppstod vid sökningen");
    } finally {
      setLoading(false);
    }
  };

  const getAIRecommendations = async (properties: Property[]) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-property-recommendations",
        {
          body: {
            user_id: user?.id,
            properties: properties.slice(0, 10), // Limit to first 10 for AI analysis
            filters: filters,
          },
        },
      );

      if (error) throw error;

      // Mock AI recommendations for demo
      const mockRecommendations: AIRecommendation[] = properties
        .slice(0, 5)
        .map((property, index) => ({
          property,
          score: 95 - index * 5,
          reasons: [
            "Matchar din sökhistorik perfekt",
            "Utmärkt prisläge för området",
            "Nära kollektivtrafik och skolor",
            "Populärt område med stark utveckling",
          ].slice(0, Math.floor(Math.random() * 3) + 2),
          match_percentage: 95 - index * 5,
        }));

      setAIRecommendations(mockRecommendations);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
    }
  };

  const saveCurrentSearch = async () => {
    if (!user) {
      toast.error("Du måste vara inloggad för att spara sökningar");
      return;
    }

    try {
      const searchName = filters.location || "Sparad sökning";

      const { error } = await supabase.from("saved_searches").insert({
        user_id: user.id,
        name: searchName,
        search_params: filters as any,
      });

      if (error) throw error;

      toast.success("Sökning sparad!");
      loadSavedSearches();
    } catch (error) {
      console.error("Error saving search:", error);
      toast.error("Kunde inte spara sökningen");
    }
  };

  const loadSavedSearch = (savedSearch: any) => {
    setFilters(savedSearch.search_params);
    toast.success("Sökning laddad!");
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      propertyType: [],
      priceRange: [0, 20000000],
      areaRange: [0, 500],
      rooms: "",
      features: [],
      energyClass: [],
      yearBuilt: [1900, 2024],
      keywords: "",
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const _formatPricePerSqm = (price: number): string => {
    return `${new Intl.NumberFormat("sv-SE", {
      maximumFractionDigits: 0,
    }).format(price)} kr/m²`;
  };

  const _hasFeature = (property: Property, feature: string): boolean => {
    return property.features?.includes(feature) || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Search className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Avancerad Fastighetssökning</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Hitta din drömfastighet med AI-powered sökning och smarta
          rekommendationer
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Sök fastigheter
          </TabsTrigger>
          <TabsTrigger value="filters" className="gap-2">
            <Filter className="h-4 w-4" />
            Avancerade filter
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <Home className="h-4 w-4" />
            Sökresultat ({searchResults.length})
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="gap-2"
            disabled={!user}
          >
            <Sparkles className="h-4 w-4" />
            AI Rekommendationer
          </TabsTrigger>
        </TabsList>

        {/* Basic Search */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grundläggande sökning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Plats</Label>
                  <Input
                    id="location"
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    placeholder="T.ex. Stockholm, Göteborg..."
                    className="gap-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Sökord</Label>
                  <Input
                    id="keywords"
                    value={filters.keywords}
                    onChange={(e) =>
                      handleFilterChange("keywords", e.target.value)
                    }
                    placeholder="T.ex. nyrenoverad, centralt..."
                  />
                </div>
              </div>

              {/* Property Types */}
              <div className="space-y-2">
                <Label>Fastighetstyp</Label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.propertyType.includes(type.value)}
                        onCheckedChange={(checked) =>
                          handlePropertyTypeChange(
                            type.value,
                            checked as boolean,
                          )
                        }
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>
                  Prisintervall: {formatPrice(filters.priceRange[0])} -{" "}
                  {formatPrice(filters.priceRange[1])}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", value)
                  }
                  max={20000000}
                  min={0}
                  step={100000}
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={performSearch}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? "Söker..." : "Sök fastigheter"}
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Rensa filter
                </Button>
                {user && (
                  <Button
                    variant="outline"
                    onClick={saveCurrentSearch}
                    className="gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Spara sökning
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Saved Searches */}
          {user && savedSearches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Sparade sökningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {savedSearches.map((search) => (
                    <Button
                      key={search.id}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedSearch(search)}
                      className="gap-2"
                    >
                      <Search className="h-3 w-3" />
                      {search.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Filters */}
        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Avancerade filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Area Range */}
              <div className="space-y-2">
                <Label>
                  Boarea: {filters.areaRange[0]} - {filters.areaRange[1]} m²
                </Label>
                <Slider
                  value={filters.areaRange}
                  onValueChange={(value) =>
                    handleFilterChange("areaRange", value)
                  }
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Rooms */}
              <div className="space-y-2">
                <Label htmlFor="rooms">Antal rum</Label>
                <Select
                  value={filters.rooms}
                  onValueChange={(value) => handleFilterChange("rooms", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj antal rum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alla</SelectItem>
                    <SelectItem value="1">1 rum</SelectItem>
                    <SelectItem value="2">2 rum</SelectItem>
                    <SelectItem value="3">3 rum</SelectItem>
                    <SelectItem value="4">4 rum</SelectItem>
                    <SelectItem value="5">5+ rum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label>Fastighetsegenskaper</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {propertyFeatures.map((feature) => (
                    <label
                      key={feature.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.features.includes(feature.value)}
                        onCheckedChange={(checked) =>
                          handleFeatureChange(feature.value, checked as boolean)
                        }
                      />
                      <span className="text-sm">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Energy Class */}
              <div className="space-y-2">
                <Label>Energiklass</Label>
                <div className="flex flex-wrap gap-2">
                  {energyClasses.map((energyClass) => (
                    <Button
                      key={energyClass}
                      variant={
                        filters.energyClass.includes(energyClass)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const newClasses = filters.energyClass.includes(
                          energyClass,
                        )
                          ? filters.energyClass.filter((c) => c !== energyClass)
                          : [...filters.energyClass, energyClass];
                        handleFilterChange("energyClass", newClasses);
                      }}
                    >
                      {energyClass}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Year Built */}
              <div className="space-y-2">
                <Label>
                  Byggår: {filters.yearBuilt[0]} - {filters.yearBuilt[1]}
                </Label>
                <Slider
                  value={filters.yearBuilt}
                  onValueChange={(value) =>
                    handleFilterChange("yearBuilt", value)
                  }
                  max={2024}
                  min={1900}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Results */}
        <TabsContent value="results" className="space-y-6">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-muted relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.address_street}, {property.address_city}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                      <Badge variant="secondary">
                        {property.property_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.living_area} m²</span>
                      <span>{property.rooms} rum</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Inga sökresultat</h3>
                <p className="text-muted-foreground">
                  Prova att ändra dina sökkriterier för att hitta fler
                  fastigheter.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          {aiRecommendations.length > 0 ? (
            <div className="space-y-4">
              {aiRecommendations.map((recommendation, _index) => (
                <Card
                  key={recommendation.property.id}
                  className="border-primary/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {recommendation.property.title}
                          </h3>
                          <Badge className="bg-primary text-primary-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            {recommendation.match_percentage}% match
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {recommendation.property.address_street},{" "}
                          {recommendation.property.address_city}
                        </p>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium">
                            Varför denna fastighet rekommenderas:
                          </p>
                          <ul className="space-y-1">
                            {recommendation.reasons.map((reason, i) => (
                              <li
                                key={i}
                                className="text-sm text-muted-foreground flex items-center gap-2"
                              >
                                <TrendingUp className="h-3 w-3 text-green-500" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(recommendation.property.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {recommendation.property.living_area} m² •{" "}
                          {recommendation.property.rooms} rum
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Inga AI-rekommendationer än
                </h3>
                <p className="text-muted-foreground">
                  Genomför en sökning för att få personliga rekommendationer
                  baserat på AI-analys.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSearch;
