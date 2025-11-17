import { Check, Play, Share2, Sparkles, Target } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyMarketingProps {
  property: {
    id: string;
    title: string;
    description?: string;
    images?: string[];
    price: number;
    address_street: string;
    address_city: string;
  };
}

const PropertyMarketing: React.FC<PropertyMarketingProps> = ({ property }) => {
  const { toast } = useToast();

  // Content type state
  const [contentType, setContentType] = useState<"video" | "post">("post");

  // Social media platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    youtube: false,
    linkedin: false,
    tiktok: false,
    instagram: false,
    facebook: false,
  });

  // Content state
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState(property.title);
  const [customDescription, setCustomDescription] = useState(
    property.description ||
      `${property.title} - ${property.address_street}, ${property.address_city}`,
  );
  const [videoDuration, setVideoDuration] = useState(15);
  const [slideTransitionTime, setSlideTransitionTime] = useState(3);

  // Target audience state
  const [targetRadius, setTargetRadius] = useState(50);
  const [ageRange, setAgeRange] = useState([25, 55]);

  // Loading states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const togglePlatform = (platform: keyof typeof selectedPlatforms) => {
    setSelectedPlatforms((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  const toggleImage = (imageUrl: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((img) => img !== imageUrl);
      } else {
        return [...prev, imageUrl];
      }
    });
  };

  const handlePublish = async () => {
    // Validation
    if (!customTitle.trim() || !customDescription.trim()) {
      toast({
        title: "Obligatoriska fält saknas",
        description: "Vänligen fyll i titel och beskrivning",
        variant: "destructive",
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Bilder saknas",
        description: "Vänligen välj minst en bild från objektet",
        variant: "destructive",
      });
      return;
    }

    const hasSelectedPlatform = Object.values(selectedPlatforms).some((v) => v);
    if (!hasSelectedPlatform) {
      toast({
        title: "Ingen plattform vald",
        description: "Vänligen välj minst en social media-plattform",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);

      // Verify content with AI
      const { data: verificationData, error: verificationError } =
        await supabase.functions.invoke("verify-marketing-content", {
          body: {
            title: customTitle,
            description: customDescription,
            images: selectedImages,
            contentType,
          },
        });

      if (verificationError) throw verificationError;

      if (!verificationData.approved) {
        toast({
          title: "Innehåll avvisat",
          description:
            verificationData.reason ||
            "Innehållet uppfyller inte våra riktlinjer",
          variant: "destructive",
        });
        return;
      }

      setIsVerifying(false);
      setIsPublishing(true);

      // Publish to social media
      const { data: publishData, error: publishError } =
        await supabase.functions.invoke("publish-social-media", {
          body: {
            title: customTitle,
            description: customDescription,
            images: selectedImages,
            contentType,
            platforms: Object.keys(selectedPlatforms).filter(
              (k) => selectedPlatforms[k as keyof typeof selectedPlatforms],
            ),
            videoDuration: contentType === "video" ? videoDuration : undefined,
            slideTransitionTime:
              contentType === "video" ? slideTransitionTime : undefined,
            targetRadius,
            ageRange,
            propertyId: property.id,
          },
        });

      if (publishError) throw publishError;

      toast({
        title: "Marknadsföring publicerad!",
        description: "Ditt innehåll har publicerats till valda plattformar",
      });

      // Reset selections
      setSelectedPlatforms({
        youtube: false,
        linkedin: false,
        tiktok: false,
        instagram: false,
        facebook: false,
      });
    } catch (error: any) {
      console.error("Error publishing:", error);
      toast({
        title: "Ett fel uppstod",
        description: error.message || "Kunde inte publicera marknadsföringen",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setIsPublishing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <CardTitle>Direktmarknadsföring</CardTitle>
        </div>
        <CardDescription>
          Marknadsför detta objekt via våra sociala medier med AI-verifierad
          kvalitet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Type Selection */}
        <div className="space-y-2">
          <Label>Innehållstyp</Label>
          <RadioGroup
            value={contentType}
            onValueChange={(v) => setContentType(v as "video" | "post")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="post" id="post-type" />
              <Label htmlFor="post-type" className="cursor-pointer">
                Enskilt inlägg
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="video-type" />
              <Label htmlFor="video-type" className="cursor-pointer">
                Marknadsföringsvideo (Slideshow)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Social Media Platforms */}
        <div className="space-y-2">
          <Label>Sociala medier-plattformar</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "youtube", label: "YouTube", videoOnly: true },
              { key: "linkedin", label: "LinkedIn", videoOnly: false },
              { key: "tiktok", label: "TikTok", videoOnly: true },
              { key: "instagram", label: "Instagram", videoOnly: false },
              { key: "facebook", label: "Facebook", videoOnly: false },
            ].map(({ key, label, videoOnly }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={
                    selectedPlatforms[key as keyof typeof selectedPlatforms]
                  }
                  onCheckedChange={() =>
                    togglePlatform(key as keyof typeof selectedPlatforms)
                  }
                  disabled={videoOnly && contentType !== "video"}
                />
                <Label
                  htmlFor={key}
                  className={`cursor-pointer ${videoOnly && contentType !== "video" ? "text-muted-foreground" : ""}`}
                >
                  {label}
                  {videoOnly && contentType !== "video" && " (endast video)"}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Selection */}
        <div className="space-y-2">
          <Label>
            Välj bilder från objektet ({selectedImages.length} valda)
          </Label>
          {property.images && property.images.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {property.images.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImages.includes(imageUrl)
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => toggleImage(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Bild ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  {selectedImages.includes(imageUrl) && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  {contentType === "video" &&
                    selectedImages.includes(imageUrl) && (
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {selectedImages.indexOf(imageUrl) + 1}
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Inga bilder tillgängliga för detta objekt
            </p>
          )}
        </div>

        {/* Video Settings (only for video type) */}
        {contentType === "video" && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Play className="h-4 w-4" />
              <span>Videoinställningar</span>
            </div>

            <div>
              <Label>Total videolängd: {videoDuration} sekunder</Label>
              <Slider
                value={[videoDuration]}
                onValueChange={([v]) => setVideoDuration(v)}
                min={10}
                max={60}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Tid per bild: {slideTransitionTime} sekunder</Label>
              <Slider
                value={[slideTransitionTime]}
                onValueChange={([v]) => setSlideTransitionTime(v)}
                min={2}
                max={8}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Totalt {Math.ceil(videoDuration / slideTransitionTime)} bilder
                visas
              </p>
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="custom-title">Titel</Label>
            <Input
              id="custom-title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="T.ex. Drömvillan i Stockholm"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="custom-description">Beskrivning</Label>
            <Textarea
              id="custom-description"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Beskriv objektet och dess fördelar..."
              rows={3}
              maxLength={1000}
            />
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4" />
            <span>Målgrupp</span>
          </div>

          <div>
            <Label>Geografisk räckvidd: {targetRadius} km</Label>
            <Slider
              value={[targetRadius]}
              onValueChange={([v]) => setTargetRadius(v)}
              min={10}
              max={200}
              step={10}
              className="mt-2"
            />
          </div>

          <div>
            <Label>
              Åldersgrupp: {ageRange[0]}-{ageRange[1]} år
            </Label>
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              min={18}
              max={75}
              step={5}
              className="mt-2"
            />
          </div>
        </div>

        {/* AI Verification Info */}
        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">AI-verifiering</p>
            <p className="text-muted-foreground">
              Allt innehåll verifieras automatiskt av vår AI innan publicering.
            </p>
          </div>
        </div>

        {/* Publish Button */}
        <Button
          onClick={handlePublish}
          disabled={isVerifying || isPublishing || selectedImages.length === 0}
          className="w-full h-12 text-base"
          size="lg"
        >
          {isVerifying && (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Verifierar innehåll...
            </>
          )}
          {isPublishing && !isVerifying && (
            <>
              <Share2 className="mr-2 h-5 w-5 animate-pulse" />
              Publicerar...
            </>
          )}
          {!isVerifying && !isPublishing && (
            <>
              <Check className="mr-2 h-5 w-5" />
              Marknadsför
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyMarketing;
