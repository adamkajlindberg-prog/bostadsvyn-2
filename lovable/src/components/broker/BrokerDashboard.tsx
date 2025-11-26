import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Home, Users, MessageSquare, Calendar, DollarSign, Target, Clock, Star, Phone, Mail, MapPin, BarChart3, Trophy, Briefcase, Award, Eye, FileText, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
interface BrokerStats {
  totalListings: number;
  activeListings: number;
  soldThisMonth: number;
  totalRevenue: number;
  averageDaysOnMarket: number;
  clientsCount: number;
  leadsCount: number;
  conversionRate: number;
  averageRating: number;
  totalViews: number;
  scheduledViewings: number;
  pendingInquiries: number;
}
interface RecentActivity {
  id: string;
  type: 'listing' | 'sale' | 'inquiry' | 'viewing' | 'client';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  value?: number;
}
interface TopProperty {
  id: string;
  title: string;
  price: number;
  views: number;
  inquiries: number;
  viewings: number;
  daysOnMarket: number;
  status: 'active' | 'pending' | 'sold';
}
export function BrokerDashboard() {
  const {
    user,
    userRoles
  } = useAuth();
  const {
    toast
  } = useToast();
  const [stats, setStats] = useState<BrokerStats>({
    totalListings: 0,
    activeListings: 0,
    soldThisMonth: 0,
    totalRevenue: 0,
    averageDaysOnMarket: 0,
    clientsCount: 0,
    leadsCount: 0,
    conversionRate: 0,
    averageRating: 0,
    totalViews: 0,
    scheduledViewings: 0,
    pendingInquiries: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [isLoading, setIsLoading] = useState(true);
  const isBroker = userRoles.includes('broker') || userRoles.includes('admin');
  useEffect(() => {
    if (user && isBroker) {
      loadBrokerData();
    }
  }, [user, isBroker, selectedPeriod]);
  const loadBrokerData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadStats(), loadRecentActivity(), loadTopProperties()]);
    } catch (error) {
      console.error('Error loading broker data:', error);
      toast({
        title: 'Fel vid laddning',
        description: 'Kunde inte ladda mäklardata',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const loadStats = async () => {
    try {
      // Load broker's properties
      const {
        data: properties,
        error: propertiesError
      } = await supabase.from('properties').select('*').eq('user_id', user?.id);
      if (propertiesError) throw propertiesError;
      const activeListings = properties?.filter(p => p.status === 'FOR_SALE').length || 0;
      const soldProperties = properties?.filter(p => p.status === 'SOLD').length || 0;

      // Load property views
      const {
        data: views,
        error: viewsError
      } = await supabase.from('property_views').select('*').in('property_id', properties?.map(p => p.id) || []);
      if (viewsError) throw viewsError;

      // Load inquiries
      const {
        data: inquiries,
        error: inquiriesError
      } = await supabase.from('property_inquiries').select('*').in('property_id', properties?.map(p => p.id) || []);
      if (inquiriesError) throw inquiriesError;
      const pendingInquiries = inquiries?.filter(i => i.status === 'new').length || 0;

      // Mock additional stats for demonstration
      setStats({
        totalListings: properties?.length || 0,
        activeListings,
        soldThisMonth: soldProperties,
        totalRevenue: soldProperties * 2500000,
        // Average revenue per sale
        averageDaysOnMarket: 45,
        clientsCount: 24,
        leadsCount: 18,
        conversionRate: 72,
        averageRating: 4.8,
        totalViews: views?.length || 0,
        scheduledViewings: 8,
        pendingInquiries
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  const loadRecentActivity = async () => {
    try {
      // Mock recent activity for demonstration
      const activities: RecentActivity[] = [{
        id: '1',
        type: 'inquiry',
        title: 'Ny förfrågan',
        description: 'Anna Svensson frågade om "Rymlig 3:a på Östermalm"',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'new'
      }, {
        id: '2',
        type: 'viewing',
        title: 'Visning bokad',
        description: 'Erik Johansson bokade visning för imorgon kl 15:00',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled'
      }, {
        id: '3',
        type: 'sale',
        title: 'Fastighet såld',
        description: 'Villa i Danderyd såld för 8,500,000 kr',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        value: 8500000,
        status: 'completed'
      }];
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };
  const loadTopProperties = async () => {
    try {
      // Mock top properties for demonstration
      const properties: TopProperty[] = [{
        id: '1',
        title: 'Rymlig 3:a med balkong, Östermalm',
        price: 4500000,
        views: 342,
        inquiries: 12,
        viewings: 8,
        daysOnMarket: 15,
        status: 'active'
      }, {
        id: '2',
        title: 'Modern villa med trädgård, Danderyd',
        price: 8900000,
        views: 156,
        inquiries: 6,
        viewings: 4,
        daysOnMarket: 8,
        status: 'pending'
      }];
      setTopProperties(properties);
    } catch (error) {
      console.error('Error loading top properties:', error);
    }
  };
  if (!isBroker) {
    return <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Mäklarbehörighet krävs</CardTitle>
          <CardDescription>
            Du behöver mäklarbehörighet för att komma åt denna sida.
          </CardDescription>
        </CardContent>
      </Card>;
  }
  if (isLoading) {
    return <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar mäklardata...</p>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="shadow-card bg-gradient-nordic text-white">
        
      </Card>

      {/* Key Metrics */}
      

      {/* Main Content Tabs */}
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Objekt
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Klienter
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Mina objekt</CardTitle>
              <CardDescription>
                Hantera dina aktiva och sålda fastigheter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Objekthantering kommer snart</p>
                <Button className="mt-4" asChild>
                  <a href="/property-management">Gå till fastighetshantering</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Klienthantering</CardTitle>
              <CardDescription>
                Översikt över dina klienter och deras intressen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Klienthantering utvecklas</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Här kommer du kunna se alla dina klienter, deras preferenser och kommunikationshistorik
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Försäljningsanalys</CardTitle>
              <CardDescription>
                Detaljerade insikter om din mäklarverksamhet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold">Försäljningstrend</h3>
                  <p className="text-2xl font-bold text-success mt-2">+15%</p>
                  <p className="text-sm text-muted-foreground">vs förra månaden</p>
                </div>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h3 className="font-semibold">Genomsnittlig försäljningstid</h3>
                  <p className="text-2xl font-bold text-primary mt-2">45 dagar</p>
                  <p className="text-sm text-muted-foreground">Branschsnitt: 60 dagar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}