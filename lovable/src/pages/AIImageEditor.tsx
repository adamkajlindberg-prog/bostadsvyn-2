import {
  ArrowLeft,
  Bot,
  Download,
  Image as ImageIcon,
  Send,
  Share2,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  images?: string[];
}

const AIImageEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [selectedImageIndex, _setSelectedImageIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    // Remove authentication requirement - allow anonymous use
    loadPropertyData();
  }, [
    // Remove authentication requirement - allow anonymous use
    loadPropertyData,
  ]);

  const loadPropertyData = async () => {
    const propertyIdParam = searchParams.get("property");
    const images = searchParams.get("images");
    const title = searchParams.get("title");

    setPropertyId(propertyIdParam);

    if (images) {
      const imageList = images.split(",");
      setPropertyImages(imageList);
      setPropertyTitle(title || "Fastighet");

      const welcomeMessage: ChatMessage = {
        id: "1",
        type: "ai",
        content: `Välkommen till AI-bildredigeraren för "${title || "denna fastighet"}"! 🏠✨\n\nJag kan hjälpa dig visualisera hur fastigheten skulle kunna se ut med olika förändringar:\n\n🎨 **Måla om väggar** - "Måla vardagsrummet i ljusblått"\n🪑 **Möblera om** - "Lägg till en stor soffa och ett soffbord"\n💡 **Ändra belysning** - "Lägg till varmare belysning"\n🔧 **Renovera** - "Gör ett öppet kök mot vardagsrummet"\n🌿 **Dekorera** - "Lägg till växter och tavlor"\n\nVälj en bild genom att klicka på den, och berätta sedan vad du vill ändra!\n\n${user ? "💾 **Alla dina redigeringar sparas automatiskt** och kan ses i ditt bildgalleri på din profil!" : "💡 **Tips**: Logga in för att spara och dela dina AI-redigeringar automatiskt!"}`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      toast({
        title: "Ingen fastighet vald",
        description: "Du måste komma hit från en fastighetsannons.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const saveEditToDatabase = async (
    originalImageUrl: string,
    editedImageUrl: string,
    prompt: string,
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("user_ai_edits")
        .insert([
          {
            user_id: user.id,
            property_id: propertyId,
            property_title: propertyTitle,
            original_image_url: originalImageUrl,
            edited_image_url: editedImageUrl,
            edit_prompt: prompt,
            edit_type: "renovation",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Redigering sparad! 💾",
        description: "Din AI-redigering har sparats till ditt bildgalleri.",
      });

      return data;
    } catch (error: any) {
      console.error("Error saving edit:", error);
      toast({
        title: "Kunde inte spara",
        description:
          "Redigeringen kunde inte sparas, men du kan fortfarande ladda ner den.",
        variant: "destructive",
      });
      return null;
    }
  };

  const selectImage = (index: number) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: `Valt bild ${index + 1}`,
      timestamp: new Date(),
      images: [propertyImages[index]],
    };
    setMessages((prev) => [...prev, newMessage]);

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content:
        'Perfekt! Nu har jag valt den bilden att arbeta med. Berätta vad du vill ändra:\n\n🎨 **Färger**: "Måla väggarna i varmgrå"\n🪑 **Möbler**: "Lägg till en modern soffa"\n💡 **Belysning**: "Byt till varmare ljus"\n🏗️ **Renovering**: "Ta bort väggen till köket"\n✨ **Stil**: "Gör rummet mer skandinaviskt"\n\nVad har du i åtanke?',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsProcessing(true);

    try {
      // If we have images and the user wants to edit them
      if (propertyImages.length > 0) {
        const { data, error } = await supabase.functions.invoke(
          "ai-image-editor",
          {
            body: {
              imageUrl: propertyImages[selectedImageIndex],
              prompt: `Interior renovation/design: ${currentMessage}. Focus on realistic architectural and interior design changes for a Swedish property.`,
              editType: "generation",
            },
          },
        );

        if (error) throw error;

        if (data.success) {
          // Save to database only if user is logged in
          if (user) {
            await saveEditToDatabase(
              propertyImages[selectedImageIndex],
              data.images[0].url,
              currentMessage,
            );
          }

          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: `Här är din AI-renovering! 🎯✨\n\nJag har skapat nya versioner som visar hur rummet skulle kunna se ut med dina förändringar. Du kan:\n\n📥 **Ladda ner** bilderna genom att hovra över dem\n📤 **Dela** dem med andra\n🔄 **Prova fler ändringar** - beskriv bara vad du vill ändra härnäst!\n\n${user ? "💾 **Automatiskt sparat** till ditt bildgalleri på din profil!" : "💡 **Tips**: Logga in för att automatiskt spara alla dina AI-redigeringar!"}\n\nVad tycker du om resultatet?`,
            timestamp: new Date(),
            images: data.images.map((img: any) => img.url),
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error(data.error);
        }
      } else {
        // No images selected
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "Du behöver välja en bild från fastighetens bildgalleri först! Klicka på en av bilderna till vänster så kan jag börja arbeta med den.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error: any) {
      console.error("AI processing error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Oj, något gick fel när jag försökte bearbeta din begäran. Kan du försöka igen?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Fel vid AI-bearbetning",
        description:
          error.message || "Kunde inte bearbeta din begäran. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-edited-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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
          text: "Kolla in den här AI-redigerade fastighetsbilden!",
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-primary" />
              AI Renoveringsverktyg
              <Badge className="bg-premium text-premium-foreground">
                <Sparkles className="h-3 w-3 mr-1" />
                Gratis
              </Badge>
              {user && (
                <Badge className="bg-green-600 text-white">
                  <User className="h-3 w-3 mr-1" />
                  Inloggad
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Visualisera renoveringar och förändringar för "{propertyTitle}"
              {!user && (
                <span className="block text-sm mt-1 text-amber-600">
                  💡 Logga in för att spara och dela dina AI-redigeringar
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Image Gallery */}
          <div className="lg:col-span-1">
            <Card className="h-[750px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Fastighetsbilder
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Klicka på en bild för att välja den för AI-redigering
                </p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[650px]">
                  <div className="space-y-2">
                    {propertyImages.map((img, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          index === selectedImageIndex
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => selectImage(index)}
                      >
                        <img
                          src={img}
                          alt={`Fastighetsbild ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            Bild {index + 1}
                          </Badge>
                        </div>
                        {index === selectedImageIndex && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              ✓ Vald
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-4">
            <Card className="h-[750px] flex flex-col shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bot className="h-6 w-6 text-primary" />
                  AI Renoveringsassistent
                </CardTitle>
                <p className="text-base text-muted-foreground">
                  Beskriv vad du vill ändra på den valda bilden och se
                  resultatet direkt
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>

                          <div
                            className={`rounded-lg p-4 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-base">
                              {message.content}
                            </p>

                            {message.images && message.images.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.images.map((img, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative group"
                                  >
                                    <img
                                      src={img}
                                      alt={`Generated ${imgIndex + 1}`}
                                      className="max-w-full rounded border"
                                    />
                                    {message.type === "ai" && (
                                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleDownload(img)}
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleShare(img)}
                                        >
                                          <Share2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <span className="text-sm text-muted-foreground ml-2">
                              AI arbetar...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <span>💡 Tips:</span>
                    <span>
                      "Måla vardagsrummet ljusblått", "Lägg till en stor soffa",
                      "Renovera köket"
                    </span>
                  </div>

                  {!user && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-amber-800">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Logga in för fler funktioner
                        </span>
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        Spara dina AI-redigeringar automatiskt och visa dem i
                        ditt bildgalleri
                      </p>
                      <Button
                        size="sm"
                        onClick={() => navigate("/login")}
                        className="mt-2 h-7 text-xs"
                      >
                        Logga in
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Input
                      placeholder="Beskriv vad du vill ändra eller renovera..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        !isProcessing &&
                        handleSendMessage()
                      }
                      disabled={isProcessing}
                      className="flex-1 h-12 text-base"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={
                        isProcessing ||
                        !currentMessage.trim() ||
                        propertyImages.length === 0
                      }
                      className="px-6 h-12"
                      size="lg"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageEditor;
