"use client";

import { Brain, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryAISearchProps {
  categoryType: "rental" | "nyproduktion" | "fritid" | "kommersiell";
  categoryLabel: string;
  categoryDescription: string;
  placeholder?: string;
}

const CategoryAISearch: React.FC<CategoryAISearchProps> = ({
  categoryType,
  categoryLabel,
  categoryDescription,
  placeholder = "Beskriv vad du söker...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Ange en sökning", {
        description: "Skriv vad du söker för att få AI-assisterade resultat.",
      });
      return;
    }

    setIsSearching(true);
    try {
      // For now, navigate to search page with the query
      // TODO: Implement AI search API route to extract search criteria
      const params = new URLSearchParams();
      params.set("query", searchQuery);
      params.set("category", categoryType);
      params.set("listingType", categoryType === "rental" ? "FOR_RENT" : "ALL");

      setIsSearching(false);
      router.push(`/search?${params.toString()}`);
    } catch (err) {
      console.error("AI search exception:", err);
      toast.error("Något gick fel", {
        description: "Kunde inte genomföra AI-sökning. Försök igen.",
      });
      setIsSearching(false);
    }
  };

  const exampleText =
    categoryType === "rental"
      ? "Stockholm, max 15000 kr/mån"
      : categoryType === "nyproduktion"
        ? "Göteborg, inflyttning 2025"
        : categoryType === "fritid"
          ? "Dalarnas län vid sjö"
          : "Stockholm för kontor";

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-lg mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  AI-sökning för {categoryLabel}
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Sparkles className="h-4 w-4 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{categoryDescription}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Beskriv vad du söker så hittar vår AI de bästa matchningarna
                inom {categoryLabel.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={isSearching}
              className="flex-1 h-12 text-base bg-background/80 border-accent/30 focus:border-primary"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-6 bg-primary hover:bg-primary/90"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Söker...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  AI-sök
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Exempel: "3 rum och kök med balkong i centrala {exampleText}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAISearch;
