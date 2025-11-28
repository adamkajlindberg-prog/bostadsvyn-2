import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Filter, SlidersHorizontal } from 'lucide-react';
import PropertyCard, { Property } from './PropertyCard';
import { useAuth } from '@/hooks/useAuth';
import fastighetsbyranLogo from '@/assets/broker-logos/fastighetsbyran.png';
import maklarhusetLogo from '@/assets/broker-logos/maklarhuset.png';
import svenskFastighetsformedlingLogo from '@/assets/broker-logos/svensk-fastighetsformedling.png';
import notarMaklareLogo from '@/assets/broker-logos/notar-maklare.png';
import lansforsakringarLogo from '@/assets/broker-logos/lansforsakringar.png';
import bjurforsLogo from '@/assets/broker-logos/bjurfors.png';
export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [filterBy, setFilterBy] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const {
    user
  } = useAuth();
  useEffect(() => {
    fetchProperties();
  }, [sortBy, filterBy]);
  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Create 9 test properties - 3 for each tier with unique images
      const testProperties: Property[] = [
      // PREMIUM - 3 annonser
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Exklusiv villa med havsutsikt',
        price: 18500000,
        address_street: 'Strandvägen 42',
        address_city: 'Djursholm',
        address_postal_code: '182 68',
        property_type: 'Villa',
        status: 'FOR_SALE',
        rooms: 8,
        living_area: 285,
        bedrooms: 5,
        bathrooms: 3,
        monthly_fee: 8500,
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Magnifik villa i absolut toppskick med panoramautsikt över havet. Genomgående exklusiva materialval, rymliga sällskapsytor och perfekt planlösning för familjen som värdesätter kvalitet och komfort.',
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
        address_city: 'Stockholm',
        address_postal_code: '114 33',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 7,
        living_area: 198,
        bedrooms: 4,
        bathrooms: 2,
        monthly_fee: 12400,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509608-f57c2647775e?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600047509418-62a1ffa95cb5?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'premium',
        description: 'Extraordinär sekelskiftesvåning med ursprungliga detaljer och modern komfort. Stuckatur, kakelugnar och kristallkronor möter nutida kök och badrum. Exklusivt läge vid Strandvägen.',
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
        address_city: 'Lidingö',
        address_postal_code: '181 62',
        property_type: 'Villa',
        status: 'FOR_SALE',
        rooms: 10,
        living_area: 420,
        bedrooms: 6,
        bathrooms: 4,
        monthly_fee: 0,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600566752229-250ed79470e0?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=675&fit=crop', 'https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=1200&h=675&fit=crop'],
        created_at: new Date().toISOString(),
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
        address_city: 'Stockholm',
        address_postal_code: '114 46',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 4,
        living_area: 98,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 4200,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
        description: 'Ljus och välplanerad lägenhet med centralt läge. Nyrenoverad med moderna lösningar och fin balkong mot lugn innergård.',
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
        address_city: 'Nacka',
        address_postal_code: '131 52',
        property_type: 'Radhus',
        status: 'FOR_SALE',
        rooms: 5,
        living_area: 135,
        bedrooms: 3,
        bathrooms: 2,
        monthly_fee: 3100,
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491679-a5f5a7c2011f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491369-a7ebba6be29b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600210491483-f75dfaa5b6e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'plus',
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
        address_city: 'Stockholm',
        address_postal_code: '118 26',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 3,
        living_area: 76,
        bedrooms: 2,
        bathrooms: 1,
        monthly_fee: 3450,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&h=600&fit=crop'],
        created_at: new Date().toISOString(),
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
      // FREE - 2 annonser
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'Mysig 2:a i Vasastan',
        price: 3450000,
        address_street: 'Hagagatan 8',
        address_city: 'Stockholm',
        address_postal_code: '113 47',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 2,
        living_area: 52,
        bedrooms: 1,
        bathrooms: 1,
        monthly_fee: 2800,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'free',
        description: 'Trevlig tvåa i populära Vasastan med bra kommunikationer och nära till service.',
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
        address_city: 'Stockholm',
        address_postal_code: '113 46',
        property_type: 'Lägenhet',
        status: 'FOR_SALE',
        rooms: 1,
        living_area: 32,
        bedrooms: 1,
        bathrooms: 1,
        monthly_fee: 2100,
        images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'],
        created_at: new Date().toISOString(),
        user_id: 'test',
        ad_tier: 'free',
        description: 'Liten men smart planerad lägenhet med perfekt läge nära tunnelbanan.',
        broker: {
          name: 'Peter Nilsson',
          avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
          office_logo: maklarhusetLogo,
          phone: '08-890 123 45'
        }
      }
      ];

      // Sort by status first (rental last), then ad_tier (premium > plus > free)
      const tierPriority = {
        premium: 3,
        plus: 2,
        free: 1
      };
      testProperties.sort((a, b) => {
        // First: Rental properties come last
        const aIsRental = a.status === 'FOR_RENT';
        const bIsRental = b.status === 'FOR_RENT';
        if (aIsRental !== bIsRental) {
          return aIsRental ? 1 : -1; // Non-rental first
        }
        
        // Second: Sort by ad_tier
        const aTierPriority = tierPriority[a.ad_tier || 'free'];
        const bTierPriority = tierPriority[b.ad_tier || 'free'];
        return bTierPriority - aTierPriority; // Higher priority first
      });
      setProperties(testProperties);
    } catch (error) {
      console.error('Error generating test properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };
  const handleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };
  const activeFilters = [filterBy !== 'all' && filterBy, sortBy !== 'created_at' && sortBy].filter(Boolean);
  if (loading) {
    return <section className="py-12 bg-nordic-ice">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laddar fastigheter...</p>
          </div>
        </div>
      </section>;
  }
  return <section className="py-12 bg-nordic-ice">
      <div className="container mx-auto px-4">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Utvalda bostäder
                </CardTitle>
                
              </div>

              
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Aktiva filter:</span>
                {activeFilters.map((filter, index) => <Badge key={index} variant="secondary">
                    {filter}
                  </Badge>)}
                <Button variant="ghost" size="sm" onClick={() => {
              setFilterBy('all');
              setSortBy('created_at');
            }}>
                  Rensa alla
                </Button>
              </div>}
          </CardHeader>

          <CardContent>
            {properties.length === 0 ? <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">Inga fastigheter hittades</h3>
                <p className="text-muted-foreground mb-6">
                  Prova att ändra dina sökfilter eller kolla tillbaka senare.
                </p>
                {user && <Button className="bg-primary hover:bg-primary-deep">
                    Lägg till din fastighet
                  </Button>}
              </div> : <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {properties.map(property => {
              const span = property.ad_tier === 'premium' ? 'col-span-1 md:col-span-2 lg:col-span-3' : property.ad_tier === 'plus' ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'col-span-1 md:col-span-1 lg:col-span-1';
              return <div key={property.id} className={span}>
                      <PropertyCard property={property} size={viewMode === 'list' ? 'large' : undefined} />
                    </div>;
            })}
              </div>}

            {/* Load More Button */}
            {properties.length > 0 && properties.length % 9 === 0 && <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Ladda fler fastigheter
                </Button>
              </div>}
          </CardContent>
        </Card>
      </div>
    </section>;
}