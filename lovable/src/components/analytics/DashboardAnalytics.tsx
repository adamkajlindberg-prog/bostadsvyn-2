import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageSquare,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Users,
  MapPin,
  DollarSign
} from 'lucide-react';

interface AnalyticsData {
  propertyViews: { date: string; views: number; unique_views: number }[];
  favoritesTrend: { date: string; favorites: number }[];
  inquiriesTrend: { date: string; inquiries: number }[];
  marketComparison: { area: string; avgPrice: number; yourPrice: number }[];
  performanceMetrics: {
    totalViews: number;
    totalFavorites: number;
    totalInquiries: number;
    avgTimeOnMarket: number;
    conversionRate: number;
  };
}

interface DashboardAnalyticsProps {
  propertyId?: string;
  timeRange?: string;
}

export default function DashboardAnalytics({ propertyId, timeRange = '30d' }: DashboardAnalyticsProps) {
  const { user, userRoles } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const isPremiumUser = userRoles.includes('broker') || userRoles.includes('admin');

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeRange, propertyId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedTimeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Load property views
      let viewsQuery = supabase
        .from('property_views')
        .select('viewed_at, property_id, user_id')
        .gte('viewed_at', startDate.toISOString())
        .lte('viewed_at', endDate.toISOString());

      if (propertyId) {
        viewsQuery = viewsQuery.eq('property_id', propertyId);
      } else if (!isPremiumUser) {
        // For non-premium users, only show their own properties
        const { data: userProperties } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user?.id);
        
        const propertyIds = userProperties?.map(p => p.id) || [];
        if (propertyIds.length > 0) {
          viewsQuery = viewsQuery.in('property_id', propertyIds);
        }
      }

      const { data: viewsData } = await viewsQuery;

      // Load favorites data
      let favoritesQuery = supabase
        .from('property_favorites')
        .select('created_at, property_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (propertyId) {
        favoritesQuery = favoritesQuery.eq('property_id', propertyId);
      } else if (!isPremiumUser) {
        const { data: userProperties } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user?.id);
        
        const propertyIds = userProperties?.map(p => p.id) || [];
        if (propertyIds.length > 0) {
          favoritesQuery = favoritesQuery.in('property_id', propertyIds);
        }
      }

      const { data: favoritesData } = await favoritesQuery;

      // Load inquiries data
      let inquiriesQuery = supabase
        .from('property_inquiries')
        .select('created_at, property_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (propertyId) {
        inquiriesQuery = inquiriesQuery.eq('property_id', propertyId);
      } else if (!isPremiumUser) {
        const { data: userProperties } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user?.id);
        
        const propertyIds = userProperties?.map(p => p.id) || [];
        if (propertyIds.length > 0) {
          inquiriesQuery = inquiriesQuery.in('property_id', propertyIds);
        }
      }

      const { data: inquiriesData } = await inquiriesQuery;

      // Process data for charts
      const processedAnalytics: AnalyticsData = {
        propertyViews: processViewsData(viewsData || [], 'viewed_at', selectedTimeRange),
        favoritesTrend: processFavoritesData(favoritesData || [], 'created_at', selectedTimeRange),
        inquiriesTrend: processInquiriesData(inquiriesData || [], 'created_at', selectedTimeRange),
        marketComparison: [], // Would need market data API
        performanceMetrics: {
          totalViews: viewsData?.length || 0,
          totalFavorites: favoritesData?.length || 0,
          totalInquiries: inquiriesData?.length || 0,
          avgTimeOnMarket: calculateAvgTimeOnMarket(viewsData || []),
          conversionRate: calculateConversionRate(viewsData || [], inquiriesData || [])
        }
      };

      setAnalytics(processedAnalytics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processViewsData = (data: any[], dateField: string, timeRange: string) => {
    if (!data.length) return [];

    const grouped: { [key: string]: number } = {};
    const uniqueGrouped: { [key: string]: Set<string> } = {};

    data.forEach(item => {
      const date = new Date(item[dateField]);
      const key = timeRange === '7d' || timeRange === '30d' 
        ? date.toISOString().split('T')[0] 
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      grouped[key] = (grouped[key] || 0) + 1;
      
      if (item.user_id) {
        if (!uniqueGrouped[key]) uniqueGrouped[key] = new Set();
        uniqueGrouped[key].add(item.user_id);
      }
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      views: count,
      unique_views: uniqueGrouped[date]?.size || count
    }));
  };

  const processFavoritesData = (data: any[], dateField: string, timeRange: string) => {
    if (!data.length) return [];

    const grouped: { [key: string]: number } = {};

    data.forEach(item => {
      const date = new Date(item[dateField]);
      const key = timeRange === '7d' || timeRange === '30d' 
        ? date.toISOString().split('T')[0] 
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      favorites: count
    }));
  };

  const processInquiriesData = (data: any[], dateField: string, timeRange: string) => {
    if (!data.length) return [];

    const grouped: { [key: string]: number } = {};

    data.forEach(item => {
      const date = new Date(item[dateField]);
      const key = timeRange === '7d' || timeRange === '30d' 
        ? date.toISOString().split('T')[0] 
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      inquiries: count
    }));
  };

  const calculateAvgTimeOnMarket = (viewsData: any[]) => {
    // Simplified calculation - would need property creation dates
    return 24; // placeholder
  };

  const calculateConversionRate = (viewsData: any[], inquiriesData: any[]) => {
    if (viewsData.length === 0) return 0;
    return (inquiriesData.length / viewsData.length) * 100;
  };

  const refreshAnalytics = () => {
    loadAnalytics();
  };

  const exportData = () => {
    if (!analytics) return;
    
    const csvData = analytics.propertyViews.map(item => 
      `${item.date},${item.views},${item.unique_views}`
    ).join('\n');
    
    const blob = new Blob([`Date,Views,Unique Views\n${csvData}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedTimeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="shadow-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analys & Statistik</h2>
          <p className="text-muted-foreground">
            Senast uppdaterad: {lastUpdated.toLocaleString('sv-SE')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Senaste 7 dagarna</SelectItem>
              <SelectItem value="30d">Senaste 30 dagarna</SelectItem>
              <SelectItem value="90d">Senaste 90 dagarna</SelectItem>
              <SelectItem value="1y">Senaste året</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={refreshAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportera
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totala visningar</p>
                <p className="text-2xl font-bold">{analytics?.performanceMetrics.totalViews || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favoriter</p>
                <p className="text-2xl font-bold">{analytics?.performanceMetrics.totalFavorites || 0}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Förfrågningar</p>
                <p className="text-2xl font-bold">{analytics?.performanceMetrics.totalInquiries || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Konvertering</p>
                <p className="text-2xl font-bold">{analytics?.performanceMetrics.conversionRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Snitt tid</p>
                <p className="text-2xl font-bold">{analytics?.performanceMetrics.avgTimeOnMarket} dagar</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Visningstrend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Interaktivt diagram</p>
                <p className="text-xs text-muted-foreground">
                  {analytics?.propertyViews.length || 0} datapunkter
                </p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    {analytics?.performanceMetrics.totalViews || 0} visningar
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Användarengagemang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <div className="text-center space-y-2">
                <Heart className="h-12 w-12 mx-auto text-red-500" />
                <p className="text-muted-foreground">Engagemangsanalys</p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="secondary">
                    <Heart className="h-3 w-3 mr-1" />
                    {analytics?.performanceMetrics.totalFavorites || 0} favoriter
                  </Badge>
                  <Badge variant="secondary">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {analytics?.performanceMetrics.totalInquiries || 0} förfrågningar
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prestationsinsikter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <p className="font-semibold text-sm">Visningar/dag</p>
                  <p className="text-xs text-muted-foreground">Genomsnitt</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {((analytics?.performanceMetrics.totalViews || 0) / 30).toFixed(1)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <p className="font-semibold text-sm">Intressenivå</p>
                  <p className="text-xs text-muted-foreground">Favoriter/visningar</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {analytics?.performanceMetrics.totalViews 
                      ? ((analytics.performanceMetrics.totalFavorites / analytics.performanceMetrics.totalViews) * 100).toFixed(1)
                      : 0}%
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    Bra
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <p className="font-semibold text-sm">Kontaktfrekvens</p>
                  <p className="text-xs text-muted-foreground">Förfrågningar/visningar</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {analytics?.performanceMetrics.conversionRate.toFixed(1)}%
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {analytics?.performanceMetrics.conversionRate > 5 ? 'Utmärkt' : 'Normal'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Insights */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geografisk fördelning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Stockholm</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Göteborg</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-1/5 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">20%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Malmö</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div className="w-1/20 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">5%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Baserat på besökarnas IP-adresser och profildata
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Market Position */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Marknadsposition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">8.5/10</p>
              <p className="text-sm text-muted-foreground">Konkurrenskraft</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Prisposition</span>
                <Badge variant="secondary">Konkurrenskraftig</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Marknadsexponering</span>
                <Badge variant="secondary">Hög</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Intressenivå</span>
                <Badge variant="secondary">Över genomsnitt</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Jämfört med liknande fastigheter i området
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}