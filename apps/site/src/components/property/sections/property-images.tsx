import { ChevronLeftIcon, ChevronRightIcon, ScanIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import imageOne from "@/images/property-image-1.webp";
import imageTwo from "@/images/property-image-2.webp";
import imageThree from "@/images/property-image-3.webp";
import imageFour from "@/images/property-image-4.webp";

const images = [imageOne, imageTwo, imageThree, imageFour];

const PropertyImages = () => {
  return (
    <Card className="py-0 shadow-xs overflow-hidden">
      <CardContent className="px-0">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={`property-image-${index}`}>
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={image}
                    alt="Fastighetsbild"
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            type="button"
            className="hidden @lg:block absolute -translate-y-[18px] top-1/2 left-4 bg-nordic-snow text-primary-deep rounded-sm px-3 py-2.5 hover:bg-nordic-snow hover:text-primary-deep hover:opacity-90 cursor-pointer"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            type="button"
            className="hidden @lg:block absolute -translate-y-[18px] top-1/2 right-4 bg-nordic-snow text-primary-deep rounded-sm px-3 py-2.5 hover:bg-nordic-snow hover:text-primary-deep hover:opacity-90 cursor-pointer"
          >
            <ChevronRightIcon size={16} />
          </button>

          <div className="absolute top-3 right-3 @lg:top-4 @lg:right-4 bg-primary text-xs font-medium text-primary-foreground rounded-full px-3 py-1">
            Till salu
          </div>
          <div className="absolute bottom-3 left-3 @lg:bottom-4 @lg:left-4 bg-foreground/70 text-xs @lg:text-sm text-primary-foreground rounded-sm px-3 py-1">
            1 / {images.length}
          </div>
          <button
            type="button"
            className="absolute bottom-3 right-3 @lg:bottom-4 @lg:right-4 bg-nordic-snow/90 text-sm text-primary-deep rounded-sm px-3 py-2.5 hover:opacity-90 cursor-pointer"
          >
            <ScanIcon className="h-3 w-3 @lg:h-4 @lg:w-4" />
          </button>
        </Carousel>

        <div className="p-3 @lg:p-4">
          <Carousel>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem
                  key={`property-image-select-${index}`}
                  className="basis-1/3 @lg:basis-1/5 @3xl:basis-1/7 @4xl:basis-1/8"
                >
                  <div className="relative h-16 bg-gray-100 rounded-sm overflow-hidden">
                    <Image
                      src={image}
                      alt="Fastighetsbild"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyImages;
