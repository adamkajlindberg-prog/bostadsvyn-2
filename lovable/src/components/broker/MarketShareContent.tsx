import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, TrendingUp, TrendingDown, Home, Building2, Award } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

type TimePeriod = '7days' | '30days' | '90days' | '6months' | '12months' | '18months';
type PropertyType = 'all' | 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'FARM';
type ViewType = 'broker' | 'office' | 'chain';
type StatusFilter = 'utbud' | 'nya' | 'borttagna' | 'salda';

interface MarketStats {
  totalProperties: number;
  soldProperties: number;
  comingSoon: number;
  marketShare: number;
  avgPrice: number;
  totalArea: number;
}

interface PropertyTypeStats {
  type: string;
  count: number;
  avgPrice: number;
  soldCount: number;
  marketShare: number;
}

interface BrokerRanking {
  broker_id: string;
  broker_name: string;
  office_name: string;
  totalProperties: number;
  soldProperties: number;
  avgPrice: number;
  marketShare: number;
}

interface OfficeRanking {
  office_id: string;
  office_name: string;
  totalBrokers: number;
  totalProperties: number;
  soldProperties: number;
  avgPrice: number;
  marketShare: number;
}

export function MarketShareContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [brokerData, setBrokerData] = useState<any>(null);
  const [officeData, setOfficeData] = useState<any>(null);
  
  // Filters
  const [viewType, setViewType] = useState<ViewType>('broker');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');
  const [propertyTypes, setPropertyTypes] = useState<string[]>(['all']);
  const [statusFilters, setStatusFilters] = useState<StatusFilter[]>(['utbud']);
  const [minRooms, setMinRooms] = useState('');
  const [maxRooms, setMaxRooms] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [area, setArea] = useState('');
  const [showDevelopers, setShowDevelopers] = useState(false);
  const [showNewConstruction, setShowNewConstruction] = useState<'hide' | 'show' | 'only'>('hide');
  const [showCondos, setShowCondos] = useState<'hide' | 'show'>('show');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minLivingArea, setMinLivingArea] = useState('');
  const [maxLivingArea, setMaxLivingArea] = useState('');
  const [tenureType, setTenureType] = useState<string[]>(['all']);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  
  // Stats
  const [brokerStats, setBrokerStats] = useState<MarketStats>({
    totalProperties: 0,
    soldProperties: 0,
    comingSoon: 0,
    marketShare: 0,
    avgPrice: 0,
    totalArea: 0,
  });
  
  const [officeStats, setOfficeStats] = useState<MarketStats>({
    totalProperties: 0,
    soldProperties: 0,
    comingSoon: 0,
    marketShare: 0,
    avgPrice: 0,
    totalArea: 0,
  });

  const [propertyTypeStats, setPropertyTypeStats] = useState<PropertyTypeStats[]>([]);
  const [allBrokersRanking, setAllBrokersRanking] = useState<BrokerRanking[]>([]);
  const [allOfficesRanking, setAllOfficesRanking] = useState<OfficeRanking[]>([]);

  useEffect(() => {
    if (user) {
      loadBrokerData();
    }
  }, [user]);

  useEffect(() => {
    if (brokerData) {
      loadStatistics();
      loadPropertyTypeStatistics();
      loadAllBrokersRanking();
      loadAllOfficesRanking();
    }
  }, [brokerData, viewType, timePeriod, propertyTypes, statusFilters, minRooms, maxRooms, yearFrom, yearTo, area, customDateFrom, customDateTo]);

  const loadBrokerData = async () => {
    try {
      const { data: broker, error: brokerError } = await supabase
        .from('brokers')
        .select('*, broker_offices(*)')
        .eq('user_id', user?.id)
        .single();

      if (brokerError) throw brokerError;
      
      setBrokerData(broker);
      setOfficeData(broker.broker_offices);
    } catch (error) {
      console.error('Error loading broker data:', error);
      toast.error('Kunde inte ladda mäklardata');
    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = () => {
    if (customDateFrom && customDateTo) {
      return { from: new Date(customDateFrom).toISOString(), to: new Date(customDateTo).toISOString() };
    }
    
    const now = new Date();
    const periods: Record<TimePeriod, Date> = {
      '7days': new Date(now.setDate(now.getDate() - 7)),
      '30days': new Date(now.setDate(now.getDate() - 30)),
      '90days': new Date(now.setDate(now.getDate() - 90)),
      '6months': new Date(now.setMonth(now.getMonth() - 6)),
      '12months': new Date(now.setFullYear(now.getFullYear() - 1)),
      '18months': new Date(now.setMonth(now.getMonth() - 18)),
    };
    
    return { from: periods[timePeriod].toISOString(), to: now.toISOString() };
  };

  const togglePropertyType = (type: string) => {
    if (type === 'all') {
      setPropertyTypes(['all']);
    } else {
      const filtered = propertyTypes.filter(t => t !== 'all');
      if (filtered.includes(type)) {
        const newTypes = filtered.filter(t => t !== type);
        setPropertyTypes(newTypes.length === 0 ? ['all'] : newTypes);
      } else {
        setPropertyTypes([...filtered, type]);
      }
    }
  };

  const toggleStatusFilter = (status: StatusFilter) => {
    if (statusFilters.includes(status)) {
      const newFilters = statusFilters.filter(s => s !== status);
      setStatusFilters(newFilters.length === 0 ? ['utbud'] : newFilters);
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const loadStatistics = async () => {
    if (!brokerData) return;
    
    try {
      setLoading(true);
      const dateFilter = getDateFilter();
      
      // Build filter query
      let brokerQuery = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id)
        .gte('created_at', dateFilter.from)
        .lte('created_at', dateFilter.to);
      
      let officeQuery = supabase
        .from('properties')
        .select('*, brokers!inner(office_id)', { count: 'exact' })
        .eq('brokers.office_id', brokerData.office_id)
        .gte('created_at', dateFilter.from)
        .lte('created_at', dateFilter.to);
      
      let marketQuery = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .gte('created_at', dateFilter.from)
        .lte('created_at', dateFilter.to);

      // Apply property type filters
      if (!propertyTypes.includes('all')) {
        brokerQuery = brokerQuery.in('property_type', propertyTypes);
        officeQuery = officeQuery.in('property_type', propertyTypes);
        marketQuery = marketQuery.in('property_type', propertyTypes);
      }
      
      // Apply status filters
      const statusMap = {
        'utbud': 'FOR_SALE',
        'nya': 'FOR_SALE',
        'borttagna': 'REMOVED',
        'salda': 'SOLD'
      };
      
      const statusValues = statusFilters.map(s => statusMap[s]);
      brokerQuery = brokerQuery.in('status', statusValues);
      officeQuery = officeQuery.in('status', statusValues);
      marketQuery = marketQuery.in('status', statusValues);
      
      // Apply room filters
      if (minRooms) {
        const min = parseInt(minRooms);
        brokerQuery = brokerQuery.gte('rooms', min);
        officeQuery = officeQuery.gte('rooms', min);
        marketQuery = marketQuery.gte('rooms', min);
      }
      if (maxRooms) {
        const max = parseInt(maxRooms);
        brokerQuery = brokerQuery.lte('rooms', max);
        officeQuery = officeQuery.lte('rooms', max);
        marketQuery = marketQuery.lte('rooms', max);
      }
      
      // Apply year filters
      if (yearFrom) {
        const year = parseInt(yearFrom);
        brokerQuery = brokerQuery.gte('year_built', year);
        officeQuery = officeQuery.gte('year_built', year);
        marketQuery = marketQuery.gte('year_built', year);
      }
      if (yearTo) {
        const year = parseInt(yearTo);
        brokerQuery = brokerQuery.lte('year_built', year);
        officeQuery = officeQuery.lte('year_built', year);
        marketQuery = marketQuery.lte('year_built', year);
      }
      
      if (area) {
        brokerQuery = brokerQuery.ilike('address_city', `%${area}%`);
        officeQuery = officeQuery.ilike('address_city', `%${area}%`);
        marketQuery = marketQuery.ilike('address_city', `%${area}%`);
      }

      // Execute queries
      const [brokerResult, officeResult, marketResult] = await Promise.all([
        brokerQuery,
        officeQuery,
        marketQuery,
      ]);

      // Calculate broker stats
      const brokerProperties = brokerResult.data || [];
      const brokerSold = brokerProperties.filter(p => p.status === 'SOLD').length;
      const brokerComingSoon = brokerProperties.filter(p => p.status === 'COMING_SOON').length;
      const brokerAvgPrice = brokerProperties.length > 0 
        ? brokerProperties.reduce((sum, p) => sum + (p.price || 0), 0) / brokerProperties.length 
        : 0;
      const brokerTotalArea = brokerProperties.reduce((sum, p) => sum + (p.living_area || 0), 0);

      // Calculate office stats
      const officeProperties = officeResult.data || [];
      const officeSold = officeProperties.filter(p => p.status === 'SOLD').length;
      const officeComingSoon = officeProperties.filter(p => p.status === 'COMING_SOON').length;
      const officeAvgPrice = officeProperties.length > 0
        ? officeProperties.reduce((sum, p) => sum + (p.price || 0), 0) / officeProperties.length
        : 0;
      const officeTotalArea = officeProperties.reduce((sum, p) => sum + (p.living_area || 0), 0);

      // Calculate market share
      const totalMarket = marketResult.count || 1;
      const brokerMarketShare = (brokerProperties.length / totalMarket) * 100;
      const officeMarketShare = (officeProperties.length / totalMarket) * 100;

      setBrokerStats({
        totalProperties: brokerProperties.length,
        soldProperties: brokerSold,
        comingSoon: brokerComingSoon,
        marketShare: brokerMarketShare,
        avgPrice: brokerAvgPrice,
        totalArea: brokerTotalArea,
      });

      setOfficeStats({
        totalProperties: officeProperties.length,
        soldProperties: officeSold,
        comingSoon: officeComingSoon,
        marketShare: officeMarketShare,
        avgPrice: officeAvgPrice,
        totalArea: officeTotalArea,
      });

    } catch (error) {
      console.error('Error loading statistics:', error);
      toast.error('Kunde inte ladda statistik');
    } finally {
      setLoading(false);
    }
  };

  const loadPropertyTypeStatistics = async () => {
    if (!brokerData) return;
    
    try {
      const dateFilter = getDateFilter();
      
      const propertyTypesArray = ['APARTMENT', 'HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND', 'FARM'];
      const typeStatsPromises = propertyTypesArray.map(async (type) => {
        const brokerQuery = supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .eq('user_id', user?.id)
          .eq('property_type', type)
          .gte('created_at', dateFilter.from)
          .lte('created_at', dateFilter.to);

        const marketQuery = supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .eq('property_type', type)
          .gte('created_at', dateFilter.from)
          .lte('created_at', dateFilter.to);

        const [brokerResult, marketResult] = await Promise.all([brokerQuery, marketQuery]);
        
        const brokerProperties = brokerResult.data || [];
        const totalMarket = marketResult.count || 1;
        const soldCount = brokerProperties.filter(p => p.status === 'SOLD').length;
        const avgPrice = brokerProperties.length > 0 
          ? brokerProperties.reduce((sum, p) => sum + (p.price || 0), 0) / brokerProperties.length 
          : 0;

        return {
          type,
          count: brokerProperties.length,
          avgPrice,
          soldCount,
          marketShare: (brokerProperties.length / totalMarket) * 100,
        };
      });

      const stats = await Promise.all(typeStatsPromises);
      setPropertyTypeStats(stats.filter(s => s.count > 0));
    } catch (error) {
      console.error('Error loading property type statistics:', error);
    }
  };

  const loadAllBrokersRanking = async () => {
    try {
      const dateFilter = getDateFilter();
      
      const { data: brokers, error } = await supabase
        .from('brokers')
        .select('user_id, broker_name, office_id, broker_offices(office_name)');

      if (error) throw error;

      const rankings: BrokerRanking[] = [];
      
      for (const broker of brokers || []) {
        const { data: properties } = await supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .eq('user_id', broker.user_id)
          .gte('created_at', dateFilter.from)
          .lte('created_at', dateFilter.to);

        if (properties && properties.length > 0) {
          const { count: marketTotal } = await supabase
            .from('properties')
            .select('*', { count: 'exact' })
            .gte('created_at', dateFilter.from)
            .lte('created_at', dateFilter.to);

          rankings.push({
            broker_id: broker.user_id,
            broker_name: broker.broker_name,
            office_name: broker.broker_offices?.office_name || 'Okänt kontor',
            totalProperties: properties.length,
            soldProperties: properties.filter(p => p.status === 'SOLD').length,
            avgPrice: properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length,
            marketShare: ((properties.length / (marketTotal || 1)) * 100),
          });
        }
      }

      setAllBrokersRanking(rankings.sort((a, b) => b.totalProperties - a.totalProperties));
    } catch (error) {
      console.error('Error loading brokers ranking:', error);
    }
  };

  const loadAllOfficesRanking = async () => {
    try {
      const dateFilter = getDateFilter();
      
      const { data: offices, error } = await supabase
        .from('broker_offices')
        .select('id, office_name');

      if (error) throw error;

      const rankings: OfficeRanking[] = [];
      
      for (const office of offices || []) {
        const { data: brokers } = await supabase
          .from('brokers')
          .select('user_id')
          .eq('office_id', office.id);

        const brokerIds = brokers?.map(b => b.user_id) || [];
        
        if (brokerIds.length > 0) {
          const { data: properties } = await supabase
            .from('properties')
            .select('*', { count: 'exact' })
            .in('user_id', brokerIds)
            .gte('created_at', dateFilter.from)
            .lte('created_at', dateFilter.to);

          if (properties && properties.length > 0) {
            const { count: marketTotal } = await supabase
              .from('properties')
              .select('*', { count: 'exact' })
              .gte('created_at', dateFilter.from)
              .lte('created_at', dateFilter.to);

            rankings.push({
              office_id: office.id,
              office_name: office.office_name,
              totalBrokers: brokerIds.length,
              totalProperties: properties.length,
              soldProperties: properties.filter(p => p.status === 'SOLD').length,
              avgPrice: properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length,
              marketShare: ((properties.length / (marketTotal || 1)) * 100),
            });
          }
        }
      }

      setAllOfficesRanking(rankings.sort((a, b) => b.totalProperties - a.totalProperties));
    } catch (error) {
      console.error('Error loading offices ranking:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laddar statistik...</p>
        </div>
      </div>
    );
  }

  // Prepare pie chart data
  const pieChartData = allBrokersRanking.slice(0, 10).map((broker, index) => ({
    name: broker.broker_name,
    value: broker.marketShare,
    color: `hsl(${(index * 360) / 10}, 70%, 50%)`
  }));

  const COLORS = pieChartData.map(d => d.color);

  return (
    <div className="flex gap-6">
      {/* Sidebar Filter */}
      <aside className="w-80 flex-shrink-0">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg">Analysfilter</CardTitle>
            <CardDescription>Anpassa din marknadsanalys</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["type", "area", "price"]} className="space-y-2">
              {/* Bostadstyp */}
              <AccordionItem value="type" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span className="font-medium">Bostadstyp</span>
                    {!propertyTypes.includes('all') && (
                      <Badge variant="secondary" className="ml-auto">{propertyTypes.length}</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-all"
                        checked={propertyTypes.includes('all')}
                        onCheckedChange={() => togglePropertyType('all')}
                      />
                      <label htmlFor="type-all" className="text-sm cursor-pointer font-medium">Alla bostadstyper</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-house"
                        checked={propertyTypes.includes('HOUSE')}
                        onCheckedChange={() => togglePropertyType('HOUSE')}
                      />
                      <label htmlFor="type-house" className="text-sm cursor-pointer">Villor</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-townhouse"
                        checked={propertyTypes.includes('TOWNHOUSE')}
                        onCheckedChange={() => togglePropertyType('TOWNHOUSE')}
                      />
                      <label htmlFor="type-townhouse" className="text-sm cursor-pointer">Radhus/Parhus</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-apartment"
                        checked={propertyTypes.includes('APARTMENT')}
                        onCheckedChange={() => togglePropertyType('APARTMENT')}
                      />
                      <label htmlFor="type-apartment" className="text-sm cursor-pointer">Lägenheter</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-land"
                        checked={propertyTypes.includes('LAND')}
                        onCheckedChange={() => togglePropertyType('LAND')}
                      />
                      <label htmlFor="type-land" className="text-sm cursor-pointer">Fritidshus</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-farm"
                        checked={propertyTypes.includes('FARM')}
                        onCheckedChange={() => togglePropertyType('FARM')}
                      />
                      <label htmlFor="type-farm" className="text-sm cursor-pointer">Gårdar/Skog</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="type-commercial"
                        checked={propertyTypes.includes('COMMERCIAL')}
                        onCheckedChange={() => togglePropertyType('COMMERCIAL')}
                      />
                      <label htmlFor="type-commercial" className="text-sm cursor-pointer">Kommersiellt</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Område */}
              <AccordionItem value="area" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">Plats & område</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Område/Ort</Label>
                    <Input
                      placeholder="T.ex. Stockholm, Göteborg..."
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Pris */}
              <AccordionItem value="price" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Pris</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Min pris</Label>
                      <Input
                        placeholder="0 kr"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        type="number"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Max pris</Label>
                      <Input
                        placeholder="∞"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        type="number"
                        className="h-9"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Storlek */}
              <AccordionItem value="size" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span className="font-medium">Storlek</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Antal rum</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={minRooms} onValueChange={setMinRooms}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={maxRooms} onValueChange={setMaxRooms}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Max" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Boarea (m²)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Min"
                        value={minLivingArea}
                        onChange={(e) => setMinLivingArea(e.target.value)}
                        type="number"
                        className="h-9"
                      />
                      <Input
                        placeholder="Max"
                        value={maxLivingArea}
                        onChange={(e) => setMaxLivingArea(e.target.value)}
                        type="number"
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Byggår</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Från"
                        value={yearFrom}
                        onChange={(e) => setYearFrom(e.target.value)}
                        type="number"
                        className="h-9"
                      />
                      <Input
                        placeholder="Till"
                        value={yearTo}
                        onChange={(e) => setYearTo(e.target.value)}
                        type="number"
                        className="h-9"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Egenskaper */}
              <AccordionItem value="features" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="font-medium">Egenskaper</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-balcony"
                      checked={hasBalcony}
                      onCheckedChange={(checked) => setHasBalcony(checked as boolean)}
                    />
                    <label htmlFor="has-balcony" className="text-sm cursor-pointer">Balkong/Uteplats</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-parking"
                      checked={hasParking}
                      onCheckedChange={(checked) => setHasParking(checked as boolean)}
                    />
                    <label htmlFor="has-parking" className="text-sm cursor-pointer">Parkering</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-elevator"
                      checked={hasElevator}
                      onCheckedChange={(checked) => setHasElevator(checked as boolean)}
                    />
                    <label htmlFor="has-elevator" className="text-sm cursor-pointer">Hiss</label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 space-y-2">
              <Button className="w-full" variant="default">
                Tillämpa filter
              </Button>
              <Button className="w-full" variant="outline">
                Spara sökning
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Andelsstatistik</h2>
          <p className="text-muted-foreground">
            Jämför din marknadsandel mot hela marknaden
          </p>
        </div>

        {/* View Type Tabs */}
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)} className="mb-6">
          <TabsList>
            <TabsTrigger value="broker">Mäklare</TabsTrigger>
            <TabsTrigger value="office">Kontor</TabsTrigger>
            <TabsTrigger value="chain">Kedja</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Period Buttons */}
              <div>
                <Label className="text-sm mb-2 block">Period</Label>
                <div className="flex gap-2 flex-wrap">
                  {(['7days', '30days', '90days', '6months', '12months', '18months'] as TimePeriod[]).map((period) => (
                    <Button
                      key={period}
                      size="sm"
                      variant={timePeriod === period ? "default" : "outline"}
                      onClick={() => setTimePeriod(period)}
                    >
                      {period === '7days' ? '7d' : period === '30days' ? '30d' : period === '90days' ? '90d' : period === '6months' ? '6m' : period === '12months' ? '12m' : '18m'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filters */}
              <div>
                <Label className="text-sm mb-2 block">Välj</Label>
                <div className="flex gap-2 flex-wrap">
                  {(['utbud', 'nya', 'borttagna', 'salda'] as StatusFilter[]).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={statusFilters.includes(status) ? "default" : "outline"}
                      onClick={() => toggleStatusFilter(status)}
                    >
                      {status === 'utbud' ? 'Utbud' : status === 'nya' ? 'Nya' : status === 'borttagna' ? 'Borttagna' : 'Sålda'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <Label className="text-sm mb-2 block">Välj datum</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    placeholder="Från och med"
                  />
                  <Input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    placeholder="Till och med"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Marknadsandel - Topp 10</CardTitle>
            <CardDescription>
              Senast uppdaterad: {new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons */}
        <div className="mb-4 flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Ladda ner
          </Button>
          <Button variant="outline" size="sm">
            Exportera Excel
          </Button>
          <Button variant="outline" size="sm">
            Exportera CSV
          </Button>
        </div>

        {/* Rankings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {viewType === 'broker' ? 'Mäklarranking' : viewType === 'office' ? 'Kontorsranking' : 'Kedjor'}
            </CardTitle>
            <CardDescription>Baserat på antal aktiva objekt under vald period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{viewType === 'broker' ? 'Mäklare' : 'Kontor'}</TableHead>
                  <TableHead className="text-right">Andel</TableHead>
                  <TableHead className="text-right">Förändring</TableHead>
                  <TableHead className="text-right">Utbud</TableHead>
                  <TableHead className="text-right">Nya</TableHead>
                  <TableHead className="text-right">Borttagna</TableHead>
                  <TableHead className="text-right">Sålda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewType === 'broker' && allBrokersRanking.slice(0, 20).map((broker, index) => (
                  <TableRow 
                    key={broker.broker_id}
                    className={broker.broker_id === user?.id ? 'bg-primary/10' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{broker.broker_name}</p>
                        <p className="text-sm text-muted-foreground">{broker.office_name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{broker.marketShare.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center text-sm text-success">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +0.2%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{broker.totalProperties}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">{broker.soldProperties}</TableCell>
                  </TableRow>
                ))}
                {viewType === 'office' && allOfficesRanking.slice(0, 20).map((office, index) => (
                  <TableRow 
                    key={office.office_id}
                    className={office.office_id === brokerData?.office_id ? 'bg-primary/10' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{office.office_name}</p>
                        <p className="text-sm text-muted-foreground">{office.totalBrokers} mäklare</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{office.marketShare.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center text-sm text-destructive">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        -0.1%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{office.totalProperties}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">{office.soldProperties}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
