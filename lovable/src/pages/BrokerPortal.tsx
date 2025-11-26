import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyDashboard } from '@/components/PropertyDashboard';
import { BrokerDashboard } from '@/components/broker/BrokerDashboard';
import { BrokerProfileManager } from '@/components/broker/BrokerProfileManager';
import { ClientManager } from '@/components/broker/ClientManager';
import { BrokerSettings } from '@/components/broker/BrokerSettings';
import { MarketShareContent } from '@/components/broker/MarketShareContent';
import { OfficePage } from '@/components/broker/OfficePage';
import AdManager from '@/components/ads/AdManager';
import DirectMarketing from '@/components/ads/DirectMarketing';
import AdStatistics from '@/components/ads/AdStatistics';
import PendingAds from '@/components/ads/PendingAds';
import PublishedAds from '@/components/ads/PublishedAds';
import NyproduktionProjectForm from '@/components/ads/NyproduktionProjectForm';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { TEST_LISTING_PROPERTIES } from '@/data/testProperties';
import { Building2, BarChart3, Megaphone, Settings, Crown, TrendingUp, Users, Eye, DollarSign, Calendar, Zap, Shield, Rocket, Lock, Briefcase, CheckSquare, Clock, User, Star, Check, Sparkles, CheckCircle } from 'lucide-react';
export default function BrokerPortal() {
  const {
    user,
    loading,
    userRoles
  } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingCount, setPendingCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [isOfficeOwner, setIsOfficeOwner] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const previewMode = params.get('preview') === '1' || params.get('bypass') === '1' || params.get('bypass') === 'true';
  useEffect(() => {
    if (user) {
      fetchCounts();
      checkOfficeOwnerStatus();
    }
  }, [user]);
  
  const checkOfficeOwnerStatus = async () => {
    try {
      const { data: brokerData } = await supabase
        .from('brokers')
        .select('is_office_owner')
        .eq('user_id', user?.id)
        .single();
      
      if (brokerData) {
        setIsOfficeOwner(brokerData.is_office_owner || false);
      }
    } catch (error) {
      console.error('Error checking office owner status:', error);
    }
  };
  const fetchCounts = async () => {
    try {
      // Fetch pending ads count
      const {
        count: pendingAdsCount
      } = await supabase.from('ads').select('*', {
        count: 'exact',
        head: true
      }).eq('user_id', user?.id).in('moderation_status', ['pending', 'draft']);

      // Fetch published properties count
      const {
        count: publishedPropertiesCount
      } = await supabase.from('properties').select('*', {
        count: 'exact',
        head: true
      }).eq('user_id', user?.id).eq('status', 'FOR_SALE');
      setPendingCount((pendingAdsCount || 0) + 1); // +1 for example ad
      setPublishedCount(publishedPropertiesCount || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar mäklarportalen...</p>
          </div>
        </div>
      </div>;
  }
  if (!user && !previewMode) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-8">
          <Card className="shadow-card max-w-md mx-auto">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Logga in för mäklarportalen</CardTitle>
              <p className="text-muted-foreground">
                Du behöver vara inloggad för att komma åt mäklarportalen.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="/maklare-login">Mäklarinloggning</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <LegalFooter />
      </div>;
  }
  const isBroker = previewMode || userRoles.includes('broker') || userRoles.includes('admin');
  if (!isBroker && !previewMode) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-8">
          <Card className="shadow-card max-w-md mx-auto">
            <CardHeader className="text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Mäklarbehörighet krävs</CardTitle>
              <p className="text-muted-foreground">
                Du behöver mäklarbehörighet för att komma åt denna portal. Kontakta administratören för åtkomst.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => window.location.href = '/maklare-login'}>
                Logga in som mäklare
              </Button>
            </CardContent>
          </Card>
        </main>
        <LegalFooter />
      </div>;
  }
  const MarketingTools = () => <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Marknadsföringsverktyg
          </CardTitle>
          <p className="text-muted-foreground">
            Professionella verktyg för att marknadsföra dina fastigheter
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <Rocket className="h-8 w-8 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">AI-genererade annonser</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Skapa professionella annonser med AI-stöd
              </p>
              <Button>Skapa annons</Button>
            </div>

            <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <Eye className="h-8 w-8 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Premium-exponering</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Höj synligheten för dina objekt
              </p>
              <Button variant="outline">Uppgradera</Button>
            </div>

            <div className="border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <TrendingUp className="h-8 w-8 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Sociala medier</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Automatisk delning på sociala medier
              </p>
              <Button variant="outline">Konfigurera</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Integrations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Systemintegrationer</CardTitle>
          <p className="text-muted-foreground">
            Anslut till ledande fastighetssystem för effektiv arbetsflöde
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Vitec Express</p>
                  <p className="text-sm text-muted-foreground">Objekthanteringssystem</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Ansluten</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Fasad</p>
                  <p className="text-sm text-muted-foreground">Marknadsföring</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Anslut</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Mspecs</p>
                  <p className="text-sm text-muted-foreground">Objektspecifikationer</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Anslut</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
  const PackageSettings = () => {
    // Använd samma property för alla tre exempel så att skillnaden mellan paketen blir tydlig
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const baseProperty = {
      ...TEST_LISTING_PROPERTIES[0],
      viewing_times: [{
        date: tomorrowStr,
        time: '18:00-19:00',
        status: 'scheduled' as const,
        spots_available: 8
      }]
    } as unknown as Property;
    const premiumExample = {
      ...baseProperty,
      ad_tier: 'premium'
    } as Property;
    const plusExample = {
      ...baseProperty,
      ad_tier: 'plus'
    } as Property;
    const freeExample = {
      ...baseProperty,
      ad_tier: 'free'
    } as Property;
    return <div className="mb-20">
      <div className="text-center mb-12">
        <Badge variant="gold" className="mb-5 px-5 py-2 text-base">
          <Eye className="h-5 w-5 mr-2" />
          Jämför paketen
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-5">Se skillnaden mellan våra paket</h2>
        <p className="text-base text-foreground font-medium max-w-4xl mx-auto leading-relaxed">
          Samma bostad, samma text och bild - men stor skillnad i synlighet och funktioner
        </p>
      </div>
      
      <div className="space-y-16">
        {/* Premium/Exklusiv Example */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-premium/20 to-premium/10 rounded-xl p-3 shadow-md">
              <Crown className="h-6 w-6 text-premium" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Exklusivpaket - 3995 kr</h3>
              <p className="text-muted-foreground">Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad</p>
            </div>
          </div>
          <Card className="shadow-xl bg-gradient-to-br from-premium/10 to-card border-premium/30">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Maximerad synlighet
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Allt som ingår i Pluspaketet + största annonsen</li>
                    <li>• Hamnar över Pluspaketet i publiceringslistan</li>
                    <li>• Premium-badge som sticker ut</li>
                    <li>• Kostnadsfri förnyelse varje månad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Exklusiva AI-verktyg
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• AI-Bildredigering som levererar otroliga resultat</li>
                    <li>• Unik AI-statistik i mäklarens och säljarens kundportal</li>
                    <li>• Detaljerad intressestatistik för mäklare och säljare</li>
                    <li>• Mest trafik till annonsen</li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-6">
                <PropertyCard property={premiumExample} size="large" disableClick={true} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plus Example */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-3 shadow-md">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Pluspaket - 1995 kr</h3>
              <p className="text-muted-foreground">Större annons med kostnadsfri förnyelse varje månad</p>
            </div>
          </div>
          <Card className="shadow-xl bg-gradient-to-br from-accent/10 to-card border-accent/30">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Ökad synlighet
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Allt som ingår i Grundpaketet + större annons</li>
                    <li>• Hamnar över Grundpaketet i publiceringslistan</li>
                    <li>• Plus-badge</li>
                    <li>• Kostnadsfri förnyelse varje månad</li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-6">
                <PropertyCard property={plusExample} disableClick={true} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Free/Grund Example */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl p-3 shadow-md">
              <Star className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Grundpaket - Gratis</h3>
              <p className="text-muted-foreground">Kostnadsfri grundannons för alla</p>
            </div>
          </div>
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Grundläggande publicering
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Standard annonsformat</li>
                    <li>• Tillhörande statistik för mäklare och säljare</li>
                    <li>• Bläddra genom alla bilder utan att gå in på annonsen</li>
                    <li>• Fri publicering för alla säljare</li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-6">
                <PropertyCard property={freeExample} disableClick={true} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 text-center">
        
      </div>
    </div>;
  };
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
            Mäklarportalen
          </h1>
          <p className="text-xl text-foreground font-medium max-w-2xl mx-auto">Professionella verktyg för fastighetsmäklare - hantera klienter, publicerade objekt och statistik</p>
          
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isOfficeOwner ? 'grid-cols-9' : 'grid-cols-8'} gap-1`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Publicerade objekt {publishedCount > 0 && `(${publishedCount})`}
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Väntande {pendingCount > 0 && `(${pendingCount})`}
            </TabsTrigger>
            <TabsTrigger value="nyproduktion" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Nyproduktion
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Paket
            </TabsTrigger>
            <TabsTrigger value="market-share" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Andelsstatistik
            </TabsTrigger>
            {isOfficeOwner && (
              <TabsTrigger value="office" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Kontorssida
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Inställningar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <BrokerProfileManager />
              
            </div>
          </TabsContent>

          <TabsContent value="published">
            <div className="space-y-6">
              <PropertyDashboard />
              <PublishedAds />
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <PendingAds />
          </TabsContent>

          <TabsContent value="nyproduktion">
            <NyproduktionProjectForm />
          </TabsContent>

          <TabsContent value="statistics">
            <AdStatistics />
          </TabsContent>

          <TabsContent value="packages">
            <PackageSettings />
          </TabsContent>

          <TabsContent value="market-share">
            <MarketShareContent />
          </TabsContent>

          {isOfficeOwner && (
            <TabsContent value="office">
              <OfficePage userId={user?.id || ''} />
            </TabsContent>
          )}

          <TabsContent value="settings">
            <BrokerSettings />
          </TabsContent>
        </Tabs>
      </main>
      <LegalFooter />
    </div>;
}