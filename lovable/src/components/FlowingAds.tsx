import { Crown, Star } from "lucide-react";
import { useState } from "react";
// Premium property images
import premiumRoom1 from "@/assets/premium-room-1.jpg";
import premiumRoom2 from "@/assets/premium-room-2.jpg";
import premiumRoom3 from "@/assets/premium-room-3.jpg";
import premiumRoom4 from "@/assets/premium-room-4.jpg";
import premiumRoom5 from "@/assets/premium-room-5.jpg";
import premiumRoom6 from "@/assets/premium-room-6.jpg";
import premiumRoom7 from "@/assets/premium-room-7.jpg";
import premiumRoom8 from "@/assets/premium-room-8.jpg";
import premiumRoom9 from "@/assets/premium-room-9.jpg";
import premiumRoom10 from "@/assets/premium-room-10.jpg";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type AdTier = "free" | "plus" | "premium";
interface AdData {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  image: string;
  features: string[];
  size: string;
  description: string;
  link: string;
  adTier: AdTier;
  priorityScore?: number;
  isFeatured?: boolean;
  images?: string[];
}
const FlowingAdsGrid = () => {
  const [_isGenerating, setIsGenerating] = useState(false);
  const [_generatedImages, setGeneratedImages] = useState<{
    [key: number]: string;
  }>({});
  const [imagePrompts, _setImagePrompts] = useState<{
    [key: number]: string;
  }>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const ads: AdData[] = [
    {
      id: 1,
      title: "Exklusiv penthouse med takterrass",
      location: "Östermalm, Stockholm",
      price: "25 000 000 kr",
      type: "Lägenhet",
      image: premiumRoom1,
      images: [
        premiumRoom1,
        premiumRoom2,
        premiumRoom3,
        premiumRoom4,
        premiumRoom5,
        premiumRoom6,
        premiumRoom7,
        premiumRoom8,
        premiumRoom9,
        premiumRoom10,
      ],
      features: ["Takterrass", "Hiss", "Panoramautsikt", "Gym", "Concierge"],
      size: "180 m²",
      description:
        "Lyxig penthouse med spektakulär takterrass och panoramautsikt över Stockholm. Fullständigt renoverad med högsta standard och exklusiva materialval.",
      link: "/property/1",
      adTier: "premium",
      priorityScore: 100,
      isFeatured: true,
    },
    {
      id: 2,
      title: "Lyxvilla med pool och sjöutsikt",
      location: "Djursholm, Stockholm",
      price: "18 500 000 kr",
      type: "Villa",
      image: "/placeholder.svg",
      features: ["Pool", "Sjöutsikt", "Garage", "Stor trädgård"],
      size: "350 m²",
      description:
        "En magnifik villa med privat pool och fantastisk sjöutsikt. Perfekt för familjer som värdesätter lyx och komfort.",
      link: "/property/2",
      adTier: "plus",
      priorityScore: 80,
    },
    {
      id: 3,
      title: "Modern lägenhet i city",
      location: "Södermalm, Stockholm",
      price: "6 800 000 kr",
      type: "Lägenhet",
      image: "/placeholder.svg",
      features: ["Balkong", "Hiss", "Renoverad"],
      size: "85 m²",
      description: "Stilren lägenhet mitt i hjärtat av Stockholm.",
      link: "/property/3",
      adTier: "free",
    },
    {
      id: 4,
      title: "Charmig radhus med trädgård",
      location: "Nacka, Stockholm",
      price: "8 200 000 kr",
      type: "Radhus",
      image: "/placeholder.svg",
      features: ["Trädgård", "Garage", "Nyrenoverat", "Altan"],
      size: "140 m²",
      description:
        "Perfekt för familjen med egen trädgård och moderna lösningar. Nyligen renoverat med smakfulla detaljer.",
      link: "/property/4",
      adTier: "plus",
      priorityScore: 70,
    },
    {
      id: 5,
      title: "Familjevänlig villa",
      location: "Täby, Stockholm",
      price: "9 500 000 kr",
      type: "Villa",
      image: "/placeholder.svg",
      features: ["Stor trädgård", "Garage"],
      size: "200 m²",
      description: "Ideal för barnfamiljer.",
      link: "/property/5",
      adTier: "free",
    },
    {
      id: 6,
      title: "Studio i Vasastan",
      location: "Vasastan, Stockholm",
      price: "3 200 000 kr",
      type: "Lägenhet",
      image: "/placeholder.svg",
      features: ["Centralt", "Renoverad"],
      size: "32 m²",
      description: "Smart studio i populärt område.",
      link: "/property/6",
      adTier: "free",
    },
  ];

  // Sort ads by tier and priority
  const _sortedAds = [...ads].sort((a, b) => {
    const tierOrder = {
      premium: 3,
      plus: 2,
      free: 1,
    };
    if (tierOrder[a.adTier] !== tierOrder[b.adTier]) {
      return tierOrder[b.adTier] - tierOrder[a.adTier];
    }
    return (b.priorityScore || 0) - (a.priorityScore || 0);
  });
  const _generateAIImage = async (adId: number) => {
    const prompt = imagePrompts[adId];
    if (!prompt) {
      toast({
        title: "Fel",
        description: "Ange en beskrivning för bilden",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "ai-image-generator",
        {
          body: {
            prompt: prompt,
            imageType: "property_ad",
          },
        },
      );
      if (error) throw error;
      if (data?.success) {
        setGeneratedImages((prev) => ({
          ...prev,
          [adId]: data.imageUrl,
        }));
        toast({
          title: "Bild genererad!",
          description: "AI-bilden har skapats och sparats",
        });
      } else {
        throw new Error(data?.error || "Kunde inte generera bild");
      }
    } catch (error: any) {
      console.error("Error generating AI image:", error);
      toast({
        title: "Fel vid bildgenerering",
        description: error.message || "Kunde inte generera bild. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const _getAdSizeClass = (adTier: AdTier, index: number) => {
    switch (adTier) {
      case "premium":
        return index === 0 ? "md:col-span-2 lg:col-span-2" : "lg:col-span-1";
      case "plus":
        return "md:col-span-1 lg:col-span-1";
      case "free":
        return "";
      default:
        return "";
    }
  };
  const _getTierBadge = (adTier: AdTier) => {
    switch (adTier) {
      case "premium":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        );
      case "plus":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <Star className="h-3 w-3 mr-1" />
            Plus
          </Badge>
        );
      case "free":
        return null;
      default:
        return null;
    }
  };
  const _canUseAIFeatures = (adTier: AdTier) => adTier === "premium";
  return null;
};
export default FlowingAdsGrid;
