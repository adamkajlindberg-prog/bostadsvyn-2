import {
  Brain,
  Calendar,
  Clock,
  FileSignature,
  Home,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Waves,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const heroImage = "/lovable-uploads/6460350a-4407-412d-802c-ca99c2bfd9e3.png";
const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAISearching, setIsAISearching] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [listingType, _setListingType] = useState("");
  const [_priceRange, _setPriceRange] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasOutdoorSpace, setHasOutdoorSpace] = useState(false);
  const [minPlotSize, setMinPlotSize] = useState("");
  const [maxPlotSize, setMaxPlotSize] = useState("");
  const [minRooms, setMinRooms] = useState("");
  const [minArea, setMinArea] = useState("");
  const [hasParking, setHasParking] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [energyClass, setEnergyClass] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxFloor, setMaxFloor] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");

  // New Hemnet-inspired filters
  const [_keywords, setKeywords] = useState("");
  const [_expandArea, setExpandArea] = useState("0");
  const [isNewConstruction, setIsNewConstruction] = useState("all");
  const [minBuildYear, setMinBuildYear] = useState("");
  const [maxBuildYear, setMaxBuildYear] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [minFee, setMinFee] = useState("");
  const [daysListed, setDaysListed] = useState("all");
  const [viewingTime, setViewingTime] = useState("all");
  const [hideBeforeViewing, setHideBeforeViewing] = useState(false);
  const [waterDistance, setWaterDistance] = useState("all");
  const [nearSea, setNearSea] = useState(false);
  const [minPlotArea, setMinPlotArea] = useState("");
  const [maxPlotArea, setMaxPlotArea] = useState("");
  const [minPricePerSqm, setMinPricePerSqm] = useState("");
  const [maxPricePerSqm, setMaxPricePerSqm] = useState("");
  const [biddingActive, setBiddingActive] = useState(false);
  const [priceReduced, setPriceReduced] = useState(false);
  const [priceIncreased, setPriceIncreased] = useState(false);
  const [ownership, setOwnership] = useState(false);

  // Unique filters
  const [_petFriendly, setPetFriendly] = useState(false);
  const [_smartHome, setSmartHome] = useState(false);
  const [_sustainabilityScore, setSustainabilityScore] = useState("all");
  const [_nearSchools, setNearSchools] = useState(false);
  const [_nearPublicTransport, setNearPublicTransport] = useState(false);
  const [floorLevel, setFloorLevel] = useState("all");
  const handleSearch = async () => {
    // Check if the query is a natural language description (more than just a location)
    const isNaturalLanguage =
      searchQuery && searchQuery.trim().split(" ").length > 2;
    if (isNaturalLanguage) {
      setIsAISearching(true);
      try {
        // Call the AI natural search edge function
        const { data, error } = await supabase.functions.invoke(
          "ai-natural-search",
          {
            body: {
              query: searchQuery,
            },
          },
        );
        if (error) {
          console.error("AI search error:", error);
          toast({
            title: "Sökfel",
            description:
              "Kunde inte tolka din sökning. Försök igen eller använd enklare sökord.",
            variant: "destructive",
          });
          setIsAISearching(false);
          return;
        }
        if (data?.searchCriteria) {
          toast({
            title: "AI-sökning klar!",
            description:
              data.message || `Hittade ${data.count} matchande bostäder`,
          });

          // Navigate to search page with AI-extracted criteria
          const params = new URLSearchParams();
          const criteria = data.searchCriteria;
          if (criteria.location) params.set("location", criteria.location);
          if (criteria.propertyType && criteria.propertyType.length > 0) {
            params.set("propertyType", criteria.propertyType.join(","));
          }
          if (criteria.minRooms)
            params.set("minRooms", criteria.minRooms.toString());
          if (criteria.maxRooms)
            params.set("maxRooms", criteria.maxRooms.toString());
          if (criteria.minArea)
            params.set("minArea", criteria.minArea.toString());
          if (criteria.maxArea)
            params.set("maxArea", criteria.maxArea.toString());
          if (criteria.minPrice)
            params.set("minPrice", criteria.minPrice.toString());
          if (criteria.maxPrice)
            params.set("maxPrice", criteria.maxPrice.toString());
          if (criteria.minBedrooms)
            params.set("minBedrooms", criteria.minBedrooms.toString());
          if (criteria.minBathrooms)
            params.set("minBathrooms", criteria.minBathrooms.toString());

          // Handle features
          if (criteria.features && criteria.features.length > 0) {
            if (criteria.features.includes("balcony"))
              params.set("balcony", "true");
            if (criteria.features.includes("parking"))
              params.set("parking", "true");
            if (criteria.features.includes("elevator"))
              params.set("elevator", "true");
            if (criteria.features.includes("outdoorSpace"))
              params.set("outdoorSpace", "true");
          }
          if (criteria.keywords) params.set("keywords", criteria.keywords);
          params.set("searchQuery", searchQuery);
          setIsAISearching(false);
          navigate(`/search?${params.toString()}&aiSearch=true`);
          return;
        }
      } catch (err) {
        console.error("AI search exception:", err);
        toast({
          title: "Något gick fel",
          description: "Kunde inte genomföra AI-sökning. Försök igen.",
          variant: "destructive",
        });
        setIsAISearching(false);
        return;
      }
    }

    // Standard search (location-based)
    const params = new URLSearchParams();
    if (searchQuery) params.set("location", searchQuery);
    if (propertyType && propertyType !== "all")
      params.set("propertyType", propertyType);
    if (listingType && listingType !== "all")
      params.set("listingType", listingType);
    if (minPrice && minPrice !== "none") params.set("minPrice", minPrice);
    if (maxPrice && maxPrice !== "none") params.set("maxPrice", maxPrice);
    if (hasBalcony) params.set("balcony", "true");
    if (hasOutdoorSpace) params.set("outdoorSpace", "true");
    if (minPlotSize && minPlotSize !== "none")
      params.set("minPlotSize", minPlotSize);
    if (maxPlotSize && maxPlotSize !== "none")
      params.set("maxPlotSize", maxPlotSize);
    if (minRooms && minRooms !== "none") params.set("minRooms", minRooms);
    if (minArea && minArea !== "none") params.set("minArea", minArea);
    if (hasParking) params.set("parking", "true");
    if (hasElevator) params.set("elevator", "true");
    if (location && location !== "all") params.set("city", location);
    if (energyClass && energyClass !== "all")
      params.set("energyClass", energyClass);
    if (minYear && minYear !== "none") params.set("minYear", minYear);
    if (maxFloor && maxFloor !== "none") params.set("maxFloor", maxFloor);
    if (minBedrooms && minBedrooms !== "none")
      params.set("minBedrooms", minBedrooms);
    if (minBathrooms && minBathrooms !== "none")
      params.set("minBathrooms", minBathrooms);
    params.set("searchQuery", searchQuery);
    navigate(`/search?${params.toString()}`);
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-nordic-fjord to-accent">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="High quality aerial drone view of Stockholm city with historic districts and archipelago"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
              <span className="block text-white drop-shadow-2xl">
                Välkommen till Bostadsvyn!
              </span>
            </h1>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <Brain className="h-7 w-7 text-white mx-auto mb-3" />
              <h3 className="text-base font-medium text-white mb-1.5">
                AI-Rekommendationer
              </h3>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                Personliga tips och rekommendationer baserade på din sökhistorik
                och önskemål
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <Sparkles className="h-7 w-7 text-white mx-auto mb-3" />
              <h3 className="text-base font-medium text-white mb-1.5">
                AI-verktyg
              </h3>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                Avancerad bildgenerering för att se objekts potential och
                exklusiv rådgivning från vår AI-rådgivare 
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <FileSignature className="h-7 w-7 text-white mx-auto mb-3" />
              <h3 className="text-base font-medium text-white mb-1.5">
                Digitala hyreskontrakt
              </h3>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                Efter vald hyresbostad hjälper vi med digitala hyreskontrakt och
                säker signering med BankID
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all">
              <Home className="h-7 w-7 text-white mx-auto mb-3" />
              <h3 className="text-base font-medium text-white mb-1.5">
                Brett utbud av bostäder
              </h3>
              <p className="text-white/80 text-sm font-light leading-relaxed">
                Vi erbjuder alla typer av bostäder i både Sverige och utlandet
                på en och samma plattform
              </p>
            </div>
          </div>

          {/* Search Interface */}
          <div className="max-w-6xl mx-auto mt-12">
            <Card className="bg-card/40 backdrop-blur-lg border border-primary-foreground/20 shadow-2xl">
              <CardContent className="p-8">
                {/* Unified Search Interface */}
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
                  <div className="mb-5">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Brain className="h-6 w-6 text-primary" />
                      <h3 className="text-base font-medium text-white">
                        Smart bostadssökning
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild></TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm font-light">
                              Via den här sökrutan kan du antingen söka på gata,
                              område, kommun eller län, eller skriva vad du
                              söker för typ av bostad med vilka attribut och i
                              vilket område. Vår smarta AI-sökning hjälper dig
                              att hitta de bostäder som matchar bäst.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-white font-normal leading-relaxed antialiased [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                      Med hjälp av vår unika AI-sökning kan du enkelt skriva en
                      liten text om vad du söker, vilka attribut som den nya
                      bostaden ska ha och vilken gata, område eller kommun som
                      önskas. Vår AI kommer sen att matcha de bostäderna i vårt
                      system som bäst passar dina önskemål.
                    </p>
                  </div>

                  <div className="flex gap-4 mb-6">
                    {/* Main Search Input */}
                    <div className="flex-1">
                      <Input
                        placeholder="Beskriv din önskade bostad eller sök på gata, område, kommun eller stad..."
                        className="bg-background/80 border-accent/30 text-foreground placeholder:text-muted-foreground focus:border-accent h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        disabled={isAISearching}
                      />
                    </div>

                    {/* Advanced Filters Dialog */}
                    <Dialog
                      open={filterDialogOpen}
                      onOpenChange={setFilterDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-background/80 border-accent/30 hover:bg-accent/10 h-12 w-32 text-sm"
                        >
                          <SlidersHorizontal className="h-4 w-4 mr-1" />
                          Filter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Avancerade filter</DialogTitle>
                          <DialogDescription>
                            Filtrera bostäder efter dina önskemål
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          {/* Location & Area */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Gata/Område/Kommun
                            </Label>
                            <Input
                              placeholder="Skriv område eller adress"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="bg-background border-accent/30"
                            />
                          </div>

                          <Separator />

                          {/* Property Type with Icons */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Bostadstyp
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant={
                                  propertyType === "all" ? "default" : "outline"
                                }
                                onClick={() => setPropertyType("all")}
                                className="justify-start h-11"
                              >
                                Alla typer
                              </Button>
                              <Button
                                variant={
                                  propertyType === "house"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("house")}
                                className="justify-start h-11"
                              >
                                Villor
                              </Button>
                              <Button
                                variant={
                                  propertyType === "townhouse"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("townhouse")}
                                className="justify-start h-11"
                              >
                                Par/Kedje/Radhus
                              </Button>
                              <Button
                                variant={
                                  propertyType === "apartment"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("apartment")}
                                className="justify-start h-11"
                              >
                                Lägenheter
                              </Button>
                              <Button
                                variant={
                                  propertyType === "cottage"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("cottage")}
                                className="justify-start h-11"
                              >
                                Fritidshus
                              </Button>
                              <Button
                                variant={
                                  propertyType === "plot"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("plot")}
                                className="justify-start h-11"
                              >
                                Tomter
                              </Button>
                              <Button
                                variant={
                                  propertyType === "farm"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("farm")}
                                className="justify-start h-11"
                              >
                                Gårdar/Skogar
                              </Button>
                              <Button
                                variant={
                                  propertyType === "commercial"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("commercial")}
                                className="justify-start h-11"
                              >
                                Kommersiellt
                              </Button>
                              <Button
                                variant={
                                  propertyType === "rental"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("rental")}
                                className="justify-start h-11"
                              >
                                Hyresbostäder
                              </Button>
                              <Button
                                variant={
                                  propertyType === "other"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => setPropertyType("other")}
                                className="justify-start h-11"
                              >
                                Övriga
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          {/* Rooms */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Rum
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min
                                </Label>
                                <Select
                                  value={minRooms}
                                  onValueChange={setMinRooms}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget minimum
                                    </SelectItem>
                                    <SelectItem value="1">1 rum</SelectItem>
                                    <SelectItem value="2">2 rum</SelectItem>
                                    <SelectItem value="3">3 rum</SelectItem>
                                    <SelectItem value="4">4 rum</SelectItem>
                                    <SelectItem value="5">5 rum</SelectItem>
                                    <SelectItem value="6">6+ rum</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max
                                </Label>
                                <Select
                                  value={minRooms}
                                  onValueChange={setMinRooms}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Max" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget maximum
                                    </SelectItem>
                                    <SelectItem value="2">2 rum</SelectItem>
                                    <SelectItem value="3">3 rum</SelectItem>
                                    <SelectItem value="4">4 rum</SelectItem>
                                    <SelectItem value="5">5 rum</SelectItem>
                                    <SelectItem value="6">6+ rum</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Boarea (Living Area) */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Boarea
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min (m²)
                                </Label>
                                <Select
                                  value={minArea}
                                  onValueChange={setMinArea}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget minimum
                                    </SelectItem>
                                    <SelectItem value="30">30 m²</SelectItem>
                                    <SelectItem value="50">50 m²</SelectItem>
                                    <SelectItem value="75">75 m²</SelectItem>
                                    <SelectItem value="100">100 m²</SelectItem>
                                    <SelectItem value="125">125 m²</SelectItem>
                                    <SelectItem value="150">150 m²</SelectItem>
                                    <SelectItem value="200">200 m²</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max (m²)
                                </Label>
                                <Select
                                  value={minArea}
                                  onValueChange={setMinArea}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Max" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget maximum
                                    </SelectItem>
                                    <SelectItem value="75">75 m²</SelectItem>
                                    <SelectItem value="100">100 m²</SelectItem>
                                    <SelectItem value="150">150 m²</SelectItem>
                                    <SelectItem value="200">200 m²</SelectItem>
                                    <SelectItem value="300">300 m²</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Price Range */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Pris
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min (kr)
                                </Label>
                                <Select
                                  value={minPrice}
                                  onValueChange={setMinPrice}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget minimum
                                    </SelectItem>
                                    <SelectItem value="500000">
                                      500 000 kr
                                    </SelectItem>
                                    <SelectItem value="1000000">
                                      1 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="2000000">
                                      2 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="3000000">
                                      3 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="5000000">
                                      5 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="10000000">
                                      10 000 000 kr
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max (kr)
                                </Label>
                                <Select
                                  value={maxPrice}
                                  onValueChange={setMaxPrice}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Max" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget maximum
                                    </SelectItem>
                                    <SelectItem value="1000000">
                                      1 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="2000000">
                                      2 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="3000000">
                                      3 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="5000000">
                                      5 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="10000000">
                                      10 000 000 kr
                                    </SelectItem>
                                    <SelectItem value="15000000">
                                      15 000 000 kr
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Amenities */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Egenskaper
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="balcony"
                                  checked={hasBalcony}
                                  onCheckedChange={(checked) =>
                                    setHasBalcony(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="balcony"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Balkong/Uteplats/Terrass
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="elevator"
                                  checked={hasElevator}
                                  onCheckedChange={(checked) =>
                                    setHasElevator(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="elevator"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Hiss
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="parking"
                                  checked={hasParking}
                                  onCheckedChange={(checked) =>
                                    setHasParking(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="parking"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Parkering
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="outdoorSpace"
                                  checked={hasOutdoorSpace}
                                  onCheckedChange={(checked) =>
                                    setHasOutdoorSpace(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="outdoorSpace"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Trädgård
                                </Label>
                              </div>
                            </div>
                          </div>

                          {/* Floor Plan */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Våningsplan
                            </Label>
                            <Select
                              value={floorLevel}
                              onValueChange={setFloorLevel}
                            >
                              <SelectTrigger className="bg-background border-accent/30 h-11">
                                <SelectValue placeholder="Visa alla" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Visa alla</SelectItem>
                                <SelectItem value="ground">
                                  Bottenvåning
                                </SelectItem>
                                <SelectItem value="1-3">Våning 1-3</SelectItem>
                                <SelectItem value="4+">Våning 4+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator />

                          {/* New Construction */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Nyproduktion
                            </Label>
                            <Select
                              value={isNewConstruction}
                              onValueChange={setIsNewConstruction}
                            >
                              <SelectTrigger className="bg-background border-accent/30 h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Visa nyproduktion
                                </SelectItem>
                                <SelectItem value="yes">
                                  Endast nyproduktion
                                </SelectItem>
                                <SelectItem value="no">
                                  Uteslut nyproduktion
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Build Year */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Byggår
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min
                                </Label>
                                <Select
                                  value={minBuildYear}
                                  onValueChange={setMinBuildYear}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget minimum
                                    </SelectItem>
                                    <SelectItem value="2020">2020</SelectItem>
                                    <SelectItem value="2010">2010</SelectItem>
                                    <SelectItem value="2000">2000</SelectItem>
                                    <SelectItem value="1990">1990</SelectItem>
                                    <SelectItem value="1980">1980</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max
                                </Label>
                                <Select
                                  value={maxBuildYear}
                                  onValueChange={setMaxBuildYear}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Max" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget maximum
                                    </SelectItem>
                                    <SelectItem value="2020">2020</SelectItem>
                                    <SelectItem value="2010">2010</SelectItem>
                                    <SelectItem value="2000">2000</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Monthly Fee */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Avgift
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min avgift (kr/mån)
                                </Label>
                                <Select
                                  value={minFee}
                                  onValueChange={setMinFee}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget minimum
                                    </SelectItem>
                                    <SelectItem value="0">0 kr/mån</SelectItem>
                                    <SelectItem value="1000">
                                      1 000 kr/mån
                                    </SelectItem>
                                    <SelectItem value="2000">
                                      2 000 kr/mån
                                    </SelectItem>
                                    <SelectItem value="3000">
                                      3 000 kr/mån
                                    </SelectItem>
                                    <SelectItem value="5000">
                                      5 000 kr/mån
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max avgift (kr/mån)
                                </Label>
                                <Select
                                  value={maxFee}
                                  onValueChange={setMaxFee}
                                >
                                  <SelectTrigger className="bg-background border-accent/30 h-11 mt-1">
                                    <SelectValue placeholder="Max" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Inget maximum
                                    </SelectItem>
                                    <SelectItem value="2000">
                                      2 000 kr/mån
                                    </SelectItem>
                                    <SelectItem value="3000">
                                      3 000 kr/mån
                                    </SelectItem>
                                    <SelectItem value="5000">
                                      5 000 kr/mån
                                    </SelectItem>
                                    <SelectItem value="7500">
                                      7 500 kr/mån
                                    </SelectItem>
                                    <SelectItem value="10000">
                                      10 000 kr/mån
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Days Listed */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              <Calendar className="h-4 w-4 inline mr-2" />
                              Dagar på plattformen
                            </Label>
                            <RadioGroup
                              value={daysListed}
                              onValueChange={setDaysListed}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="days-all" />
                                <Label
                                  htmlFor="days-all"
                                  className="font-normal cursor-pointer"
                                >
                                  Visa alla
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="days-1" />
                                <Label
                                  htmlFor="days-1"
                                  className="font-normal cursor-pointer"
                                >
                                  Senaste dygnet
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="days-3" />
                                <Label
                                  htmlFor="days-3"
                                  className="font-normal cursor-pointer"
                                >
                                  Max 3 dagar
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="7" id="days-7" />
                                <Label
                                  htmlFor="days-7"
                                  className="font-normal cursor-pointer"
                                >
                                  Max 1 vecka
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="14" id="days-14" />
                                <Label
                                  htmlFor="days-14"
                                  className="font-normal cursor-pointer"
                                >
                                  Max 2 veckor
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="30" id="days-30" />
                                <Label
                                  htmlFor="days-30"
                                  className="font-normal cursor-pointer"
                                >
                                  Max 1 månad
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Viewing Time */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              <Clock className="h-4 w-4 inline mr-2" />
                              Visningstid
                            </Label>
                            <RadioGroup
                              value={viewingTime}
                              onValueChange={setViewingTime}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="view-all" />
                                <Label
                                  htmlFor="view-all"
                                  className="font-normal cursor-pointer"
                                >
                                  Visa alla
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="today" id="view-today" />
                                <Label
                                  htmlFor="view-today"
                                  className="font-normal cursor-pointer"
                                >
                                  Idag
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="tomorrow"
                                  id="view-tomorrow"
                                />
                                <Label
                                  htmlFor="view-tomorrow"
                                  className="font-normal cursor-pointer"
                                >
                                  Imorgon
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="weekend"
                                  id="view-weekend"
                                />
                                <Label
                                  htmlFor="view-weekend"
                                  className="font-normal cursor-pointer"
                                >
                                  I helgen (lör-mån)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="custom"
                                  id="view-custom"
                                />
                                <Label
                                  htmlFor="view-custom"
                                  className="font-normal cursor-pointer"
                                >
                                  Välj datum
                                </Label>
                              </div>
                            </RadioGroup>
                            <div className="flex items-center space-x-2 mt-2">
                              <Checkbox
                                id="hideBeforeViewing"
                                checked={hideBeforeViewing}
                                onCheckedChange={(checked) =>
                                  setHideBeforeViewing(checked as boolean)
                                }
                              />
                              <Label
                                htmlFor="hideBeforeViewing"
                                className="text-sm font-normal cursor-pointer"
                              >
                                Dölj borttagen före visning
                              </Label>
                            </div>
                          </div>

                          <Separator />

                          {/* Water Distance */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              <Waves className="h-4 w-4 inline mr-2" />
                              Avstånd till vatten
                            </Label>
                            <Select
                              value={waterDistance}
                              onValueChange={setWaterDistance}
                            >
                              <SelectTrigger className="bg-background border-accent/30 h-11">
                                <SelectValue placeholder="Alla" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Alla</SelectItem>
                                <SelectItem value="100">Inom 100 m</SelectItem>
                                <SelectItem value="500">Inom 500 m</SelectItem>
                                <SelectItem value="1000">Inom 1 km</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2 mt-2">
                              <Checkbox
                                id="nearSea"
                                checked={nearSea}
                                onCheckedChange={(checked) =>
                                  setNearSea(checked as boolean)
                                }
                              />
                              <Label
                                htmlFor="nearSea"
                                className="text-sm font-normal cursor-pointer"
                              >
                                Endast nära hav
                              </Label>
                            </div>
                          </div>

                          {/* Plot Area */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Tomtarea
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min tomtarea (m²)
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Min"
                                  value={minPlotArea}
                                  onChange={(e) =>
                                    setMinPlotArea(e.target.value)
                                  }
                                  className="bg-background border-accent/30 h-11 mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max tomtarea (m²)
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Max"
                                  value={maxPlotArea}
                                  onChange={(e) =>
                                    setMaxPlotArea(e.target.value)
                                  }
                                  className="bg-background border-accent/30 h-11 mt-1"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Price per Square Meter */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Kvadratmeterpris (kr/m²)
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Min
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Min"
                                  value={minPricePerSqm}
                                  onChange={(e) =>
                                    setMinPricePerSqm(e.target.value)
                                  }
                                  className="bg-background border-accent/30 mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">
                                  Max
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Max"
                                  value={maxPricePerSqm}
                                  onChange={(e) =>
                                    setMaxPricePerSqm(e.target.value)
                                  }
                                  className="bg-background border-accent/30 mt-1"
                                />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Endast tillgänglig för bostadsrätter
                            </p>
                          </div>

                          <Separator />

                          {/* Show Only */}
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Visa endast
                            </Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="biddingActive"
                                  checked={biddingActive}
                                  onCheckedChange={(checked) =>
                                    setBiddingActive(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="biddingActive"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Budgivning pågår
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="priceReduced"
                                  checked={priceReduced}
                                  onCheckedChange={(checked) =>
                                    setPriceReduced(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="priceReduced"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Sänkt pris
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="priceIncreased"
                                  checked={priceIncreased}
                                  onCheckedChange={(checked) =>
                                    setPriceIncreased(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="priceIncreased"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Höjt pris
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="ownership"
                                  checked={ownership}
                                  onCheckedChange={(checked) =>
                                    setOwnership(checked as boolean)
                                  }
                                />
                                <Label
                                  htmlFor="ownership"
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Äganderätt
                                </Label>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Unique Filters Section */}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 sticky bottom-0 bg-background pb-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                // Reset all filters
                                setLocation("");
                                setExpandArea("0");
                                setPropertyType("");
                                setMinPrice("none");
                                setMaxPrice("none");
                                setMinRooms("none");
                                setMinArea("none");
                                setMinPlotSize("none");
                                setMaxPlotSize("none");
                                setEnergyClass("");
                                setMinYear("none");
                                setMaxFloor("none");
                                setMinBedrooms("none");
                                setMinBathrooms("none");
                                setHasBalcony(false);
                                setHasOutdoorSpace(false);
                                setHasParking(false);
                                setHasElevator(false);
                                setKeywords("");
                                setIsNewConstruction("all");
                                setMinBuildYear("");
                                setMaxBuildYear("");
                                setMaxFee("");
                                setDaysListed("all");
                                setViewingTime("all");
                                setHideBeforeViewing(false);
                                setWaterDistance("all");
                                setNearSea(false);
                                setMinPlotArea("");
                                setMinPricePerSqm("");
                                setMaxPricePerSqm("");
                                setBiddingActive(false);
                                setPriceReduced(false);
                                setPriceIncreased(false);
                                setOwnership(false);
                                setPetFriendly(false);
                                setSmartHome(false);
                                setSustainabilityScore("all");
                                setNearSchools(false);
                                setNearPublicTransport(false);
                                setFloorLevel("all");
                              }}
                              className="flex-1"
                            >
                              Rensa filter
                            </Button>
                            <Button
                              onClick={() => setFilterDialogOpen(false)}
                              className="flex-1 bg-accent hover:bg-accent/90"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              Hitta bostäder
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Search Button */}
                  <div className="text-center">
                    <Button
                      onClick={handleSearch}
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12"
                      disabled={isAISearching}
                    >
                      {isAISearching ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          AI tolkar din sökning...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Sök bostäder
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quick Search Suggestions */}
                  <div className="mt-6 pt-4 border-t border-accent/20">
                    <p className="text-sm text-primary-foreground/70 mb-3">
                      Populära sökningar:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                        onClick={() =>
                          setSearchQuery(
                            "3 rum och kök Stockholm under 5 miljoner",
                          )
                        }
                      >
                        3 rum Stockholm under 5M
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                        onClick={() =>
                          setSearchQuery("Lägenhet nära tunnelbana Göteborg")
                        }
                      >
                        Lägenhet nära tunnelbana Göteborg
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                        onClick={() =>
                          setSearchQuery("Villa med trädgård Malmö")
                        }
                      >
                        Villa med trädgård Malmö
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary CTA */}
          <div className="pt-4"></div>

          {/* Trust Indicators */}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-nordic-aurora/20 rounded-full blur-2xl animate-pulse delay-1000" />
    </section>
  );
};
export default HeroSection;
