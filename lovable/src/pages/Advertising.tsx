import {
  Check,
  Home,
  Image as ImageIcon,
  Play,
  Share2,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  price: number;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  property_type: string;
}

const Advertising = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  // Property selection
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [loadingProperties, setLoadingProperties] = useState(true);

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoDuration, setVideoDuration] = useState(15);
  const [slideTransitionTime, setSlideTransitionTime] = useState(3);

  // Target audience state
  const [targetRadius, setTargetRadius] = useState(50);
  const [ageRange, setAgeRange] = useState([25, 55]);

  // Loading states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch user's properties
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("user_id", user.id)
          .in("status", ["FOR_SALE", "FOR_RENT", "COMING_SOON"]);

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Kunde inte hämta objekt",
          description: "Ett fel uppstod vid hämtning av dina objekt",
          variant: "destructive",
        });
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, [user, toast]);

  // Update title and description when property is selected
  useEffect(() => {
    if (selectedProperty) {
      setTitle(selectedProperty.title);
      setDescription(
        selectedProperty.description ||
          `${selectedProperty.title} - ${selectedProperty.address_street}, ${selectedProperty.address_city}`,
      );
      setSelectedImages([]);
    }
  }, [selectedProperty]);

  if (loading || loadingProperties) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Laddar...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
    if (!selectedProperty) {
      toast({
        title: "Inget objekt valt",
        description: "Vänligen välj ett objekt att marknadsföra",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
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
            title,
            description,
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
            title,
            description,
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
            propertyId: selectedProperty.id,
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
      setSelectedImages([]);
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Share2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Direktmarknadsföring
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Marknadsför ditt objekt direkt via våra sociala medier. Skapa
            engagerande innehåll som når rätt målgrupp med AI-verifierad
            kvalitet.
          </p>
        </div>

        {/* Info about broker system integration */}
        <Card className="mb-8 bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 rounded-full p-3">
                <Home className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Integration med mäklarsystem
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Från och med nu hanteras marknadsföring automatiskt genom
                  integration med ditt mäklarsystem. Välj Bostadsvyn i ditt
                  system för att publicera annonser. Manuell publicering är inte
                  längre tillgänglig.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 opacity-40 pointer-events-none">
          {/* Property Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Välj objekt
              </CardTitle>
              <CardDescription>
                Välj vilket objekt du vill marknadsföra
              </CardDescription>
            </CardHeader>
            <CardContent>
              {properties.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Du har inga aktiva objekt att marknadsföra. Lägg till ett
                  objekt först.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedProperty?.id === property.id
                          ? "border-primary ring-2 ring-primary ring-offset-2 bg-primary/5"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => setSelectedProperty(property)}
                    >
                      <div className="flex gap-3">
                        {property.images && property.images.length > 0 && (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {property.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {property.address_city}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {property.price.toLocaleString("sv-SE")} kr
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedProperty && (
            <>
              {/* Content Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Välj innehållstyp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={contentType}
                    onValueChange={(v) => setContentType(v as "video" | "post")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="post" id="post" />
                      <Label htmlFor="post" className="cursor-pointer">
                        Enskilt inlägg
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="cursor-pointer">
                        Marknadsföringsvideo (Slideshow)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Social Media Platforms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Välj plattformar
                  </CardTitle>
                  <CardDescription>
                    Välj var du vill publicera ditt innehåll
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: "youtube", label: "YouTube", videoOnly: true },
                      { key: "linkedin", label: "LinkedIn", videoOnly: false },
                      { key: "tiktok", label: "TikTok", videoOnly: true },
                      {
                        key: "instagram",
                        label: "Instagram",
                        videoOnly: false,
                      },
                      { key: "facebook", label: "Facebook", videoOnly: false },
                    ].map(({ key, label, videoOnly }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={
                            selectedPlatforms[
                              key as keyof typeof selectedPlatforms
                            ]
                          }
                          onCheckedChange={() =>
                            togglePlatform(
                              key as keyof typeof selectedPlatforms,
                            )
                          }
                          disabled={videoOnly && contentType !== "video"}
                        />
                        <Label
                          htmlFor={key}
                          className={`cursor-pointer ${videoOnly && contentType !== "video" ? "text-muted-foreground" : ""}`}
                        >
                          {label}
                          {videoOnly &&
                            contentType !== "video" &&
                            " (endast video)"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Image Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Välj bilder
                  </CardTitle>
                  <CardDescription>
                    Välj bilder från objektet ({selectedImages.length} valda)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProperty.images &&
                  selectedProperty.images.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {selectedProperty.images.map((imageUrl, index) => (
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
                      Detta objekt har inga bilder. Lägg till bilder till
                      objektet först.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Video Settings (only for video type) */}
              {contentType === "video" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Videoinställningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                      <Label>
                        Tid per bild: {slideTransitionTime} sekunder
                      </Label>
                      <Slider
                        value={[slideTransitionTime]}
                        onValueChange={([v]) => setSlideTransitionTime(v)}
                        min={2}
                        max={8}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Totalt {Math.ceil(videoDuration / slideTransitionTime)}{" "}
                        bilder visas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Title & Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Anpassa innehåll</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titel *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="T.ex. Drömvillan i Stockholm"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Beskrivning *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Beskriv objektet och dess fördelar..."
                      rows={3}
                      maxLength={1000}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Målgrupp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Marketing Strategy Info */}
              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5 text-accent-foreground" />
                    Din marknadsföringsstrategi
                  </CardTitle>
                  <CardDescription>
                    Så här når vi din målgrupp baserat på dina val
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Target Audience Summary */}
                  <div className="bg-background/50 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">Målgrupp</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        • Ålder: {ageRange[0]}-{ageRange[1]} år
                      </li>
                      <li>
                        • Geografisk räckvidd: {targetRadius} km från{" "}
                        {selectedProperty.address_city}
                      </li>
                      <li>
                        • Typ:{" "}
                        {selectedProperty.property_type === "APARTMENT"
                          ? "Lägenhetssökande"
                          : selectedProperty.property_type === "HOUSE"
                            ? "Villaköpare"
                            : "Fastighetssökande"}
                      </li>
                    </ul>
                  </div>

                  {/* Platform-specific strategies */}
                  {Object.values(selectedPlatforms).some((v) => v) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">
                        Plattformsspecifik marknadsföring
                      </h4>

                      {selectedPlatforms.facebook && (
                        <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">Facebook</h5>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Estimerad räckvidd: 3,000-8,000
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                              Målgruppsinriktning:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>
                                • Geografisk: {targetRadius} km från{" "}
                                {selectedProperty.address_city}
                              </li>
                              <li>
                                • Ålder: {ageRange[0]}-{ageRange[1]} år
                              </li>
                              <li>
                                • Intresse: Fastigheter, bostadsköp,
                                investeringar
                              </li>
                              <li>
                                • Beteende: Aktivt söker bostad eller planerar
                                flytt
                              </li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Annonsformat:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>
                                • Bildkarusell med {selectedImages.length}{" "}
                                bilder
                              </li>
                              <li>• Nyhetsfeed och Stories</li>
                              <li>• Desktop och mobil optimering</li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Förväntade resultat (7 dagar):
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Visningar: 3,000-8,000</li>
                              <li>• Klick: 150-400</li>
                              <li>
                                • Engagemang: 80-200 (likes, delningar,
                                kommentarer)
                              </li>
                              <li>• Direktförfrågningar: 10-25</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPlatforms.instagram && (
                        <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">Instagram</h5>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Estimerad räckvidd: 2,500-7,000
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                              Målgruppsinriktning:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>
                                • Geografisk: {targetRadius} km från{" "}
                                {selectedProperty.address_city}
                              </li>
                              <li>
                                • Ålder: {ageRange[0]}-{ageRange[1]} år (primärt
                                25-45)
                              </li>
                              <li>
                                • Hashtags: #bostad
                                {selectedProperty.address_city.toLowerCase()}{" "}
                                #nyahem
                              </li>
                              <li>
                                • Utforska-sidan för lokala fastighetssökande
                              </li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Annonsformat:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Feed-inlägg med karusell</li>
                              <li>• Stories med swipe-up länk</li>
                              <li>• Reels (om video)</li>
                              <li>• Professionella fastighetsfoton</li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Förväntade resultat (7 dagar):
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Visningar: 2,500-7,000</li>
                              <li>• Profilbesök: 200-500</li>
                              <li>• Sparade inlägg: 50-120</li>
                              <li>• DM-förfrågningar: 8-20</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPlatforms.linkedin && (
                        <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">LinkedIn</h5>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Estimerad räckvidd: 1,500-4,000
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                              Målgruppsinriktning:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>
                                • Geografisk: {targetRadius} km från{" "}
                                {selectedProperty.address_city}
                              </li>
                              <li>
                                • Jobbroll: Chefer, Företagare, Investerare
                              </li>
                              <li>• Inkomst: Medel-Hög</li>
                              <li>
                                • Yrkesgrupper: Finans, IT, Management,
                                Consulting
                              </li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Annonsformat:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Sponsored content i nyhetsflödet</li>
                              <li>• Professionellt bildformat</li>
                              <li>• B2B-fokuserad beskrivning</li>
                              <li>• Investeringspotential framhävs</li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Förväntade resultat (7 dagar):
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Visningar: 1,500-4,000</li>
                              <li>• Klick: 100-250</li>
                              <li>• Professionella förfrågningar: 5-15</li>
                              <li>• Högkvalitativa leads</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPlatforms.youtube && contentType === "video" && (
                        <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">YouTube</h5>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Estimerad räckvidd: 2,000-6,000
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                              Målgruppsinriktning:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>
                                • Geografisk: {targetRadius} km via Google Ads
                              </li>
                              <li>
                                • Ålder: {ageRange[0]}-{ageRange[1]} år
                              </li>
                              <li>
                                • Sökord: "bostad{" "}
                                {selectedProperty.address_city}", "villa till
                                salu"
                              </li>
                              <li>
                                • YouTube-kanaler: Fastighetsvisningar,
                                hemdesign
                              </li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Annonsformat:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Pre-roll annonser ({videoDuration}s)</li>
                              <li>
                                • Professionellt slideshow med{" "}
                                {selectedImages.length} bilder
                              </li>
                              <li>• Musik och övergångar inkluderat</li>
                              <li>• Möjlighet att hoppa över efter 5s</li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Förväntade resultat (7 dagar):
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Visningar: 2,000-6,000</li>
                              <li>
                                • Genomsnittlig visningstid:{" "}
                                {Math.round(videoDuration * 0.7)}s
                              </li>
                              <li>• Klick till webbsida: 120-300</li>
                              <li>• CTR (Click-Through Rate): 6-8%</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {selectedPlatforms.tiktok && contentType === "video" && (
                        <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">TikTok</h5>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Estimerad räckvidd: 5,000-15,000
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                              Målgruppsinriktning:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>
                                • Geografisk: {targetRadius} km från{" "}
                                {selectedProperty.address_city}
                              </li>
                              <li>
                                • Ålder: {ageRange[0]}-{ageRange[1]} år (primärt
                                22-35)
                              </li>
                              <li>
                                • Intresse: Heminredning, fastigheter, lifestyle
                              </li>
                              <li>• For You Page algoritm-optimering</li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Annonsformat:
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• In-Feed annonser ({videoDuration}s)</li>
                              <li>• Vertikalt format 9:16</li>
                              <li>• Snabba övergångar mellan bilder</li>
                              <li>• Trendig musik och effekter</li>
                            </ul>
                            <p className="font-medium text-foreground mt-2">
                              Förväntade resultat (7 dagar):
                            </p>
                            <ul className="space-y-0.5 ml-3">
                              <li>• Visningar: 5,000-15,000</li>
                              <li>• Engagement rate: 8-15% (hög)</li>
                              <li>• Delningar: 100-300</li>
                              <li>• Kommentarer: 50-150</li>
                              <li>
                                • Viral potential: Möjlig exponentiell tillväxt
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Overall Performance Summary */}
                  {Object.values(selectedPlatforms).some((v) => v) && (
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
                      <h5 className="font-semibold text-sm text-primary">
                        Sammanfattande prognos (7 dagar)
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-background/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">
                            Total räckvidd
                          </p>
                          <p className="font-bold text-lg text-foreground">
                            {Object.keys(selectedPlatforms)
                              .filter(
                                (k) =>
                                  selectedPlatforms[
                                    k as keyof typeof selectedPlatforms
                                  ],
                              )
                              .map((p) => {
                                if (p === "facebook") return 5500;
                                if (p === "instagram") return 4750;
                                if (p === "linkedin") return 2750;
                                if (p === "youtube" && contentType === "video")
                                  return 4000;
                                if (p === "tiktok" && contentType === "video")
                                  return 10000;
                                return 0;
                              })
                              .reduce((a, b) => a + b, 0)
                              .toLocaleString("sv-SE")}
                          </p>
                        </div>
                        <div className="bg-background/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">
                            Förväntade leads
                          </p>
                          <p className="font-bold text-lg text-foreground">
                            {Object.keys(selectedPlatforms)
                              .filter(
                                (k) =>
                                  selectedPlatforms[
                                    k as keyof typeof selectedPlatforms
                                  ],
                              )
                              .map((p) => {
                                if (p === "facebook") return 17;
                                if (p === "instagram") return 14;
                                if (p === "linkedin") return 10;
                                if (p === "youtube" && contentType === "video")
                                  return 8;
                                if (p === "tiktok" && contentType === "video")
                                  return 12;
                                return 0;
                              })
                              .reduce((a, b) => a + b, 0)}
                          </p>
                        </div>
                        <div className="bg-background/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">
                            Engagemang
                          </p>
                          <p className="font-bold text-lg text-foreground">
                            {Object.keys(selectedPlatforms)
                              .filter(
                                (k) =>
                                  selectedPlatforms[
                                    k as keyof typeof selectedPlatforms
                                  ],
                              )
                              .map((p) => {
                                if (p === "facebook") return 140;
                                if (p === "instagram") return 85;
                                if (p === "linkedin") return 40;
                                if (p === "youtube" && contentType === "video")
                                  return 60;
                                if (p === "tiktok" && contentType === "video")
                                  return 200;
                                return 0;
                              })
                              .reduce((a, b) => a + b, 0)}
                          </p>
                        </div>
                        <div className="bg-background/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">
                            Klick till objekt
                          </p>
                          <p className="font-bold text-lg text-foreground">
                            {Object.keys(selectedPlatforms)
                              .filter(
                                (k) =>
                                  selectedPlatforms[
                                    k as keyof typeof selectedPlatforms
                                  ],
                              )
                              .map((p) => {
                                if (p === "facebook") return 275;
                                if (p === "instagram") return 160;
                                if (p === "linkedin") return 175;
                                if (p === "youtube" && contentType === "video")
                                  return 210;
                                if (p === "tiktok" && contentType === "video")
                                  return 150;
                                return 0;
                              })
                              .reduce((a, b) => a + b, 0)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Baserat på din målgrupp ({ageRange[0]}-{ageRange[1]} år,{" "}
                        {targetRadius} km radie) och valda plattformar. Resultat
                        kan variera beroende på fastighetens prisläge och
                        marknadssituation.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Verification Info */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">AI-verifiering</h4>
                      <p className="text-sm text-muted-foreground">
                        Allt innehåll verifieras automatiskt av vår AI för att
                        säkerställa bildkvalitet och att texten följer våra
                        riktlinjer innan publicering.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Publish Button */}
              <Button
                onClick={handlePublish}
                disabled={
                  isVerifying || isPublishing || selectedImages.length === 0
                }
                className="w-full h-12 text-lg"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advertising;
