import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CategoryAISearchProps {
  categoryType: 'rental' | 'nyproduktion' | 'fritid' | 'kommersiell';
  categoryLabel: string;
  categoryDescription: string;
  placeholder?: string;
}

const CategoryAISearch: React.FC<CategoryAISearchProps> = ({
  categoryType,
  categoryLabel,
  categoryDescription,
  placeholder = 'Beskriv vad du söker...'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Ange en sökning',
        description: 'Skriv vad du söker för att få AI-assisterade resultat.',
        variant: 'destructive'
      });
      return;
    }

    setIsSearching(true);
    try {
      // Call the AI natural search with category context
      const { data, error } = await supabase.functions.invoke('ai-category-search', {
        body: {
          query: searchQuery,
          category: categoryType
        }
      });

      if (error) {
        console.error('AI search error:', error);
        toast({
          title: 'Sökfel',
          description: 'Kunde inte tolka din sökning. Försök igen eller använd enklare sökord.',
          variant: 'destructive'
        });
        setIsSearching(false);
        return;
      }

      if (data && data.searchCriteria) {
        toast({
          title: 'AI-sökning klar!',
          description: data.message || `Hittade ${data.count || 0} matchande ${categoryLabel.toLowerCase()}`
        });

        // Navigate to search page with AI-extracted criteria and category focus
        const params = new URLSearchParams();
        const criteria = data.searchCriteria;
        
        if (criteria.location) params.set('location', criteria.location);
        if (criteria.propertyType && criteria.propertyType.length > 0) {
          params.set('propertyType', criteria.propertyType.join(','));
        }
        if (criteria.minRooms) params.set('minRooms', criteria.minRooms.toString());
        if (criteria.maxRooms) params.set('maxRooms', criteria.maxRooms.toString());
        if (criteria.minArea) params.set('minArea', criteria.minArea.toString());
        if (criteria.maxArea) params.set('maxArea', criteria.maxArea.toString());
        if (criteria.minPrice) params.set('minPrice', criteria.minPrice.toString());
        if (criteria.maxPrice) params.set('maxPrice', criteria.maxPrice.toString());
        if (criteria.minBedrooms) params.set('minBedrooms', criteria.minBedrooms.toString());
        if (criteria.minBathrooms) params.set('minBathrooms', criteria.minBathrooms.toString());

        // Handle features
        if (criteria.features && criteria.features.length > 0) {
          if (criteria.features.includes('balcony')) params.set('balcony', 'true');
          if (criteria.features.includes('parking')) params.set('parking', 'true');
          if (criteria.features.includes('elevator')) params.set('elevator', 'true');
          if (criteria.features.includes('outdoorSpace')) params.set('outdoorSpace', 'true');
        }
        
        if (criteria.keywords) params.set('keywords', criteria.keywords);
        params.set('searchQuery', searchQuery);
        params.set('category', categoryType);
        params.set('aiSearch', 'true');
        
        setIsSearching(false);
        navigate(`/search?${params.toString()}`);
        return;
      }
    } catch (err) {
      console.error('AI search exception:', err);
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte genomföra AI-sökning. Försök igen.',
        variant: 'destructive'
      });
      setIsSearching(false);
      return;
    }
  };

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
                <h3 className="text-lg font-semibold text-foreground">AI-sökning för {categoryLabel}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Sparkles className="h-4 w-4 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        {categoryDescription}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Beskriv vad du söker så hittar vår AI de bästa matchningarna inom {categoryLabel.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
            Exempel: "3 rum och kök med balkong i centrala {categoryType === 'rental' ? 'Stockholm, max 15000 kr/mån' : categoryType === 'nyproduktion' ? 'Göteborg, inflyttning 2025' : categoryType === 'fritid' ? 'Dalarnas län vid sjö' : 'Stockholm för kontor'}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAISearch;
