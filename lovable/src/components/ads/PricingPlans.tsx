import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, TrendingUp, Zap, Crown, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AdTierExamples from './AdTierExamples';
interface AdTierFeature {
  feature_name: string;
  feature_description: string;
  ad_tier: string;
  is_enabled: boolean;
}
interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: AdTierFeature[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  icon: React.ReactNode;
}
const PricingPlans = () => {
  const {
    user
  } = useAuth();
  const [tierFeatures, setTierFeatures] = useState<AdTierFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  useEffect(() => {
    fetchTierFeatures();
  }, []);
  const fetchTierFeatures = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('ad_tier_features').select('*').eq('is_enabled', true).order('ad_tier');
      if (error) throw error;
      setTierFeatures(data || []);
    } catch (error) {
      console.error('Error fetching tier features:', error);
    } finally {
      setLoading(false);
    }
  };
  const getTierFeatures = (tier: string): AdTierFeature[] => {
    return tierFeatures.filter(feature => feature.ad_tier === tier);
  };
  const handleUpgrade = async (tierName: string) => {
    if (!user) {
      toast.error('Vänligen logga in för att uppgradera');
      return;
    }
    setProcessingTier(tierName);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Uppgraderad till ${tierName}-paketet!`);
      // Here you would integrate with actual payment processor
    } catch (error) {
      toast.error('Uppgraderingen misslyckades. Försök igen.');
    } finally {
      setProcessingTier(null);
    }
  };
  const pricingTiers: PricingTier[] = [{
    name: 'Grundpaket',
    price: '0',
    period: 'Helt kostnadsfritt',
    description: 'Kostnadsfri grundannons för alla',
    features: getTierFeatures('free'),
    buttonText: 'Nuvarande paket',
    buttonVariant: 'outline',
    icon: <Star className="h-5 w-5" />
  }, {
    name: 'Pluspaket',
    price: '1995',
    period: 'per månad',
    description: 'Större annons med kostnadsfri förnyelse var 4:e vecka',
    features: getTierFeatures('plus'),
    popular: true,
    buttonText: 'Uppgradera till Plus',
    buttonVariant: 'default',
    icon: <TrendingUp className="h-5 w-5" />
  }, {
    name: 'Exklusivpaket',
    price: '3995',
    period: 'per månad',
    description: 'Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad',
    features: getTierFeatures('premium'),
    buttonText: 'Uppgradera till Exklusiv',
    buttonVariant: 'default',
    icon: <Crown className="h-5 w-5" />
  }];
  if (loading) {
    return <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Laddar prisplaner...</div>
      </div>;
  }
  return <div className="space-y-16">
      

      {/* Show actual ad examples */}
      

      {/* Pricing Details Section */}
      

      {/* Additional Benefits Section */}
      

    </div>;
};
export default PricingPlans;