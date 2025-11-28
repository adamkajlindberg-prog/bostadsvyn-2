import React from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import SEOOptimization from '@/components/seo/SEOOptimization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Calendar, Users, Zap, CheckCircle, Star, Home, Ruler, Euro, Shield, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const NyproduktionDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;
      
      try {
        // Fetch main project property
        // @ts-ignore - Suppress type inference depth error
        const projectResponse = await supabase
          .from('properties')
          .select('*')
          .eq('id', projectId)
          .limit(1);

        if (projectResponse.error) throw projectResponse.error;
        
        const projectData = projectResponse.data?.[0];
        if (!projectData) {
          setLoading(false);
          return;
        }
        
        // Fetch all units belonging to this project
        // @ts-ignore - Suppress type inference depth error
        const unitsResponse = await supabase
          .from('properties')
          .select('id, title, price, living_area, rooms, status, images')
          .eq('nyproduktion_project_id', projectId)
          .order('price', { ascending: true });

        if (unitsResponse.error) throw unitsResponse.error;
        
        setProject(projectData);
        setUnits(unitsResponse.data || []);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div>Laddar projekt...</div>
    </div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div>Projektet hittades inte</div>
    </div>;
  }

  const availableUnitsCount = units.filter(u => u.status === 'FOR_SALE' || u.status === 'COMING_SOON').length;
  const minPrice = units.length > 0 ? Math.min(...units.map(u => u.price)) : 0;
  const soldPercentage = project.nyproduktion_total_units > 0 
    ? Math.round((1 - availableUnitsCount / project.nyproduktion_total_units) * 100) 
    : 0;
  
  const projectForDisplay = {
    id: project.id as string,
    name: project.title as string,
    location: project.address_city as string,
    description: (project.description || 'Nyproduktionsprojekt') as string,
    fullDescription: (project.description || 'Information om projektet kommer snart.') as string,
    priceFrom: units.length > 0 ? `${(minPrice / 1000000).toFixed(1)}M kr` : 'Pris kommer',
    image: (project.images?.[0] as string) || '/lovable-uploads/6460350a-4407-412d-802c-ca99c2bfd9e3.png',
    status: project.status === 'COMING_SOON' ? 'Lanseras snart' : 'Säljs nu',
    soldPercentage: `${soldPercentage}%`,
    energyClass: (project.energy_class || 'Ej angiven') as string,
    developer: 'Utvecklare ej angiven',
    completionDate: project.year_built ? `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${project.year_built}` : 'Ej angiven',
    totalUnits: project.nyproduktion_total_units || units.length,
    availableUnits: availableUnitsCount,
    features: (project.features || [
      'Modern arkitektur',
      'Hög standard',
      'Bra läge'
    ]) as string[],
    units: units.map(unit => ({
      id: unit.id as string | number,
      name: unit.title as string,
      area: (unit.living_area || 0) as number,
      rooms: (unit.rooms || 0) as number,
      floor: 0,
      price: unit.price as number,
      available: unit.status === 'FOR_SALE' || unit.status === 'COMING_SOON'
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimization 
        title={`${project.name} - Nyproduktion | Bostadsvyn`}
        description={project.description}
        keywords={`${project.name}, nyproduktion, ${project.location}, nya lägenheter`}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden mb-6">
            <img 
              src={project.image} 
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-premium text-premium-foreground">
                {project.status}
              </Badge>
              <Badge className="bg-success text-success-foreground">
                {project.soldPercentage} sålt
              </Badge>
            </div>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{project.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-premium mb-2">Från {project.priceFrom}</div>
              <div className="flex items-center gap-2 justify-end">
                <Star className="h-5 w-5 text-accent fill-current" />
                <span className="text-sm">{project.energyClass} energiklass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold mb-1">{project.totalUnits}</div>
              <p className="text-sm text-muted-foreground">Totalt antal enheter</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Home className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold mb-1">{project.availableUnits}</div>
              <p className="text-sm text-muted-foreground">Tillgängliga</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold mb-1">{project.completionDate}</div>
              <p className="text-sm text-muted-foreground">Inflyttning</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-premium" />
              <div className="text-2xl font-bold mb-1">{project.developer}</div>
              <p className="text-sm text-muted-foreground">Byggare</p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Om projektet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {project.fullDescription}
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Egenskaper & faciliteter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Units */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Tillgängliga lägenheter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.units.map((unit) => (
              <Card key={unit.id} className={!unit.available ? 'opacity-50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{unit.name}</CardTitle>
                    {unit.available ? (
                      <Badge className="bg-success text-success-foreground">Tillgänglig</Badge>
                    ) : (
                      <Badge variant="outline">Såld</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ruler className="h-4 w-4" />
                        <span>{unit.area} m²</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>Våning {unit.floor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{(unit.price / 1000000).toFixed(1)}M kr</span>
                      <span className="text-sm text-muted-foreground">{Math.round(unit.price / unit.area)} kr/m²</span>
                    </div>
                  </div>
                  {unit.available && (
                    <Button className="w-full bg-premium hover:bg-premium-dark">
                      <Calendar className="h-4 w-4 mr-2" />
                      Boka visning
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-premium text-premium-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Intresserad av detta projekt?</h2>
            <p className="mb-6 opacity-90">
              Få mer information och boka en visning redan idag
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-premium-foreground text-premium-foreground hover:bg-premium-foreground hover:text-premium">
                <Users className="h-5 w-5 mr-2" />
                Intresseanmälan
              </Button>
              <Button size="lg" className="bg-premium-foreground text-premium hover:bg-premium-foreground/90">
                <Calendar className="h-5 w-5 mr-2" />
                Boka visning
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <LegalFooter />
    </div>
  );
};

export default NyproduktionDetail;
