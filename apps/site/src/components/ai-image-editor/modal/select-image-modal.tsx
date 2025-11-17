import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSelectImageStore } from "@/stores/use-select-image"
import { ImageIcon } from "lucide-react"
import Image, { StaticImageData } from "next/image"

type T_Prop = {
    propertyImages: {
        index: number
        src: StaticImageData
    }[]
}

const SelectImageModal = ({ propertyImages }: T_Prop) => {
    const { selectedImage, setSelectedImage } = useSelectImageStore((state) => state)

    return (
        <Dialog>
        <form>
            <DialogTrigger asChild>
            <Button size="sm" className="mt-4 @xl:mt-0 @5xl:hidden">Välj en bild</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-[90dvh] sm:h-[50dvh] lg:h-[90dvh] xl:h-[50dvh] flex flex-col px-0">
            <DialogHeader className="text-left px-6">
                <div className="flex items-center gap-2">
                    <ImageIcon className="text-primary" />
                    <DialogTitle>Fastighetsbilder</DialogTitle>
                </div>
                <DialogDescription>
                Klicka på en bild för att välja den för AI-redigering
                </DialogDescription>
            </DialogHeader>
            <div className="h-full overflow-y-auto px-6">
                {propertyImages.map((image) => (
                    <button 
                        key={`property-image-${image.index}`} 
                        className={`w-full relative overflow-hidden h-40 rounded-lg group border-2 cursor-pointer ${selectedImage === image.index && "border-primary"}`}
                        onClick={() => setSelectedImage(image.index)}
                    >
                        <Image src={image.src} alt={`Fastighetsbild ${image.index}`} fill sizes="100%" className="object-cover" />
                        <div className="absolute top-3 left-3 text-xs font-medium bg-nordic-snow text-primary px-3 py-1 rounded-full">Bild {image.index}</div>
                        {selectedImage === image.index && (
                            <div className="absolute top-3 right-3 text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                                Vald
                            </div>
                        )} 

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </button>
                ))}
            </div>
            </DialogContent>
        </form>
        </Dialog>
  )
}

export default SelectImageModal
