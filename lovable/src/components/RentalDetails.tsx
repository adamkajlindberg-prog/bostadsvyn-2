import {
  ArrowLeft,
  Bath,
  BedDouble,
  Calendar,
  Car,
  Check,
  Dumbbell,
  FileText,
  Heart,
  Home,
  MapPin,
  Ruler,
  School,
  Share2,
  ShoppingBag,
  Train,
  Wifi,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import PropertyLocationMap from "@/components/PropertyLocationMap";
import { PropertyTypeInformation } from "@/components/PropertyTypeInformation";
import { RentalChat } from "@/components/RentalChat";
import SimilarProperties from "@/components/SimilarProperties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface RentalProperty {
  id: string;
  title: string;
  description?: string;
  property_type: string;
  price: number;
  status: string;
  address_street: string;
  address_postal_code: string;
  address_city: string;
  address_country: string;
  living_area?: number;
  plot_area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  features?: string[];
  images?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  rental_info?: {
    contract_type: string;
    available_from: string;
    pets_allowed: boolean;
    furnished: boolean;
    is_shared?: boolean;
    utilities_included?: boolean;
    smoking_allowed?: boolean;
    lease_duration?: string;
    floor_level?: string;
    has_elevator?: boolean;
    has_balcony?: boolean;
    has_garden?: boolean;
    parking_available?: boolean;
    parking_type?: string;
    internet_included?: boolean;
    energy_rating?: string;
    min_income?: number;
    min_age?: number;
    max_occupants?: number;
    references_required?: boolean;
    neighborhood_description?: string;
    nearest_metro?: string;
    transport_description?: string;
    contact_phone?: string;
    viewing_instructions?: string;
    preferred_contact_method?: string;
  };
}
interface PropertyOwner {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
}
const _statusLabels = {
  FOR_RENT: "Till uthyrning",
  RENTED: "Uthyrd",
  DRAFT: "Utkast",
};
export const RentalDetails: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<RentalProperty | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<PropertyOwner | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    if (id) {
      loadProperty();
      trackView();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user, checkFavoriteStatus, loadProperty, trackView]);
  const loadProperty = async () => {
    try {
      // Check if it's a test property first
      const testProperty = getTestRentalProperty(id!);
      if (testProperty) {
        setProperty(testProperty);
        setLoading(false);
        return;
      }
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("status", "FOR_RENT")
        .maybeSingle();
      if (!propertyData) {
        throw new Error("Rental property not found");
      }
      setProperty(propertyData as any as RentalProperty);

      // Load property owner info
      try {
        const { data: ownerData } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone")
          .eq("user_id", propertyData.user_id)
          .maybeSingle();
        if (ownerData) {
          setPropertyOwner(ownerData);
        }
      } catch (_e) {
        // Profile not found, skip
      }
    } catch (_error: any) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda hyresbostad",
        variant: "destructive",
      });
      navigate("/hyresbostader");
    } finally {
      setLoading(false);
    }
  };

  // Get test rental properties from RentalProperties component data
  const getTestRentalProperty = (propertyId: string): RentalProperty | null => {
    const testProperties: RentalProperty[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        title: "Möblerad 3:a uthyres centralt",
        price: 18500,
        address_street: "Drottninggatan 88",
        address_city: "Stockholm",
        address_postal_code: "111 36",
        address_country: "SE",
        property_type: "Lägenhet",
        status: "FOR_RENT",
        rooms: 3,
        living_area: 75,
        bedrooms: 2,
        bathrooms: 1,
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=675&fit=crop",
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "test",
        description:
          "Fullt möblerad lägenhet i city. Perfekt för den som söker korttidsboende.",
        rental_info: {
          contract_type: "Korttid",
          available_from: "2025-02-01",
          pets_allowed: false,
          furnished: true,
          utilities_included: true,
          smoking_allowed: false,
          is_shared: false,
          lease_duration: "6 månader",
          floor_level: "3",
          has_elevator: true,
          has_balcony: true,
          has_garden: false,
          parking_available: false,
          internet_included: true,
          energy_rating: "B",
          min_income: 55000,
          min_age: 23,
          max_occupants: 3,
          references_required: true,
          neighborhood_description:
            "Centralt läge med närhet till shopping, restauranger och kollektivtrafik.",
          nearest_metro: "T-Centralen (3 min promenad)",
          transport_description:
            "Perfekt kommunikation med alla tunnelbanelinjer och bussar.",
          viewing_instructions: "Kontakta för att boka visning.",
        },
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        title: "Lägenhet uthyres i Hammarby Sjöstad",
        price: 14000,
        address_street: "Sjöviksvägen 12",
        address_city: "Stockholm",
        address_postal_code: "120 32",
        address_country: "SE",
        property_type: "Lägenhet",
        status: "FOR_RENT",
        rooms: 2,
        living_area: 58,
        bedrooms: 1,
        bathrooms: 1,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=675&fit=crop",
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "test",
        description: "Modern lägenhet med sjöutsikt. Omöblerad.",
        rental_info: {
          contract_type: "Långtidskontrakt",
          available_from: "2025-03-01",
          pets_allowed: true,
          furnished: false,
          utilities_included: false,
          smoking_allowed: false,
          is_shared: false,
          lease_duration: "12 månader",
          floor_level: "4",
          has_elevator: true,
          has_balcony: true,
          has_garden: false,
          parking_available: true,
          parking_type: "Utomhusparkering",
          internet_included: false,
          energy_rating: "B",
          min_income: 42000,
          min_age: 20,
          max_occupants: 2,
          references_required: true,
          neighborhood_description:
            "Modernt område vid vattnet med fin utsikt och bra grönområden.",
          nearest_metro: "Gullmarsplan (10 min med buss)",
          transport_description: "Goda förbindelser med buss och spårvagn.",
          viewing_instructions: "Visningar vardagar efter överenskommelse.",
        },
      },
    ];
    return testProperties.find((p) => p.id === propertyId) || null;
  };
  const trackView = async () => {
    try {
      await supabase.from("property_views").insert([
        {
          property_id: id,
          user_id: user?.id || null,
          ip_address: null,
          user_agent: navigator.userAgent,
        },
      ]);
    } catch (error) {
      console.log("Failed to track view:", error);
    }
  };
  const checkFavoriteStatus = async () => {
    if (!user || !id) return;
    try {
      const { data } = await supabase
        .from("property_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", id)
        .single();
      setIsFavorite(!!data);
    } catch (_error) {
      setIsFavorite(false);
    }
  };
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Logga in krävs",
        description: "Du måste logga in för att spara favoriter",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isFavorite) {
        await supabase
          .from("property_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", id);
        setIsFavorite(false);
        toast({
          title: "Borttagen från favoriter",
          description: "Hyresbostaden har tagits bort från dina favoriter",
        });
      } else {
        await supabase.from("property_favorites").insert([
          {
            user_id: user.id,
            property_id: id,
          },
        ]);
        setIsFavorite(true);
        toast({
          title: "Sparad som favorit",
          description: "Hyresbostaden har lagts till i dina favoriter",
        });
      }
    } catch (_error: any) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera favorit",
        variant: "destructive",
      });
    }
  };
  const shareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: `Kolla in denna hyresbostad: ${property?.title}`,
          url: window.location.href,
        });
      } catch (_error) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Länk kopierad",
        description: "Länken har kopierats till urklipp",
      });
    }
  };
  const _handleContact = () => {
    if (!user) {
      toast({
        title: "Logga in",
        description: "Du måste vara inloggad för att kontakta uthyraren",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/messages", {
      state: {
        propertyId: property?.id,
        contactUserId: property?.user_id,
      },
    });
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar hyresbostad...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Hyresbostad hittades inte
            </h3>
            <p className="text-muted-foreground mb-4">
              Hyresbostaden du söker efter finns inte eller har tagits bort.
            </p>
            <Button onClick={() => navigate("/hyresbostader")}>
              Tillbaka till hyresbostäder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tillbaka
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images and Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <PropertyImageGallery
            images={(property.images || []).map((url, idx) => ({
              url,
              alt: `${property.title} - Bild ${idx + 1}`,
              description: idx === 0 ? property.title : undefined,
              isAIEdited:
                url.includes("ai-edited") ||
                url.includes("homestyling") ||
                url.includes("virtuellt"),
            }))}
            propertyTitle={property.title}
          />

          {/* Property Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {property.title}
                  </CardTitle>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address_street}, {property.address_postal_code}{" "}
                    {property.address_city}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {property.price.toLocaleString("sv-SE")} kr/mån
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFavorite}
                    className={isFavorite ? "text-red-500" : ""}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareProperty}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.living_area && (
                  <div className="text-center">
                    <Ruler className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">
                      {property.living_area} m²
                    </div>
                    <div className="text-sm text-muted-foreground">Boarea</div>
                  </div>
                )}
                {property.rooms && (
                  <div className="text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.rooms} rum</div>
                    <div className="text-sm text-muted-foreground">
                      Antal rum
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <BedDouble className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Sovrum</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Badrum</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Rental Information */}
              {property.rental_info && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Hyresinformation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Kontraktstyp</div>
                          <div className="text-sm text-muted-foreground">
                            {property.rental_info.contract_type}
                          </div>
                        </div>
                      </div>
                      {property.rental_info.lease_duration && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Uthyrningsperiod</div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.lease_duration}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Tillgänglig från</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              property.rental_info.available_from,
                            ).toLocaleDateString("sv-SE", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Husdjur</div>
                          <div className="text-sm text-muted-foreground">
                            {property.rental_info.pets_allowed
                              ? "Tillåtna"
                              : "Ej tillåtna"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Home className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Möblering</div>
                          <div className="text-sm text-muted-foreground">
                            {property.rental_info.furnished
                              ? "Möblerad"
                              : "Omöblerad"}
                          </div>
                        </div>
                      </div>
                      {property.rental_info.smoking_allowed !== undefined && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Check className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Rökning</div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.smoking_allowed
                                ? "Tillåten"
                                : "Ej tillåten"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property.rental_info.is_shared !== undefined && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Home className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Delad bostad</div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.is_shared
                                ? "Ja (inneboende)"
                                : "Nej"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Building Information */}
              {property.rental_info &&
                (property.rental_info.floor_level ||
                  property.rental_info.has_elevator !== undefined ||
                  property.year_built ||
                  property.rental_info.energy_rating) && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">
                        Byggnadsinformation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.rental_info.floor_level && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Home className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Våning</div>
                              <div className="text-sm text-muted-foreground">
                                Våning {property.rental_info.floor_level}
                              </div>
                            </div>
                          </div>
                        )}
                        {property.rental_info.has_elevator !== undefined && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Hiss</div>
                              <div className="text-sm text-muted-foreground">
                                {property.rental_info.has_elevator
                                  ? "Ja"
                                  : "Nej"}
                              </div>
                            </div>
                          </div>
                        )}
                        {property.year_built && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Byggnadsår</div>
                              <div className="text-sm text-muted-foreground">
                                {property.year_built}
                              </div>
                            </div>
                          </div>
                        )}
                        {property.rental_info.energy_rating && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Zap className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Energiklass</div>
                              <div className="text-sm text-muted-foreground">
                                {property.rental_info.energy_rating}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

              {/* Description */}
              {property.description && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">Beskrivning</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {property.description}
                    </p>
                  </div>
                  <Separator />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Features */}
              {property.features && property.features.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">Egenskaper</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Additional Rental Details */}
              {property.rental_info && (
                <div>
                  <h3 className="font-semibold mb-4 text-lg">
                    Vad ingår i hyran?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.rental_info.utilities_included && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-sm">El och värme ingår</span>
                      </div>
                    )}
                    {property.rental_info.internet_included && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Wifi className="h-5 w-5 text-primary" />
                        <span className="text-sm">Bredband ingår</span>
                      </div>
                    )}
                    {property.rental_info.has_balcony && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="text-sm">Balkong</span>
                      </div>
                    )}
                    {property.rental_info.has_garden && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="text-sm">Trädgård</span>
                      </div>
                    )}
                    {property.rental_info.parking_available && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Car className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          {property.rental_info.parking_type ||
                            "Parkering tillgänglig"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Nearby Services */}
              {property.rental_info &&
                (property.rental_info.neighborhood_description ||
                  property.rental_info.nearest_metro ||
                  property.rental_info.transport_description) && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">
                        Område och transport
                      </h3>
                      <div className="space-y-3">
                        {property.rental_info.neighborhood_description && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {property.rental_info.neighborhood_description}
                            </p>
                          </div>
                        )}
                        {property.rental_info.nearest_metro && (
                          <div className="flex items-start gap-3">
                            <Train className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">
                                Närmaste kollektivtrafik
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {property.rental_info.nearest_metro}
                              </div>
                            </div>
                          </div>
                        )}
                        {property.rental_info.transport_description && (
                          <div className="flex items-start gap-3">
                            <Train className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">
                                Kommunikationer
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {property.rental_info.transport_description}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

              {/* Default nearby services if no custom info */}
              {(!property.rental_info ||
                (!property.rental_info.neighborhood_description &&
                  !property.rental_info.nearest_metro &&
                  !property.rental_info.transport_description)) && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">I närheten</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Train className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">
                            Kollektivtrafik
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tunnelbana/busshållplats 200m
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Shopping</div>
                          <div className="text-sm text-muted-foreground">
                            Mataffär och apotek inom 5 min promenad
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <School className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Skolor</div>
                          <div className="text-sm text-muted-foreground">
                            Grundskola och gymnasium i närområdet
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">
                            Träning & Fritid
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Gym och park i närheten
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}
            </CardContent>
          </Card>

          {/* Property Type Information - Full Width */}
          <PropertyTypeInformation
            propertyType={property.property_type}
            status={property.status}
          />

          {/* Similar Properties - Full Width */}
          <SimilarProperties
            currentProperty={{
              id: property.id,
              address_city: property.address_city,
              property_type: property.property_type,
              price: property.price,
              status: property.status,
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RentalChat
            propertyId={property.id}
            propertyOwnerId={property.user_id}
            propertyOwner={propertyOwner || undefined}
          />
          <PropertyLocationMap
            address={property.address_street}
            city={property.address_city}
            postalCode={property.address_postal_code}
            latitude={property.latitude}
            longitude={property.longitude}
          />
        </div>
      </div>
    </div>
  );
};
