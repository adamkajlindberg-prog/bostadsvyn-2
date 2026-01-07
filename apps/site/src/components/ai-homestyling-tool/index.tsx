"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Wand2,
  Download,
  Sparkles,
  Home,
  Palette,
  Sofa,
  Lightbulb,
  Camera,
  RefreshCw,
  Eye,
  Star,
} from "lucide-react";
import { toast } from "sonner";

export function AIHomestyling() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [styledImage, setStyledImage] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [intensity, setIntensity] = useState([70]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stylePresets = [
    {
      id: "scandinavian",
      name: "Skandinavisk",
      description: "Minimalistisk, ljus och naturlig",
      icon: "🌿",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Ren design med raka linjer",
      icon: "🏢",
    },
    {
      id: "bohemian",
      name: "Bohemisk",
      description: "Färgglad och konstnärlig",
      icon: "🎨",
    },
    {
      id: "industrial",
      name: "Industriell",
      description: "Rå material och mörka toner",
      icon: "🏭",
    },
    {
      id: "luxury",
      name: "Lyxig",
      description: "Exklusiva material och finish",
      icon: "👑",
    },
    {
      id: "cozy",
      name: "Mysig",
      description: "Varm och inbjudande atmosfär",
      icon: "🕯️",
    },
  ];

  const roomTypes = [
    { id: "living", name: "Vardagsrum", icon: Sofa },
    { id: "kitchen", name: "Kök", icon: Home },
    { id: "bedroom", name: "Sovrum", icon: Home },
    { id: "bathroom", name: "Badrum", icon: Home },
    { id: "office", name: "Hemkontor", icon: Home },
    { id: "dining", name: "Matsal", icon: Home },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setStyledImage(""); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const generateStyledImage = async () => {
    if (!selectedFile || !selectedStyle || !selectedRoom) {
      toast({
        title: "Komplettera uppgifterna",
        description: "Välj bild, stil och rumstyp för att fortsätta.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;

        const selectedStyleData = stylePresets.find((s) => s.id === selectedStyle);
        const selectedRoomData = roomTypes.find((r) => r.id === selectedRoom);

        const prompt =
          customPrompt ||
          `Redesign this ${selectedRoomData?.name.toLowerCase()} in ${selectedStyleData?.name.toLowerCase()} style. ${selectedStyleData?.description}. Keep the room structure but update furniture, colors, lighting, and decor to match the style perfectly.`;

        // TODO: Replace with actual API call to /api/ai/homestyling
        const response = await fetch("/api/ai/homestyling", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            prompt,
            style: selectedStyle,
            room: selectedRoom,
            intensity: intensity[0] / 100,
          }),
        });

        if (!response.ok) {
          throw new Error("Kunde inte generera homestyling");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Kunde inte generera homestyling");
        }

        setStyledImage(data.image_url);
        toast({
          title: "Homestyling klar!",
          description: "Din inredningsvisualisering är redo.",
        });
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Error styling image:", error);
      toast({
        title: "Fel vid homestyling",
        description: "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (styledImage) {
      const link = document.createElement("a");
      link.href = styledImage;
      link.download = `homestyling-${selectedStyle}-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Home className="h-8 w-8 text-primary" />
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Homestyling
          </CardTitle>
          <CardDescription className="text-lg">
            Visualisera olika inredningsstilar för dina rum med AI-teknik
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Ladda upp bild
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-20 border-dashed"
                >
                  <div className="text-center">
                    <Camera className="h-6 w-6 mx-auto mb-2" />
                    <span>Välj en bild av rummet</span>
                  </div>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <Badge variant="secondary" className="w-full justify-center">
                    {selectedFile.name}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Styling Options */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Välj stil och rum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="style" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="style">Inredningsstil</TabsTrigger>
                  <TabsTrigger value="room">Rumstyp</TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {stylePresets.map((style) => (
                      <Button
                        key={style.id}
                        variant={selectedStyle === style.id ? "default" : "outline"}
                        onClick={() => setSelectedStyle(style.id)}
                        className="h-auto p-3 flex flex-col items-start"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span>{style.icon}</span>
                          <span className="font-medium">{style.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {style.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="room" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {roomTypes.map((room) => {
                      const Icon = room.icon;
                      return (
                        <Button
                          key={room.id}
                          variant={selectedRoom === room.id ? "default" : "outline"}
                          onClick={() => setSelectedRoom(room.id)}
                          className="h-12 flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {room.name}
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Avancerade inställningar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Intensitet av förändring: {intensity[0]}%</Label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Högre värde = större förändring av ursprungsbilden
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Anpassad instruktion (valfri)</Label>
                <Input
                  id="custom-prompt"
                  placeholder="T.ex. 'Lägg till en stor soffa och växter'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generateStyledImage}
            disabled={!selectedFile || !selectedStyle || !selectedRoom || isProcessing}
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/60 hover:opacity-90"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Genererar homestyling...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Skapa homestyling
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Förhandsvisning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Original Image */}
                {originalImage && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Original</Label>
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Styled Image */}
                {styledImage && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      Homestyling resultat
                      <Badge className="bg-success text-success-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Klar
                      </Badge>
                    </Label>
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={styledImage}
                        alt="Homestyling result"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <Button onClick={downloadImage} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Ladda ner bild
                    </Button>
                  </div>
                )}

                {!originalImage && (
                  <div className="flex items-center justify-center h-48 bg-muted rounded-lg border-dashed border">
                    <div className="text-center text-muted-foreground">
                      <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Ladda upp en bild för att se förhandsvisning</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5" />
                Tips för bästa resultat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Använd bilder med bra ljus och tydlig rumsvy</li>
                <li>• Undvik för rörliga eller suddiga bilder</li>
                <li>• Experimentera med olika intensitetsnivåer</li>
                <li>• Prova anpassade instruktioner för specifika önskemål</li>
                <li>• Skandinavisk stil fungerar särskilt bra för svenska hem</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

