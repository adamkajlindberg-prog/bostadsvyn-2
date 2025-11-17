import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Map,
  Maximize,
  Wand2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PropertyImage {
  url: string;
  alt?: string;
  description?: string;
  isAIEdited?: boolean;
}
interface PropertyImageGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
  onShowFloorPlan?: () => void;
  onShowPropertyMap?: () => void;
  hasFloorPlan?: boolean;
  hasPropertyMap?: boolean;
}
export default function PropertyImageGallery({
  images,
  propertyTitle,
  onShowFloorPlan,
  onShowPropertyMap,
  hasFloorPlan = false,
  hasPropertyMap = false,
}: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [thumbnailScrollIndex, setThumbnailScrollIndex] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showImageModal) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      } else if (e.key === "Escape") {
        setShowImageModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showImageModal, nextImage, prevImage]);

  // Reset zoom when changing images
  useEffect(() => {
    setZoomLevel(1);
  }, []);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };
  const scrollThumbnailsLeft = () => {
    setThumbnailScrollIndex((prev) => Math.max(0, prev - 1));
  };
  const scrollThumbnailsRight = () => {
    setThumbnailScrollIndex((prev) => Math.min(images.length - 5, prev + 1));
  };
  const visibleThumbnails = images.slice(
    thumbnailScrollIndex,
    thumbnailScrollIndex + 5,
  );
  const currentImage = images[currentImageIndex];
  if (images.length === 0) {
    return (
      <Card className="aspect-video bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Inga bilder tillgängliga</p>
      </Card>
    );
  }
  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-muted">
          <img
            src={currentImage.url}
            alt={
              currentImage.alt ||
              `${propertyTitle} - Bild ${currentImageIndex + 1}`
            }
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowImageModal(true)}
          />

          {/* AI-Edited Badge */}
          {currentImage.isAIEdited && (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-accent/90 text-accent-foreground backdrop-blur-sm flex items-center gap-1"
            >
              <Wand2 className="h-3 w-3" />
              Virtuellt stylad
            </Badge>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                onClick={prevImage}
                aria-label="Föregående bild"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={nextImage}
                aria-label="Nästa bild"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4"
            onClick={() => setShowImageModal(true)}
            aria-label="Öppna i fullskärm"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4 bg-background border-t">
            <div className="flex items-center gap-3">
              {thumbnailScrollIndex > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollThumbnailsLeft}
                  aria-label="Scrolla vänster"
                  className="shrink-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex gap-3 flex-1 overflow-hidden">
                {visibleThumbnails.map((image, idx) => {
                  const actualIndex = thumbnailScrollIndex + idx;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => setCurrentImageIndex(actualIndex)}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-lg shrink-0",
                        currentImageIndex === actualIndex
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border",
                      )}
                      aria-label={`Visa bild ${actualIndex + 1}`}
                    >
                      <img
                        src={image.url}
                        alt={`Tumnagel ${actualIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.isAIEdited && (
                        <div className="absolute top-1.5 right-1.5 bg-accent/90 rounded-full p-1 backdrop-blur-sm">
                          <Wand2 className="h-3 w-3 text-accent-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {thumbnailScrollIndex + 5 < images.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollThumbnailsRight}
                  aria-label="Scrolla höger"
                  className="shrink-0"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Fullscreen Modal with Zoom */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-20 text-white hover:bg-white/20"
              onClick={() => setShowImageModal(false)}
              aria-label="Stäng fullskärm"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* AI-Edited Badge in Fullscreen */}
            {currentImage.isAIEdited && (
              <Badge
                variant="secondary"
                className="absolute top-4 left-4 z-20 bg-accent/90 text-accent-foreground backdrop-blur-sm flex items-center gap-1"
              >
                <Wand2 className="h-3 w-3" />
                Virtuellt stylad
              </Badge>
            )}

            {/* Zoom Controls */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-black/70 rounded-lg p-2 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                aria-label="Zooma ut"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm px-2 flex items-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                aria-label="Zooma in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Floor Plan and Property Map Buttons */}
            <div className="absolute top-4 right-20 z-20 flex gap-2">
              {hasFloorPlan && onShowFloorPlan && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 bg-black/70 backdrop-blur-sm"
                  onClick={onShowFloorPlan}
                  aria-label="Visa planritning"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  <span className="text-sm">Planritning</span>
                </Button>
              )}
              {hasPropertyMap && onShowPropertyMap && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 bg-black/70 backdrop-blur-sm"
                  onClick={onShowPropertyMap}
                  aria-label="Visa fastighetskarta"
                >
                  <Map className="h-4 w-4 mr-2" />
                  <span className="text-sm">Fastighetskarta</span>
                </Button>
              )}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={prevImage}
                  aria-label="Föregående bild (pil vänster)"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20"
                  onClick={nextImage}
                  aria-label="Nästa bild (pil höger)"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image with Zoom */}
            <img
              src={currentImage.url}
              alt={
                currentImage.alt ||
                `${propertyTitle} - Bild ${currentImageIndex + 1}`
              }
              className="max-w-none transition-transform duration-200"
              style={{
                width: `${95 * zoomLevel}vw`,
                height: `${90 * zoomLevel}vh`,
                objectFit: "contain",
              }}
            />

            {/* Thumbnail Navigation in Fullscreen */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4">
                <div className="bg-black/70 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3 justify-center">
                    {thumbnailScrollIndex > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollThumbnailsLeft}
                        aria-label="Scrolla vänster"
                        className="shrink-0 text-white hover:bg-white/20"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    )}

                    <div className="flex gap-3 overflow-hidden">
                      {visibleThumbnails.map((image, idx) => {
                        const actualIndex = thumbnailScrollIndex + idx;
                        return (
                          <button
                            key={actualIndex}
                            onClick={() => setCurrentImageIndex(actualIndex)}
                            className={cn(
                              "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-lg shrink-0",
                              currentImageIndex === actualIndex
                                ? "border-white ring-2 ring-white/50"
                                : "border-white/30",
                            )}
                            aria-label={`Visa bild ${actualIndex + 1}`}
                          >
                            <img
                              src={image.url}
                              alt={`Tumnagel ${actualIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {image.isAIEdited && (
                              <div className="absolute top-1 right-1 bg-accent/90 rounded-full p-0.5 backdrop-blur-sm">
                                <Wand2 className="h-2.5 w-2.5 text-accent-foreground" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {thumbnailScrollIndex + 5 < images.length && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={scrollThumbnailsRight}
                        aria-label="Scrolla höger"
                        className="shrink-0 text-white hover:bg-white/20"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {/* Image Counter */}
                  <div className="text-center text-white text-sm font-medium mt-2">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              </div>
            )}

            {/* Keyboard Hints */}
            <div className="absolute bottom-4 right-4 z-20 text-white/60 text-xs bg-black/50 px-3 py-2 rounded backdrop-blur-sm">
              Använd piltangenterna för att navigera
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
