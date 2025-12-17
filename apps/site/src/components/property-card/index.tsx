"use client";

import type { Property } from "db";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyImageUrl } from "@/image";
import { checkFavoriteStatus, toggleFavorite } from "@/lib/actions/property";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  size?: "small" | "medium" | "large";
  onContactClick?: () => void;
  forceWide?: boolean;
  maxWidthClass?: string;
  disableClick?: boolean;
  managementMode?: boolean;
}

const propertyTypeLabels: {
  [key: string]: string;
} = {
  Villa: "Villa",
  Lägenhet: "Lägenhet",
  Radhus: "Radhus",
  Bostadsrätt: "Bostadsrätt",
  Fritidshus: "Fritidshus",
  Tomt: "Tomt",
  Kommersiell: "Kommersiell",
  APARTMENT: "Lägenhet",
  HOUSE: "Villa",
  TOWNHOUSE: "Radhus",
  COTTAGE: "Fritidshus",
  PLOT: "Tomt",
  COMMERCIAL: "Kommersiell",
};


const tierBadgeLabels = {
  free: "Grund",
  plus: "Plus",
  premium: "Exklusiv",
};

export default function PropertyCard({
  property,
  size,
  onContactClick,
  forceWide,
  maxWidthClass,
  disableClick = false,
  managementMode = false,
}: PropertyCardProps) {
  // Map ad_tier to size if not explicitly provided
  const getCardSize = () => {
    if (size) return size;
    if (property.adTier === "free") return "small";
    if (property.adTier === "plus") return "medium";
    if (property.adTier === "premium") return "large";
    return "medium";
  };
  const cardSize = getCardSize();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const images = useMemo(() => {
    return (property.images || []).filter(Boolean).map(getPropertyImageUrl);
  }, [property.images]);
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];

  const checkIfFavorite = useCallback(async () => {
    if (!user) return;
    const favorite = await checkFavoriteStatus(property.id);
    setIsFavorite(favorite);
  }, [user, property.id]);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, checkIfFavorite]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Du måste vara inloggad för att spara favoriter");
      return;
    }
    setIsLoading(true);
    try {
      const result = await toggleFavorite(property.id);
      if (result.success) {
        setIsFavorite(result.isFavorite);
        toast.success(
          result.isFavorite
            ? "Tillagd som favorit"
            : "Borttagen från favoriter",
        );
      } else {
        toast.error(result.error || "Kunde inte uppdatera favoriter");
      }
    } catch (_error) {
      toast.error("Kunde inte uppdatera favoriter");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, status: string) => {
    if (status === "FOR_RENT" || status === "RENTED") {
      return `${price.toLocaleString("sv-SE")} kr/mån`;
    }
    return `${price.toLocaleString("sv-SE")} kr`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (disableClick) {
      return;
    }
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    if (managementMode) {
      router.push(`/broker/property/${property.id}`);
    } else {
      router.push(`/annons/${property.id}`);
    }
  };

  const isRental = property.status === "FOR_RENT";

  // PREMIUM / LARGE CARD - 70%/30% layout with enhanced styling
  if (cardSize === "large") {
    return (
      <Card
        className={cn(
          "w-full mx-auto overflow-hidden hover:shadow-2xl transition-all duration-500 group border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5 py-0",
          !disableClick && "cursor-pointer",
          maxWidthClass ?? (forceWide ? "max-w-7xl" : "max-w-6xl"),
        )}
        onClick={handleCardClick}
      >
        <div
          className={cn(
            "flex h-full lg:h-[480px]",
            forceWide ? "flex-row" : "flex-col lg:flex-row",
          )}
        >
          {/* Image Section - 70% width */}
          <div
            className={cn(
              "relative shrink-0",
              forceWide ? "w-[70%] self-stretch" : "lg:w-[70%] lg:self-stretch",
            )}
          >
            {/* Mobile aspect ratio */}
            <div
              className={cn(
                "aspect-video overflow-hidden bg-muted",
                forceWide ? "hidden" : "lg:hidden",
              )}
            >
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={property.title}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Ingen bild tillgänglig
                </div>
              )}
            </div>
            {/* Desktop full height image */}
            <div
              className={cn(
                "relative h-full bg-muted overflow-hidden",
                forceWide ? "block" : "hidden lg:block",
              )}
            >
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Ingen bild tillgänglig
                </div>
              )}
            </div>

            {/* Image Navigation */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        index === currentImageIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50",
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Premium Badge */}
            <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-2.5 py-1 text-xs font-semibold shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                <span className="mr-1" style={{ fontSize: "0.6rem" }}>
                  👑
                </span>
                {tierBadgeLabels[property.adTier as keyof typeof tierBadgeLabels] || "Exklusiv"}
              </Badge>

              {/* Coming Soon Badge */}
              {property.status === "COMING_SOON" && (
                <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-xs font-semibold shadow-md border border-accent/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Snart till salu
                </Badge>
              )}

              {isRental && (
                <Badge className="bg-rental text-rental-foreground px-2 py-0.5 text-xs font-semibold shadow-lg">
                  UTHYRNING
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-5 right-5 flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 bg-white/95 hover:bg-white shadow-xl backdrop-blur-md rounded-full border border-white/50"
                onClick={handleToggleFavorite}
                disabled={isLoading}
              >
                <Heart
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isFavorite
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-foreground hover:text-red-500",
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Info Section - 30% width */}
          <div
            className={cn(
              "p-6 flex flex-col justify-between overflow-hidden",
              forceWide ? "w-[30%]" : "lg:w-[30%]",
            )}
          >
            <div className="space-y-3">
              <h3 className="font-bold text-xl leading-tight text-foreground">
                {property.title}
              </h3>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm font-medium">
                  {property.addressStreet}, {property.addressCity}
                </div>
              </div>

              <div className="py-3">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {formatPrice(property.price, property.status)}
                </div>
              </div>

              <div className="space-y-2 py-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Storlek</div>
                    <div className="font-bold text-sm">
                      {property.livingArea
                        ? `${property.livingArea} m²`
                        : "Ej angivet"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Bostadstyp
                    </div>
                    <div className="font-bold text-sm">
                      {propertyTypeLabels[property.propertyType] ||
                        property.propertyType}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.rooms && (
                    <div>
                      <div className="text-xs text-muted-foreground">Rum</div>
                      <div className="font-bold text-sm">
                        {property.rooms} rum
                      </div>
                    </div>
                  )}
                  {property.plotArea && (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Tomtstorlek
                      </div>
                      <div className="font-bold text-sm">
                        {property.plotArea} m²
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {onContactClick && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick();
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Kontakta säljare
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // PLUS / MEDIUM CARD - 58%/42% layout
  if (cardSize === "medium") {
    return (
      <Card
        className={cn(
          "w-full max-w-5xl mx-auto overflow-hidden hover:shadow-xl transition-all duration-400 group border border-info/40 bg-gradient-to-br from-background to-info/5 py-0",
          !disableClick && "cursor-pointer",
        )}
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image Section - 58% width */}
          <div className="relative sm:w-[58%] shrink-0">
            <div className="aspect-video overflow-hidden bg-muted">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={property.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Ingen bild tillgänglig
                </div>
              )}
            </div>

            {/* Image Navigation */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1 rounded-full transition-all",
                        index === currentImageIndex
                          ? "w-4 bg-white"
                          : "w-1 bg-white/50",
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Plus Badge */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 text-xs font-semibold shadow-lg border border-white/30 backdrop-blur-sm">
                <span className="mr-1" style={{ fontSize: "0.6rem" }}>
                  ⭐
                </span>
                {tierBadgeLabels[property.adTier as keyof typeof tierBadgeLabels] || "Plus"}
              </Badge>

              {/* Coming Soon Badge */}
              {property.status === "COMING_SOON" && (
                <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-xs font-semibold shadow-md border border-accent/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Snart till salu
                </Badge>
              )}

              {isRental && (
                <Badge className="bg-rental text-rental-foreground px-2 py-0.5 text-xs font-semibold shadow-lg">
                  UTHYRNING
                </Badge>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg backdrop-blur-md rounded-full"
                onClick={handleToggleFavorite}
                disabled={isLoading}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-foreground hover:text-red-500",
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Info Section - 42% width */}
          <div className="sm:w-[42%] p-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <h3 className="font-bold text-lg leading-tight">{property.title}</h3>

              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <div className="font-medium">
                  {property.addressStreet}, {property.addressCity}
                </div>
              </div>

              <div className="py-2">
                <div className="text-xl font-extrabold text-primary">
                  {formatPrice(property.price, property.status)}
                </div>
              </div>

              <div className="space-y-1.5 py-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Storlek: </span>
                    <span className="font-bold">
                      {property.livingArea
                        ? `${property.livingArea} m²`
                        : "Ej angivet"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Typ: </span>
                    <span className="font-bold">
                      {propertyTypeLabels[property.propertyType] ||
                        property.propertyType}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.rooms && (
                    <div>
                      <span className="text-muted-foreground">Rum: </span>
                      <span className="font-bold">{property.rooms} rum</span>
                    </div>
                  )}
                  {property.plotArea && (
                    <div>
                      <span className="text-muted-foreground">Tomt: </span>
                      <span className="font-bold">{property.plotArea} m²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {onContactClick && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick();
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Kontakta säljare
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // FREE / SMALL CARD - 50%/50% layout (default)
  return (
    <Card
      className={cn(
        "w-full max-w-5xl mx-auto overflow-hidden hover:shadow-lg transition-all duration-300 group py-0",
        !disableClick && "cursor-pointer",
        isRental && "border-l-4 border-l-rental",
      )}
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image Section - 50% width */}
        <div className="relative sm:w-[50%] shrink-0">
          <div className="aspect-video overflow-hidden bg-muted">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={property.title}
                width={400}
                height={225}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Ingen bild tillgänglig
              </div>
            )}
          </div>

          {/* Grund Badge */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            <Badge className="bg-muted text-muted-foreground px-2 py-0.5 text-xs font-semibold shadow-md border border-border backdrop-blur-sm">
              {tierBadgeLabels[property.adTier as keyof typeof tierBadgeLabels] || "Grund"}
            </Badge>

            {/* Coming Soon Badge */}
            {property.status === "COMING_SOON" && (
              <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-xs font-semibold shadow-md border border-accent/30">
                <Clock className="h-3 w-3 mr-1" />
                Snart till salu
              </Badge>
            )}

            {isRental && (
              <Badge className="bg-rental text-rental-foreground px-2 py-0.5 text-xs font-semibold shadow-lg">
                UTHYRNING
              </Badge>
            )}
          </div>

          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={previousImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-0.5 rounded-full transition-all",
                      index === currentImageIndex
                        ? "w-3 bg-white"
                        : "w-0.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Favorite button */}
          <div className="absolute bottom-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-white/90 hover:bg-white shadow-md rounded-full"
              onClick={handleToggleFavorite}
              disabled={isLoading}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-foreground hover:text-red-500",
                )}
              />
            </Button>
          </div>
        </div>

        {/* Info Section - 50% width */}
        <div className="sm:w-[50%] p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {property.title}
            </h3>

            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">
                {property.addressStreet}, {property.addressCity}
              </span>
            </div>

            <div className="text-lg font-bold text-primary">
              {formatPrice(property.price, property.status)}
            </div>

            <div className="space-y-1 text-sm py-2">
              <div>
                <span className="text-muted-foreground">Storlek: </span>
                <span className="font-semibold">
                  {property.livingArea
                    ? `${property.livingArea} m²`
                    : "Ej angivet"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Typ: </span>
                <span className="font-semibold">
                  {propertyTypeLabels[property.propertyType] ||
                    property.propertyType}
                </span>
              </div>
              {property.rooms && (
                <div>
                  <span className="text-muted-foreground">Rum: </span>
                  <span className="font-semibold">{property.rooms} rum</span>
                </div>
              )}
              {property.plotArea && (
                <div>
                  <span className="text-muted-foreground">Tomt: </span>
                  <span className="font-semibold">{property.plotArea} m²</span>
                </div>
              )}
            </div>
          </div>

          {onContactClick && (
            <div className="mt-3 pt-3 border-t border-border">
              <Button
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onContactClick();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Kontakta säljare
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
