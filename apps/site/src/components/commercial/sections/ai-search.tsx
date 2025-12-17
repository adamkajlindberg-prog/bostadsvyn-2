"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const AISearch = () => {
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
      // TODO: Implement AI search functionality
      const params = new URLSearchParams();
      params.set("searchQuery", searchQuery);
      params.set("category", "kommersiell");
      params.set("aiSearch", "true");

      router.push(`/search?${params.toString()}`);
    } catch (err) {
      console.error("AI search exception:", err);
      toast.error("Något gick fel", {
        description: "Kunde inte genomföra AI-sökning. Försök igen.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-lg mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <BrainIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  AI-sökning för Kommersiella fastigheter
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SparklesIcon className="h-4 w-4 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        Vår AI förstår din sökning och prioriterar kommersiella
                        fastigheter. Om inga exakta matchningar finns visas
                        liknande kommersiella objekt baserat på dina kriterier.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Beskriv vad du söker så hittar vår AI de bästa matchningarna
                inom kommersiella fastigheter.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Exempel: Kontorslokal 200 kvm i centrala Stockholm, moderna faciliteter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={isSearching}
              className="flex-1 h-12 text-base bg-background/80 border-accent/30 focus:border-primary"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-6"
            >
              {isSearching ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Söker...
                </>
              ) : (
                <>
                  <BrainIcon className="h-4 w-4 mr-2" />
                  AI-sök
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Exempel: &quot;3 rum och kök med balkong i centrala Stockholm för
            kontor&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISearch;
