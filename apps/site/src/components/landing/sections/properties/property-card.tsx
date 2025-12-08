import {
  BedSingleIcon,
  CrownIcon,
  EyeIcon,
  ExternalLinkIcon,
  HeartIcon,
  MapPinIcon,
  Share2Icon,
  SquareIcon,
  StarIcon,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type AdTier = "premium" | "plus" | "free";

export type PropertyCardProps = {
  image: string | StaticImageData;
  name: string;
  location: {
    street: string;
    city: string;
  };
  price: number;
  areaSize: number;
  rooms: number;
  tier?: AdTier;
  isFeatured?: boolean;
  propertyId?: string;
};

const getTierBadge = (tier: AdTier) => {
  switch (tier) {
    case "premium":
      return (
        <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-0 py-1.5 px-3 text-xs font-semibold">
          <CrownIcon className="h-3.5 w-3.5 mr-1" />
          Premium
        </Badge>
      );
    case "plus":
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 py-1.5 px-3 text-xs font-semibold">
          <StarIcon className="h-3.5 w-3.5 mr-1" />
          Plus
        </Badge>
      );
    default:
      return null;
  }
};

const getCardStyles = (tier: AdTier) => {
  switch (tier) {
    case "premium":
      return "border-2 border-amber-500/40 bg-gradient-to-br from-background via-amber-50/30 to-orange-50/20";
    case "plus":
      return "border-2 border-blue-500/30 bg-gradient-to-br from-background to-blue-50/20";
    default:
      return "border border-border bg-card";
  }
};

const PropertyCard = ({
  image,
  name,
  location,
  price,
  areaSize,
  rooms,
  tier = "free",
  propertyId = "1",
}: PropertyCardProps) => {
  const isPremium = tier === "premium";
  const isPlus = tier === "plus";
  const hasTierBadge = isPremium || isPlus;

  return (
    <Card
      className={`py-0 overflow-hidden shadow-none ${getCardStyles(tier)} ${isPremium ? "ring-1 ring-amber-500/20" : ""}`}
    >
      <CardContent className="px-0 h-full group">
        <div className="flex flex-col @4xl:flex-row">
          {/* Image section */}
          <div
            className={`@4xl:w-[70%] overflow-hidden ${isPremium ? "bg-amber-50/30" : isPlus ? "bg-blue-50/20" : "bg-muted/30"}`}
          >
            <div className="relative h-48 @lg:h-72 @4xl:h-[450px] @6xl:h-[440px] @8xl:h-[460px]">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-all duration-300"
              />

              {/* Tier Badge */}
              {hasTierBadge && (
                <div className="absolute top-3 left-3 @lg:top-4 @lg:left-4">
                  {getTierBadge(tier)}
                </div>
              )}

              {/* Action buttons */}
              <div className="absolute bottom-3 right-3 @lg:bottom-4 @lg:right-4 flex gap-2">
                <button
                  type="button"
                  className="bg-white/90 backdrop-blur-sm p-2 @lg:p-2.5 rounded-full shadow text-gray-600 cursor-pointer hover:bg-white hover:text-primary transition-colors"
                  aria-label="Dela"
                >
                  <Share2Icon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="bg-white/90 backdrop-blur-sm p-2 @lg:p-2.5 rounded-full shadow text-gray-600 cursor-pointer hover:bg-white hover:text-red-500 transition-colors"
                  aria-label="Spara som favorit"
                >
                  <HeartIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-4 @lg:p-5 @4xl:w-[30%] flex flex-col">
            <h3 className="text-base @lg:text-lg @4xl:text-xl font-semibold mb-2 @lg:mb-3 line-clamp-2">
              {name}
            </h3>

            <div className="flex items-start gap-1.5 mb-4 @lg:mb-5">
              <MapPinIcon
                size={18}
                className={`mt-0.5 ${isPremium ? "text-amber-600" : isPlus ? "text-blue-600" : "text-primary"}`}
              />
              <div className="text-sm text-muted-foreground">
                <div className="text-sm @lg:text-base font-medium text-foreground">
                  {location.street}
                </div>
                <div className="text-sm">{location.city}</div>
              </div>
            </div>

            <div
              className={`text-xl @lg:text-2xl @4xl:text-3xl font-bold mb-5 @lg:mb-7 ${isPremium ? "text-amber-600" : isPlus ? "text-blue-600" : "text-primary"}`}
            >
              {price.toLocaleString("sv-SE")} kr
            </div>

            <div className="py-2 border-y flex flex-wrap gap-4 @lg:gap-6 @4xl:gap-4 @6xl:gap-6 px-1">
              <div className="flex items-center gap-2">
                <SquareIcon
                  size={18}
                  className={
                    isPremium
                      ? "text-amber-600"
                      : isPlus
                        ? "text-blue-600"
                        : "text-primary"
                  }
                />
                <div>
                  <div className="text-xs text-muted-foreground">Boarea</div>
                  <div className="text-sm font-semibold">
                    {areaSize} m<sup>2</sup>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BedSingleIcon
                  size={18}
                  className={
                    isPremium
                      ? "text-amber-600"
                      : isPlus
                        ? "text-blue-600"
                        : "text-primary"
                  }
                />
                <div>
                  <div className="text-xs text-muted-foreground">Rum</div>
                  <div className="text-sm font-semibold">{rooms} rum</div>
                </div>
              </div>
            </div>

            <div className="mt-6 @lg:mt-8 @4xl:mt-auto space-y-2">
              <Link href={`/property/${propertyId}`}>
                <Button
                  size="lg"
                  className={`w-full text-sm @lg:text-base font-semibold py-5 @lg:py-6 ${isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : isPlus ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" : ""}`}
                >
                  <EyeIcon className="h-4 w-4 mr-1.5" />
                  Se hela annonsen
                </Button>
              </Link>

              {isPremium && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-amber-500/30 text-amber-700 hover:bg-amber-50"
                  asChild
                >
                  <a
                    href={`/property/${propertyId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
                    Öppna i ny flik
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
