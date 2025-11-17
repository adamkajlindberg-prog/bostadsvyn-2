import {
  AlertCircle,
  BookOpen,
  Box,
  Brush,
  Car,
  Download,
  Heart,
  Home,
  ImagePlus,
  Layers,
  Loader2,
  Palette,
  RefreshCw,
  Scissors,
  Settings,
  Share2,
  Sofa,
  Sparkles,
  Sun,
  Target,
  TreePine,
  Video,
  Wand2,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AIImageMasking from "./AIImageMasking";

interface SavedProperty {
  id: string;
  title: string;
  images: string[];
}

interface AIImageEditorProps {
  propertyImages?: string[];
  onImagesUpdated?: (images: string[]) => void;
}

const editPresets = [
  {
    id: "wall-color",
    label: "Ändra väggfärg",
    icon: Palette,
    prompt: "Change the wall color to",
    editType: "generation" as const,
  },
  {
    id: "furniture",
    label: "Möblera om",
    icon: Sofa,
    prompt: "Rearrange the furniture in this room to",
    editType: "generation" as const,
  },
  {
    id: "lighting",
    label: "Ändra belysning",
    icon: Sun,
    prompt: "Change the lighting in this room to",
    editType: "generation" as const,
  },
  {
    id: "flooring",
    label: "Golv & mattor",
    icon: Home,
    prompt: "Change the flooring to",
    editType: "generation" as const,
  },
  {
    id: "garden",
    label: "Trädgård & utemiljö",
    icon: TreePine,
    prompt: "Add to the outdoor space",
    editType: "generation" as const,
  },
  {
    id: "garage",
    label: "Garage & carport",
    icon: Car,
    prompt: "Add or modify garage/parking to include",
    editType: "generation" as const,
  },
  {
    id: "remove-bg",
    label: "Ta bort bakgrund",
    icon: Scissors,
    prompt: "Remove background",
    editType: "object_removal" as const,
  },
  {
    id: "inpaint",
    label: "Precisionsredigering",
    icon: Target,
    prompt: "Precisely edit selected area:",
    editType: "inpainting" as const,
  },
  {
    id: "style-transfer",
    label: "Stilöverföring",
    icon: Layers,
    prompt: "Apply style",
    editType: "style_transfer" as const,
  },
  {
    id: "smart-mask",
    label: "AI-maskering",
    icon: Brush,
    prompt: "AI-assisted precise editing",
    editType: "inpainting" as const,
  },
  {
    id: "generate-video",
    label: "🎬 Videotour",
    icon: Video,
    prompt: "Create virtual tour video",
    editType: "video_generation" as const,
  },
  {
    id: "generate-3d",
    label: "🏠 3D-vy",
    icon: Box,
    prompt: "Generate 3D room visualization",
    editType: "3d_generation" as const,
  },
];

const roomPresets = [
  "modernt skandinaviskt kök",
  "lyxigt vardagsrum med öppen spis",
  "harmoniskt sovrum i naturliga toner",
  "funktionellt hemmakontor",
  "inbjudande matsal för familjen",
  "avkopplande badrum i spa-stil",
  "elegant hall med förvaring",
  "mysig läshörna vid fönstret",
];

const stylePresets = [
  { id: "scandinavian", label: "Skandinavisk" },
  { id: "modern", label: "Modern" },
  { id: "luxury", label: "Lyxig" },
  { id: "cozy", label: "Mysig" },
  { id: "professional", label: "Professionell" },
];

const qualityLevels = [
  {
    id: "standard",
    label: "Standard",
    description: "Snabb, grundläggande kvalitet",
  },
  {
    id: "high",
    label: "Hög",
    description: "Balans mellan kvalitet och hastighet",
  },
  {
    id: "ultra",
    label: "Ultra",
    description: "Högsta kvalitet, tar längre tid",
  },
];

export default function AIImageEditor({
  propertyImages = [],
  onImagesUpdated,
}: AIImageEditorProps) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [editPrompt, setEditPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [editType, setEditType] = useState<"preset" | "custom" | "room">(
    "preset",
  );
  const [selectedPreset, setSelectedPreset] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [selectedQuality, setSelectedQuality] = useState("high");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [beforeAfterMode, setBeforeAfterMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [strength, setStrength] = useState([0.8]);
  const [guidanceScale, setGuidanceScale] = useState([7.5]);
  const [_batchMode, setBatchMode] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showMasking, setShowMasking] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState<string>("");
  const [_collaborationMode, _setCollaborationMode] = useState(false);
  const [_generate3D, _setGenerate3D] = useState(false);
  const [_generateVideo, _setGenerateVideo] = useState(false);
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loadingSavedProperties, setLoadingSavedProperties] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const { toast } = useToast();

  // Fetch saved properties on component mount
  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user, fetchSavedProperties]);

  const fetchSavedProperties = async () => {
    if (!user) return;

    setLoadingSavedProperties(true);
    try {
      const { data: favorites, error } = await supabase
        .from("property_favorites")
        .select(`
          properties (
            id,
            title,
            images
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const propertiesWithImages =
        favorites
          ?.filter(
            (fav) => fav.properties?.images && fav.properties.images.length > 0,
          )
          .map((fav) => ({
            id: fav.properties.id,
            title: fav.properties.title,
            images: fav.properties.images,
          })) || [];

      setSavedProperties(propertiesWithImages);
    } catch (error: any) {
      console.error("Error fetching saved properties:", error);
      toast({
        title: "Kunde inte ladda sparade annonser",
        description: "Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setLoadingSavedProperties(false);
    }
  };

  // Background removal using in-browser AI
  const _handleBackgroundRemoval = async () => {
    if (!selectedImage) {
      toast({
        title: "Ingen bild vald",
        description: "Välj en bild först.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Convert data URL to File if needed
      let file: File;
      if (selectedImage.startsWith("data:")) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        file = new File([blob], "image.jpg", { type: blob.type });
      } else {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        file = new File([blob], "image.jpg", { type: blob.type });
      }

      const resultDataUrl = await removeBackgroundInBrowser(file);
      setGeneratedImages([resultDataUrl]);
      setBeforeAfterMode(true);

      toast({
        title: "Bakgrund borttagen!",
        description: "Bakgrunden har tagits bort med AI i webbläsaren.",
      });
    } catch (error: any) {
      console.error("Background removal error:", error);
      toast({
        title: "Bakgrundsborttagning misslyckades",
        description:
          error.message ||
          "Kunde inte ta bort bakgrund. Försök med AI-redigering istället.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Background removal function using in-browser AI
  const removeBackgroundInBrowser = async (
    imageFile: File,
  ): Promise<string> => {
    try {
      // Load the removeBackground function from a separate module
      const { removeBackground, loadImage } = await import(
        "@/lib/backgroundRemoval"
      );

      toast({
        title: "Bearbetar bakgrundsborttagning...",
        description: "Detta kan ta en stund första gången.",
      });

      const imageElement = await loadImage(imageFile);
      const resultBlob = await removeBackground(imageElement);

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(resultBlob);
      });
    } catch (error) {
      console.error("Background removal error:", error);
      throw new Error("Kunde inte ta bort bakgrund automatiskt");
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
    const property = savedProperties.find((p) => p.id === propertyId);
    if (property && property.images.length > 0) {
      setSelectedImage(property.images[0]);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const generateEditedImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Ingen bild vald",
        description: "Välj en bild att redigera först.",
        variant: "destructive",
      });
      return;
    }

    let prompt = "";
    let currentEditType = "generation";

    if (editType === "preset" && selectedPreset) {
      const preset = editPresets.find((p) => p.id === selectedPreset);
      prompt = `${preset?.prompt} ${editPrompt}`;
      currentEditType = preset?.editType || "generation";
    } else if (editType === "custom") {
      prompt = customPrompt;
    } else if (editType === "room") {
      prompt = `Interior design: ${selectedRoom}`;
    }

    if (!prompt.trim()) {
      toast({
        title: "Beskrivning saknas",
        description: "Beskriv vilken ändring du vill göra.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProcessingProgress(0);

    try {
      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 10, 90));
      }, 1000);

      const { data, error } = await supabase.functions.invoke(
        "ai-image-editor",
        {
          body: {
            imageUrl: selectedImage,
            prompt: prompt,
            editType: currentEditType,
            negativePrompt: negativePrompt.trim() || undefined,
            strength: strength[0],
            guidanceScale: guidanceScale[0],
            stylePreset: selectedStyle,
            qualityLevel: selectedQuality,
            maskUrl: maskDataUrl || undefined,
          },
        },
      );

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (error) throw error;

      if (data.success) {
        setGeneratedImages(data.images.map((img: any) => img.url));
        setBeforeAfterMode(true);
        toast({
          title: "AI-redigering klar!",
          description: `Använde ${data.metadata?.model || "AI"} för ${selectedQuality} kvalitet.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error("AI image editing error:", error);
      toast({
        title: "Fel vid AI-redigering",
        description:
          error.message || "Kunde inte redigera bilden. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProcessingProgress(0);
    }
  };

  const handleBatchProcess = async () => {
    if (propertyImages.length === 0) {
      toast({
        title: "Inga bilder att bearbeta",
        description: "Ladda upp bilder först.",
        variant: "destructive",
      });
      return;
    }

    setBatchMode(true);
    setIsGenerating(true);
    const results: string[] = [];

    for (let i = 0; i < propertyImages.length; i++) {
      try {
        setProcessingProgress((i / propertyImages.length) * 100);

        const { data } = await supabase.functions.invoke("ai-image-editor", {
          body: {
            imageUrl: propertyImages[i],
            prompt:
              customPrompt ||
              "Professional real estate photography enhancement",
            editType: "generation",
            stylePreset: selectedStyle,
            qualityLevel: selectedQuality,
          },
        });

        if (data.success && data.images[0]) {
          results.push(data.images[0].url);
        }
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
      }
    }

    setGeneratedImages(results);
    setBeforeAfterMode(true);
    setBatchMode(false);
    setIsGenerating(false);
    setProcessingProgress(0);

    toast({
      title: "Batch-bearbetning klar!",
      description: `Bearbetade ${results.length} av ${propertyImages.length} bilder.`,
    });
  };

  const handleBulkExport = async (format: string, _quality?: number) => {
    try {
      toast({
        title: "Förbereder export...",
        description: "Detta kan ta en stund för många bilder.",
      });

      if (format === "zip") {
        // For ZIP export, we'd need a ZIP library like JSZip
        const JSZip = await import("jszip");
        const zip = new JSZip.default();

        for (let i = 0; i < generatedImages.length; i++) {
          try {
            const response = await fetch(generatedImages[i]);
            const blob = await response.blob();
            zip.file(`ai-edited-${i + 1}.png`, blob);
          } catch (error) {
            console.error(`Failed to add image ${i + 1} to ZIP:`, error);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ai-edited-images.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Export individual files
        for (let i = 0; i < generatedImages.length; i++) {
          await handleDownload(
            generatedImages[i],
            `ai-edited-${i + 1}.${format}`,
          );
        }
      }

      toast({
        title: "Export klar!",
        description: `Alla bilder exporterade som ${format.toUpperCase()}.`,
      });
    } catch (_error) {
      toast({
        title: "Export misslyckades",
        description: "Kunde inte exportera bilderna.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!selectedImage) {
      toast({
        title: "Ingen bild vald",
        description: "Välj en bild först.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    const quickPrompts = {
      enhance:
        "Professional real estate photography enhancement, perfect lighting, sharp details, vibrant colors",
      "remove-bg": "Remove background completely, transparent background",
      lighting:
        "Perfect natural lighting, bright and welcoming atmosphere, professional real estate lighting",
      staging:
        "Professional home staging, modern furniture arrangement, clean and inviting interior design",
    };

    const quickEditTypes = {
      enhance: "generation",
      "remove-bg": "object_removal",
      lighting: "generation",
      staging: "generation",
    };

    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-image-editor",
        {
          body: {
            imageUrl: selectedImage,
            prompt: quickPrompts[action as keyof typeof quickPrompts],
            editType: quickEditTypes[action as keyof typeof quickEditTypes],
            stylePreset: "professional",
            qualityLevel: "high",
            strength: action === "enhance" ? 0.6 : 0.8,
          },
        },
      );

      if (error) throw error;

      if (data.success) {
        setGeneratedImages(data.images.map((img: any) => img.url));
        setBeforeAfterMode(true);
        toast({
          title: "Snabbåtgärd klar!",
          description: `${
            action === "enhance"
              ? "Förbättring"
              : action === "remove-bg"
                ? "Bakgrundsborttagning"
                : action === "lighting"
                  ? "Ljusförbättring"
                  : "Staging"
          } slutförd.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Snabbåtgärd misslyckades",
        description: error.message || "Kunde inte utföra åtgärden.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (
    imageUrl: string,
    filename: string,
    format?: string,
    quality?: number,
  ) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      let finalBlob = blob;

      // Convert format if needed
      if (format && format !== "png" && !imageUrl.startsWith("data:")) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        finalBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob!),
            `image/${format}`,
            format === "jpg" || format === "jpeg"
              ? (quality || 90) / 100
              : undefined,
          );
        });
      }

      const url = window.URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Nedladdning klar",
        description: `${filename} har laddats ner.`,
      });
    } catch (_error) {
      toast({
        title: "Nedladdning misslyckades",
        description: "Kunde inte ladda ner bilden.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI-redigerad fastighetsbild",
          text: "Kolla in den här AI-redigerade fastighetsbilden från Bostadsvyn.se",
          url: imageUrl,
        });
      } catch (_error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Länk kopierad",
        description: "Bildlänken har kopierats till urklipp.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Bildredigering
            <Badge className="bg-premium text-premium-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Använd AI för att visualisera förändringar i fastighetsbilder. Ändra
            färger, möbler, belysning och mer.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Saved Properties Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <Label>Välj från sparade annonser</Label>
            </div>

            {!user ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Du måste logga in för att använda
                    AI-bildredigeringsverktyget med dina sparade annonser.
                  </p>
                  <Button asChild>
                    <a href="/login">Logga in</a>
                  </Button>
                </CardContent>
              </Card>
            ) : loadingSavedProperties ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <p className="text-muted-foreground">
                  Laddar sparade annonser...
                </p>
              </div>
            ) : savedProperties.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Du har inga sparade annonser än. Spara annonser från
                    sökresultaten för att kunna redigera deras bilder med AI.
                  </p>
                  <Button asChild variant="outline">
                    <a href="/search">Gå till sök</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Välj annons</Label>
                  <Select
                    value={selectedProperty}
                    onValueChange={handlePropertySelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Välj en sparad annons..." />
                    </SelectTrigger>
                    <SelectContent>
                      {savedProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProperty && (
                  <div className="space-y-2">
                    <Label>Välj bild att redigera</Label>
                    <div className="flex gap-2 overflow-x-auto">
                      {savedProperties
                        .find((p) => p.id === selectedProperty)
                        ?.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Property image ${index + 1}`}
                            className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${
                              selectedImage === img
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                            onClick={() => handleImageSelect(img)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {selectedImage && (
                  <div className="mt-4">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="max-w-md mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Edit Options */}
          <Tabs
            value={editType}
            onValueChange={(value: any) => setEditType(value)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preset">Snabbval</TabsTrigger>
              <TabsTrigger value="room">Rumstyper</TabsTrigger>
              <TabsTrigger value="custom">Anpassad</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {editPresets.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <Button
                      key={preset.id}
                      variant={
                        selectedPreset === preset.id ? "default" : "outline"
                      }
                      className="h-auto p-4 flex-col gap-2"
                      onClick={() => setSelectedPreset(preset.id)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{preset.label}</span>
                    </Button>
                  );
                })}
              </div>

              {selectedPreset && (
                <div className="space-y-2">
                  <Label>Beskriv ändringen</Label>
                  <Input
                    placeholder="t.ex. ljusblå, minimalistisk stil, varm belysning..."
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="room" className="space-y-4">
              <div className="space-y-2">
                <Label>Välj rumstyp</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en rumstyp..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roomPresets.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-2">
                <Label>Beskriv din vision</Label>
                <Textarea
                  placeholder="Beskriv detaljerat hur du vill att rummet/området ska se ut..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Advanced Settings */}
          {showAdvanced && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  Avancerade inställningar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Styrka: {strength[0]}</Label>
                    <Slider
                      value={strength}
                      onValueChange={setStrength}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Hur mycket originalet ska ändras (0.1 = lite, 1.0 =
                      mycket)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Guidance: {guidanceScale[0]}</Label>
                    <Slider
                      value={guidanceScale}
                      onValueChange={setGuidanceScale}
                      max={20}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Hur noga AI:n följer instruktionen (1 = kreativ, 20 =
                      exakt)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Negativ prompt (vad som INTE ska finnas)</Label>
                  <Textarea
                    placeholder="blurry, low quality, messy, unrealistic..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stil</Label>
                    <Select
                      value={selectedStyle}
                      onValueChange={setSelectedStyle}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stylePresets.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Kvalitet</Label>
                    <Select
                      value={selectedQuality}
                      onValueChange={setSelectedQuality}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityLevels.map((quality) => (
                          <SelectItem key={quality.id} value={quality.id}>
                            <div className="flex flex-col">
                              <span>{quality.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {quality.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation Controls */}
          <div className="flex gap-2">
            <Button
              onClick={generateEditedImage}
              disabled={isGenerating || !selectedImage}
              className="flex-1 bg-primary hover:bg-primary-deep"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {processingProgress > 0 && `${processingProgress}% - `}
                  Genererar AI-redigering...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Skapa AI-redigering
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowMasking(true)}
              disabled={!selectedImage}
            >
              <Brush className="mr-2 h-4 w-4" />
              Maskera område
            </Button>

            {propertyImages.length > 1 && (
              <Button
                variant="outline"
                onClick={handleBatchProcess}
                disabled={isGenerating}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Batch ({propertyImages.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showMasking && selectedImage && (
        <Card className="shadow-card mt-4">
          <CardContent className="pt-6">
            <AIImageMasking
              imageUrl={selectedImage}
              onMaskCreated={(url) => {
                setMaskDataUrl(url);
                setShowMasking(false);
                toast({
                  title: "Mask klar",
                  description: "Masken används nu för precisionsredigering.",
                });
              }}
              onClose={() => setShowMasking(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Before/After Results with Advanced Comparison */}
      {beforeAfterMode && generatedImages.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Före och efter</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGeneratedImages([])}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <p className="text-muted-foreground">
              Jämför originalbilden med AI-genererade alternativ. Använd slidern
              för att jämföra.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparison">Jämförelse</TabsTrigger>
                <TabsTrigger value="grid">Rutnät</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison" className="space-y-4">
                {generatedImages.map((img, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-semibold">Alternativ {index + 1}</h3>
                    <BeforeAfterSlider
                      beforeImage={selectedImage}
                      afterImage={img}
                      onDownload={(type) =>
                        handleDownload(
                          type === "before" ? selectedImage : img,
                          `${type}-${index + 1}.jpg`,
                        )
                      }
                      onShare={(type) =>
                        handleShare(type === "before" ? selectedImage : img)
                      }
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="grid" className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Original</h4>
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                  {generatedImages.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">AI-genererad {index + 1}</h4>
                      <div className="relative group">
                        <img
                          src={img}
                          alt={`AI Generated ${index + 1}`}
                          className="w-full rounded-lg shadow-md"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              handleDownload(img, `ai-edited-${index + 1}.jpg`)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleShare(img)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <ExportPanel
                  images={[selectedImage, ...generatedImages]}
                  onExport={handleBulkExport}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Panel */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Snabbåtgärder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleQuickAction("enhance")}
              disabled={!selectedImage || isGenerating}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">Förbättra kvalitet</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleQuickAction("remove-bg")}
              disabled={!selectedImage || isGenerating}
            >
              <Scissors className="h-5 w-5" />
              <span className="text-xs">Ta bort bakgrund</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleQuickAction("lighting")}
              disabled={!selectedImage || isGenerating}
            >
              <Sun className="h-5 w-5" />
              <span className="text-xs">Förbättra ljus</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleQuickAction("staging")}
              disabled={!selectedImage || isGenerating}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Professionell staging</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Before/After Slider Component
interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  onDownload: (type: "before" | "after") => void;
  onShare: (type: "before" | "after") => void;
}

function BeforeAfterSlider({
  beforeImage,
  afterImage,
  onDownload,
  onShare,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState([50]);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Bildredigerare
            <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Världsklass
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Avancerad AI-bildredigering med OpenAI GPT-Image-1, in-browser AI
            och professionella verktyg
          </p>
        </CardHeader>
      </Card>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg shadow-lg group"
      >
        <div className="relative w-full aspect-video">
          {/* Before Image */}
          <img
            src={beforeImage}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* After Image with mask */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition[0]}% 0 0)` }}
          >
            <img
              src={afterImage}
              alt="After"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
            style={{ left: `${sliderPosition[0]}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="w-1 h-4 bg-gray-400 rounded"></div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Före
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Efter
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onDownload("before")}
              className="bg-black/50 hover:bg-black/70"
            >
              <Download className="h-4 w-4 mr-1" />
              Före
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onDownload("after")}
              className="bg-black/50 hover:bg-black/70"
            >
              <Download className="h-4 w-4 mr-1" />
              Efter
            </Button>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="px-4">
        <Slider
          value={sliderPosition}
          onValueChange={setSliderPosition}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Före</span>
          <span>Efter</span>
        </div>
      </div>
    </div>
  );
}

// Export Panel Component
interface ExportPanelProps {
  images: string[];
  onExport: (format: string, quality?: number) => void;
}

function ExportPanel({ images, onExport }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState([90]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (Bäst kvalitet)</SelectItem>
              <SelectItem value="jpg">JPEG (Mindre filstorlek)</SelectItem>
              <SelectItem value="webp">WebP (Modern, liten fil)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {exportFormat !== "png" && (
          <div className="space-y-2">
            <Label>Kvalitet: {exportQuality[0]}%</Label>
            <Slider
              value={exportQuality}
              onValueChange={setExportQuality}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onExport(exportFormat, exportQuality[0])}
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportera alla ({images.length} bilder)
        </Button>

        <Button variant="outline" onClick={() => onExport("zip")}>
          ZIP
        </Button>
      </div>
    </div>
  );
}
