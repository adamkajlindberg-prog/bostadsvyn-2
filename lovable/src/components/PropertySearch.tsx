import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import PropertyCard from './PropertyCard';
import PropertyMap from './PropertyMap';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, SlidersHorizontal, MapPin, Home, Heart, BarChart3, Grid, List, Map, Brain, Sparkles, ArrowUpDown, Calendar, Clock, Waves, Loader2 } from 'lucide-react';
import fastighetsbyranLogo from '@/assets/broker-logos/fastighetsbyran.png';
import maklarhusetLogo from '@/assets/broker-logos/maklarhuset.png';
import bjurforsLogo from '@/assets/broker-logos/bjurfors.png';
import svenskFastighetsformedlingLogo from '@/assets/broker-logos/svensk-fastighetsformedling.png';
import notarMaklareLogo from '@/assets/broker-logos/notar-maklare.png';
import lansforsakringarLogo from '@/assets/broker-logos/lansforsakringar.png';
interface Property {
  id: string;
  title: string;
  property_type: string;
  price: number;
  status: string;
  address_street: string;
  address_postal_code: string;
  address_city: string;
  living_area?: number;
  plot_area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  monthly_fee?: number;
  energy_class?: string;
  features?: string[];
  images?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
  user_id: string;
  description?: string;
  ad_tier?: 'free' | 'plus' | 'premium';
  is_nyproduktion?: boolean;
  viewing_times?: Array<{
    date: string;
    time: string;
    status: 'scheduled' | 'cancelled' | 'completed';
    spots_available?: number;
  }>;
  broker?: {
    name: string;
    avatar_url?: string;
    office_logo?: string;
    phone?: string;
  };
}
interface SearchFilters {
  query: string;
  propertyType: string;
  listingType: string; // FOR_SALE, FOR_RENT, or all
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  minRooms: number;
  maxRooms: number;
  city: string;
  features: string[];
  energyClass: string[];
  sortBy: string;
  // Rental-specific filters
  minRent: number;
  maxRent: number;
  furnished: string; // '', 'furnished', 'unfurnished'
  petsAllowed: boolean;
  shortTerm: boolean;
  utilities: string[]; // ['electricity', 'heating', 'internet', 'parking']
  // Sale-specific filters
  floorLevel: string;
  isNewConstruction: string;
  minBuildYear: string;
  maxBuildYear: string;
  minMonthlyFee: number;
  maxMonthlyFee: number;
  daysListed: string;
  viewingTime: string;
  waterDistance: string;
  nearSea: boolean;
  minPlotArea: number;
  maxPlotArea: number;
  hideBeforeViewing: boolean;
  hideRental: boolean;
  hideCommercial: boolean;
  hideNyproduktion: boolean;
}
const propertyTypes = ['Villa', 'Lägenhet', 'Radhus', 'Bostadsrätt', 'Fritidshus', 'Tomt', 'Kommersiell'];
const energyClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const commonFeatures = ['Balkong', 'Terrass', 'Trädgård', 'Garage', 'Parkering', 'Hiss', 'Pool', 'Bastu'];
const sortOptions = [{
  value: 'created_desc',
  label: 'Nyast först'
}, {
  value: 'created_asc',
  label: 'Äldst först'
}, {
  value: 'price_asc',
  label: 'Billigast först'
}, {
  value: 'price_desc',
  label: 'Dyrast först'
}, {
  value: 'area_desc',
  label: 'Störst först (m²)'
}, {
  value: 'area_asc',
  label: 'Minst först (m²)'
}, {
  value: 'land_area_desc',
  label: 'Tomt - störst först (m²)'
}, {
  value: 'land_area_asc',
  label: 'Tomt - minst först (m²)'
}, {
  value: 'price_per_sqm_asc',
  label: 'Lägst kvadratmeterpris (kr/m²)'
}, {
  value: 'price_per_sqm_desc',
  label: 'Högst kvadratmeterpris (kr/m²)'
}, {
  value: 'rooms_desc',
  label: 'Flest rum först'
}, {
  value: 'rooms_asc',
  label: 'Minst antal rum först'
}, {
  value: 'monthly_fee_asc',
  label: 'Lägst avgift (kr/mån)'
}, {
  value: 'monthly_fee_desc',
  label: 'Högst avgift (kr/mån)'
}, {
  value: 'address_asc',
  label: 'Adress A-Ö'
}, {
  value: 'address_desc',
  label: 'Adress Ö-A'
}];
interface PropertySearchProps {
  defaultTab?: 'ALL' | 'FOR_SALE' | 'FOR_RENT' | 'COMING_SOON' | 'SOLD' | 'COMMERCIAL' | 'NYPRODUKTION';
  defaultPropertyType?: string;
}
export const PropertySearch: React.FC<PropertySearchProps> = ({
  defaultTab = 'ALL',
  defaultPropertyType = ''
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<Property[]>([]);
  const [showAiRecommendations, setShowAiRecommendations] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'FOR_SALE' | 'FOR_RENT' | 'COMING_SOON' | 'SOLD' | 'COMMERCIAL' | 'NYPRODUKTION'>(defaultTab);
  const [countryTab, setCountryTab] = useState<'SVERIGE' | 'UTOMLANDS'>('SVERIGE');
  const [selectedLocation, setSelectedLocation] = useState<{
    center_lat?: number;
    center_lng?: number;
    name?: string;
    type?: string;
  } | undefined>(undefined);
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('location') || searchParams.get('query') || searchParams.get('searchQuery') || '',
    propertyType: searchParams.get('propertyType') || defaultPropertyType,
    listingType: searchParams.get('listingType') || '',
    minPrice: 0,
    maxPrice: 20000000,
    minArea: 0,
    maxArea: 1000,
    minRooms: 0,
    maxRooms: 10,
    city: '',
    features: [],
    energyClass: [],
    sortBy: 'created_desc',
    // Rental-specific filters
    minRent: 0,
    maxRent: 50000,
    furnished: '',
    petsAllowed: false,
    shortTerm: false,
    utilities: [],
    // Sale-specific filters
    floorLevel: 'all',
    isNewConstruction: 'all',
    minBuildYear: 'none',
    maxBuildYear: 'none',
    minMonthlyFee: 0,
    maxMonthlyFee: 10000,
    daysListed: 'all',
    viewingTime: 'all',
    waterDistance: 'all',
    nearSea: false,
    minPlotArea: 0,
    maxPlotArea: 10000,
    hideBeforeViewing: false,
    hideRental: false,
    hideCommercial: false,
    hideNyproduktion: false
  });
  const [isAISearching, setIsAISearching] = useState(false);
  const [naturalSearchQuery, setNaturalSearchQuery] = useState(searchParams.get('query') || searchParams.get('searchQuery') || '');
  const [isSearchInputExpanded, setIsSearchInputExpanded] = useState(false);

  // Parse price range from URL params
  useEffect(() => {
    const priceRange = searchParams.get('priceRange');
    if (priceRange && priceRange.includes('-')) {
      const [min, max] = priceRange.split('-').map(Number);
      setFilters(prev => ({
        ...prev,
        minPrice: min || 0,
        maxPrice: max || 20000000
      }));
    }

    // Update natural search query from URL
    const searchQuery = searchParams.get('query') || searchParams.get('searchQuery');
    if (searchQuery) {
      setNaturalSearchQuery(searchQuery);
    }
  }, [searchParams]);
  useEffect(() => {
    loadProperties();
  }, []);
  useEffect(() => {
    applyFilters();
  }, [properties, filters, activeTab, countryTab]);
  useEffect(() => {
    // Save search to history when user is logged in and filters change
    if (user && (filters.query || filters.propertyType || filters.city)) {
      saveSearchToHistory();
    }
  }, [filters.query, filters.propertyType, filters.city, user]);
  const saveSearchToHistory = async () => {
    if (!user) return;
    try {
      await supabase.from('user_search_history').insert({
        user_id: user.id,
        search_query: filters.query,
        search_filters: JSON.parse(JSON.stringify(filters)),
        // Convert to Json type
        property_type: filters.propertyType,
        price_range: `${filters.minPrice}-${filters.maxPrice}`,
        location: filters.city
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };
  const loadAiRecommendations = async () => {
    if (!user) {
      toast({
        title: 'Logga in för AI-rekommendationer',
        description: 'Skapa ett konto för att få personliga fastighetsrekommendationer baserade på dina sökningar.'
      });
      return;
    }
    setLoadingRecommendations(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      const response = await fetch('/functions/v1/ai-property-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          user_id: user.id
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiRecommendations(data.recommendations);
      setShowAiRecommendations(true);
      toast({
        title: 'AI-rekommendationer laddade!',
        description: data.message
      });
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      toast({
        title: 'Kunde inte ladda rekommendationer',
        description: 'Försök igen senare.',
        variant: 'destructive'
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };
  const loadProperties = async () => {
    try {
      // Create 9 test properties - 3 for each tier with unique images
      const testProperties: Property[] = [
      // PREMIUM - 3 annonser
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Exklusiv villa med havsutsikt',
        price: 18500000,
        address_street: 'Strandvägen 42',
        address_postal_code: '182 68',
        address_city: 'Djursholm',
        property_type: 'Villa',
        status: 'FOR_SALE',
        rooms: 8,
        living_area: 285,
        bedrooms: 5,
        bathrooms: 3,
        monthly_fee: 8500,
        latitude: 59.4015,
        longitude: 18.0512,
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=675&fit=crop'],
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        // Idag, för 2 timmar sedan
        user_id: 'test',
        ad_tier: 'premium',
        show_bidding: true,
        description: 'Magnifik villa i absolut toppskick med panoramautsikt över havet. Genomgående exklusiva materialval, rymliga sällskapsytor och perfekt planlösning för familjen som värdesätter kvalitet och komfort.',
        viewing_times: [{
          date: '2025-11-15',
          time: '14:00-15:00',
          status: 'scheduled',
          spots_available: 10
        }, {
          date: '2025-11-16',
          time: '11:00-12:00',
          status: 'scheduled',
          spots_available: 8
        }, {
          date: '2025-11-17',
          time: '15:00-16:00',
          status: 'scheduled',
          spots_available: 12
        }],
        broker: {
          name: 'Anna Andersson',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-123 456 78'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Arkitektritad sekelskiftesvåning',
        price: 24900000,
        address_street: 'Östermalmsvägen 12',
        address_postal_code: '114 33',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 7,
        living_area: 198,
        bedrooms: 4,
        bathrooms: 2,
        monthly_fee: 12400,
        latitude: 59.3350,
        longitude: 18.0880,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509608-f57c2647775e?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509418-62a1ffa95cb5?w=1200&h=675&fit=crop'],
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        // 2 dagar sedan
        user_id: 'test',
        ad_tier: 'premium',
        is_nyproduktion: true,
        description: 'Extraordinär sekelskiftesvåning med ursprungliga detaljer och modern komfort. Stuckatur, kakelugnar och kristallkronor möter nutida kök och badrum. Exklusivt läge vid Strandvägen.',
        viewing_times: [{
          date: '2025-11-14',
          time: '18:00-19:00',
          status: 'scheduled',
          spots_available: 6
        }, {
          date: '2025-11-15',
          time: '17:00-18:00',
          status: 'scheduled',
          spots_available: 5
        }],
        broker: {
          name: 'Carl Bergström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-456 789 01'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Modern lyxvilla med pool och spa',
        price: 32500000,
        address_street: 'Alphyddevägen 15',
        address_postal_code: '181 62',
        address_city: 'Lidingö',
        property_type: 'Villa',
        status: 'FOR_SALE',
        rooms: 10,
        living_area: 420,
        bedrooms: 6,
        bathrooms: 4,
        latitude: 59.3600,
        longitude: 18.1500,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566752229-250ed79470e0?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=1200&h=675&fit=crop'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        // 5 dagar sedan
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Nybyggd lyxvilla med högsta tänkbara standard. Pool, spa-avdelning, hembiograf och vinkällare. Fantastisk sjöutsikt och egen brygga. Perfekt för den som söker det absolut bästa.',
        broker: {
          name: 'Sofia Lindqvist',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-567 890 12'
        }
      },
      // PLUS - 3 annonser
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Stilren lägenhet i hjärtat av stan',
        price: 6850000,
        address_street: 'Biblioteksgatan 15',
        address_postal_code: '114 46',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 4,
        living_area: 98,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 4200,
        latitude: 59.3350,
        longitude: 18.0750,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-444092475094?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        // Idag, för 5 timmar sedan
        user_id: 'test',
        ad_tier: 'plus',
        show_bidding: true,
        description: 'Ljus och välplanerad lägenhet med centralt läge. Nyrenoverad med moderna lösningar och fin balkong mot lugn innergård.',
        viewing_times: [{
          date: '2025-11-16',
          time: '13:00-14:00',
          status: 'scheduled',
          spots_available: 15
        }, {
          date: '2025-11-18',
          time: '16:00-17:00',
          status: 'scheduled',
          spots_available: 10
        }],
        broker: {
          name: 'Erik Eriksson',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-234 567 89'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440005',
        title: 'Charmigt radhus med trädgård',
        price: 8450000,
        address_street: 'Parkvägen 23',
        address_postal_code: '131 52',
        address_city: 'Nacka',
        property_type: 'Radhus',
        status: 'COMING_SOON',
        rooms: 5,
        living_area: 135,
        bedrooms: 3,
        bathrooms: 2,
        monthly_fee: 3100,
        latitude: 59.3100,
        longitude: 18.1600,
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491679-a5f5a7c2011f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491369-a7ebba6be29b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491483-f75dfaa5b6e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        // 2 veckor sedan
        user_id: 'test',
        ad_tier: 'plus',
        is_nyproduktion: true,
        description: 'Trevligt radhus i barnvänligt område. Egen trädgård, nyrenoverat kök och närhet till skolor och kommunikationer.',
        broker: {
          name: 'Johan Karlsson',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: notarMaklareLogo,
          phone: '08-678 901 23'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Modern 3:a med balkong och utsikt',
        price: 5290000,
        address_street: 'Högbergsgatan 45',
        address_postal_code: '118 26',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 3,
        living_area: 76,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 3450,
        latitude: 59.3150,
        longitude: 18.0700,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        // 3 dagar sedan
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Ljus lägenhet på Södermalm med härlig balkong och vacker utsikt över staden. Smart planlösning och fint skick.',
        broker: {
          name: 'Lisa Svensson',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
          office_logo: lansforsakringarLogo,
          phone: '08-789 012 34'
        }
      },
      // FREE - 3 annonser
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'Mysig 2:a i Vasastan',
        price: 3450000,
        address_street: 'Hagagatan 8',
        address_postal_code: '113 47',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 2,
        living_area: 52,
        monthly_fee: 2800,
        latitude: 59.3450,
        longitude: 18.0450,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        // 7 dagar sedan (1 vecka)
        user_id: 'test',
        ad_tier: 'free',
        viewing_times: [{
          date: '2025-11-19',
          time: '10:00-11:00',
          status: 'scheduled',
          spots_available: 20
        }],
        broker: {
          name: 'Maria Johansson',
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-345 678 90'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440008',
        title: 'Praktisk 1:a nära T-bana',
        price: 2150000,
        address_street: 'Sveavägen 142',
        address_postal_code: '113 46',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 1,
        living_area: 32,
        monthly_fee: 2100,
        latitude: 59.3450,
        longitude: 18.0550,
        images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400&h=400&fit=crop'],
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        // 3 veckor sedan
        user_id: 'test',
        ad_tier: 'free',
        broker: {
          name: 'Peter Nilsson',
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-890 123 45'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440009',
        title: 'Ljus studentlägenhet',
        price: 1890000,
        address_street: 'Kungsholmsgatan 55',
        address_postal_code: '112 27',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 1,
        living_area: 28,
        monthly_fee: 1950,
        latitude: 59.3330,
        longitude: 18.0500,
        images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop'],
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        // 4 dagar sedan
        user_id: 'test',
        ad_tier: 'free',
        broker: {
          name: 'Gustav Nilsson',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-901 234 56'
        }
      },
      // Hyresbostäder
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'Möblerad 3:a uthyres centralt',
        price: 18500,
        address_street: 'Drottninggatan 88',
        address_postal_code: '111 36',
        address_city: 'Stockholm',
        property_type: 'APARTMENT',
        status: 'FOR_RENT',
        rooms: 3,
        living_area: 75,
        bedrooms: 2,
        bathrooms: 1,
        latitude: 59.3350,
        longitude: 18.0650,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        // 6 dagar sedan
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Fullt möblerad lägenhet i city. Perfekt för den som söker korttidsboende.',
        features: ['Möblerad', 'Balkong', 'Hiss'],
        broker: {
          name: 'Anna Andersson',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-123 456 78'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440011',
        title: 'Lägenhet uthyres i Hammarby Sjöstad',
        price: 14000,
        address_street: 'Sjöviksvägen 12',
        address_postal_code: '120 32',
        address_city: 'Stockholm',
        property_type: 'APARTMENT',
        status: 'FOR_RENT',
        rooms: 2,
        living_area: 58,
        bedrooms: 1,
        bathrooms: 1,
        latitude: 59.3050,
        longitude: 18.0950,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        // 4 veckor sedan
        user_id: 'test',
        ad_tier: 'free',
        description: 'Modern lägenhet med sjöutsikt. Omöblerad.',
        features: ['Balkong', 'Hiss'],
        broker: {
          name: 'Erik Eriksson',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-234 567 89'
        }
      },
      // Kommersiella fastigheter
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        title: 'Kontorslokal i Kista',
        price: 8500000,
        address_street: 'Kistagången 16',
        address_postal_code: '164 40',
        address_city: 'Kista',
        property_type: 'COMMERCIAL',
        status: 'FOR_SALE',
        rooms: 8,
        living_area: 320,
        latitude: 59.4050,
        longitude: 17.9450,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        // 1 dag sedan
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Modern kontorslokal i Kista Science City. Perfekt för IT-företag.',
        features: ['Hiss', 'Parkering'],
        broker: {
          name: 'Carl Bergström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-456 789 01'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440013',
        title: 'Butikslokal i Södermalm',
        price: 12500000,
        address_street: 'Götgatan 45',
        address_postal_code: '118 26',
        address_city: 'Stockholm',
        property_type: 'COMMERCIAL',
        status: 'COMING_SOON',
        rooms: 3,
        living_area: 145,
        latitude: 59.3150,
        longitude: 18.0700,
        images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
        created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        // Idag, för 10 timmar sedan
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Attraktiv butikslokal på Götgatan med högt flöde av förbipasserande.',
        features: ['Skyltfönster'],
        broker: {
          name: 'Sofia Lindqvist',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-567 890 12'
        }
      },
      // Fritidshus
      {
        id: '550e8400-e29b-41d4-a716-446655440014',
        title: 'Charmigt fritidshus vid sjö',
        price: 2850000,
        address_street: 'Sjövägen 42',
        address_postal_code: '760 10',
        address_city: 'Bergshamra',
        property_type: 'COTTAGE',
        status: 'COMING_SOON',
        rooms: 4,
        living_area: 65,
        plot_area: 1200,
        bedrooms: 3,
        bathrooms: 1,
        latitude: 60.2050,
        longitude: 17.1450,
        images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Mysigt fritidshus med direkt sjötomt och egen brygga. Perfekt för familjen.',
        features: ['Sjötomt', 'Bastu', 'Brygga'],
        broker: {
          name: 'Johan Karlsson',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: notarMaklareLogo,
          phone: '08-678 901 23'
        }
      },
      // Tomter
      {
        id: '550e8400-e29b-41d4-a716-446655440015',
        title: 'Byggnadstomt i Saltsjöbaden',
        price: 4500000,
        address_street: 'Strandvägen 89',
        address_postal_code: '133 35',
        address_city: 'Saltsjöbaden',
        property_type: 'PLOT',
        status: 'FOR_SALE',
        plot_area: 1850,
        latitude: 59.2850,
        longitude: 18.2950,
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Attraktiv byggnadstomt med havsutsikt. Detaljplan finns för villa på 250 kvm.',
        features: ['Havsutsikt', 'Byggnadstomt'],
        broker: {
          name: 'Lisa Svensson',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
          office_logo: lansforsakringarLogo,
          phone: '08-789 012 34'
        }
      },
      // Gård
      {
        id: '550e8400-e29b-41d4-a716-446655440016',
        title: 'Lantgård med åkermark',
        price: 9500000,
        address_street: 'Gårdsvägen 5',
        address_postal_code: '755 92',
        address_city: 'Uppsala',
        property_type: 'HOUSE',
        status: 'COMING_SOON',
        rooms: 8,
        living_area: 245,
        plot_area: 85000,
        bedrooms: 5,
        bathrooms: 2,
        latitude: 59.8585,
        longitude: 17.6389,
        images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Vacker lantgård med bostadshus, ekonomibyggnader och 8,5 hektar mark.',
        features: ['Ekonomibyggnader', 'Åkermark', 'Garage'],
        broker: {
          name: 'Maria Johansson',
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-345 678 90'
        }
      },
      // Additional COMING_SOON properties
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        title: 'Stilren takvåning med takterrass',
        price: 14900000,
        address_street: 'Karlavägen 88',
        address_postal_code: '114 49',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 5,
        living_area: 142,
        bedrooms: 3,
        bathrooms: 2,
        monthly_fee: 6800,
        latitude: 59.3435,
        longitude: 18.0878,
        images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Fantastisk takvåning med stor takterrass och otrolig utsikt över Stockholm.',
        features: ['Takterrass', 'Hiss', 'Balkong'],
        broker: {
          name: 'Emma Nilsson',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-111 222 33'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440021',
        title: 'Nyrenoverad villa i Bromma',
        price: 16500000,
        address_street: 'Åkeshovsvägen 34',
        address_postal_code: '168 39',
        address_city: 'Bromma',
        property_type: 'Villa',
        status: 'COMING_SOON',
        rooms: 7,
        living_area: 215,
        plot_area: 950,
        bedrooms: 4,
        bathrooms: 3,
        latitude: 59.3450,
        longitude: 17.9350,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Totalrenoverad villa i lugnt läge med närhet till Brommaplan och grönområden.',
        features: ['Renoverad', 'Trädgård', 'Garage', 'Öppen spis'],
        broker: {
          name: 'Oscar Bergman',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-222 333 44'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440022',
        title: 'Modern tvåa på Södermalm',
        price: 4850000,
        address_street: 'Folkungagatan 92',
        address_postal_code: '116 30',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 2,
        living_area: 58,
        bedrooms: 1,
        bathrooms: 1,
        monthly_fee: 3200,
        latitude: 59.3150,
        longitude: 18.0800,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Fräsch tvåa i hjärtat av Södermalm med balkong och soligt läge.',
        features: ['Balkong', 'Nybyggt kök'],
        broker: {
          name: 'Lisa Andersson',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-333 444 55'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440023',
        title: 'Parhus med garage i Täby',
        price: 11900000,
        address_street: 'Enbacksvägen 18',
        address_postal_code: '183 53',
        address_city: 'Täby',
        property_type: 'Radhus',
        status: 'COMING_SOON',
        rooms: 6,
        living_area: 165,
        plot_area: 380,
        bedrooms: 4,
        bathrooms: 2,
        monthly_fee: 2800,
        latitude: 59.4450,
        longitude: 18.0650,
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Välplanerat parhus i populärt område med bra kommunikationer.',
        features: ['Garage', 'Trädgård', 'Öppen planlösning'],
        broker: {
          name: 'Peter Johansson',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-444 555 66'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440024',
        title: 'Ljus trea i Vasastan',
        price: 7200000,
        address_street: 'Odengatan 58',
        address_postal_code: '113 22',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 3,
        living_area: 78,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 4100,
        latitude: 59.3450,
        longitude: 18.0550,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Trivsam trea med högt till tak och fina originaldetaljer från sekelskiftet.',
        features: ['Balkong', 'Högt i tak', 'Originaldetaljer'],
        broker: {
          name: 'Anna Svensson',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: notarMaklareLogo,
          phone: '08-555 666 77'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440025',
        title: 'Charmig stuga i Dalarna',
        price: 3200000,
        address_street: 'Fjällvägen 12',
        address_postal_code: '780 67',
        address_city: 'Sälen',
        property_type: 'COTTAGE',
        status: 'COMING_SOON',
        rooms: 5,
        living_area: 95,
        plot_area: 2100,
        bedrooms: 4,
        bathrooms: 1,
        latitude: 61.1550,
        longitude: 13.2850,
        images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'free',
        description: 'Mysig fjällstuga i Sälen med nära till liftar och skidbackar.',
        features: ['Öppen spis', 'Bastu', 'Nära liftar'],
        broker: {
          name: 'Maria Karlsson',
          avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          office_logo: lansforsakringarLogo,
          phone: '08-666 777 88'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440026',
        title: 'Nyrenoverad lägenhet i Hammarby Sjöstad',
        price: 6950000,
        address_street: 'Ljusslingan 25',
        address_postal_code: '120 66',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 3,
        living_area: 85,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 3900,
        latitude: 59.3050,
        longitude: 18.1050,
        images: ['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Helt nyrenoverad lägenhet med balkong och fantastisk sjöutsikt.',
        features: ['Balkong', 'Sjöutsikt', 'Nybyggt kök', 'Hiss'],
        broker: {
          name: 'Erik Lindström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-777 888 99'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440027',
        title: 'Kontor i city',
        price: 18500000,
        address_street: 'Drottninggatan 78',
        address_postal_code: '111 36',
        address_city: 'Stockholm',
        property_type: 'COMMERCIAL',
        status: 'COMING_SOON',
        rooms: 12,
        living_area: 425,
        latitude: 59.3350,
        longitude: 18.0600,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Representativa kontorslokaler i bästa cityläge med höga tak och fina originaldetaljer.',
        features: ['Centralt läge', 'Höga tak', 'Hiss'],
        broker: {
          name: 'Helena Bergqvist',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-888 999 00'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440028',
        title: 'Mysig etta på Kungsholmen',
        price: 3650000,
        address_street: 'Sankt Eriksgatan 45',
        address_postal_code: '112 34',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 1,
        living_area: 38,
        bedrooms: 1,
        bathrooms: 1,
        monthly_fee: 2400,
        latitude: 59.3350,
        longitude: 18.0350,
        images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'free',
        description: 'Charmig etta perfekt för den som söker sitt första boende i stan.',
        features: ['Centralt', 'Nytt badrum'],
        broker: {
          name: 'David Holm',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-999 000 11'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440029',
        title: 'Villa med sjötomt i Saltsjöbaden',
        price: 22500000,
        address_street: 'Strandpromenaden 8',
        address_postal_code: '133 33',
        address_city: 'Saltsjöbaden',
        property_type: 'Villa',
        status: 'COMING_SOON',
        rooms: 9,
        living_area: 265,
        plot_area: 1650,
        bedrooms: 5,
        bathrooms: 3,
        latitude: 59.2750,
        longitude: 18.3050,
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Exklusiv villa med egen sjötomt och brygga. Panoramautsikt över havet.',
        features: ['Sjötomt', 'Brygga', 'Pool', 'Garage', 'Bastu'],
        broker: {
          name: 'Caroline Nyberg',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-000 111 22'
        }
      },
      // Fler kommersiella fastigheter
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        title: 'Restauranglokal i Vasastan',
        price: 15800000,
        address_street: 'Odenplan 22',
        address_postal_code: '113 24',
        address_city: 'Stockholm',
        property_type: 'COMMERCIAL',
        status: 'FOR_SALE',
        rooms: 6,
        living_area: 285,
        latitude: 59.3432,
        longitude: 18.0525,
        images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Etablerad restauranglokal med fullt utrustat kök och bra flöde. Perfekt läge vid Odenplan med hög genomströmning. Sittplatser för 80 gäster inomhus plus 40 på uteservering.',
        features: ['Fullt utrustat kök', 'Serveringstillstånd', 'Uteservering', 'Högt i tak', 'Skyltfönster'],
        broker: {
          name: 'Marcus Ekström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-111 222 33'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440031',
        title: 'Lagerlokal med kontor i Kungens Kurva',
        price: 24500000,
        address_street: 'Exportgatan 35',
        address_postal_code: '141 75',
        address_city: 'Kungens Kurva',
        property_type: 'COMMERCIAL',
        status: 'COMING_SOON',
        rooms: 15,
        living_area: 1850,
        latitude: 59.2733,
        longitude: 17.9142,
        images: ['https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Stor lagerlokal med tillhörande moderna kontorsutrymmen. Perfekt för logistikverksamhet med lastkajer och 6 meters takhöjd. Tillgång till truck och lasthiss.',
        features: ['Lastkajer', 'Truck', 'Lasthiss', 'Kontor', 'Parkering', 'Nära E4/E20'],
        broker: {
          name: 'Stefan Lundberg',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-333 444 55'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440032',
        title: 'Kontorshotell på Östermalm',
        price: 34000000,
        address_street: 'Strandvägen 5A',
        address_postal_code: '114 51',
        address_city: 'Stockholm',
        property_type: 'COMMERCIAL',
        status: 'FOR_SALE',
        rooms: 25,
        living_area: 650,
        latitude: 59.3328,
        longitude: 18.0842,
        images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Exklusivt kontorshotell i absolut toppskick på Östermalm. Lyxiga gemensamma utrymmen med reception, konferensrum och lounge. Havsutsikt från flera kontorsrum.',
        features: ['Reception', 'Konferensrum', 'Kök', 'Lounge', 'Havsutsikt', 'Hiss', 'AC'],
        broker: {
          name: 'Isabella Borg',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-555 666 77'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440033',
        title: 'Butikslokal på Drottninggatan',
        price: 18900000,
        address_street: 'Drottninggatan 52',
        address_postal_code: '111 21',
        address_city: 'Stockholm',
        property_type: 'COMMERCIAL',
        status: 'COMING_SOON',
        rooms: 4,
        living_area: 180,
        latitude: 59.3350,
        longitude: 18.0640,
        images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1555529669-2269763671c0?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Attraktiv butikslokal mitt på Drottninggatan med enormt flöde. Stora skyltfönster och högt i tak. Perfekt för detaljhandel eller showroom.',
        features: ['Skyltfönster', 'Centralt läge', 'Högt i tak', 'Lager i källare'],
        broker: {
          name: 'Johan Eklund',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-777 888 99'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440034',
        title: 'Gym/Träningslokal i Hammarby Sjöstad',
        price: 12500000,
        address_street: 'Sickla Kanalgata 15',
        address_postal_code: '131 34',
        address_city: 'Hammarby Sjöstad',
        property_type: 'COMMERCIAL',
        status: 'FOR_SALE',
        rooms: 8,
        living_area: 420,
        latitude: 59.3025,
        longitude: 18.1072,
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Komplett träningslokal med all utrustning. Bastu, omklädningsrum och reception. Etablerad kundkrets.',
        features: ['Komplett utrustning', 'Bastu', 'Dusch', 'Reception', 'Gummigolv'],
        broker: {
          name: 'Emma Pettersson',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: notarMaklareLogo,
          phone: '08-999 000 11'
        }
      },
      // Fler "Snart till salu" fastigheter
      {
        id: '550e8400-e29b-41d4-a716-446655440035',
        title: 'Exklusiv nyproduktion på Lidingö',
        price: 27500000,
        address_street: 'Gåshagavägen 88',
        address_postal_code: '181 63',
        address_city: 'Lidingö',
        property_type: 'Villa',
        status: 'COMING_SOON',
        rooms: 8,
        living_area: 320,
        plot_area: 1200,
        bedrooms: 5,
        bathrooms: 4,
        latitude: 59.3625,
        longitude: 18.1450,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Nybyggd arkitektritad villa i naturskönt läge. Skandinavisk design i harmoni med naturen. Pool, spa och vinkällare. Inflyttning Q2 2025.',
        features: ['Nyproduktion', 'Pool', 'Spa', 'Vinkällare', 'Smart home', 'Garage', 'Havsutsikt'],
        broker: {
          name: 'Alexander Nordström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-123 456 78'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440036',
        title: 'Penthouse i Hammarby Sjöstad',
        price: 19900000,
        address_street: 'Sjöviksvägen 142',
        address_postal_code: '131 71',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 6,
        living_area: 185,
        bedrooms: 4,
        bathrooms: 3,
        monthly_fee: 9800,
        latitude: 59.3050,
        longitude: 18.1000,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Spektakulär penthouse med 360-graders utsikt över Stockholm och vattnet. Takterrass på 120 kvm med jacuzzi. Unik möjlighet!',
        features: ['Takterrass', 'Jacuzzi', 'Panoramautsikt', 'Hiss', 'Garage', 'Smart home'],
        broker: {
          name: 'Victoria Sandberg',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '08-234 567 89'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440037',
        title: 'Herrg gård i Roslagen',
        price: 38500000,
        address_street: 'Herrgårdsvägen 1',
        address_postal_code: '764 95',
        address_city: 'Väddö',
        property_type: 'Villa',
        status: 'COMING_SOON',
        rooms: 14,
        living_area: 580,
        plot_area: 125000,
        bedrooms: 8,
        bathrooms: 5,
        latitude: 60.0150,
        longitude: 18.8250,
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Magnifik herrgård från 1700-talet på 12,5 hektar mark med egen skogsfastighet. Totalrenoverad med bibehållen historisk charm. Egen sjö, stall och ekonomibyggnader.',
        features: ['Herrgård', 'Historisk', 'Egen sjö', 'Stall', 'Skog', 'Orangeri', 'Vinkällare'],
        broker: {
          name: 'Gustaf von Essen',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-345 678 90'
        }
      },
      // Nyproduktionsprojekt
      {
        id: '550e8400-e29b-41d4-a716-446655440038',
        title: 'Moderna lägenheter i Hammarby Sjöstad - Nyproduktion',
        price: 4850000,
        address_street: 'Sjöstadskajen 15',
        address_postal_code: '12048',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'COMING_SOON',
        rooms: 3,
        living_area: 72,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 3420,
        latitude: 59.3050,
        longitude: 18.1050,
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Nyproducerade lägenheter med hög standard och fantastisk sjöutsikt. Inflyttning Q2 2025.',
        features: ['Nyproduktion', 'Balkong', 'Hiss', 'Tvättstuga', 'Förråd'],
        broker: {
          name: 'Anna Andersson',
          avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          office_logo: fastighetsbyranLogo,
          phone: '08-123 456 78'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440039',
        title: 'Radhus i Hyllie - Nyproduktion',
        price: 5200000,
        address_street: 'Hyresvägen 8',
        address_postal_code: '21575',
        address_city: 'Malmö',
        property_type: 'Radhus',
        status: 'FOR_SALE',
        rooms: 5,
        living_area: 115,
        plot_area: 180,
        bedrooms: 4,
        bathrooms: 2,
        latitude: 55.5683,
        longitude: 12.9743,
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Energieffektiva radhus i ett av Malmös mest expansiva områden.',
        features: ['Nyproduktion', 'Bergvärme', 'Solceller', 'Parkering', 'Uteplats'],
        broker: {
          name: 'Carl Bergström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '040-123 456'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440040',
        title: 'Takvåning med takterrass - Nyproduktion Göteborg',
        price: 8900000,
        address_street: 'Lindholmen 42',
        address_postal_code: '41705',
        address_city: 'Göteborg',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 4,
        living_area: 128,
        bedrooms: 3,
        bathrooms: 2,
        monthly_fee: 5890,
        latitude: 57.7089,
        longitude: 11.9746,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Exklusiv takvåning med privat takterrass och vidsträckt utsikt över staden.',
        features: ['Nyproduktion', 'Takterrass 80kvm', 'Panoramautsikt', '2 Parkeringar', 'Förråd'],
        broker: {
          name: 'Sofia Lindqvist',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '031-123 456'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440041',
        title: 'Parhus i Limhamn - Nybyggda designvillor',
        price: 6750000,
        address_street: 'Strandvägen 102',
        address_postal_code: '21623',
        address_city: 'Limhamn',
        property_type: 'Villa',
        status: 'FOR_SALE',
        rooms: 6,
        living_area: 145,
        plot_area: 250,
        bedrooms: 4,
        bathrooms: 2,
        latitude: 55.5683,
        longitude: 12.9243,
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Nybyggda parhus med smarta lösningar och hög energieffektivitet.',
        features: ['Nyproduktion', 'Smart home', 'Bergvärme', 'Solceller', 'Garage'],
        broker: {
          name: 'Marcus Ekström',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '040-234 567'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440042',
        title: 'Kompakt 2:a i Vasastan - Nyproduktion',
        price: 3250000,
        address_street: 'Vasagatan 85',
        address_postal_code: '11120',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 2,
        living_area: 48,
        bedrooms: 1,
        bathrooms: 1,
        monthly_fee: 2150,
        latitude: 59.3350,
        longitude: 18.0550,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Prisvärd nyproducerad tvåa perfekt för singeln eller paret.',
        features: ['Nyproduktion', 'Centralt', 'Balkong', 'Hiss', 'Förråd'],
        broker: {
          name: 'Emma Pettersson',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: notarMaklareLogo,
          phone: '08-345 678'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440043',
        title: 'Familjevilla i Östra Helsingborg - Nybyggd',
        price: 5850000,
        address_street: 'Parkvägen 22',
        address_postal_code: '25468',
        address_city: 'Helsingborg',
        property_type: 'Villa',
        status: 'COMING_SOON',
        rooms: 7,
        living_area: 165,
        plot_area: 520,
        bedrooms: 5,
        bathrooms: 2,
        latitude: 56.0465,
        longitude: 12.6945,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Rymlig villa i barnvänligt område med närhet till skolor och natur.',
        features: ['Nyproduktion', 'Stor trädgård', 'Carport', 'Bergvärme', 'Barnvänligt'],
        broker: {
          name: 'Helena Bergqvist',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '042-456 789'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440044',
        title: 'Lägenheter vid älven - Nyproduktion Umeå',
        price: 3680000,
        address_street: 'Älvgatan 12',
        address_postal_code: '90325',
        address_city: 'Umeå',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 3,
        living_area: 68,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 2890,
        latitude: 63.8258,
        longitude: 20.2630,
        images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Moderna lägenheter med älvutsikt i hjärtat av Umeå.',
        features: ['Nyproduktion', 'Älvutsikt', 'Balkong', 'Centralt läge', 'Hiss'],
        broker: {
          name: 'David Holm',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '090-123 456'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440045',
        title: 'Exklusiva lägenheter i Vasaparken - Nyproduktion',
        price: 12500000,
        address_street: 'Vasaparken 5',
        address_postal_code: '11320',
        address_city: 'Stockholm',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 5,
        living_area: 156,
        bedrooms: 4,
        bathrooms: 3,
        monthly_fee: 8200,
        latitude: 59.3450,
        longitude: 18.0450,
        images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Lyxiga lägenheter med egen concierge och poolområde.',
        features: ['Nyproduktion', 'Concierge', 'Pool', 'Bastu', 'Gym', '2 Parkeringar'],
        broker: {
          name: 'Caroline Nyberg',
          avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '08-567 890'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440046',
        title: 'Kedjehus i Lindholmen - Nybyggda sjönära',
        price: 7200000,
        address_street: 'Bryggarvägen 3',
        address_postal_code: '41701',
        address_city: 'Göteborg',
        property_type: 'Radhus',
        status: 'COMING_SOON',
        rooms: 5,
        living_area: 132,
        plot_area: 145,
        bedrooms: 4,
        bathrooms: 2,
        latitude: 57.7089,
        longitude: 11.9446,
        images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Moderna kedjehus med sjöutsikt och egen brygga.',
        features: ['Nyproduktion', 'Sjöutsikt', 'Egen brygga', 'Takterrass', 'Garage'],
        broker: {
          name: 'Victoria Sandberg',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
          office_logo: bjurforsLogo,
          phone: '031-678 901'
        }
      }, {
        id: '550e8400-e29b-41d4-a716-446655440047',
        title: 'Studentlägenheter i Lund - Nyproduktion',
        price: 2100000,
        address_street: 'Studentvägen 42',
        address_postal_code: '22362',
        address_city: 'Lund',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 1,
        living_area: 32,
        bedrooms: 1,
        bathrooms: 1,
        monthly_fee: 1450,
        latitude: 55.7047,
        longitude: 13.1910,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'free',
        description: 'Kompakta och smarta studentlägenheter nära universitetet.',
        features: ['Nyproduktion', 'Nära universitet', 'Smart inredning', 'Cykelrum'],
        broker: {
          name: 'Gustaf von Essen',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          office_logo: svenskFastighetsformedlingLogo,
          phone: '046-789 012'
        }
      }] as Property[];

      // Build demo properties: 5 per dag (Idag, Igår, 2-7 dagar) i paketsordning
      const premTpl = testProperties.find(p => p.ad_tier === 'premium' && p.status !== 'FOR_RENT');
      const plusTpls = testProperties.filter(p => p.ad_tier === 'plus' && p.status !== 'FOR_RENT').slice(0, 2);
      const freeTpl = testProperties.find(p => p.ad_tier === 'free' && p.status !== 'FOR_RENT');
      const rentTpl = testProperties.find(p => p.status === 'FOR_RENT');
      const demoProperties: Property[] = [];
      for (let day = 0; day <= 7; day++) {
        const hours = day === 0 ? [1, 2, 3, 4, 5] : [10, 12, 14, 16, 18];
        const makeTs = (h: number) => new Date(Date.now() - (day * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000)).toISOString();
        if (premTpl && plusTpls.length > 0 && freeTpl && rentTpl) {
          demoProperties.push({
            ...premTpl,
            id: `${premTpl.id}-d${day}`,
            created_at: makeTs(hours[0]),
            ad_tier: 'premium',
            status: 'FOR_SALE'
          }, {
            ...plusTpls[0],
            id: `${plusTpls[0].id}-d${day}`,
            created_at: makeTs(hours[1]),
            ad_tier: 'plus',
            status: 'FOR_SALE'
          }, {
            ...(plusTpls[1] ?? plusTpls[0]),
            id: `${(plusTpls[1] ?? plusTpls[0]).id}-d${day}-b`,
            created_at: makeTs(hours[2]),
            ad_tier: 'plus',
            status: 'FOR_SALE'
          }, {
            ...freeTpl,
            id: `${freeTpl.id}-d${day}`,
            created_at: makeTs(hours[3]),
            ad_tier: 'free',
            status: 'FOR_SALE'
          }, {
            ...rentTpl,
            id: `${rentTpl.id}-d${day}`,
            created_at: makeTs(hours[4]),
            status: 'FOR_RENT'
          });
        }
      }

      // Load sold properties from database
      const {
        data: soldProperties,
        error: soldError
      } = await supabase.from('property_sales_history').select('*').order('sale_date', {
        ascending: false
      }).limit(100);
      if (!soldError && soldProperties) {
        // Convert sales history to Property format
        const soldPropertyList: Property[] = soldProperties.map(sale => ({
          id: sale.id,
          title: `${sale.property_type} - ${sale.address_street}`,
          price: sale.sale_price,
          status: 'SOLD',
          address_street: sale.address_street,
          address_postal_code: sale.address_postal_code,
          address_city: sale.address_city,
          property_type: sale.property_type,
          living_area: sale.living_area || undefined,
          rooms: sale.rooms || undefined,
          latitude: sale.latitude ? Number(sale.latitude) : undefined,
          longitude: sale.longitude ? Number(sale.longitude) : undefined,
          images: [],
          created_at: sale.sale_date,
          user_id: 'system',
          description: `Såld ${new Date(sale.sale_date).toLocaleDateString('sv-SE')} för ${sale.sale_price.toLocaleString('sv-SE')} kr`
        }));

        // Combine demo properties with sold properties
        setProperties([...demoProperties, ...soldPropertyList]);
      } else {
        setProperties(demoProperties);
      }
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda fastigheter',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if a property is in Sweden based on address
  const isSwedishProperty = (property: Property): boolean => {
    // Swedish postal codes are in format "XXX XX" or "XXXXX" (5 digits)
    const swedishPostalCodePattern = /^\d{3}\s?\d{2}$/;
    if (property.address_postal_code && swedishPostalCodePattern.test(property.address_postal_code)) {
      return true;
    }

    // Common Swedish cities as fallback
    const swedishCities = ['stockholm', 'göteborg', 'malmö', 'uppsala', 'västerås', 'örebro', 'linköping', 'helsingborg', 'jönköping', 'norrköping', 'lund', 'umeå', 'gävle', 'borås', 'södertälje', 'eskilstuna', 'karlstad', 'täby', 'växjö', 'halmstad'];
    const city = property.address_city?.toLowerCase() || '';
    return swedishCities.some(swedishCity => city.includes(swedishCity));
  };

  // Helper function to get filtered count for a specific tab/status
  const getFilteredCountForTab = useCallback((tabType: 'ALL' | 'FOR_SALE' | 'FOR_RENT' | 'COMING_SOON' | 'SOLD' | 'COMMERCIAL' | 'NYPRODUKTION') => {
    let filtered = [...properties];

    // Filter by country first
    if (countryTab === 'SVERIGE') {
      filtered = filtered.filter(property => isSwedishProperty(property));
    } else if (countryTab === 'UTOMLANDS') {
      filtered = filtered.filter(property => !isSwedishProperty(property));
    }

    // Apply all filters except the activeTab filter
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(property => property.title.toLowerCase().includes(query) || property.address_street.toLowerCase().includes(query) || property.address_city.toLowerCase().includes(query) || property.property_type.toLowerCase().includes(query));
    }

    // Property type
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.property_type === filters.propertyType);
    }

    // Listing type (köp/hyra filter)
    if (filters.listingType) {
      filtered = filtered.filter(property => property.status === filters.listingType);
    }

    // Hide rental properties
    if (filters.hideRental) {
      filtered = filtered.filter(property => property.status !== 'FOR_RENT');
    }

    // Hide commercial properties
    if (filters.hideCommercial) {
      filtered = filtered.filter(property => property.property_type !== 'COMMERCIAL');
    }

    // Hide nyproduktion properties
    if (filters.hideNyproduktion) {
      filtered = filtered.filter(property => !property.is_nyproduktion);
    }

    // Price range - use rent range for rental properties
    if (filters.listingType === 'FOR_RENT') {
      filtered = filtered.filter(property => property.price >= filters.minRent && property.price <= filters.maxRent);
    } else {
      filtered = filtered.filter(property => property.price >= filters.minPrice && property.price <= filters.maxPrice);
    }

    // Area range
    if (filters.minArea > 0 || filters.maxArea < 1000) {
      filtered = filtered.filter(property => {
        const area = property.living_area || 0;
        return area >= filters.minArea && area <= filters.maxArea;
      });
    }

    // Rooms range
    if (filters.minRooms > 0 || filters.maxRooms < 10) {
      filtered = filtered.filter(property => {
        const rooms = property.rooms || 0;
        return rooms >= filters.minRooms && rooms <= filters.maxRooms;
      });
    }

    // City
    if (filters.city) {
      filtered = filtered.filter(property => property.address_city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    // Features
    if (filters.features.length > 0) {
      filtered = filtered.filter(property => filters.features.every(feature => property.features?.includes(feature)));
    }

    // Energy class
    if (filters.energyClass.length > 0) {
      filtered = filtered.filter(property => property.energy_class && filters.energyClass.includes(property.energy_class));
    }

    // Rental-specific filters (only apply when showing rental properties)
    if (filters.listingType === 'FOR_RENT') {
      if (filters.furnished) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          if (filters.furnished === 'furnished') {
            return features.includes('Möblerad');
          } else if (filters.furnished === 'unfurnished') {
            return !features.includes('Möblerad');
          }
          return true;
        });
      }
      if (filters.petsAllowed) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          return features.includes('Husdjur tillåtet');
        });
      }
      if (filters.shortTerm) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          return features.includes('Korttidsuthyrning');
        });
      }
      if (filters.utilities.length > 0) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          return filters.utilities.every(utility => {
            switch (utility) {
              case 'El':
                return features.includes('El inkluderat');
              case 'Värme':
                return features.includes('Värme inkluderat');
              case 'Internet':
                return features.includes('Internet inkluderat');
              case 'Parkering':
                return features.includes('Parkering inkluderad');
              default:
                return true;
            }
          });
        });
      }
    }

    // Now apply the specific tab filter
    if (tabType === 'ALL') {
      // Show all properties
    } else if (tabType === 'FOR_SALE') {
      filtered = filtered.filter(property => property.status === 'FOR_SALE');
    } else if (tabType === 'FOR_RENT') {
      filtered = filtered.filter(property => property.status === 'FOR_RENT');
    } else if (tabType === 'COMING_SOON') {
      filtered = filtered.filter(property => property.status === 'COMING_SOON');
    } else if (tabType === 'COMMERCIAL') {
      filtered = filtered.filter(property => property.property_type === 'COMMERCIAL' || property.property_type === 'Kommersiell');
    } else if (tabType === 'NYPRODUKTION') {
      filtered = filtered.filter(property => property.is_nyproduktion || property.features?.includes('Nyproduktion') || property.features?.includes('Nybyggd') || property.features?.includes('Nyproducerad') || property.description?.toLowerCase().includes('nyproduktion') || property.description?.toLowerCase().includes('nybyggd'));
    } else if (tabType === 'SOLD') {
      filtered = filtered.filter(property => property.status === 'SOLD');
    }
    return filtered.length;
  }, [properties, filters, countryTab]);
  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    // Filter by country first
    if (countryTab === 'SVERIGE') {
      filtered = filtered.filter(property => isSwedishProperty(property));
    } else if (countryTab === 'UTOMLANDS') {
      filtered = filtered.filter(property => !isSwedishProperty(property));
    }

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(property => property.title.toLowerCase().includes(query) || property.address_street.toLowerCase().includes(query) || property.address_city.toLowerCase().includes(query) || property.property_type.toLowerCase().includes(query));
    }

    // Property type
    if (filters.propertyType) {
      filtered = filtered.filter(property => property.property_type === filters.propertyType);
    }

    // Listing type (köp/hyra filter)
    if (filters.listingType) {
      filtered = filtered.filter(property => property.status === filters.listingType);
    }

    // Hide rental properties
    if (filters.hideRental) {
      filtered = filtered.filter(property => property.status !== 'FOR_RENT');
    }

    // Hide commercial properties
    if (filters.hideCommercial) {
      filtered = filtered.filter(property => property.property_type !== 'COMMERCIAL');
    }

    // Hide nyproduktion properties
    if (filters.hideNyproduktion) {
      filtered = filtered.filter(property => !property.is_nyproduktion);
    }

    // Filter by active tab
    if (activeTab === 'ALL') {
      // Show all properties
    } else if (activeTab === 'FOR_SALE') {
      filtered = filtered.filter(property => property.status === 'FOR_SALE');
    } else if (activeTab === 'FOR_RENT') {
      filtered = filtered.filter(property => property.status === 'FOR_RENT');
    } else if (activeTab === 'COMING_SOON') {
      filtered = filtered.filter(property => property.status === 'COMING_SOON');
    } else if (activeTab === 'COMMERCIAL') {
      filtered = filtered.filter(property => property.property_type === 'COMMERCIAL' || property.property_type === 'Kommersiell');
    } else if (activeTab === 'NYPRODUKTION') {
      filtered = filtered.filter(property => property.is_nyproduktion || property.features?.includes('Nyproduktion') || property.features?.includes('Nybyggd') || property.features?.includes('Nyproducerad') || property.description?.toLowerCase().includes('nyproduktion') || property.description?.toLowerCase().includes('nybyggd'));
    } else if (activeTab === 'SOLD') {
      filtered = filtered.filter(property => property.status === 'SOLD');
    }

    // Price range - use rent range for rental properties
    if (filters.listingType === 'FOR_RENT') {
      filtered = filtered.filter(property => property.price >= filters.minRent && property.price <= filters.maxRent);
    } else {
      filtered = filtered.filter(property => property.price >= filters.minPrice && property.price <= filters.maxPrice);
    }

    // Area range
    if (filters.minArea > 0 || filters.maxArea < 1000) {
      filtered = filtered.filter(property => {
        const area = property.living_area || 0;
        return area >= filters.minArea && area <= filters.maxArea;
      });
    }

    // Rooms range
    if (filters.minRooms > 0 || filters.maxRooms < 10) {
      filtered = filtered.filter(property => {
        const rooms = property.rooms || 0;
        return rooms >= filters.minRooms && rooms <= filters.maxRooms;
      });
    }

    // City
    if (filters.city) {
      filtered = filtered.filter(property => property.address_city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    // Features
    if (filters.features.length > 0) {
      filtered = filtered.filter(property => filters.features.every(feature => property.features?.includes(feature)));
    }

    // Energy class
    if (filters.energyClass.length > 0) {
      filtered = filtered.filter(property => property.energy_class && filters.energyClass.includes(property.energy_class));
    }

    // Rental-specific filters (only apply when showing rental properties)
    if (filters.listingType === 'FOR_RENT') {
      // Furnished filter
      if (filters.furnished) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          if (filters.furnished === 'furnished') {
            return features.includes('Möblerad');
          } else if (filters.furnished === 'unfurnished') {
            return !features.includes('Möblerad');
          }
          return true;
        });
      }

      // Pets allowed filter
      if (filters.petsAllowed) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          return features.includes('Husdjur tillåtet');
        });
      }

      // Short term rental filter
      if (filters.shortTerm) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          return features.includes('Korttidsuthyrning');
        });
      }

      // Utilities included filter
      if (filters.utilities.length > 0) {
        filtered = filtered.filter(property => {
          const features = property.features || [];
          return filters.utilities.every(utility => {
            switch (utility) {
              case 'El':
                return features.includes('El inkluderat');
              case 'Värme':
                return features.includes('Värme inkluderat');
              case 'Internet':
                return features.includes('Internet inkluderat');
              case 'Parkering':
                return features.includes('Parkering inkluderad');
              default:
                return true;
            }
          });
        });
      }
    }

    // Sorting - Dynamic based on publication date
    filtered.sort((a, b) => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const aCreatedDate = new Date(a.created_at);
      const bCreatedDate = new Date(b.created_at);
      const aIsToday = aCreatedDate >= todayStart;
      const bIsToday = bCreatedDate >= todayStart;

      // If both properties were published today, sort ONLY by publication time (newest first)
      if (aIsToday && bIsToday) {
        return bCreatedDate.getTime() - aCreatedDate.getTime();
      }

      // If one is from today and one is older, today's properties come first
      if (aIsToday !== bIsToday) {
        return aIsToday ? -1 : 1;
      }

      // For properties older than today (after midnight), use tier-based sorting
      // Level 1: Status priority (rental properties come last unless in FOR_RENT tab)
      const aIsRental = a.status === 'FOR_RENT';
      const bIsRental = b.status === 'FOR_RENT';

      // In FOR_RENT tab, rental properties are not deprioritized
      // In all other tabs (ALL, FOR_SALE, etc.), rental properties come last
      if (activeTab !== 'FOR_RENT' && aIsRental !== bIsRental) {
        return aIsRental ? 1 : -1; // Non-rental first
      }

      // Level 2: Priority tier sorting (premium > plus > free)
      const tierPriority = {
        premium: 3,
        plus: 2,
        free: 1
      };
      const aTierPriority = tierPriority[a.ad_tier || 'free'];
      const bTierPriority = tierPriority[b.ad_tier || 'free'];
      if (aTierPriority !== bTierPriority) {
        return bTierPriority - aTierPriority; // Higher priority first
      }

      // Level 3: Within same tier, sort by publication time (newest first)
      return bCreatedDate.getTime() - aCreatedDate.getTime();
    });
    setFilteredProperties(filtered);
    setTotalResults(filtered.length);
    setHasSearched(true);
  }, [properties, filters, activeTab, countryTab]);

  // Group properties by days since creation
  const groupPropertiesByDays = (properties: Property[]) => {
    const groups: {
      [key: string]: Property[];
    } = {};
    const now = new Date();
    properties.forEach(property => {
      const createdDate = new Date(property.created_at);
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      let groupKey: string;
      if (diffDays === 0) {
        groupKey = 'Idag';
      } else if (diffDays === 1) {
        groupKey = 'Igår';
      } else if (diffDays >= 2 && diffDays <= 7) {
        groupKey = `${diffDays} dagar`;
      } else if (diffDays > 7 && diffDays <= 28) {
        const weeks = Math.floor(diffDays / 7);
        groupKey = `${weeks} ${weeks === 1 ? 'vecka' : 'veckor'}`;
      } else {
        const weeks = Math.floor(diffDays / 7);
        groupKey = `${weeks} veckor`;
      }
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(property);
    });

    // Sort groups by time (newest first)
    const sortedGroups: {
      label: string;
      properties: Property[];
    }[] = [];

    // Add "Idag" first
    if (groups['Idag']) {
      sortedGroups.push({
        label: 'Idag',
        properties: groups['Idag']
      });
    }

    // Add "Igår" second
    if (groups['Igår']) {
      sortedGroups.push({
        label: 'Igår',
        properties: groups['Igår']
      });
    }

    // Add day groups (2-7 days)
    for (let i = 2; i <= 7; i++) {
      const key = `${i} dagar`;
      if (groups[key]) {
        sortedGroups.push({
          label: key,
          properties: groups[key]
        });
      }
    }

    // Add week groups
    const weekKeys = Object.keys(groups).filter(k => k.includes('vecka') || k.includes('veckor'));
    weekKeys.sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    }).forEach(key => {
      sortedGroups.push({
        label: key,
        properties: groups[key]
      });
    });
    return sortedGroups;
  };
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter(f => f !== feature) : [...prev.features, feature]
    }));
  };
  const toggleEnergyClass = (energyClass: string) => {
    setFilters(prev => ({
      ...prev,
      energyClass: prev.energyClass.includes(energyClass) ? prev.energyClass.filter(e => e !== energyClass) : [...prev.energyClass, energyClass]
    }));
  };
  const clearFilters = () => {
    setFilters({
      query: '',
      propertyType: '',
      listingType: '',
      minPrice: 0,
      maxPrice: 20000000,
      minArea: 0,
      maxArea: 1000,
      minRooms: 0,
      maxRooms: 10,
      city: '',
      features: [],
      energyClass: [],
      sortBy: 'created_desc',
      minRent: 0,
      maxRent: 50000,
      furnished: '',
      petsAllowed: false,
      shortTerm: false,
      utilities: [],
      floorLevel: 'all',
      isNewConstruction: 'all',
      minBuildYear: 'none',
      maxBuildYear: 'none',
      minMonthlyFee: 0,
      maxMonthlyFee: 10000,
      daysListed: 'all',
      viewingTime: 'all',
      waterDistance: 'all',
      nearSea: false,
      minPlotArea: 0,
      maxPlotArea: 10000,
      hideBeforeViewing: false,
      hideRental: false,
      hideCommercial: false,
      hideNyproduktion: false
    });
    setSelectedLocation(undefined);
  };
  const toggleUtility = (utility: string) => {
    setFilters(prev => ({
      ...prev,
      utilities: prev.utilities.includes(utility) ? prev.utilities.filter(u => u !== utility) : [...prev.utilities, utility]
    }));
  };
  const handleNaturalSearch = async () => {
    if (!naturalSearchQuery || naturalSearchQuery.trim().length === 0) {
      toast({
        title: "Ange sökning",
        description: "Vänligen ange en sökfras eller plats",
        variant: "destructive"
      });
      return;
    }

    // Check if the query is a natural language description (more than just a location)
    const isNaturalLanguage = naturalSearchQuery.trim().split(' ').length > 2;
    if (isNaturalLanguage) {
      setIsAISearching(true);
      try {
        // Call the AI natural search edge function
        const {
          data,
          error
        } = await supabase.functions.invoke('ai-natural-search', {
          body: {
            query: naturalSearchQuery
          }
        });
        if (error) {
          console.error('AI search error:', error);
          toast({
            title: "Sökfel",
            description: "Kunde inte tolka din sökning. Försök igen eller använd enklare sökord.",
            variant: "destructive"
          });
          setIsAISearching(false);
          return;
        }
        if (data && data.searchCriteria) {
          toast({
            title: "AI-sökning klar!",
            description: data.message || `Hittade ${data.count} matchande bostäder`
          });

          // Update filters based on AI-extracted criteria
          const criteria = data.searchCriteria;
          setFilters(prev => ({
            ...prev,
            query: criteria.location || prev.query,
            propertyType: criteria.propertyType?.[0] || prev.propertyType,
            minRooms: criteria.minRooms || prev.minRooms,
            maxRooms: criteria.maxRooms || prev.maxRooms,
            minArea: criteria.minArea || prev.minArea,
            maxArea: criteria.maxArea || prev.maxArea,
            minPrice: criteria.minPrice || prev.minPrice,
            maxPrice: criteria.maxPrice || prev.maxPrice
          }));
          setIsAISearching(false);
          setHasSearched(true);
          return;
        }
      } catch (err) {
        console.error('AI search exception:', err);
        toast({
          title: "Något gick fel",
          description: "Kunde inte genomföra AI-sökning. Försök igen.",
          variant: "destructive"
        });
        setIsAISearching(false);
        return;
      }
    } else {
      // Simple location search
      updateFilter('query', naturalSearchQuery);
    }
  };
  if (loading) {
    return <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar fastigheter...</p>
          </div>
        </div>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sök alla fastigheter</h1>
          <p className="text-muted-foreground">{totalResults} fastigheter hittades</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          
          <Button variant={viewMode === 'map' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('map')}>
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Rensa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {/* AI Smart Search */}
              <div className={`bg-accent/10 border border-accent/20 rounded-xl p-4 transition-all duration-300 ${isSearchInputExpanded ? 'fixed inset-0 z-50 backdrop-blur-md bg-background/30 flex items-center justify-center' : ''}`}>
                {isSearchInputExpanded && <div className="absolute inset-0" onClick={() => setIsSearchInputExpanded(false)} />}
                <div className={`relative ${isSearchInputExpanded ? 'w-full max-w-4xl mx-auto p-8' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <Label className="text-sm font-medium">Smart AI-sökning</Label>
                    
                  </div>
                  <p className={`text-xs text-muted-foreground mb-3 ${isSearchInputExpanded ? 'text-base' : ''}`}>
                    Beskriv din drömbostad i naturligt språk. Vår AI tolkar automatiskt dina önskemål.
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="T.ex. '3 rum lägenhet i Stockholm med balkong under 5 miljoner'" value={naturalSearchQuery} onChange={e => setNaturalSearchQuery(e.target.value)} onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleNaturalSearch();
                      setIsSearchInputExpanded(false);
                    }
                  }} onFocus={() => setIsSearchInputExpanded(true)} disabled={isAISearching} className={`text-sm transition-all duration-300 ${isSearchInputExpanded ? 'text-lg p-6' : ''}`} />
                    <Button onClick={() => {
                    handleNaturalSearch();
                    setIsSearchInputExpanded(false);
                  }} disabled={isAISearching} size={isSearchInputExpanded ? "lg" : "sm"}>
                      {isAISearching ? <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </> : <>
                          <Sparkles className="h-4 w-4" />
                        </>}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Search */}
              <div>
                <Label>Sök plats</Label>
                <LocationAutocomplete placeholder="Ange stad, kommun eller område" value={filters.query} onChange={value => updateFilter('query', value)} onSelect={location => {
                updateFilter('query', location.fullName);
                setSelectedLocation({
                  center_lat: location.center_lat,
                  center_lng: location.center_lng,
                  name: location.fullName,
                  type: location.type
                });
              }} className="mt-2" />
                <Input placeholder="T.ex. Stockholm" value={filters.city} onChange={e => updateFilter('city', e.target.value)} className="mt-2" />
              </div>

              <Separator />

              {/* Property Type */}
              <div>
                <Label>Fastighetstyp</Label>
                <div className="mt-2 space-y-2">
                  {['APARTMENT', 'HOUSE', 'TOWNHOUSE', 'COTTAGE', 'PLOT', 'COMMERCIAL', 'FARM', 'OTHER'].map(type => {
                  const labels = {
                    APARTMENT: 'Lägenheter',
                    HOUSE: 'Villor',
                    TOWNHOUSE: 'Radhus/Parhus/Kedjehus',
                    COTTAGE: 'Fritidshus',
                    PLOT: 'Tomter',
                    COMMERCIAL: 'Kommersiellt',
                    FARM: 'Gård',
                    OTHER: 'Övrigt'
                  };
                  return <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} checked={filters.propertyType === type} onCheckedChange={() => updateFilter('propertyType', filters.propertyType === type ? '' : type)} />
                        <Label htmlFor={type} className="text-sm cursor-pointer">
                          {labels[type as keyof typeof labels]}
                        </Label>
                      </div>;
                })}
                </div>
              </div>

              {/* Listing Type */}
              <div>
                <Label>Typ av annons</Label>
                <div className="mt-2 space-y-2">
                  {['FOR_SALE', 'FOR_RENT', 'COMING_SOON'].map(type => {
                  const labels = {
                    FOR_SALE: 'Till salu',
                    FOR_RENT: 'Uthyrning',
                    COMING_SOON: 'Snart till salu'
                  };
                  return <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} checked={filters.listingType === type} onCheckedChange={() => updateFilter('listingType', filters.listingType === type ? '' : type)} />
                        <Label htmlFor={type} className="text-sm cursor-pointer">
                          {labels[type as keyof typeof labels]}
                        </Label>
                      </div>;
                })}
                </div>
              </div>

              {/* Rental-specific filters - only show when FOR_RENT is selected */}
              {filters.listingType === 'FOR_RENT' && <>
                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-accent" />
                      <Label className="font-semibold">Hyresfilter</Label>
                      <Badge variant="outline" className="text-xs">
                        Endast hyresbostäder
                      </Badge>
                    </div>

                    {/* Rent Range */}
                    <div>
                      <Label>Hyresintervall (SEK/månad)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input type="number" placeholder="Från" value={filters.minRent || ''} onChange={e => updateFilter('minRent', Number(e.target.value) || 0)} />
                        <Input type="number" placeholder="Till" value={filters.maxRent === 50000 ? '' : filters.maxRent} onChange={e => updateFilter('maxRent', Number(e.target.value) || 50000)} />
                      </div>
                    </div>

                    {/* Furnished */}
                    <div>
                      <Label>Möblering</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="furnished" checked={filters.furnished === 'furnished'} onCheckedChange={() => updateFilter('furnished', filters.furnished === 'furnished' ? '' : 'furnished')} />
                          <Label htmlFor="furnished" className="text-sm cursor-pointer">
                            Möblerad
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="unfurnished" checked={filters.furnished === 'unfurnished'} onCheckedChange={() => updateFilter('furnished', filters.furnished === 'unfurnished' ? '' : 'unfurnished')} />
                          <Label htmlFor="unfurnished" className="text-sm cursor-pointer">
                            Omöblerad
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Utilities Included */}
                    <div>
                      <Label>Inkluderat i hyran</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['El', 'Värme', 'Internet', 'Parkering'].map(utility => <div key={utility} className="flex items-center space-x-2">
                            <Checkbox id={utility} checked={filters.utilities.includes(utility)} onCheckedChange={() => toggleUtility(utility)} />
                            <Label htmlFor={utility} className="text-sm">
                              {utility}
                            </Label>
                          </div>)}
                      </div>
                    </div>

                    {/* Additional rental options */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pets" checked={filters.petsAllowed} onCheckedChange={checked => updateFilter('petsAllowed', checked)} />
                        <Label htmlFor="pets" className="text-sm">
                          Husdjur tillåtet
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="shortTerm" checked={filters.shortTerm} onCheckedChange={checked => updateFilter('shortTerm', checked)} />
                        <Label htmlFor="shortTerm" className="text-sm">
                          Korttidsuthyrning (&lt;12 månader)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>}

              {/* Advanced Filters Toggle Button */}
              <Button variant="outline" className="w-full" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? 'Dölj utökade filter' : 'Utökade filter'}
              </Button>

              {showAdvancedFilters && <>
                  <Separator />

                  {/* Price Range - only show for non-rental properties */}
                  {filters.listingType !== 'FOR_RENT' && <div>
                  <Label>
                    {filters.listingType === 'FOR_SALE' ? 'Köpesumma (SEK)' : 'Prisintervall (SEK)'}
                  </Label>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="Från" value={filters.minPrice || ''} onChange={e => updateFilter('minPrice', Number(e.target.value) || 0)} />
                      <Input type="number" placeholder="Till" value={filters.maxPrice === 20000000 ? '' : filters.maxPrice} onChange={e => updateFilter('maxPrice', Number(e.target.value) || 20000000)} />
                    </div>
                  </div>
                </div>}

              {/* Area Range */}
              <div>
                <Label>Boarea (m²)</Label>
                <div className="mt-4 space-y-4">
                  <Slider value={[filters.minArea, filters.maxArea]} onValueChange={([min, max]) => {
                    updateFilter('minArea', min);
                    updateFilter('maxArea', max);
                  }} max={1000} step={10} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.minArea} m²</span>
                    <span>{filters.maxArea} m²</span>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <Label>Antal rum</Label>
                <div className="mt-4 space-y-4">
                  <Slider value={[filters.minRooms, filters.maxRooms]} onValueChange={([min, max]) => {
                    updateFilter('minRooms', min);
                    updateFilter('maxRooms', max);
                  }} max={10} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.minRooms} rum</span>
                    <span>{filters.maxRooms}+ rum</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Features */}
              <div>
                <Label>Egenskaper</Label>
                <div className="mt-2 space-y-2">
                  {commonFeatures.map(feature => <div key={feature} className="flex items-center space-x-2">
                      <Checkbox id={feature} checked={filters.features.includes(feature)} onCheckedChange={() => toggleFeature(feature)} />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>)}
                </div>
              </div>

              {/* Energy Class */}
              <div>
                <Label>Energiklass</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {energyClasses.map(energyClass => <Button key={energyClass} variant={filters.energyClass.includes(energyClass) ? 'default' : 'outline'} size="sm" onClick={() => toggleEnergyClass(energyClass)}>
                      {energyClass}
                    </Button>)}
                </div>
              </div>

              {/* Sale-specific filters - only show when NOT renting */}
              {filters.listingType !== 'FOR_RENT' && <>
                <Separator />

                {/* Floor Level */}
                <div>
                  <Label>Våningsplan</Label>
                  <div className="mt-2 space-y-2">
                    {['ground', '1-3', '4+'].map(level => {
                      const labels = {
                        ground: 'Bottenvåning',
                        '1-3': 'Våning 1-3',
                        '4+': 'Våning 4+'
                      };
                      return <div key={level} className="flex items-center space-x-2">
                          <Checkbox id={`floor-${level}`} checked={filters.floorLevel === level} onCheckedChange={() => updateFilter('floorLevel', filters.floorLevel === level ? 'all' : level)} />
                          <Label htmlFor={`floor-${level}`} className="text-sm cursor-pointer">
                            {labels[level as keyof typeof labels]}
                          </Label>
                        </div>;
                    })}
                  </div>
                </div>

                {/* New Construction */}
                <div>
                  <Label>Nyproduktion</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newconst-yes" checked={filters.isNewConstruction === 'yes'} onCheckedChange={() => updateFilter('isNewConstruction', filters.isNewConstruction === 'yes' ? 'all' : 'yes')} />
                      <Label htmlFor="newconst-yes" className="text-sm cursor-pointer">
                        Endast nyproduktion
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newconst-no" checked={filters.isNewConstruction === 'no'} onCheckedChange={() => updateFilter('isNewConstruction', filters.isNewConstruction === 'no' ? 'all' : 'no')} />
                      <Label htmlFor="newconst-no" className="text-sm cursor-pointer">
                        Uteslut nyproduktion
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Build Year */}
                <div>
                  <Label>Byggår</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Select value={filters.minBuildYear} onValueChange={value => updateFilter('minBuildYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="none">Inget minimum</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2010">2010</SelectItem>
                        <SelectItem value="2000">2000</SelectItem>
                        <SelectItem value="1990">1990</SelectItem>
                        <SelectItem value="1980">1980</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.maxBuildYear} onValueChange={value => updateFilter('maxBuildYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Max" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="none">Inget maximum</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2010">2010</SelectItem>
                        <SelectItem value="2000">2000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Monthly Fee */}
                <div>
                  <Label>Avgift (kr/mån)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="Min" value={filters.minMonthlyFee || ''} onChange={e => updateFilter('minMonthlyFee', Number(e.target.value) || 0)} />
                    <Input type="number" placeholder="Max" value={filters.maxMonthlyFee === 10000 ? '' : filters.maxMonthlyFee} onChange={e => updateFilter('maxMonthlyFee', Number(e.target.value) || 10000)} />
                  </div>
                </div>

                {/* Plot Area */}
                <div>
                  <Label>Tomtarea (m²)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input type="number" placeholder="Min" value={filters.minPlotArea || ''} onChange={e => updateFilter('minPlotArea', Number(e.target.value) || 0)} />
                    <Input type="number" placeholder="Max" value={filters.maxPlotArea === 10000 ? '' : filters.maxPlotArea} onChange={e => updateFilter('maxPlotArea', Number(e.target.value) || 10000)} />
                  </div>
                </div>

                <Separator />

                {/* Days Listed */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dagar på plattformen
                  </Label>
                  <RadioGroup value={filters.daysListed} onValueChange={value => updateFilter('daysListed', value)} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="days-all" />
                      <Label htmlFor="days-all" className="font-normal cursor-pointer">Visa alla</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="days-1" />
                      <Label htmlFor="days-1" className="font-normal cursor-pointer">Senaste dygnet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="days-3" />
                      <Label htmlFor="days-3" className="font-normal cursor-pointer">Max 3 dagar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7" id="days-7" />
                      <Label htmlFor="days-7" className="font-normal cursor-pointer">Max 1 vecka</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="14" id="days-14" />
                      <Label htmlFor="days-14" className="font-normal cursor-pointer">Max 2 veckor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="days-30" />
                      <Label htmlFor="days-30" className="font-normal cursor-pointer">Max 1 månad</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Viewing Time */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Visningstid
                  </Label>
                  <RadioGroup value={filters.viewingTime} onValueChange={value => updateFilter('viewingTime', value)} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="view-all" />
                      <Label htmlFor="view-all" className="font-normal cursor-pointer">Visa alla</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="today" id="view-today" />
                      <Label htmlFor="view-today" className="font-normal cursor-pointer">Idag</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tomorrow" id="view-tomorrow" />
                      <Label htmlFor="view-tomorrow" className="font-normal cursor-pointer">Imorgon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekend" id="view-weekend" />
                      <Label htmlFor="view-weekend" className="font-normal cursor-pointer">I helgen (lör-mån)</Label>
                    </div>
                  </RadioGroup>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="hideBeforeViewing" checked={filters.hideBeforeViewing} onCheckedChange={checked => updateFilter('hideBeforeViewing', checked)} />
                    <Label htmlFor="hideBeforeViewing" className="text-sm font-normal cursor-pointer">
                      Dölj borttagen före visning
                    </Label>
                  </div>
                </div>

                {/* Water Distance */}
                <div>
                  <Label className="flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    Avstånd till vatten
                  </Label>
                  <Select value={filters.waterDistance} onValueChange={value => updateFilter('waterDistance', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Alla" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="all">Alla</SelectItem>
                      <SelectItem value="100">Inom 100 m</SelectItem>
                      <SelectItem value="500">Inom 500 m</SelectItem>
                      <SelectItem value="1000">Inom 1 km</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="nearSea" checked={filters.nearSea} onCheckedChange={checked => updateFilter('nearSea', checked)} />
                    <Label htmlFor="nearSea" className="text-sm font-normal cursor-pointer">
                      Endast nära hav
                    </Label>
                  </div>
                </div>
              </>}

              <Separator />

              {/* AI Recommendations */}
              

              <Separator />

                  {/* Sort */}
                  
                </>}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Map View - Show centered above results in grid/list mode, full height in map mode */}
          {viewMode === 'map' ? <div className="h-[600px]">
              <PropertyMap properties={filteredProperties} searchLocation={filters.query} selectedLocation={selectedLocation} />
            </div> : <div className="mb-8 h-[400px]">
              <PropertyMap properties={filteredProperties} searchLocation={filters.query} selectedLocation={selectedLocation} />
            </div>}

          {/* Sort Button and Filters */}
          <div className="mb-6 space-y-4">
            {/* Main Country Tabs */}
            <div className="flex items-center justify-center">
              <Tabs value={countryTab} onValueChange={value => setCountryTab(value as 'SVERIGE' | 'UTOMLANDS')} className="w-full max-w-lg">
                <TabsList className="grid grid-cols-2 w-full h-12">
                  <TabsTrigger value="SVERIGE" className="text-lg font-semibold">
                    Sverige
                  </TabsTrigger>
                  <TabsTrigger value="UTOMLANDS" className="text-lg font-semibold">
                    Utland
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Property Type Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {/* Tabs for all property types with counters */}
                <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'ALL' | 'FOR_SALE' | 'FOR_RENT' | 'COMING_SOON' | 'SOLD' | 'COMMERCIAL' | 'NYPRODUKTION')}>
                  <TabsList className="grid grid-cols-7">
                    <TabsTrigger value="ALL">
                      Alla ({getFilteredCountForTab('ALL')})
                    </TabsTrigger>
                    <TabsTrigger value="FOR_SALE">
                      Till salu ({getFilteredCountForTab('FOR_SALE')})
                    </TabsTrigger>
                    <TabsTrigger value="COMING_SOON">
                      Snart till salu ({getFilteredCountForTab('COMING_SOON')})
                    </TabsTrigger>
                    <TabsTrigger value="SOLD">
                      Slutpriser ({getFilteredCountForTab('SOLD')})
                    </TabsTrigger>
                    <TabsTrigger value="FOR_RENT">
                      Uthyrning ({getFilteredCountForTab('FOR_RENT')})
                    </TabsTrigger>
                    <TabsTrigger value="NYPRODUKTION">
                      Nyproduktion ({getFilteredCountForTab('NYPRODUKTION')})
                    </TabsTrigger>
                    <TabsTrigger value="COMMERCIAL">
                      Kommersiellt ({getFilteredCountForTab('COMMERCIAL')})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="hideRental" checked={filters.hideRental} onCheckedChange={checked => updateFilter('hideRental', checked)} />
                <Label htmlFor="hideRental" className="text-sm cursor-pointer">
                  Visa ej hyresbostäder
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="hideCommercial" checked={filters.hideCommercial} onCheckedChange={checked => updateFilter('hideCommercial', checked)} />
                <Label htmlFor="hideCommercial" className="text-sm cursor-pointer">
                  Visa ej kommersiellt
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="hideNyproduktion" checked={filters.hideNyproduktion} onCheckedChange={checked => updateFilter('hideNyproduktion', checked)} />
                <Label htmlFor="hideNyproduktion" className="text-sm cursor-pointer">
                  Visa ej nyproduktion
                </Label>
              </div>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sortera efter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-border">
                {sortOptions.map(option => <DropdownMenuItem key={option.value} onClick={() => updateFilter('sortBy', option.value)} className={filters.sortBy === option.value ? 'bg-accent text-accent-foreground' : ''}>
                    {option.label}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
              </div>
            </div>
          </div>

          {/* AI Recommendations Section */}
          {showAiRecommendations && aiRecommendations.length > 0 && <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    AI-Rekommendationer för dig
                    <Badge variant="accent">Personligt</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-4xl mx-auto space-y-4">
                    {aiRecommendations.map(property => <PropertyCard key={`ai-${property.id}`} property={property} />)}
                  </div>
                </CardContent>
              </Card>
            </div>}

          {/* Grid/List View */}
          {viewMode !== 'map' && <>
              {filteredProperties.length === 0 ? <Card>
                  <CardContent className="text-center py-12">
                    <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Inga fastigheter hittades</h3>
                    <p className="text-muted-foreground mb-4">
                      Prova att justera dina sökkriterier för att hitta fler fastigheter.
                    </p>
                    <Button onClick={clearFilters}>
                      Rensa filter
                    </Button>
                  </CardContent>
                </Card> : <div className="mx-auto space-y-8">
                  {groupPropertiesByDays(filteredProperties).map(group => <div key={group.label} className="space-y-4">
                      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b">
                        <h3 className="text-lg font-semibold text-foreground">{group.label}</h3>
                      </div>
                      <div className="space-y-6">
                        {group.properties.map(property => <PropertyCard key={property.id} property={property} />)}
                      </div>
                    </div>)}
                </div>}
            </>}
        </div>
      </div>
    </div>;
};