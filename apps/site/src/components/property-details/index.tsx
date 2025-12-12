"use client";

import type { Property } from "db";
import {
  ArrowLeftIcon,
  BedDoubleIcon,
  BellIcon,
  BoxIcon,
  Building2Icon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  DumbbellIcon,
  EuroIcon,
  FileTextIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  RulerIcon,
  SchoolIcon,
  Share2Icon,
  ShoppingBagIcon,
  TrainIcon,
  WandSparklesIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContainerWrapper from "@/components/common/container-wrapper";
import { PropertyContact } from "@/components/property-contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

type BrokerInfo = {
  id: string;
  brokerName: string;
  brokerEmail: string;
  brokerPhone?: string | null;
  licenseNumber?: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    metadata?: string | null;
  } | null;
};

type Props = {
  property: Property;
  propertyOwner?: PropertyOwner;
  brokerInfo?: BrokerInfo;
};

export default function PropertyDetails({
  property,
  propertyOwner,
  brokerInfo,
}: Props) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);
  const [showPropertyMapModal, setShowPropertyMapModal] = useState(false);
  const [currentPropertyMapIndex, setCurrentPropertyMapIndex] = useState(0);
  const [_showWatchForm, setShowWatchForm] = useState(false);

  useEffect(() => {
    // Track view
    trackPropertyView(property.id, navigator.userAgent).catch(() => { });

    // Check favorite status
    checkFavoriteStatus(property.id).then(setIsFavorite);
  }, [property.id]);

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(property.id);
    if (result.success) {
      setIsFavorite(result.isFavorite);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Kolla in denna fastighet: ${property.title}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getPropertyCategory = () => {
    const type = property.propertyType?.toLowerCase() || "";
    if (
      type.includes("villa") ||
      type.includes("tomt") ||
      type.includes("fritid") ||
      type.includes("gård")
    ) {
      return "fastighet";
    }
    return "lägenhet";
  };

  const getFloorPlanImages = () => {
    if (!property.images) return [];
    return property.images
      .filter((img) => {
        const fileName = img.toLowerCase();
        return (
          fileName.includes("planritning") ||
          fileName.includes("floorplan") ||
          fileName.includes("floor-plan") ||
          fileName.includes("floor_plan") ||
          fileName.includes("plan")
        );
      })
      .map(getPropertyImageUrl);
  };

  const getPropertyMapImages = () => {
    if (!property.images) return [];
    return property.images
      .filter((img) => {
        const fileName = img.toLowerCase();
        return (
          fileName.includes("fastighetskarta") ||
          fileName.includes("fastighets-karta") ||
          fileName.includes("property-map") ||
          fileName.includes("propertymap") ||
          fileName.includes("tomtkarta")
        );
      })
      .map(getPropertyImageUrl);
  };

  const floorPlanImages = getFloorPlanImages();
  const propertyMapImages = getPropertyMapImages();

  // Parse organization metadata for website
  const organizationMetadata = brokerInfo?.organization?.metadata
    ? (JSON.parse(brokerInfo.organization.metadata) as {
      website?: string;
      address?: string;
      city?: string;
      phone?: string;
      email?: string;
    })
    : null;

  const brokerWebsite =
    organizationMetadata?.website ||
    (property.userId === "test"
      ? `https://www.maklarexempel.se/objekt/${property.id}`
      : undefined);

  const rentalInfo = property.rentalInfo as
    | {
      available_from?: string;
      lease_duration?: string;
      floor_level?: string;
      building_year?: number;
      energy_rating?: string;
      max_occupants?: number;
      min_income?: number;
      min_age?: number;
      references_required?: boolean;
      neighborhood_description?: string;
      nearest_metro?: string;
      transport_description?: string;
      kitchen_amenities?: string[];
      bathroom_amenities?: string[];
      tech_amenities?: string[];
      other_amenities?: string[];
    }
    | null
    | undefined;

  const propertyDocuments = property.propertyDocuments as
    | Array<{
      name: string;
      url: string;
      type: string;
      uploaded_at: string;
    }>
    | null
    | undefined;

  return (
    <ContainerWrapper className="py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Tillbaka
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images and Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery - Simplified for now */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-200">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={getPropertyImageUrl(property.images[0])}
                    alt={property.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Ingen bild tillgänglig
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Info */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={isFavorite ? "text-red-500" : ""}
                  >
                    <HeartIcon
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2Icon className="h-4 w-4" />
                  </Button>
                  {property.threedTourUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        property.threedTourUrl &&
                        window.open(property.threedTourUrl, "_blank")
                      }
                    >
                      <BoxIcon className="h-4 w-4 mr-1" />
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
                          images: property.images?.join(",") || "",
                          title: property.title,
                        });
                        router.push(`/ai-bildredigering?${params.toString()}`);
                      }}
                    >
                      <WandSparklesIcon className="h-4 w-4 mr-2" />
                      AI Renovering
                    </Button>
                  )}
                </div>

                {/* Property information */}
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {property.title}
                  </CardTitle>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {property.addressStreet}, {property.addressPostalCode}{" "}
                    {property.addressCity}
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
                {property.livingArea && (
                  <div className="text-center">
                    <RulerIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">
                      {property.livingArea} m²
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Boarea {property.plotArea && `+ Biarea`}
                    </div>
                  </div>
                )}
                {property.rooms && (
                  <div className="text-center">
                    <HomeIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.rooms} rum</div>
                    <div className="text-sm text-muted-foreground">
                      Antal rum
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <BedDoubleIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Sovrum</div>
                  </div>
                )}
                <div className="text-center">
                  <HomeIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-semibold">{property.propertyType}</div>
                  <div className="text-sm text-muted-foreground">
                    Upplåtelseform
                  </div>
                </div>
                {property.yearBuilt && (
                  <div className="text-center">
                    <CalendarIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-semibold">{property.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground">Byggår</div>
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

              {/* Rental Information */}
              {property.status === "FOR_RENT" && rentalInfo && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Uthyrningsinformation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rentalInfo.available_from && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">
                              Tillgänglig från
                            </div>
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
                      {rentalInfo.floor_level && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <Building2Icon className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Våning</div>
                            <div className="text-sm text-muted-foreground">
                              {rentalInfo.floor_level}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <Building2Icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Byggår</div>
                      <div className="text-sm text-muted-foreground">
                        {property.yearBuilt || "Ej angivet"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <ZapIcon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Energiklass</div>
                      <div className="text-sm text-muted-foreground">
                        {property.energyClass || "Ej angivet"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Monthly Costs */}
              {property.monthlyFee && (
                <>
                  <div>
                    <h3 className="font-semibold mb-4 text-lg">
                      Månadskostnader
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <EuroIcon className="h-5 w-5 text-primary" />
                          <span className="font-medium text-sm">
                            {getPropertyCategory() === "fastighet"
                              ? "Driftskostnad"
                              : "Månadsavgift"}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {property.monthlyFee.toLocaleString("sv-SE")} kr/mån
                        </span>
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
                    <TrainIcon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Kollektivtrafik</div>
                      <div className="text-sm text-muted-foreground">
                        Tunnelbana/busshållplats inom 500m
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShoppingBagIcon className="h-5 w-5 text-primary mt-0.5" />
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
                    <SchoolIcon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Skolor</div>
                      <div className="text-sm text-muted-foreground">
                        Grundskola och gymnasium inom gångavstånd
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DumbbellIcon className="h-5 w-5 text-primary mt-0.5" />
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Contact */}
          <PropertyContact
            propertyId={property.id}
            propertyTitle={property.title}
            propertyStatus={property.status}
            propertyPrice={property.price}
            propertyAddress={`${property.addressStreet}, ${property.addressCity}`}
            propertyOwner={propertyOwner}
            brokerId={brokerInfo?.id}
            propertyUserId={property.userId}
          />

          {/* Watch Final Price Button */}
          {property.status === "FOR_SALE" && (
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowWatchForm(true)}
                  className="w-full"
                  variant="outline"
                  size="lg"
                >
                  <BellIcon className="h-4 w-4 mr-2" />
                  Bevaka slutpriset för bostaden
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Få ett meddelande när bostaden är såld
                </p>
              </CardContent>
            </Card>
          )}

          {/* Property Documents */}
          {propertyDocuments && propertyDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Annonserade dokument</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {propertyDocuments.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileTextIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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
                    <DownloadIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                {property.monthlyFee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {getPropertyCategory() === "fastighet"
                        ? "Driftskostnad"
                        : "Månadsavgift"}
                    </span>
                    <span className="font-semibold">
                      {property.monthlyFee.toLocaleString("sv-SE")} kr/mån
                    </span>
                  </div>
                )}
                <Separator className="my-3" />
                <Button
                  className="w-full mt-4"
                  onClick={() => router.push("/kostnadskalkylator")}
                >
                  Fullständig kalkyl
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floor Plan Modal */}
      <Dialog open={showFloorPlanModal} onOpenChange={setShowFloorPlanModal}>
        <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setShowFloorPlanModal(false)}
            >
              <XIcon className="h-6 w-6" />
            </Button>
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
                  <ChevronLeftIcon className="h-8 w-8" />
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
                  <ChevronRightIcon className="h-8 w-8" />
                </Button>
              </>
            )}
            {floorPlanImages[currentFloorPlanIndex] && (
              /* biome-ignore lint/performance/noImgElement: Modal images need dynamic sizing */
              <img
                src={floorPlanImages[currentFloorPlanIndex]}
                alt={`Planritning ${currentFloorPlanIndex + 1}`}
                className="w-[95vw] h-[90vh] object-contain"
              />
            )}
            {floorPlanImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-sm">
                {currentFloorPlanIndex + 1} / {floorPlanImages.length}
              </div>
            )}
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
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setShowPropertyMapModal(false)}
            >
              <XIcon className="h-6 w-6" />
            </Button>
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
                  <ChevronLeftIcon className="h-8 w-8" />
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
                  <ChevronRightIcon className="h-8 w-8" />
                </Button>
              </>
            )}
            {propertyMapImages[currentPropertyMapIndex] && (
              /* biome-ignore lint/performance/noImgElement: Modal images need dynamic sizing */
              <img
                src={propertyMapImages[currentPropertyMapIndex]}
                alt={`Fastighetskarta ${currentPropertyMapIndex + 1}`}
                className="w-[95vw] h-[90vh] object-contain"
              />
            )}
            {propertyMapImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded text-sm">
                {currentPropertyMapIndex + 1} / {propertyMapImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ContainerWrapper>
  );
}
