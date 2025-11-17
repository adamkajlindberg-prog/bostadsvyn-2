"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BedSingleIcon, ChevronLeftIcon, ChevronRightIcon, CrownIcon, EyeIcon, HeartIcon, MapPinIcon, SquareIcon } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import imageOne from "@/images/property-image-1.webp"
import imageTwo from "@/images/property-image-2.webp"
import imageThree from "@/images/property-image-3.webp"
import imageFour from "@/images/property-image-4.webp"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type T_Props = {
    image: string | StaticImageData
    name: string
    address: string
    price: number
    areaSize: number
    rooms: number
}

const images = [imageOne, imageTwo, imageThree, imageFour]

const PropertyCard = ({image, name, address, price, areaSize, rooms}: T_Props) => {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState<number>(0);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <Card className="bg-card py-0 overflow-hidden border-2 border-primary/30 shadow-sm hover:shadow-lg bg-gradient-to-br from-background to-primary/5">
            <CardContent className="px-0 h-full group">
                <div className="flex flex-col @5xl:flex-row">
                    <div className="bg-primary-light/10 @5xl:w-[70%] overflow-hidden">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            setApi={setApi}
                            className="group"
                        >
                            <CarouselContent>
                                {images.map((image, index) => (
                                    <CarouselItem key={`image-${index}`} className="pl-0">
                                        <div className="relative h-40 @lg:h-72 @4xl:h-[450px] @6xl:h-[440px] @8xl:h-[460px]">
                                            <Image src={image} alt="Fastighetsbild" fill className="object-cover" />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <div className="absolute top-3 left-3 @lg:top-5 @lg:left-5 py-1 px-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 backdrop-blur-sm border-2 border-white/30 text-xs text-primary-foreground font-semibold inline-flex items-center gap-x-1.5">
                                <CrownIcon className="h-3.5 w-3.5" />
                                Exklusiv
                            </div>

                            <button className="absolute bottom-3 right-3 @lg:bottom-5 @lg:right-5 bg-neutral-100 p-3 rounded-full shadow text-gray-600 cursor-pointer hover:bg-neutral-200 hover:text-gray-500">
                                <HeartIcon className="h-4 w-4 @lg:h-5 @lg:w-5" />
                            </button>

                            <div className="absolute -translate-y-[18px] top-1/2 hidden @lg:justify-between @lg:w-full px-5 @lg:group-hover:flex">
                                <button onClick={() => api?.scrollPrev()} className="bg-black/50 text-primary-foreground rounded-full p-3 hover:bg-black/60 cursor-pointer">
                                    <ChevronLeftIcon size={18} />
                                </button>
                                <button onClick={() => api?.scrollNext()} className="bg-black/50 text-primary-foreground rounded-full p-3 hover:bg-black/60 cursor-pointer">
                                    <ChevronRightIcon size={18} />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 absolute bottom-4 w-full">
                                {Array.from({ length: count }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => api?.scrollTo(index)}
                                    className={cn("h-2 w-2 rounded-full border-2", {
                                    "border-primary": current === index + 1,
                                    })}
                                />
                                ))}
                            </div>
                        </Carousel>
                    </div>

                    <div className="p-5 @5xl:w-[30%] flex flex-col">
                        <h3 className="text-lg @lg:text-xl font-semibold mb-3 break-words">{ name }</h3>
                        
                        <div className="flex items-start gap-1.5 mb-5">
                            <MapPinIcon size={18} className="text-primary" />
                            <div className="text-sm text-muted-foreground">
                                <div className="text-sm font-medium">{ address }</div>
                            </div>
                        </div>

                        <div className="text-2xl text-primary font-bold mb-7">{ price.toLocaleString("sv-SE") } kr</div>

                        <div className="flex flex-wrap gap-x-10 gap-y-3 pb-5 mb-5 border-b">
                            <div>
                                <div className="text-xs text-muted-foreground">Storlek</div>
                                <div className="text-sm font-semibold">285 m<sup>2</sup></div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Bostadstyp</div>
                                <div className="text-sm font-semibold">Villa</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Rum</div>
                                <div className="text-sm font-semibold">8 rum</div>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="bg-gray-200 h-10 w-10 rounded-full" />
                                <div className="text-sm font-semibold">Anna Andersson</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PropertyCard