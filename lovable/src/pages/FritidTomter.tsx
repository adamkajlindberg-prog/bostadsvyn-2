import React, { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import SEOOptimization from '@/components/seo/SEOOptimization';
import CategoryAISearch from '@/components/CategoryAISearch';
import FritidsProperties from '@/components/FritidsProperties';
import FritidsMap from '@/components/FritidsMap';
import PropertyCard from '@/components/PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Trees, Waves, Mountain, Filter, CheckCircle, FileText, Lightbulb, AlertCircle, TrendingUp, Shield, Zap, Droplet, Wifi, Ruler, Building, Leaf, Euro, Clock, Award, Search, MapPin, Sun, Compass, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
const FritidTomter = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('ALL');
  const [environment, setEnvironment] = useState<string>('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [recommendedProperties, setRecommendedProperties] = useState<any[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const minPriceNum = useMemo(() => minPrice ? Number(minPrice) : undefined, [minPrice]);
  const maxPriceNum = useMemo(() => maxPrice ? Number(maxPrice) : undefined, [maxPrice]);
  useEffect(() => {
    loadRecommendedProperties();
  }, []);
  const loadRecommendedProperties = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('properties').select('*').in('property_type', ['COTTAGE', 'PLOT']).in('status', ['FOR_SALE', 'COMING_SOON']).order('created_at', {
        ascending: false
      }).limit(3);
      if (error) throw error;
      setRecommendedProperties(data || []);
    } catch (error) {
      console.error('Error loading recommended properties:', error);
    } finally {
      setLoadingRecommended(false);
    }
  };
  return <div className="min-h-screen bg-background">
      <SEOOptimization title="Fritidshus & Tomter - Sommarstuga, fritidstomter och rekreation | Bostadsvyn" description="Hitta din perfekta fritidsbostad eller tomt. Från charmiga sommarstugor vid havet till skogsgläntor för ditt drömhus. Hela Sverige på ett ställe." keywords="fritidshus, sommarstuga, fritidstomt, byggtomt, skärgård, fjälltomter, skogstomt, havsnära, rekreation" />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-ocean rounded-lg p-3 shadow-glow">
              <Home className="h-8 w-8 text-background" />
            </div>
            <Badge className="bg-success text-success-foreground">Över 15,000 objekt</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            Fritidshus & Tomter
          </h1>
          <p className="text-lg text-foreground font-medium max-w-3xl mx-auto leading-relaxed">
            Upptäck din perfekta tillflyktsort. Från charmiga sommarstugor vid havet till skogsgläntor 
            och fjälltomter där du kan bygga ditt drömhus för avkoppling och rekreation.
          </p>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <FritidsMap />
        </div>

        {/* AI Search Section */}
        <CategoryAISearch categoryType="fritid" categoryLabel="Fritidshus & Tomter" categoryDescription="Vår AI förstår din sökning och prioriterar fritidshus och tomter. Om inga exakta matchningar finns visas liknande fritidsobjekt baserat på dina kriterier." placeholder="Exempel: Sommarstuga vid sjö i Dalarna, 3 sovrum, egen brygga" />

        {/* Search Filters */}
        

        {/* Properties List */}
        

        {/* Categories */}
        

        {/* Recommended Properties */}
        

        {/* Important Information Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Viktig information för fritidshusköpare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Allt du behöver veta innan du investerar i en fritidsbostad eller tomt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Regulations & Permits */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Tillstånd & Bygglov</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Kontrollera detaljplan och områdesbestämmelser hos kommunen</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Verifiera byggrätt och maximal byggnadsarea</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Undersök strandskyddsbestämmelser (minst 100m från strand)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Kontrollera allemansrättsliga begränsningar</p>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 rounded-lg p-2">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Infrastruktur</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Elförsörjning: Finns elnät eller krävs solceller/generator?</p>
                </div>
                <div className="flex items-start gap-2">
                  <Droplet className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Vatten: Kommunalt, egen brunn eller vattentank?</p>
                </div>
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Avlopp: Kommunalt, egen anläggning eller torrtoalett?</p>
                </div>
                <div className="flex items-start gap-2">
                  <Wifi className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Fiber/Bredband: Kontrollera täckning för uppkoppling</p>
                </div>
              </CardContent>
            </Card>

            {/* Economics */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 rounded-lg p-2">
                    <Euro className="h-5 w-5 text-success" />
                  </div>
                  <CardTitle className="text-lg">Ekonomi & Kostnader</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Fastighetsavgift: 0,75% av taxeringsvärdet årligen</p>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Försäkring: Särskild för fritidshus, budgetera 3,000-8,000 kr/år</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Underhåll: Räkna med 1-2% av fastighetsvärdet årligen</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Driftskostnader: El, snöröjning, sophämtning</p>
                </div>
              </CardContent>
            </Card>

            {/* Access & Location */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-premium/10 rounded-lg p-2">
                    <MapPin className="h-5 w-5 text-premium" />
                  </div>
                  <CardTitle className="text-lg">Läge & Tillgänglighet</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Vägtillgång: Framkomlig året runt eller säsongsvista?</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Snöröjning: Privat, samfällighet eller kommunal?</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Avstånd till service: Mataffär, apotek, sjukvård</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-premium mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Restid från hemmet: Planera för helgpendling</p>
                </div>
              </CardContent>
            </Card>

            {/* Environment */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 rounded-lg p-2">
                    <Leaf className="h-5 w-5 text-success" />
                  </div>
                  <CardTitle className="text-lg">Miljö & Natur</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Naturvärden: Kontrollera om området är naturreservat</p>
                </div>
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Skyddsområden: Biotopskydd eller Natura 2000-områden</p>
                </div>
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Markegenskaper: Lermark, berg, fuktig eller torr mark?</p>
                </div>
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Radon: Kontrollera radonhalter i området</p>
                </div>
              </CardContent>
            </Card>

            {/* Legal Aspects */}
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-critical/10 rounded-lg p-2">
                    <Shield className="h-5 w-5 text-critical" />
                  </div>
                  <CardTitle className="text-lg">Juridik & Avtal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Lantmäterihandlingar: Kontrollera fastighetsgränser</p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Servitut: Väg-, vatten-, el-rättigheter för grannar</p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Samfälligheter: Avgifter och skyldigheter i områden</p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Köpeavtal: Använd Svensk Mäklarstatistik standardavtal</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Buyer Tips */}
        

        {/* CTA Section */}
        
      </main>
      
      <LegalFooter />
    </div>;
};
export default FritidTomter;