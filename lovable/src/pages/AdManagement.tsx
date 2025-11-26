import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Clock,
  Settings,
  Sparkles,
  Image as ImageIcon,
  ArrowLeft,
  Users,
  Target,
  Share2
} from 'lucide-react';
import DirectMarketing from '@/components/ads/DirectMarketing';

interface AdStats {
  views: number;
  favorites: number;
  inquiries: number;
  conversions: number;
  aiImagesGenerated: number;
  aiEditsUsed: number;
  lastViewed?: string;
}

export default function AdManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [ad, setAd] = useState<any>(null);
  const [stats, setStats] = useState<AdStats>({
    views: 0,
    favorites: 0,
    inquiries: 0,
    conversions: 0,
    aiImagesGenerated: 0,
    aiEditsUsed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      loadAdData();
      loadStats();
    }
  }, [user, id]);

  const loadAdData = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          properties (
            id,
            title,
            property_type,
            price,
            status,
            address_street,
            address_city,
            living_area,
            rooms,
            images
          )
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setAd(data);
    } catch (error) {
      console.error('Error loading ad:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda annonsdata",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load views (placeholder - would need proper tracking)
      setStats({
        views: Math.floor(Math.random() * 500),
        favorites: Math.floor(Math.random() * 50),
        inquiries: Math.floor(Math.random() * 20),
        conversions: Math.floor(Math.random() * 5),
        aiImagesGenerated: Math.floor(Math.random() * 10),
        aiEditsUsed: Math.floor(Math.random() * 15),
        lastViewed: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Annonsen hittades inte</h3>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Tillbaka till Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPremium = ad.ad_tier === 'premium';
  const isRental = ad.properties?.status === 'FOR_RENT';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{ad.title}</h1>
            <p className="text-muted-foreground mt-1">
              {ad.properties?.address_street}, {ad.properties?.address_city}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={ad.moderation_status === 'approved' ? 'default' : 'secondary'}>
              {ad.moderation_status === 'approved' ? 'Godkänd' : 'Granskas'}
            </Badge>
            <Badge variant="outline">
              {ad.ad_tier === 'free' ? 'Grund' : ad.ad_tier === 'plus' ? 'Plus' : 'Premium'}
            </Badge>
            {isRental ? (
              <Badge className="bg-rental text-rental-foreground">Uthyrning</Badge>
            ) : (
              <Badge className="bg-blue-500 text-white">Försäljning</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visningar</p>
                <p className="text-2xl font-bold">{stats.views}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Favoriter</p>
                <p className="text-2xl font-bold">{stats.favorites}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Förfrågningar</p>
                <p className="text-2xl font-bold">{stats.inquiries}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Konverteringar</p>
                <p className="text-2xl font-bold">{stats.conversions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="analytics">Detaljerad Analys</TabsTrigger>
          <TabsTrigger value="marketing">Marknadsföring</TabsTrigger>
          {isPremium && (
            <TabsTrigger value="ai-tools">
              <Sparkles className="h-4 w-4 mr-1" />
              AI-Tjänster
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Prestanda senaste 30 dagarna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Visningar per dag</span>
                    <span className="font-semibold">~{Math.floor(stats.views / 30)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Konverteringsgrad</span>
                    <span className="font-semibold">
                      {((stats.conversions / stats.views) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Favoriter/Visningar</span>
                    <span className="font-semibold">
                      {((stats.favorites / stats.views) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Senaste aktivitet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Eye className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Ny visning</p>
                      <p className="text-xs text-muted-foreground">För 2 timmar sedan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Sparad som favorit</p>
                      <p className="text-xs text-muted-foreground">För 5 timmar sedan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Ny förfrågan</p>
                      <p className="text-xs text-muted-foreground">Igår</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snabbåtgärder</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/annons/${ad.property_id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Förhandsgranska annons
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/redigera-annons/${ad.id}`)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Redigera annons
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Dela annons
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detaljerad statistik</CardTitle>
              <CardDescription>
                Djupgående analys av annonsens prestanda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Visningsstatistik</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Totala visningar</p>
                      <p className="text-2xl font-bold">{stats.views}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Unika besökare</p>
                      <p className="text-2xl font-bold">{Math.floor(stats.views * 0.7)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Genomsnittlig visningstid</p>
                      <p className="text-2xl font-bold">2:34</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Avvisningsfrekvens</p>
                      <p className="text-2xl font-bold">32%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Konverteringar</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Kontaktformulär</span>
                      <Badge>{stats.inquiries}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Telefon uppringningar</span>
                      <Badge>{Math.floor(stats.inquiries * 0.6)}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Bokade visningar</span>
                      <Badge>{stats.conversions}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Direkt Marknadsföring</CardTitle>
              <CardDescription>
                Skapa och hantera kampanjer för din annons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DirectMarketing />
            </CardContent>
          </Card>
        </TabsContent>

        {isPremium && (
          <TabsContent value="ai-tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  AI-Tjänster Användning
                </CardTitle>
                <CardDescription>
                  Statistik för dina AI-genererade bilder och bildredigeringar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <ImageIcon className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-semibold">AI-Bildgenerering</p>
                        <p className="text-sm text-muted-foreground">
                          Endast Exklusivpaket
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">{stats.aiImagesGenerated}</p>
                    <p className="text-sm text-muted-foreground">
                      Bilder genererade för denna annons
                    </p>
                  </div>

                  <div className="p-6 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-semibold">AI-Bildredigering</p>
                        <p className="text-sm text-muted-foreground">
                          Endast Exklusivpaket
                        </p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-2">{stats.aiEditsUsed}</p>
                    <p className="text-sm text-muted-foreground">
                      Redigeringar utförda på bilder
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Populära AI-redigeringar</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Möbleringsvisualisering</span>
                      <Badge variant="secondary">
                        {Math.floor(stats.aiEditsUsed * 0.4)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Renovering förhandsvisning</span>
                      <Badge variant="secondary">
                        {Math.floor(stats.aiEditsUsed * 0.35)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Årstidbyte</span>
                      <Badge variant="secondary">
                        {Math.floor(stats.aiEditsUsed * 0.25)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
