import {
  ArrowLeft,
  BedDouble,
  Bell,
  Box,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Dumbbell,
  Euro,
  FileText,
  Heart,
  Home,
  MapPin,
  Ruler,
  School,
  Share2,
  ShoppingBag,
  Train,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FinalPriceWatchForm from "@/components/FinalPriceWatchForm";
import { PropertyContact } from "@/components/PropertyContact";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import PropertyLocationMap from "@/components/PropertyLocationMap";
import PropertyMarketing from "@/components/PropertyMarketing";
import { PropertyTypeInformation } from "@/components/PropertyTypeInformation";
import SimilarProperties from "@/components/SimilarProperties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TEST_LISTING_PROPERTIES } from "@/data/testProperties";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Property {
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
  monthly_fee?: number;
  energy_class?: string;
  features?: string[];
  images?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  floor_plan_url?: string;
  energy_declaration_url?: string;
  operating_costs?: number;
  kitchen_description?: string;
  bathroom_description?: string;
  property_documents?: Array<{
    name: string;
    url: string;
    type: string;
    uploaded_at: string;
  }>;
  rental_info?: {
    contract_type?: string;
    available_from?: string;
    lease_duration?: string;
    pets_allowed?: boolean;
    smoking_allowed?: boolean;
    furnished?: boolean;
    utilities_included?: boolean;
    internet_included?: boolean;
    is_shared?: boolean;
    floor_level?: string;
    has_elevator?: boolean;
    has_balcony?: boolean;
    has_garden?: boolean;
    has_garage?: boolean;
    parking_available?: boolean;
    parking_type?: string;
    building_year?: number;
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
    kitchen_amenities?: string[];
    bathroom_amenities?: string[];
    tech_amenities?: string[];
    other_amenities?: string[];
  };
  threed_tour_url?: string;
}
interface PropertyOwner {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
}
interface BrokerInfo {
  id: string;
  broker_name: string;
  broker_email: string;
  broker_phone?: string;
  license_number?: string;
  office: {
    office_name: string;
    office_address?: string;
    office_city?: string;
    office_phone?: string;
    office_email?: string;
    office_website?: string;
  };
}
const _statusLabels = {
  FOR_SALE: "Till salu",
  FOR_RENT: "Till uthyrning",
  COMING_SOON: "Kommer snart",
  SOLD: "Såld",
  DRAFT: "Utkast",
};
const _statusColors = {
  FOR_SALE: "bg-success",
  FOR_RENT: "bg-info",
  COMING_SOON: "bg-warning",
  SOLD: "bg-muted",
  DRAFT: "bg-secondary",
};
export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const cleanId = React.useMemo(() => {
    if (!id) return id as any;
    const match = id.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    );
    return match ? match[0] : id;
  }, [id]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<PropertyOwner | null>(
    null,
  );
  const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);
  const [showPropertyMapModal, setShowPropertyMapModal] = useState(false);
  const [currentPropertyMapIndex, setCurrentPropertyMapIndex] = useState(0);
  const [showWatchForm, setShowWatchForm] = useState(false);
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
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", cleanId)
        .maybeSingle();

      // If property not found in database, check if it's a test property
      if (!propertyData) {
        const testProperty = getTestProperty(cleanId!);
        if (testProperty) {
          setProperty(testProperty);
          setLoading(false);
          return;
        }
        throw new Error("Property not found");
      }

      // Parse property_documents if it's a string
      const parsedProperty = {
        ...propertyData,
        property_documents:
          typeof propertyData.property_documents === "string"
            ? JSON.parse(propertyData.property_documents)
            : propertyData.property_documents,
      };
      setProperty(parsedProperty as Property);

      // Try to load property owner info from profiles table (optional)
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

      // Load broker info if property is managed by a broker
      const { data: brokerData } = await supabase
        .from("brokers")
        .select(`
          id,
          broker_name,
          broker_email,
          broker_phone,
          license_number,
          office:broker_offices (
            office_name,
            office_address,
            office_city,
            office_phone,
            office_email,
            office_website
          )
        `)
        .eq("user_id", propertyData.user_id)
        .maybeSingle();
      if (brokerData) {
        setBrokerInfo(brokerData as any);
      }
    } catch (_error: any) {
      toast({
        title: "Fel",
        description: "Kunde inte ladda fastighet",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get test properties
  const getTestProperty = (propertyId: string): Property | null => {
    const src = TEST_LISTING_PROPERTIES.find((p) => p.id === propertyId);
    if (!src) return null;
    const now = new Date().toISOString();
    const mapped: Property = {
      id: src.id as string,
      title: src.title as string,
      description: (src as any).description,
      property_type: src.property_type as string,
      price: src.price as number,
      status: src.status as string,
      address_street: src.address_street as string,
      address_postal_code: src.address_postal_code as string,
      address_city: src.address_city as string,
      address_country: "SE",
      living_area: (src as any).living_area,
      plot_area: (src as any).plot_area,
      rooms: (src as any).rooms,
      bedrooms: (src as any).bedrooms,
      bathrooms: (src as any).bathrooms,
      year_built: (src as any).year_built,
      monthly_fee: (src as any).monthly_fee,
      energy_class: (src as any).energy_class,
      features: (src as any).features,
      images: (src as any).images,
      latitude: undefined,
      longitude: undefined,
      created_at: now,
      updated_at: now,
      user_id: (src as any).user_id || "test",
      property_documents: (src as any).property_documents,
      threed_tour_url: (src as any).threed_tour_url,
    };
    return mapped;
  };
  const trackView = async () => {
    try {
      await supabase.from("property_views").insert([
        {
          property_id: cleanId,
          user_id: user?.id || null,
          ip_address: null,
          // Would need server-side to get real IP
          user_agent: navigator.userAgent,
        },
      ]);
    } catch (error) {
      // Silent fail for analytics
      console.log("Failed to track view:", error);
    }
  };
  const checkFavoriteStatus = async () => {
    if (!user || !cleanId) return;
    try {
      const { data } = await supabase
        .from("property_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", cleanId)
        .maybeSingle();
      setIsFavorite(!!data);
    } catch (_error) {
      // Not a favorite
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
          .eq("property_id", cleanId);
        setIsFavorite(false);
        toast({
          title: "Borttagen från favoriter",
          description: "Fastigheten har tagits bort från dina favoriter",
        });
      } else {
        await supabase.from("property_favorites").insert([
          {
            user_id: user.id,
            property_id: cleanId,
          },
        ]);
        setIsFavorite(true);
        toast({
          title: "Sparad som favorit",
          description: "Fastigheten har lagts till i dina favoriter",
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
          text: `Kolla in denna fastighet: ${property?.title}`,
          url: window.location.href,
        });
      } catch (_error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Länk kopierad",
        description: "Fastighetslänken har kopierats till urklipp",
      });
    }
  };

  // Helper to determine property category for cost calculator
  const getPropertyCategory = () => {
    const type = property?.property_type?.toLowerCase() || "";
    // Houses, land, farms = "fastighet"
    if (
      type.includes("villa") ||
      type.includes("tomt") ||
      type.includes("fritid") ||
      type.includes("gård")
    ) {
      return "fastighet";
    }
    // Apartments = "lägenhet/bostadsrätt"
    return "lägenhet";
  };

  // Helper to identify floor plan images
  const getFloorPlanImages = () => {
    if (!property?.images) return [];
    return property.images.filter((img, _idx) => {
      const fileName = img.toLowerCase();
      return (
        fileName.includes("planritning") ||
        fileName.includes("floorplan") ||
        fileName.includes("floor-plan") ||
        fileName.includes("floor_plan") ||
        fileName.includes("plan")
      );
    });
  };

  // Helper to identify property map images
  const getPropertyMapImages = () => {
    if (!property?.images) return [];
    return property.images.filter((img, _idx) => {
      const fileName = img.toLowerCase();
      return (
        fileName.includes("fastighetskarta") ||
        fileName.includes("fastighets-karta") ||
        fileName.includes("property-map") ||
        fileName.includes("propertymap") ||
        fileName.includes("tomtkarta")
      );
    });
  };
  const floorPlanImages = getFloorPlanImages();
  const propertyMapImages = getPropertyMapImages();
  const brokerWebsite =
    brokerInfo?.office?.office_website ||
    (property?.user_id === "test"
      ? `https://www.maklarexempel.se/objekt/${property?.id}`
      : undefined);
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar fastighet...</p>
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
              Fastighet hittades inte
            </h3>
            <p className="text-muted-foreground mb-4">
              Fastigheten du söker efter finns inte eller har tagits bort.
            </p>
            <Button onClick={() => navigate("/")}>
              Tillbaka till startsidan
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
            onShowFloorPlan={() => setShowFloorPlanModal(true)}
            onShowPropertyMap={() => setShowPropertyMapModal(true)}
            hasFloorPlan={floorPlanImages.length > 0}
            hasPropertyMap={propertyMapImages.length > 0}
          />

          {/* Property Info */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                {/* Action buttons at the top */}
                <div className="flex flex-wrap gap-2">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Film/Video",
                        description: "Video-funktionalitet kommer snart!",
                      })
                    }
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Film
                  </Button>
                  {property.threed_tour_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(property.threed_tour_url, "_blank")
                      }
                    >
                      <Box className="h-4 w-4 mr-1" />
                      3D
                    </Button>
                  )}
                  {floorPlanImages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFloorPlanModal(true)}
                    >
                      Planritning
                    </Button>
                  )}
                  {propertyMapImages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPropertyMapModal(true)}
                    >
                      Fastighetskarta
                    </Button>
                  )}
                  {property.images && property.images.length > 0 && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0"
                      onClick={() => {
                        const params = new URLSearchParams({
                          images: property.images?.join(","),
                          title: property.title,
                        });
                        navigate(`/ai-bildredigering?${params.toString()}`);
                      }}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      AI Renovering
                    </Button>
                  )}
                </div>

                {/* Property information below buttons */}
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
                    {property.price.toLocaleString("sv-SE")} kr
                  </div>
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
                    <div className="text-sm text-muted-foreground">
                      Boarea {property.plot_area && `+ Biarea`}
                    </div>
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
                <div className="text-center">
                  <Home className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-semibold">{property.property_type}</div>
                  <div className="text-sm text-muted-foreground">
                    Upplåtelseform
                  </div>
                </div>
                {property.year_built && (
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.year_built}</div>
                    <div className="text-sm text-muted-foreground">Byggår</div>
                  </div>
                )}
                {(property.property_type
                  ?.toLowerCase()
                  .includes("bostadsrätt") ||
                  property.property_type
                    ?.toLowerCase()
                    .includes("ägarlägenhet")) && (
                  <div className="text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">-</div>
                    <div className="text-sm text-muted-foreground">
                      Förening
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              {property.description && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">Beskrivning</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {property.description}
                    </p>
                    {brokerWebsite && (
                      <Button
                        variant="default"
                        className="mt-4 mx-auto block"
                        onClick={() => window.open(brokerWebsite, "_blank")}
                      >
                        Fastighetsmäklarens hemsida
                      </Button>
                    )}
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

              {/* Rental Information - Only for rentals */}
              {property.status === "FOR_RENT" && property.rental_info && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Uthyrningsinformation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.rental_info.available_from && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">
                              Tillgänglig från
                            </div>
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
                      )}

                      {property.rental_info.lease_duration && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">
                              Uthyrningsperiod
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.lease_duration}
                            </div>
                          </div>
                        </div>
                      )}

                      {property.rental_info.floor_level && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <Building2 className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Våning</div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.floor_level}
                            </div>
                          </div>
                        </div>
                      )}

                      {property.rental_info.building_year && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <Building2 className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Byggår</div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.building_year}
                            </div>
                          </div>
                        </div>
                      )}

                      {property.rental_info.energy_rating && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <Zap className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">
                              Energiklass
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.energy_rating}
                            </div>
                          </div>
                        </div>
                      )}

                      {property.rental_info.max_occupants && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <BedDouble className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">
                              Max antal boende
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {property.rental_info.max_occupants} personer
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tenant Requirements */}
                    {(property.rental_info.min_income ||
                      property.rental_info.min_age ||
                      property.rental_info.references_required) && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Krav på hyresgäst</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {property.rental_info.min_income && (
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-sm">
                                Minsta månadslön
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {property.rental_info.min_income.toLocaleString(
                                  "sv-SE",
                                )}{" "}
                                kr
                              </div>
                            </div>
                          )}
                          {property.rental_info.min_age && (
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-sm">
                                Minimiålder
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {property.rental_info.min_age} år
                              </div>
                            </div>
                          )}
                          {property.rental_info.references_required && (
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-sm">
                                Referenser
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Krävs
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Location & Transport */}
                    {(property.rental_info.neighborhood_description ||
                      property.rental_info.nearest_metro ||
                      property.rental_info.transport_description) && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">
                          Område och transport
                        </h4>
                        {property.rental_info.neighborhood_description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {property.rental_info.neighborhood_description}
                          </p>
                        )}
                        {property.rental_info.nearest_metro && (
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <Train className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">
                              {property.rental_info.nearest_metro}
                            </span>
                          </div>
                        )}
                        {property.rental_info.transport_description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {property.rental_info.transport_description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <Separator />
                </>
              )}

              {/* Amenities - Only for rentals */}
              {property.status === "FOR_RENT" &&
                property.rental_info &&
                (property.rental_info.kitchen_amenities?.length ||
                  property.rental_info.bathroom_amenities?.length ||
                  property.rental_info.tech_amenities?.length ||
                  property.rental_info.other_amenities?.length) && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">
                        Bekvämligheter
                      </h3>

                      {property.rental_info.kitchen_amenities &&
                        property.rental_info.kitchen_amenities.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 text-sm">
                              Köksutrustning
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {property.rental_info.kitchen_amenities.map(
                                (amenity, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-muted/50"
                                  >
                                    {amenity}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {property.rental_info.bathroom_amenities &&
                        property.rental_info.bathroom_amenities.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 text-sm">
                              Badrumsutrustning
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {property.rental_info.bathroom_amenities.map(
                                (amenity, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-muted/50"
                                  >
                                    {amenity}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {property.rental_info.tech_amenities &&
                        property.rental_info.tech_amenities.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 text-sm">Teknik</h4>
                            <div className="flex flex-wrap gap-2">
                              {property.rental_info.tech_amenities.map(
                                (amenity, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-muted/50"
                                  >
                                    {amenity}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {property.rental_info.other_amenities &&
                        property.rental_info.other_amenities.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-sm">Övrigt</h4>
                            <div className="flex flex-wrap gap-2">
                              {property.rental_info.other_amenities.map(
                                (amenity, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-muted/50"
                                  >
                                    {amenity}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                    <Separator />
                  </>
                )}

              {/* Building & Property Information */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">
                  Fastighetsuppgifter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Building2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Byggår</div>
                      <div className="text-sm text-muted-foreground">
                        {property.year_built || "Ej angivet"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Energiklass</div>
                      <div className="text-sm text-muted-foreground">
                        {property.energy_class || "Ej angivet"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Home className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Upplåtelseform</div>
                      <div className="text-sm text-muted-foreground">
                        {property.property_type}
                      </div>
                    </div>
                  </div>
                  {property.plot_area && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Ruler className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Tomtarea</div>
                        <div className="text-sm text-muted-foreground">
                          {property.plot_area} m²
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Monthly Costs */}
              {property.monthly_fee && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Månadskostnader
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Euro className="h-5 w-5 text-primary" />
                          <span className="font-medium text-sm">
                            {getPropertyCategory() === "fastighet"
                              ? "Driftskostnad"
                              : "Månadsavgift"}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {property.monthly_fee.toLocaleString("sv-SE")} kr/mån
                        </span>
                      </div>
                      {property.operating_costs && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-primary" />
                            <span className="font-medium text-sm">
                              Driftskostnader
                            </span>
                          </div>
                          <span className="font-semibold">
                            {property.operating_costs.toLocaleString("sv-SE")}{" "}
                            kr/år
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-2">
                        {getPropertyCategory() === "fastighet"
                          ? "Inkluderar el, värme, vatten, sophämtning och fastighetsunderhåll"
                          : "Avgiften inkluderar värme, vatten, fastighetsskötsel och underhåll av gemensamma utrymmen"}
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Nearby Services */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">I närheten</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Train className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Kollektivtrafik</div>
                      <div className="text-sm text-muted-foreground">
                        Tunnelbana/busshållplats inom 500m
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">
                        Shopping & Service
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mataffär, apotek och restauranger i närområdet
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <School className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Skolor</div>
                      <div className="text-sm text-muted-foreground">
                        Grundskola och gymnasium inom gångavstånd
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Dumbbell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">
                        Fritid & Rekreation
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Gym, parker och grönområden i närheten
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          {/* Property Contact */}
          <PropertyContact
            propertyId={property.id}
            propertyTitle={property.title}
            propertyStatus={property.status}
            propertyPrice={property.price}
            propertyAddress={`${property.address_street}, ${property.address_city}`}
            propertyOwner={propertyOwner || undefined}
            brokerId={brokerInfo?.id}
            propertyUserId={property.user_id}
          />

          {/* Watch Final Price Button - Only for FOR_SALE properties */}
          {property.status === "FOR_SALE" && (
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowWatchForm(true)}
                  className="w-full"
                  variant="outline"
                  size="lg"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Bevaka slutpriset för bostaden
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Få ett meddelande när bostaden är såld
                </p>
              </CardContent>
            </Card>
          )}

          <FinalPriceWatchForm
            propertyId={property.id}
            propertyTitle={property.title}
            open={showWatchForm}
            onOpenChange={setShowWatchForm}
          />

          {/* Annonserade Dokument */}
          {property.property_documents &&
            property.property_documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Annonserade dokument
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {property.property_documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary">
                            {doc.name}
                          </p>
                          {doc.type && (
                            <p className="text-xs text-muted-foreground uppercase">
                              {doc.type}
                            </p>
                          )}
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Cost Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>
                {getPropertyCategory() === "fastighet"
                  ? "Kostnadskalkyl för fastighet"
                  : "Kostnadskalkyl för lägenhet"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Köpeskilling</span>
                  <span className="font-semibold">
                    {property.price.toLocaleString("sv-SE")} kr
                  </span>
                </div>
                {property.monthly_fee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {getPropertyCategory() === "fastighet"
                        ? "Driftskostnad"
                        : "Månadsavgift"}
                    </span>
                    <span className="font-semibold">
                      {property.monthly_fee.toLocaleString("sv-SE")} kr/mån
                    </span>
                  </div>
                )}
                <Separator className="my-3" />

                <div className="space-y-2 text-sm">
                  <h5 className="font-medium">
                    Engångskostnader (uppskattning)
                  </h5>
                  {getPropertyCategory() === "fastighet" && (
                    <>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Lagfart (1,5%)</span>
                        <span>
                          {(property.price * 0.015).toLocaleString("sv-SE")} kr
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Pantbrev (2%)</span>
                        <span>
                          {(property.price * 0.02).toLocaleString("sv-SE")} kr
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Fastighetsbesiktning</span>
                        <span>~12 000 kr</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Flytt</span>
                    <span>~15 000 kr</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-semibold">
                  <span>Total engångskostnad</span>
                  <span>
                    {getPropertyCategory() === "fastighet"
                      ? (property.price * 0.035 + 27000).toLocaleString("sv-SE")
                      : "~15 000"}{" "}
                    kr
                  </span>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {getPropertyCategory() === "fastighet"
                      ? "Detta är en uppskattning för fastighetsköp. Faktiska kostnader kan variera beroende på fastighetens storlek och läge."
                      : "Detta är en uppskattning för bostadsrättsköp. Faktiska kostnader kan variera beroende på föreningens ekonomi."}
                  </p>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={() => navigate("/kostnadskalkylator")}
                >
                  Fullständig kalkyl
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property Location Map */}
          <PropertyLocationMap
            address={property.address_street}
            city={property.address_city}
            postalCode={property.address_postal_code}
            latitude={property.latitude}
            longitude={property.longitude}
          />

          {/* Bidding Information */}
          {property.status === "FOR_SALE"}

          {/* Purchase Process */}

          {/* Property Marketing - For property owners (brokers and sellers) */}
          {user && property.user_id === user.id && (
            <PropertyMarketing property={property} />
          )}
        </div>
      </div>

      {/* Floor Plan Modal */}
      <Dialog open={showFloorPlanModal} onOpenChange={setShowFloorPlanModal}>
        <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setShowFloorPlanModal(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Arrows */}
            {floorPlanImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={() =>
                    setCurrentFloorPlanIndex((prev) =>
                      prev === 0 ? floorPlanImages.length - 1 : prev - 1,
                    )
                  }
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={() =>
                    setCurrentFloorPlanIndex((prev) =>
                      prev === floorPlanImages.length - 1 ? 0 : prev + 1,
                    )
                  }
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Floor Plan Image */}
            {floorPlanImages[currentFloorPlanIndex] && (
              <img
                src={floorPlanImages[currentFloorPlanIndex]}
                alt={`Planritning ${currentFloorPlanIndex + 1}`}
                className="w-[95vw] h-[90vh] object-contain"
              />
            )}

            {/* Image Counter */}
            {floorPlanImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-sm">
                {currentFloorPlanIndex + 1} / {floorPlanImages.length}
              </div>
            )}

            {/* Title */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded text-sm font-semibold">
              Planritning
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Property Map Modal */}
      <Dialog
        open={showPropertyMapModal}
        onOpenChange={setShowPropertyMapModal}
      >
        <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setShowPropertyMapModal(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Arrows */}
            {propertyMapImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={() =>
                    setCurrentPropertyMapIndex((prev) =>
                      prev === 0 ? propertyMapImages.length - 1 : prev - 1,
                    )
                  }
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={() =>
                    setCurrentPropertyMapIndex((prev) =>
                      prev === propertyMapImages.length - 1 ? 0 : prev + 1,
                    )
                  }
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Property Map Image */}
            {propertyMapImages[currentPropertyMapIndex] && (
              <img
                src={propertyMapImages[currentPropertyMapIndex]}
                alt={`Fastighetskarta ${currentPropertyMapIndex + 1}`}
                className="w-[95vw] h-[90vh] object-contain"
              />
            )}

            {/* Image Counter */}
            {propertyMapImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-sm">
                {currentPropertyMapIndex + 1} / {propertyMapImages.length}
              </div>
            )}

            {/* Title */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded text-sm font-semibold">
              Fastighetskarta
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
