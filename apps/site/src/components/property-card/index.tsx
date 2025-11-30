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
  const _cardSize = getCardSize();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const images = useMemo(() => {
    return (property.images || []).filter(Boolean).map(getPropertyImageUrl);
  }, [property.images]);
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

  // Simplified version - just show basic card layout
  // For full implementation, we'd need to handle all the different card sizes
  // This is a simplified version that works for the search page
  return (
    <Card
      className={cn(
        "w-full max-w-5xl mx-auto overflow-hidden hover:shadow-xl transition-all duration-300 group",
        !disableClick && "cursor-pointer",
        isRental && "border-l-4 border-l-rental",
      )}
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image Section */}
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

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {property.adTier && (
              <Badge
                className={cn(
                  "px-2 py-0.5 text-xs font-semibold shadow-md",
                  property.adTier === "premium" &&
                    "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white",
                  property.adTier === "plus" &&
                    "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
                  property.adTier === "free" &&
                    "bg-muted text-muted-foreground",
                )}
              >
                {
                  tierBadgeLabels[
                    property.adTier as keyof typeof tierBadgeLabels
                  ]
                }
              </Badge>
            )}
            {isRental && (
              <Badge className="bg-rental text-rental-foreground px-2 py-0.5 text-xs font-semibold shadow-lg">
                UTHYRNING
              </Badge>
            )}
            {property.status === "COMING_SOON" && (
              <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-xs font-semibold shadow-md">
                <Clock className="h-3 w-3 mr-1" />
                Snart till salu
              </Badge>
            )}
          </div>

          {/* Image Navigation */}
          {images.length > 1 && (
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

        {/* Info Section */}
        <div className="sm:w-[50%] p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {property.title}
            </h3>

            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0" />
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
