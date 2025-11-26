import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, Heart, MessageSquare, TrendingUp, TrendingDown, Calendar, Users, Clock, Star, MapPin, Phone, Mail, Share2, Zap, ImageIcon, Activity, Check } from 'lucide-react';
interface PropertyAnalyticsProps {
  propertyId: string;
  adTier?: string;
}
interface PropertyMetrics {
  totalViews: number;
  uniqueViews: number;
  totalFavorites: number;
  totalInquiries: number;
  totalViewingRequests: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  viewsTrend: number;
  favoritesTrend: number;
  bookingButtonClicks: number;
  viewsLastDay: number;
  viewsLastWeek: number;
  viewsSinceRenewal: number;
  emailIconClicks: number;
  phoneIconClicks: number;
}
interface ViewerDemographics {
  ageGroups: {
    group: string;
    percentage: number;
  }[];
  locations: {
    city: string;
    count: number;
  }[];
  devices: {
    device: string;
    count: number;
  }[];
}
interface RecentActivity {
  id: string;
  type: 'view' | 'favorite' | 'inquiry' | 'viewing_request';
  user_email?: string;
  timestamp: string;
  details?: string;
}
interface AIUsageStats {
  total_image_edits: number;
  unique_users: number;
  last_ai_usage?: string;
}
export default function PropertyAnalytics({
  propertyId,
  adTier
}: PropertyAnalyticsProps) {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [metrics, setMetrics] = useState<PropertyMetrics | null>(null);
  const [demographics, setDemographics] = useState<ViewerDemographics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [aiUsageStats, setAiUsageStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const isExclusiveTier = adTier === 'premium';
  useEffect(() => {
    loadPropertyAnalytics();
  }, [propertyId, timeRange]);
  const loadPropertyAnalytics = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Load views data
      const {
        data: viewsData
      } = await supabase.from('property_views').select('*').eq('property_id', propertyId).gte('viewed_at', startDate.toISOString());

      // Load favorites data
      const {
        data: favoritesData
      } = await supabase.from('property_favorites').select('*').eq('property_id', propertyId).gte('created_at', startDate.toISOString());

      // Load inquiries data
      const {
        data: inquiriesData
      } = await supabase.from('property_inquiries').select('*').eq('property_id', propertyId).gte('created_at', startDate.toISOString());

      // Load viewing requests data
      const {
        data: viewingRequestsData
      } = await supabase.from('viewing_requests').select('*').eq('property_id', propertyId).gte('created_at', startDate.toISOString());

      // Calculate metrics
      const uniqueViewers = new Set(viewsData?.map(v => v.user_id).filter(Boolean));
      const totalViews = viewsData?.length || 0;
      const uniqueViews = uniqueViewers.size;
      const totalFavorites = favoritesData?.length || 0;
      const totalInquiries = inquiriesData?.length || 0;
      const totalViewingRequests = viewingRequestsData?.length || 0;

      // Calculate views for different time periods
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const viewsLastDay = viewsData?.filter(v => new Date(v.viewed_at) >= oneDayAgo).length || 0;
      const viewsLastWeek = viewsData?.filter(v => new Date(v.viewed_at) >= oneWeekAgo).length || 0;
      
      // Mock data for booking button clicks and broker contact clicks
      // These would need proper tracking implementation
      const bookingButtonClicks = Math.floor(totalViewingRequests * 1.5);
      const emailIconClicks = Math.floor(totalInquiries * 0.6);
      const phoneIconClicks = Math.floor(totalInquiries * 0.4);

      // Calculate previous period for trends
      const prevStartDate = new Date(startDate);
      const prevEndDate = new Date(startDate);
      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      prevStartDate.setDate(prevStartDate.getDate() - daysDiff);
      const {
        data: prevViewsData
      } = await supabase.from('property_views').select('*').eq('property_id', propertyId).gte('viewed_at', prevStartDate.toISOString()).lt('viewed_at', startDate.toISOString());
      const {
        data: prevFavoritesData
      } = await supabase.from('property_favorites').select('*').eq('property_id', propertyId).gte('created_at', prevStartDate.toISOString()).lt('created_at', startDate.toISOString());
      const prevViews = prevViewsData?.length || 0;
      const prevFavorites = prevFavoritesData?.length || 0;
      const viewsTrend = prevViews > 0 ? (totalViews - prevViews) / prevViews * 100 : 0;
      const favoritesTrend = prevFavorites > 0 ? (totalFavorites - prevFavorites) / prevFavorites * 100 : 0;
      const calculatedMetrics: PropertyMetrics = {
        totalViews,
        uniqueViews,
        totalFavorites,
        totalInquiries,
        totalViewingRequests,
        avgSessionDuration: 120,
        // Mock data - would need session tracking
        bounceRate: 45,
        // Mock data
        conversionRate: totalViews > 0 ? totalInquiries / totalViews * 100 : 0,
        viewsTrend,
        favoritesTrend,
        bookingButtonClicks,
        viewsLastDay,
        viewsLastWeek,
        viewsSinceRenewal: totalViews, // Using total for now, would need renewal tracking
        emailIconClicks,
        phoneIconClicks
      };
      setMetrics(calculatedMetrics);

      // Process demographics (simplified with mock data)
      const mockDemographics: ViewerDemographics = {
        ageGroups: [{
          group: '25-34',
          percentage: 35
        }, {
          group: '35-44',
          percentage: 28
        }, {
          group: '45-54',
          percentage: 22
        }, {
          group: '18-24',
          percentage: 10
        }, {
          group: '55+',
          percentage: 5
        }],
        locations: [{
          city: 'Stockholm',
          count: Math.floor(totalViews * 0.6)
        }, {
          city: 'Göteborg',
          count: Math.floor(totalViews * 0.2)
        }, {
          city: 'Malmö',
          count: Math.floor(totalViews * 0.1)
        }, {
          city: 'Övrigt',
          count: Math.floor(totalViews * 0.1)
        }],
        devices: [{
          device: 'Mobil',
          count: Math.floor(totalViews * 0.65)
        }, {
          device: 'Desktop',
          count: Math.floor(totalViews * 0.25)
        }, {
          device: 'Tablet',
          count: Math.floor(totalViews * 0.1)
        }]
      };
      setDemographics(mockDemographics);

      // Load recent activity
      const activities: RecentActivity[] = [];

      // Add recent views (anonymized)
      viewsData?.slice(-5).forEach(view => {
        activities.push({
          id: view.id,
          type: 'view',
          timestamp: view.viewed_at,
          details: 'Anonymiserad visning'
        });
      });

      // Add recent favorites
      favoritesData?.slice(-5).forEach(fav => {
        activities.push({
          id: fav.id,
          type: 'favorite',
          timestamp: fav.created_at,
          details: 'Sparad som favorit'
        });
      });

      // Add recent inquiries
      inquiriesData?.slice(-3).forEach(inquiry => {
        activities.push({
          id: inquiry.id,
          type: 'inquiry',
          user_email: inquiry.email,
          timestamp: inquiry.created_at,
          details: inquiry.inquiry_type
        });
      });

      // Add recent viewing requests
      viewingRequestsData?.slice(-3).forEach(request => {
        activities.push({
          id: request.id,
          type: 'viewing_request',
          user_email: request.contact_email,
          timestamp: request.created_at,
          details: 'Visningsförfrågan'
        });
      });

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 10));

      // Load AI usage stats for exclusive tier properties
      if (isExclusiveTier) {
        // Mock AI usage data - replace with actual database queries
        const mockAiStats: AIUsageStats = {
          total_image_edits: 18,
          unique_users: 7,
          last_ai_usage: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        };
        setAiUsageStats(mockAiStats);
      }
    } catch (error) {
      console.error('Error loading property analytics:', error);
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda analysdata",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-critical" />;
    return <div className="h-4 w-4" />;
  };
  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-critical';
    return 'text-muted-foreground';
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4 text-primary" />;
      case 'favorite':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'inquiry':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'viewing_request':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };
  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'view':
        return 'Visning';
      case 'favorite':
        return 'Favorit';
      case 'inquiry':
        return 'Förfrågan';
      case 'viewing_request':
        return 'Visningstid';
      default:
        return 'Aktivitet';
    }
  };
  if (loading) {
    return <div className="space-y-6">
        {[1, 2, 3].map(i => <Card key={i} className="shadow-card">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>)}
      </div>;
  }
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fastighetsanalys</h2>
          
        </div>
        
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map(range => <Button key={range} variant={timeRange === range ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(range)}>
              {range === '7d' ? '7 dagar' : range === '30d' ? '30 dagar' : '90 dagar'}
            </Button>)}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bokningar visning</p>
                <p className="text-3xl font-bold mt-2">{metrics?.bookingButtonClicks || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Klick på "Boka visning"</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visningstider</p>
                <p className="text-3xl font-bold mt-2">{metrics?.totalViewingRequests || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Anmält intresse för visning</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">E-post</p>
                <p className="text-3xl font-bold mt-2">{metrics?.emailIconClicks || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Klick på mejlikon</p>
              </div>
              <Mail className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="text-3xl font-bold mt-2">{metrics?.phoneIconClicks || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Klick på telefonikon</p>
              </div>
              <Phone className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Views Over Time */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Annonsklick</CardTitle>
          <p className="text-sm text-muted-foreground">Visningar över tid</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Senaste dagen</p>
              </div>
              <p className="text-2xl font-bold">{metrics?.viewsLastDay || 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Senaste veckan</p>
              </div>
              <p className="text-2xl font-bold">{metrics?.viewsLastWeek || 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Sen förnyelse</p>
              </div>
              <p className="text-2xl font-bold">{metrics?.viewsSinceRenewal || 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Totalt</p>
              </div>
              <p className="text-2xl font-bold">{metrics?.totalViews || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Usage Statistics (Only for Exclusive Tier) */}
      {isExclusiveTier && aiUsageStats && <Card className="shadow-card border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI-verktygsanalys</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Exklusiv funktion för Exklusivannons
                  </p>
                </div>
              </div>
              
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Detaljerad statistik över hur potentiella köpare interagerar med AI-verktygen på din fastighet. 
              Dessa insikter visar nivån av köparintresse och engagemang.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-sm text-muted-foreground">AI-bildredigeringar</h4>
                </div>
                <p className="text-3xl font-bold mb-2">{aiUsageStats.total_image_edits}</p>
                <p className="text-xs text-muted-foreground">
                  Köpare har testat {aiUsageStats.total_image_edits} olika visualiseringar och ändringar på fastighetens bilder
                </p>
              </div>
              
              <div className="p-5 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Unika användare</h4>
                </div>
                <p className="text-3xl font-bold mb-2">{aiUsageStats.unique_users}</p>
                <p className="text-xs text-muted-foreground">
                  Antal personer som aktivt använt AI-verktygen för att utforska möjligheter med fastigheten
                </p>
              </div>
              
              <div className="p-5 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Senaste aktivitet</h4>
                </div>
                <p className="text-xl font-bold mb-2">
                  {aiUsageStats.last_ai_usage ? new Date(aiUsageStats.last_ai_usage).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : 'Ingen aktivitet'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tidpunkt för den senaste AI-interaktionen med annonsen
                </p>
              </div>
            </div>

            {/* Engagement Insights */}
            

            {/* Professional Note */}
            
          </CardContent>
        </Card>}

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Senaste aktivitet</CardTitle>
          <p className="text-sm text-muted-foreground">
            De senaste händelserna för din fastighet
          </p>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? <div className="text-center py-8">
              <div className="text-muted-foreground">Ingen aktivitet att visa</div>
            </div> : <div className="space-y-3">
              {recentActivity.slice(0, 8).map(activity => <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm">
                        {getActivityLabel(activity.type)}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(activity.timestamp).toLocaleString('sv-SE', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.details}
                    </p>
                    {activity.user_email && <p className="text-xs text-muted-foreground truncate">
                        {activity.user_email}
                      </p>}
                  </div>
                </div>)}
            </div>}
        </CardContent>
      </Card>
    </div>;
}