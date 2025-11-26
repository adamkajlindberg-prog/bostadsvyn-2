import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Eye, Users, TrendingUp, ArrowLeft, Home, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import PropertyCard from '@/components/PropertyCard';

interface ProjectStats {
  totalViews: number;
  totalInterest: number;
  unitsAvailable: number;
  unitsReserved: number;
  unitsSold: number;
}

const ProjectStatistics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalViews: 0,
    totalInterest: 0,
    unitsAvailable: 0,
    unitsReserved: 0,
    unitsSold: 0
  });

  useEffect(() => {
    if (id && user) {
      loadProjectData();
    }
  }, [id, user]);

  const loadProjectData = async () => {
    try {
      setLoading(true);

      // Load project property
      const { data: projectData, error: projectError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('is_nyproduktion', true)
        .single();

      if (projectError) throw projectError;
      if (!projectData) {
        toast.error('Projektet hittades inte');
        navigate('/broker-portal');
        return;
      }

      setProject(projectData);

      // Load all units in this project
      // @ts-ignore - Supabase type inference issue
      const { data: unitsData, error: unitsError } = await supabase
        .from('properties')
        .select('*')
        .eq('nyproduktion_project_id', id)
        .order('created_at', { ascending: false });

      if (unitsError) throw unitsError;
      setUnits(unitsData || []);

      // Calculate stats
      const totalViews = 450; // Mock data - would come from property_views table
      const totalInterest = 87; // Mock data - would come from property_inquiries
      const unitsAvailable = (unitsData || []).filter(u => u.status === 'FOR_SALE').length;
      const unitsReserved = (unitsData || []).filter(u => u.status === 'RESERVED').length;
      const unitsSold = (unitsData || []).filter(u => u.status === 'SOLD').length;

      setStats({
        totalViews,
        totalInterest,
        unitsAvailable,
        unitsReserved,
        unitsSold
      });
    } catch (error) {
      console.error('Error loading project data:', error);
      toast.error('Kunde inte ladda projektdata');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center p-12">
              <p className="text-muted-foreground">Projektet hittades inte</p>
              <Button onClick={() => navigate('/broker-portal')} className="mt-4">
                Tillbaka till portalen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/broker-portal')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka till mäklarportalen
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">{project.title}</h1>
              </div>
              <p className="text-muted-foreground">
                {project.address_street}, {project.address_city}
              </p>
              <Badge variant="secondary" className="mt-2">
                {project.nyproduktion_total_units} enheter
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="statistics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="units" className="gap-2">
              <Home className="h-4 w-4" />
              Enheter ({units.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Totala visningar</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Projekt + alla enheter
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Intresseanmälningar</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInterest}</div>
                  <p className="text-xs text-muted-foreground">
                    Totalt för projektet
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tillgängliga</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.unitsAvailable}</div>
                  <p className="text-xs text-muted-foreground">
                    Lediga enheter
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sålda/Reserverade</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unitsSold + stats.unitsReserved}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.unitsSold} sålda, {stats.unitsReserved} reserverade
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Projektinformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.description && (
                  <div>
                    <h3 className="font-medium mb-2">Beskrivning</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Totalt antal enheter</p>
                    <p className="font-medium">{project.nyproduktion_total_units} st</p>
                  </div>
                  {project.year_built && (
                    <div>
                      <p className="text-sm text-muted-foreground">Byggår</p>
                      <p className="font-medium">{project.year_built}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={project.status === 'FOR_SALE' ? 'default' : 'secondary'}>
                      {project.status === 'FOR_SALE' ? 'Till salu' : project.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alla enheter i projektet</CardTitle>
              </CardHeader>
              <CardContent>
                {units.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Inga enheter har lagts till ännu
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {units.map((unit) => (
                      <PropertyCard
                        key={unit.id}
                        property={{
                          id: unit.id,
                          title: unit.title,
                          price: unit.price,
                          property_type: unit.property_type,
                          status: unit.status,
                          address_street: unit.address_street,
                          address_postal_code: unit.address_postal_code,
                          address_city: unit.address_city,
                          living_area: unit.living_area,
                          rooms: unit.rooms,
                          bedrooms: unit.bedrooms,
                          bathrooms: unit.bathrooms,
                          images: unit.images || [],
                          ad_tier: unit.ad_tier,
                          features: unit.features || [],
                          created_at: unit.created_at,
                          user_id: unit.user_id
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <LegalFooter />
    </div>
  );
};

export default ProjectStatistics;
