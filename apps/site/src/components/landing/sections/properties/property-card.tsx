import {
  BedSingleIcon,
  CrownIcon,
  EyeIcon,
  HeartIcon,
  MapPinIcon,
  SquareIcon,
} from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type T_Props = {
  image: string | StaticImageData;
  name: string;
  location: {
    street: string;
    city: string;
  };
  price: number;
  areaSize: number;
  rooms: number;
};

const PropertyCard = ({
  image,
  name,
  location,
  price,
  areaSize,
  rooms,
}: T_Props) => {
  return (
    <Card className="bg-card py-0 overflow-hidden border-2 border-primary/30 shadow-none bg-gradient-to-br from-background to-primary/5">
      <CardContent className="px-0 h-full group">
        <div className="flex flex-col @4xl:flex-row">
          <div className="bg-primary-light/10 @4xl:w-[70%] overflow-hidden">
            <div className="relative h-40 @lg:h-72 @4xl:h-[450px] @6xl:h-[440px] @8xl:h-[460px]">
              <Image
                src={image}
                alt="Egendom"
                fill
                className="object-cover group-hover:scale-105 transition-all duration-300"
              />

              <div className="absolute top-3 left-3 @lg:top-5 @lg:left-5 py-1.5 px-3 @lg:py-2 @lg:px-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 backdrop-blur-sm border-2 border-white/30 text-xs @lg:text-sm text-primary-foreground font-semibold inline-flex items-center gap-x-1.5">
                <CrownIcon className="h-3.5 w-3.5 @lg:h-[18px] @lg:w-[18px]" />
                Exklusiv
              </div>

              <button
                type="button"
                className="absolute bottom-3 right-3 @lg:bottom-5 @lg:right-5 bg-neutral-100 p-3 rounded-full shadow text-gray-600 cursor-pointer hover:bg-neutral-200 hover:text-gray-500"
              >
                <HeartIcon className="h-4 w-4 @lg:h-5 @lg:w-5" />
              </button>
            </div>
          </div>
          <div className="p-5 @4xl:w-[30%] flex flex-col">
            <h3 className="text-lg @lg:text-xl font-semibold mb-3">{name}</h3>

            <div className="flex items-start gap-1.5 mb-5">
              <MapPinIcon size={20} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <div className="text-sm @lg:text-base font-medium">
                  {location.street}
                </div>
                <div className="text-sm @lg:text-base">{location.city}</div>
              </div>
            </div>

            <div className="text-2xl @lg:text-3xl text-primary font-bold mb-7">
              {price.toLocaleString("sv-SE")} kr
            </div>

            <div className="py-2 border-y flex @8xl:items-center gap-10 @4xl:gap-6 @6xl:gap-10 px-1">
              <div className="flex items-center gap-2">
                <SquareIcon size={20} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Boarea</div>
                  <div className="text-sm font-semibold">
                    {areaSize} m<sup>2</sup>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BedSingleIcon size={20} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Rum</div>
                  <div className="text-sm font-semibold">{rooms} rum</div>
                </div>
              </div>
            </div>

            <div className="mt-10 @lg:mt-12 @4xl:mt-auto">
              <Link href="/property">
                <Button
                  size="lg"
                  className="w-full text-base font-semibold py-6"
                >
                  <EyeIcon /> Se hela annonsen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
