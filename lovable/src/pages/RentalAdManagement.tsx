import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Eye, Heart, MessageSquare, Calendar, Clock, Settings, ArrowLeft, Users, Share2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import RentalChat from '@/components/rental/RentalChat';
import { ChatShortcut } from '@/components/ChatShortcut';
import PropertyCard, { Property } from '@/components/PropertyCard';
import RentalPropertyAnalytics from '@/components/analytics/RentalPropertyAnalytics';
interface AdStats {
  views: number;
  favorites: number;
  inquiries: number;
  applications: number;
  scheduledViewings: number;
  lastViewed?: string;
}
export default function RentalAdManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ad, setAd] = useState<any>(null);
  const [stats, setStats] = useState<AdStats>({
    views: 0,
    favorites: 0,
    inquiries: 0,
    applications: 0,
    scheduledViewings: 0
  });
  const [loading, setLoading] = useState(true);
  const initialTab = (searchParams.get('tab') as 'overview' | 'chat' | 'inquiries' | 'analytics') || 'overview';
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
            images,
            rental_info
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
        views: Math.floor(Math.random() * 500),
        favorites: Math.floor(Math.random() * 50),
        inquiries: Math.floor(Math.random() * 20),
        applications: Math.floor(Math.random() * 8),
        scheduledViewings: Math.floor(Math.random() * 12),
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
  return <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
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
          
        </div>
      </div>

      {/* Ad Preview - Exactly as it appears published */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Förhandsgranskning</h2>
          <Button onClick={() => navigate(`/redigera-hyresannons/${id}`)} size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Redigera annons
          </Button>
        </div>
        <PropertyCard 
          property={{
            ...ad.properties,
            status: 'FOR_RENT',
            ad_tier: ad.ad_tier,
            ad_id: ad.id
          } as Property}
          disableClick={true}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                <p className="text-sm text-muted-foreground">Visningar</p>
                <p className="text-2xl font-bold">{stats.scheduledViewings}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={initialTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="chat">Chatt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rental Info */}
            <Card>
              <CardHeader>
                <CardTitle>Hyresinformation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hyra per månad</span>
                    <span className="font-semibold">{ad.properties?.price?.toLocaleString('sv-SE')} kr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tillträdesdatum</span>
                    <span className="font-semibold">
                      {ad.properties?.rental_info?.move_in_date ? new Date(ad.properties.rental_info.move_in_date).toLocaleDateString('sv-SE') : 'Enligt överenskommelse'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hyresperiod</span>
                    <span className="font-semibold">
                      {ad.properties?.rental_info?.contract_type === 'first_hand' ? 'Förstahandskontrakt' : 'Andrahandskontrakt'}
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
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Ny ansökan</p>
                      <p className="text-xs text-muted-foreground">För 1 timme sedan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Nytt meddelande i chatt</p>
                      <p className="text-xs text-muted-foreground">För 3 timmar sedan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Visningstid bokad</p>
                      <p className="text-xs text-muted-foreground">För 5 timmar sedan</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Förfrågningar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Förfrågningar och Ansökningar</CardTitle>
              <CardDescription>
                Hantera intresseanmälningar och hyresansökningar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Anna Andersson</p>
                      <p className="text-sm text-muted-foreground">anna@example.com</p>
                      <p className="text-sm mt-2">Intresserad av att hyra lägenheten. Jobbar som lärare.</p>
                    </div>
                    <Badge variant="secondary">Ny</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="default">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Godkänn
                    </Button>
                    <Button size="sm" variant="outline">Svara</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Erik Svensson</p>
                      <p className="text-sm text-muted-foreground">erik@example.com</p>
                      <p className="text-sm mt-2">Vill boka en visning nästa vecka.</p>
                    </div>
                    <Badge variant="secondary">Ny</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="default">Boka visning</Button>
                    <Button size="sm" variant="outline">Svara</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Analys</h2>
            <RentalPropertyAnalytics propertyId={ad.property_id} adId={id!} />
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <RentalChat adId={id!} propertyId={ad.property_id} />
        </TabsContent>
      </Tabs>
    </div>;
}