import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Check, Sparkles, Home, Wand2, BarChart3, Calculator, Zap, Shield, Loader2 } from 'lucide-react';
const Upgrade = () => {
  const {
    user,
    subscriptionTier,
    isPro,
    refetchProfile,
    userRoles
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  // Check if user is a company account
  const isCompany = userRoles.includes('company');
  
  // Calculate prices based on account type
  const proPrice = isCompany ? 499 : 299;
  const proPlusPrice = isCompany ? 699 : 499;

  if (!user) {
    navigate('/login');
    return null;
  }
  const handleUpgrade = async (tier: 'pro' | 'pro_plus') => {
    setIsUpgrading(true);
    try {
      if (!user) {
        toast({
          title: "Fel",
          description: "Du måste vara inloggad för att uppgradera",
          variant: "destructive",
        });
        return;
      }

      // Check if user is a company account
      const isCompany = userRoles.includes('company');

      // Map tiers to Stripe price IDs (different prices for companies)
      const priceIdMap: Record<string, string> = isCompany ? {
        'pro': 'price_1SS4MnJbCfxFvx44zLSeZ8BL',      // Pro (Company) - 499 SEK/month
        'pro_plus': 'price_1SS4NAJbCfxFvx44FeWtWvKz', // Pro+ (Company) - 699 SEK/month
      } : {
        'pro': 'price_1SS4IWJbCfxFvx44ko7EQvGq',      // Pro (Personal) - 299 SEK/month
        'pro_plus': 'price_1SS4ImJbCfxFvx44S5U5jVSt', // Pro+ (Personal) - 499 SEK/month
      };

      const priceId = priceIdMap[tier];
      if (!priceId) {
        throw new Error('Invalid subscription tier');
      }

      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({
        title: "Uppgraderingsfel",
        description: error.message || "Kunde inte starta betalningsprocessen. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setIsUpgrading(false);
    }
  };
  const proFeatures = [{
    icon: Home,
    title: "AI Homestyling",
    description: "Upp till 50 AI-genererade bilder/månad"
  }, {
    icon: Wand2,
    title: "AI Bildredigering",
    description: "Upp till 50 AI-genererade bilder/månad"
  }, {
    icon: Calculator,
    title: "AI Värdering",
    description: "Upp till 50 värderingar per månad"
  }, {
    icon: BarChart3,
    title: "Marknadsanalys",
    description: "Grundläggande marknadsdata"
  }, {
    icon: Sparkles,
    title: "AI-verktyg (begränsat)",
    description: "Tillgång till alla AI-verktyg med månadsgräns"
  }];
  const proPlusFeatures = [{
    icon: Home,
    title: "AI Homestyling",
    description: "Obegränsade AI-genereringar"
  }, {
    icon: Wand2,
    title: "AI Bildredigering",
    description: "Obegränsad bildredigering med AI"
  }, {
    icon: Calculator,
    title: "AI Värdering",
    description: "Obegränsade värderingar"
  }, {
    icon: BarChart3,
    title: "Avancerad marknadsanalys",
    description: "Detaljerad marknadsdata och trender"
  }, {
    icon: BarChart3,
    title: "Analyshistorik",
    description: "Spara och exportera alla dina AI-analyser"
  }, {
    icon: Sparkles,
    title: "Obegränsade AI-verktyg",
    description: "Använd alla AI-funktioner utan begränsningar"
  }, {
    icon: Zap,
    title: "Prioriterad bearbetning",
    description: "Snabbare AI-generering och svar"
  }];

  // Show Pro+ upgrade for Pro users
  if (subscriptionTier === 'pro') {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Uppgradera till Pro+
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
              Gå från Pro till Pro+
            </h1>
            <p className="text-xl font-medium text-foreground max-w-2xl mx-auto">
              Få obegränsad tillgång till alla AI-verktyg utan några månadsgränser
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
            {/* Pro Plan (Current) */}
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Din nuvarande plan</Badge>
                <CardTitle className="text-xl md:text-2xl font-semibold">Pro-konto</CardTitle>
                <CardDescription className="font-medium text-foreground">Begränsad AI-användning</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{proPrice} kr</span>
                  <span className="text-muted-foreground">/månad</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isCompany ? 'Ex. moms' : 'Ink. moms'}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {proFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return <div key={index} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>;
              })}
              </CardContent>
            </Card>

            {/* Pro+ Plan */}
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground px-4 py-1 text-sm font-semibold">
                REKOMMENDERAS
              </div>
              <CardHeader>
                <Badge variant="default" className="w-fit mb-2">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro+
                </Badge>
                <CardTitle className="text-xl md:text-2xl font-semibold">Pro+ konto</CardTitle>
                <CardDescription className="font-medium text-foreground">Obegränsad AI-användning</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{proPlusPrice} kr</span>
                  <span className="text-muted-foreground">/månad</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isCompany ? 'Ex. moms' : 'Ink. moms'}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {proPlusFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return <div key={index} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{feature.title}</p>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>;
                })}
                </div>

                <Button size="lg" className="w-full" onClick={() => handleUpgrade('pro_plus')} disabled={isUpgrading}>
                  {isUpgrading ? <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uppgraderar...
                    </> : <>
                      <Crown className="h-4 w-4 mr-2" />
                      Uppgradera till Pro+
                    </>}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Tillbaka till Dashboard
            </Button>
          </div>
        </main>
        <LegalFooter />
      </div>;
  }

  // Already have Pro+
  if (subscriptionTier === 'pro_plus') {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
              <Crown className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Du har redan Pro+!</h1>
            <p className="text-xl font-medium text-foreground">
              Du har tillgång till alla premium-funktioner. Fortsätt utforska allt som Bostadsvyn har att erbjuda.
            </p>
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Tillbaka till Dashboard
            </Button>
          </div>
        </main>
        <LegalFooter />
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Uppgradera ditt konto
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
            Välkommen till Pro
          </h1>
          <p className="text-xl font-medium text-foreground max-w-2xl mx-auto">
            Få full tillgång till alla AI-verktyg och avancerade funktioner
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          {/* Basic Plan */}
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">Nuvarande plan</Badge>
              <CardTitle className="text-xl md:text-2xl font-semibold">Baskonto</CardTitle>
              <CardDescription className="font-medium text-foreground">Grundläggande funktioner</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">Gratis</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sök efter fastigheter</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Spara favoriter</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">AI-rådgivare</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Grundläggande funktioner</span>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-primary/50">
            <CardHeader>
              <Badge variant="default" className="w-fit mb-2">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
              <CardTitle className="text-xl md:text-2xl font-semibold">Pro-konto</CardTitle>
              <CardDescription className="font-medium text-foreground">Begränsad AI-användning</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{proPrice} kr</span>
                <span className="text-muted-foreground">/månad</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {isCompany ? 'Ex. moms' : 'Ink. moms'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {proFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return <div key={index} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>;
              })}
              </div>

              <Button size="lg" className="w-full" onClick={() => handleUpgrade('pro')} disabled={isUpgrading}>
                {isUpgrading ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uppgraderar...
                  </> : <>
                    <Crown className="h-4 w-4 mr-2" />
                    Uppgradera till Pro
                  </>}
              </Button>
              
              <p className="text-xs text-center font-medium text-foreground">
                Avsluta när som helst. Ingen bindningstid.
              </p>
            </CardContent>
          </Card>

          {/* Pro+ Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground px-4 py-1 text-sm font-semibold">
              REKOMMENDERAS
            </div>
            <CardHeader>
              <Badge variant="default" className="w-fit mb-2">
                <Crown className="h-3 w-3 mr-1" />
                Pro+
              </Badge>
              <CardTitle className="text-xl md:text-2xl font-semibold">Pro+ konto</CardTitle>
              <CardDescription className="font-medium text-foreground">Obegränsad AI-användning</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{proPlusPrice} kr</span>
                <span className="text-muted-foreground">/månad</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {isCompany ? 'Ex. moms' : 'Ink. moms'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {proPlusFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return <div key={index} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>;
              })}
              </div>

              <Button size="lg" className="w-full" onClick={() => handleUpgrade('pro_plus')} disabled={isUpgrading}>
                {isUpgrading ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uppgraderar...
                  </> : <>
                    <Crown className="h-4 w-4 mr-2" />
                    Uppgradera till Pro+
                  </>}
              </Button>
              
              <p className="text-xs text-center font-medium text-foreground">
                Avsluta när som helst. Ingen bindningstid.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium text-foreground">
            Har du frågor om Pro-kontot? <a href="/fragor-svar" className="text-primary hover:underline">Läs våra vanliga frågor</a>
          </p>
        </div>
      </main>
      <LegalFooter />
    </div>;
};
export default Upgrade;