"use client";

import type { Property } from "db";
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
  School,
  Share2,
  ShoppingBag,
  Train,
  Wifi,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ContainerWrapper from "@/components/common/container-wrapper";
import SimilarProperties from "@/components/property/sections/similar-properties";
import PropertyMap from "@/components/property-map";
import { PropertyTypeInformation } from "@/components/property-type-information";
import { RentalChat } from "@/components/rental-chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPropertyImageUrl } from "@/image";
import {
  checkFavoriteStatus,
  toggleFavorite,
  trackPropertyView,
} from "@/lib/actions/property";

type PropertyOwner = {
  id: string;
  fullName?: string | null;
  email: string;
  phone?: string | null;
};

type Props = {
  property: Property;
  propertyOwner?: PropertyOwner;
};

type RentalInfo = {
  contract_type?: string;
  available_from?: string;
  pets_allowed?: boolean;
  furnished?: boolean;
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

export default function RentalDetails({ property, propertyOwner }: Props) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const rentalInfo = (property.rentalInfo as RentalInfo | null) || null;
  const images = (property.images || [])
    .filter(Boolean)
    .map(getPropertyImageUrl);

  useEffect(() => {
    trackPropertyView(property.id, navigator.userAgent).catch(() => {});
    checkFavoriteStatus(property.id).then(setIsFavorite);
  }, [property.id]);

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(property.id);
    if (result.success) {
      setIsFavorite(result.isFavorite);
      toast.success(
        result.isFavorite ? "Sparad som favorit" : "Borttagen från favoriter",
      );
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Kolla in denna hyresbostad: ${property.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Länk kopierad");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!property) {
    return (
      <ContainerWrapper className="py-12">
        <Card>
          <CardContent className="text-center py-12">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Hyresbostad hittades inte
            </h3>
            <p className="text-muted-foreground mb-4">
              Hyresbostaden du söker efter finns inte eller har tagits bort.
            </p>
            <Button onClick={() => router.push("/hyresbostader")}>
              Tillbaka till hyresbostäder
            </Button>
          </CardContent>
        </Card>
      </ContainerWrapper>
    );
  }

  return (
    <ContainerWrapper className="py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Tillbaka
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images and Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          {images.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        onClick={previousImage}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Ingen bild tillgänglig
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
                    {property.addressStreet}, {property.addressPostalCode}{" "}
                    {property.addressCity}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {property.price.toLocaleString("sv-SE")} kr/mån
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={isFavorite ? "text-red-500" : ""}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.livingArea && (
                  <div className="text-center">
                    <div className="h-6 w-6 mx-auto mb-2 text-muted-foreground">
                      <Home className="h-6 w-6" />
                    </div>
                    <div className="font-semibold">
                      {property.livingArea} m²
                    </div>
                    <div className="text-sm text-muted-foreground">Boarea</div>
                  </div>
                )}
                {property.rooms && (
                  <div className="text-center">
                    <div className="h-6 w-6 mx-auto mb-2 text-muted-foreground">
                      <Home className="h-6 w-6" />
                    </div>
                    <div className="font-semibold">{property.rooms} rum</div>
                    <div className="text-sm text-muted-foreground">
                      Antal rum
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <div className="h-6 w-6 mx-auto mb-2 text-muted-foreground">
                      <BedDouble className="h-6 w-6" />
                    </div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Sovrum</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <div className="h-6 w-6 mx-auto mb-2 text-muted-foreground">
                      <Bath className="h-6 w-6" />
                    </div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Badrum</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Rental Information */}
              {rentalInfo && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Hyresinformation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rentalInfo.contract_type && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <FileText className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Kontraktstyp</div>
                            <div className="text-sm text-muted-foreground">
                              {rentalInfo.contract_type}
                            </div>
                          </div>
                        </div>
                      )}
                      {rentalInfo.lease_duration && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Uthyrningsperiod</div>
                            <div className="text-sm text-muted-foreground">
                              {rentalInfo.lease_duration}
                            </div>
                          </div>
                        </div>
                      )}
                      {rentalInfo.available_from && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Tillgänglig från</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                rentalInfo.available_from,
                              ).toLocaleDateString("sv-SE", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Husdjur</div>
                          <div className="text-sm text-muted-foreground">
                            {rentalInfo.pets_allowed
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
                            {rentalInfo.furnished ? "Möblerad" : "Omöblerad"}
                          </div>
                        </div>
                      </div>
                      {rentalInfo.smoking_allowed !== undefined && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Check className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Rökning</div>
                            <div className="text-sm text-muted-foreground">
                              {rentalInfo.smoking_allowed
                                ? "Tillåten"
                                : "Ej tillåten"}
                            </div>
                          </div>
                        </div>
                      )}
                      {rentalInfo.is_shared !== undefined && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Home className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium">Delad bostad</div>
                            <div className="text-sm text-muted-foreground">
                              {rentalInfo.is_shared ? "Ja (inneboende)" : "Nej"}
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
              {rentalInfo &&
                (rentalInfo.floor_level ||
                  rentalInfo.has_elevator !== undefined ||
                  property.yearBuilt ||
                  rentalInfo.energy_rating) && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">
                        Byggnadsinformation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rentalInfo.floor_level && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Home className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Våning</div>
                              <div className="text-sm text-muted-foreground">
                                Våning {rentalInfo.floor_level}
                              </div>
                            </div>
                          </div>
                        )}
                        {rentalInfo.has_elevator !== undefined && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Hiss</div>
                              <div className="text-sm text-muted-foreground">
                                {rentalInfo.has_elevator ? "Ja" : "Nej"}
                              </div>
                            </div>
                          </div>
                        )}
                        {property.yearBuilt && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Byggnadsår</div>
                              <div className="text-sm text-muted-foreground">
                                {property.yearBuilt}
                              </div>
                            </div>
                          </div>
                        )}
                        {rentalInfo.energy_rating && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <Zap className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium">Energiklass</div>
                              <div className="text-sm text-muted-foreground">
                                {rentalInfo.energy_rating}
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

              {/* What's included in rent */}
              {rentalInfo && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Vad ingår i hyran?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rentalInfo.utilities_included && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Zap className="h-5 w-5 text-primary" />
                          <span className="text-sm">El och värme ingår</span>
                        </div>
                      )}
                      {rentalInfo.internet_included && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Wifi className="h-5 w-5 text-primary" />
                          <span className="text-sm">Bredband ingår</span>
                        </div>
                      )}
                      {rentalInfo.has_balcony && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Home className="h-5 w-5 text-primary" />
                          <span className="text-sm">Balkong</span>
                        </div>
                      )}
                      {rentalInfo.has_garden && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Home className="h-5 w-5 text-primary" />
                          <span className="text-sm">Trädgård</span>
                        </div>
                      )}
                      {rentalInfo.parking_available && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Car className="h-5 w-5 text-primary" />
                          <span className="text-sm">
                            {rentalInfo.parking_type || "Parkering tillgänglig"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Nearby Services */}
              {rentalInfo &&
                (rentalInfo.neighborhood_description ||
                  rentalInfo.nearest_metro ||
                  rentalInfo.transport_description) && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4 text-lg">
                        Område och transport
                      </h3>
                      <div className="space-y-3">
                        {rentalInfo.neighborhood_description && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {rentalInfo.neighborhood_description}
                            </p>
                          </div>
                        )}
                        {rentalInfo.nearest_metro && (
                          <div className="flex items-start gap-3">
                            <Train className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">
                                Närmaste kollektivtrafik
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rentalInfo.nearest_metro}
                              </div>
                            </div>
                          </div>
                        )}
                        {rentalInfo.transport_description && (
                          <div className="flex items-start gap-3">
                            <Train className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">
                                Kommunikationer
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rentalInfo.transport_description}
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
              {(!rentalInfo ||
                (!rentalInfo.neighborhood_description &&
                  !rentalInfo.nearest_metro &&
                  !rentalInfo.transport_description)) && (
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
            propertyType={property.propertyType}
            status={property.status}
          />

          {/* Similar Properties - Full Width */}
          <SimilarProperties
            currentProperty={{
              id: property.id,
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RentalChat
            propertyId={property.id}
            propertyOwnerId={property.userId}
            propertyOwner={
              propertyOwner
                ? {
                    fullName: propertyOwner.fullName ?? undefined,
                    email: propertyOwner.email,
                  }
                : undefined
            }
          />

          {/* Map */}
          {property.latitude && property.longitude && (
            <Card>
              <CardContent className="p-0">
                <div className="h-[300px]">
                  <PropertyMap
                    properties={[property]}
                    selectedLocation={{
                      center_lat: Number(property.latitude),
                      center_lng: Number(property.longitude),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ContainerWrapper>
  );
}
