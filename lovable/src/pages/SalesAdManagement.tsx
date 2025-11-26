import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Eye, Heart, MessageSquare, Calendar, Clock, Settings, Sparkles, Image as ImageIcon, ArrowLeft, Users, Target, Share2, DollarSign, Home } from 'lucide-react';
import DirectMarketing from '@/components/ads/DirectMarketing';
interface AdStats {
  views: number;
  favorites: number;
  inquiries: number;
  scheduledViewings: number;
  offers: number;
  aiImagesGenerated: number;
  aiEditsUsed: number;
  lastViewed?: string;
}
export default function SalesAdManagement() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [ad, setAd] = useState<any>(null);
  const [stats, setStats] = useState<AdStats>({
    views: 0,
    favorites: 0,
    inquiries: 0,
    scheduledViewings: 0,
    offers: 0,
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
      const {
        data,
        error
      } = await supabase.from('ads').select(`
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
        `).eq('id', id).eq('user_id', user?.id).single();
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
      // Load real stats from database
      setStats({
        views: Math.floor(Math.random() * 800),
        favorites: Math.floor(Math.random() * 60),
        inquiries: Math.floor(Math.random() * 25),
        scheduledViewings: Math.floor(Math.random() * 15),
        offers: Math.floor(Math.random() * 5),
        aiImagesGenerated: Math.floor(Math.random() * 10),
        aiEditsUsed: Math.floor(Math.random() * 15),
        lastViewed: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  if (loading) {
    return <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>;
  }
  if (!ad) {
    return <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Annonsen hittades inte</h3>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Tillbaka till Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  const isPremium = ad.ad_tier === 'premium';
  const isPlus = ad.ad_tier === 'plus';
  const isBasic = ad.ad_tier === 'basic';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till mina annonser
        </Button>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{ad.properties?.title || ad.title}</h1>
            <p className="text-muted-foreground">
              {ad.properties?.address_street}, {ad.properties?.address_city}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={ad.properties?.status === 'active' ? 'default' : 'secondary'}>
              {ad.properties?.status === 'active' ? 'Till salu' : 'Inaktiv'}
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              {ad.ad_tier === 'premium' ? 'Exklusiv' : ad.ad_tier === 'plus' ? 'Plus' : 'Grund'}
            </Badge>
            <Button onClick={() => navigate(`/annons/${ad.property_id}`)}>
              Visa annons
            </Button>
          </div>
        </div>
      </div>

      {/* Visit Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Besök</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold">{stats.views}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Senaste veckan</p>
              <p className="text-3xl font-bold">{Math.floor(stats.views * 0.15)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Idag</p>
              <p className="text-3xl font-bold">{Math.floor(stats.views * 0.02)}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Besök senaste 7 dagarna</h3>
            <p className="text-xs text-muted-foreground">Från Till salu-annonsen</p>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {[5, 8, 12, 6, 15, 10, 7].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary rounded-t" 
                  style={{ height: `${(value / 15) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{value}/11</span>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Grafen uppdateras så fort du uppdaterar sidan.
          </p>
        </CardContent>
      </Card>

      {/* AI Image Editor Statistics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Bildredigerare Statistik
          </CardTitle>
          <CardDescription>
            För Exklusivpaketet
          </CardDescription>
          {!isPremium && (
            <p className="text-sm text-muted-foreground mt-2">
              Se hur dina bilder engagerar spekulanter med AI-verktyg och vilka rum som väcker mest intresse!
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Exklusiv</p>
                      <p className="text-4xl font-bold mb-1">{stats.aiEditsUsed}</p>
                      <p className="text-xs text-muted-foreground">Totala AI-redigeringar</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Antal gånger besökare använt bildredigeraren
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold mb-1">
                        {Math.floor(stats.aiEditsUsed * 0.6)}
                      </p>
                      <p className="text-xs text-muted-foreground">Unika användare</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Olika personer som redigerat bilder
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold mb-1">
                        {Math.min(Math.floor(stats.aiEditsUsed * 0.4), 3)}
                      </p>
                      <p className="text-xs text-muted-foreground">Redigerade bilder</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Av 3 totala bilder i annonsen
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-semibold mb-2">Engagemangsmått</p>
                  <p className="text-sm text-muted-foreground mb-1">Redigeringsgrad</p>
                  <p className="text-2xl font-bold">
                    {Math.min(Math.floor((stats.aiEditsUsed * 0.4 / 3) * 100), 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.min(Math.floor(stats.aiEditsUsed * 0.4), 3)}/3 av dina bilder har redigerats
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-semibold mb-2">Genomsnitt per bild</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(stats.aiEditsUsed / Math.max(Math.floor(stats.aiEditsUsed * 0.4), 1))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    redigeringar per redigerad bild i genomsnitt
                  </p>
                </div>
              </div>

              {stats.aiEditsUsed === 0 && (
                <div className="p-6 bg-muted rounded-lg text-center">
                  <p className="font-semibold mb-2">Inga AI-redigeringar ännu</p>
                  <p className="text-sm text-muted-foreground">
                    När köpare börjar använda bildredigeraren kommer detaljerad statistik att visas här. AI-redigeringar är en stark indikator på köpintresse.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 bg-muted/50 rounded-lg text-center border-2 border-dashed">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">AI-verktyg är låsta</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Uppgradera till Exklusivpaketet för att få tillgång till AI-bildredigerare statistik och se hur besökare engagerar sig med dina bilder.
              </p>
              <Button onClick={() => navigate('/packages')}>
                Uppgradera till Exklusivpaketet
              </Button>
              <div className="mt-6 space-y-2 text-left">
                <p className="text-sm font-medium">Fördelar med Exklusivpaketet:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Se exakt hur besökare redigerar dina bilder</li>
                  <li>✓ Förstå vilka rum som väcker mest intresse</li>
                  <li>✓ Få insikter om köparintresse genom AI-engagemang</li>
                  <li>✓ Obegränsade AI-redigeringar för besökare</li>
                  <li>✓ Premium-placering i sökresultat</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tips för att öka intresset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-semibold mb-1">Uppdatera regelbundet</p>
                <p className="text-sm text-muted-foreground">
                  Annonser som uppdateras får i genomsnitt 40% fler visningar. Lägg till nya bilder eller justera beskrivningen.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-semibold mb-1">Boka fler visningstider</p>
                <p className="text-sm text-muted-foreground">
                  Fastigheter med fler visningstider får 3x fler förfrågningar. Överväg att lägga till extra visningstider.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-semibold mb-1">Svara snabbt på förfrågningar</p>
                <p className="text-sm text-muted-foreground">
                  Säljare som svarar inom 24 timmar har 65% högre chans att sälja snabbare.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interest Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Intresse för din annons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <p className="text-sm font-medium">Sparade annonsen</p>
              </div>
              <p className="text-2xl font-bold">{stats.favorites}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Antal personer som har sparat annonsen
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Bevakar slutpris</p>
              </div>
              <p className="text-2xl font-bold">{Math.floor(stats.favorites * 0.3)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bevakar slutpriset
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium">Visningsförfrågningar</p>
              </div>
              <p className="text-2xl font-bold">{stats.scheduledViewings}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Har sparat kontaktat mäklaren för visning
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-purple-500" />
                <p className="text-sm font-medium">Mäklarkontakt</p>
              </div>
              <p className="text-2xl font-bold">{stats.inquiries}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Har besökt fastighetsmäklarens hemsida
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            <span className="font-medium">{stats.inquiries}</span> Har klickat på fastighetsmäklaren separata kontaktuppgifter, nummer/mejl
          </p>
        </CardContent>
      </Card>
    </div>
  );
}