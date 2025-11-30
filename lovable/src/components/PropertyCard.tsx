import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bed, Bath, Square, Calendar, Eye, Users, Plus, ChevronLeft, ChevronRight, MessageCircle, Clock, Home, FileText, Video, Gavel, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
export interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: string;
  status: string;
  price: number;
  address_street: string;
  address_postal_code: string;
  address_city: string;
  living_area?: number;
  auxiliary_area?: number;
  plot_area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  energy_class?: string;
  monthly_fee?: number;
  images?: string[];
  features?: string[];
  created_at: string;
  user_id: string;
  ad_tier?: 'free' | 'plus' | 'premium';
  ad_id?: string; // Add ad_id for management navigation
  tenure_type?: string;
  show_bidding?: boolean;
  video_url?: string;
  video_as_first_image?: boolean;
  headline?: string;
  floor_number?: number;
  price_per_sqm?: number;
  viewing_times?: Array<{
    date: string;
    time: string;
    status: 'scheduled' | 'cancelled' | 'completed';
    spots_available?: number;
  }>;
  broker?: {
    name: string;
    office_name?: string;
    avatar_url?: string;
    office_logo?: string;
    phone?: string;
  };
  rental_info?: {
    contract_type: string;
    available_from: string;
    pets_allowed: boolean;
    furnished: boolean;
    lease_duration?: string;
    utilities_included?: boolean;
    internet_included?: boolean;
    is_shared?: boolean;
    floor_level?: string;
    building_year?: number;
    energy_rating?: string;
    min_income?: number;
    min_age?: number;
    max_occupants?: number;
    references_required?: boolean;
    neighborhood_description?: string;
    nearest_metro?: string;
    transport_description?: string;
    contact_phone?: string;
    viewing_instructions?: string;
    preferred_contact_method?: string;
    kitchen_amenities?: string[];
    bathroom_amenities?: string[];
    tech_amenities?: string[];
    other_amenities?: string[];
  };
  is_nyproduktion?: boolean;
  nyproduktion_project_id?: string | null;
  nyproduktion_total_units?: number;
}
interface PropertyCardProps {
  property: Property;
  size?: 'small' | 'medium' | 'large';
  onContactClick?: () => void;
  forceWide?: boolean;
  maxWidthClass?: string;
  disableClick?: boolean;
  managementMode?: boolean;
}
const propertyTypeLabels: {
  [key: string]: string;
} = {
  'Villa': 'Villa',
  'Lägenhet': 'Lägenhet',
  'Radhus': 'Radhus',
  'Bostadsrätt': 'Bostadsrätt',
  'Fritidshus': 'Fritidshus',
  'Tomt': 'Tomt',
  'Kommersiell': 'Kommersiell'
};
const statusLabels: {
  [key: string]: string;
} = {
  'FOR_SALE': 'Till salu',
  'FOR_RENT': 'Till uthyrning',
  'COMING_SOON': 'Kommer snart',
  'SOLD': 'Såld',
  'DRAFT': 'Utkast'
};
const statusColors: {
  [key: string]: string;
} = {
  'FOR_SALE': 'bg-success text-success-foreground',
  'FOR_RENT': 'bg-info text-info-foreground',
  'COMING_SOON': 'bg-warning text-warning-foreground',
  'SOLD': 'bg-muted text-muted-foreground',
  'DRAFT': 'bg-secondary text-secondary-foreground'
};
export default function PropertyCard({
  property,
  size,
  onContactClick,
  forceWide,
  maxWidthClass,
  disableClick = false,
  managementMode = false
}: PropertyCardProps) {
  // Map ad_tier to size if not explicitly provided
  const getCardSize = () => {
    if (size) return size;
    if (property.ad_tier === 'free') return 'small';
    if (property.ad_tier === 'plus') return 'medium';
    if (property.ad_tier === 'premium') return 'large';
    return 'medium';
  };
  const cardSize = getCardSize();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userGroup, setUserGroup] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const images = property.images || [];
  const hasMultipleImages = images.length > 1;
  
  // Determine if we should show video as first media (only for sale properties, not rentals)
  const isRental = property.status === 'FOR_RENT';
  const showVideoFirst = !isRental && property.video_as_first_image && property.video_url && currentImageIndex === 0;
  const currentImage = images[currentImageIndex] || '/api/placeholder/400/300';
  
  // Helper function to get video embed URL
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?controls=0&mute=1&loop=1&playlist=${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?muted=1&loop=1&background=1`;
    }
    
    return url;
  };
  
  const videoEmbedUrl = property.video_url ? getVideoEmbedUrl(property.video_url) : null;
  
  useEffect(() => {
    if (user) {
      checkIfFavorite();
      loadUserGroup();
    }
  }, [user, property.id]);
  
  useEffect(() => {
    if (videoRef.current) {
      if (isVideoHovered) {
        videoRef.current.play().catch(err => console.log('Video play error:', err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoHovered]);
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };
  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };
  const checkIfFavorite = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.from('property_favorites').select('id').eq('user_id', user.id).eq('property_id', property.id).maybeSingle();
    if (!error && data) {
      setIsFavorite(true);
    }
  };
  const loadUserGroup = async () => {
    if (!user) return;
    try {
      const {
        data: groupMember,
        error
      } = await supabase.from('group_members').select(`
          *,
          groups (*)
        `).eq('user_id', user.id).maybeSingle();
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading group:', error);
        return;
      }
      if (groupMember && groupMember.groups) {
        setUserGroup(groupMember.groups);
      }
    } catch (error) {
      console.error('Error loading group:', error);
    }
  };
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Logga in",
        description: "Du måste vara inloggad för att spara favoriter",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isFavorite) {
        await supabase.from('property_favorites').delete().eq('user_id', user.id).eq('property_id', property.id);
        setIsFavorite(false);
        toast({
          title: "Borttagen från favoriter",
          description: "Objektet har tagits bort från dina favoriter"
        });
      } else {
        await supabase.from('property_favorites').insert({
          user_id: user.id,
          property_id: property.id
        });
        setIsFavorite(true);
        toast({
          title: "Tillagd som favorit",
          description: "Objektet har lagts till i dina favoriter"
        });
      }
    } catch (error) {
      toast({
        title: "Något gick fel",
        description: "Kunde inte uppdatera favoriter",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };
  const addToGroup = async () => {
    if (!user || !userGroup) {
      toast({
        title: "Ingen grupp",
        description: "Du måste vara medlem i en grupp för att lägga till objekt",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.from('group_properties').insert({
        group_id: userGroup.id,
        property_id: property.id,
        added_by: user.id
      });
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Redan tillagt",
            description: "Detta objekt finns redan i gruppens lista",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Fel",
            description: error.message,
            variant: "destructive"
          });
        }
        return;
      }
      toast({
        title: "Tillagt till gruppen!",
        description: "Objektet har lagts till för gruppröstning"
      });
    } catch (error) {
      console.error('Error adding to group:', error);
      toast({
        title: "Fel",
        description: "Kunde inte lägga till objekt till gruppen",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const formatPrice = (price: number, status: string) => {
    if (status === 'FOR_RENT' || status === 'RENTED') {
      return `${price.toLocaleString('sv-SE')} kr/mån`;
    }
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  const getTotalArea = () => {
    const living = property.living_area || 0;
    const auxiliary = property.auxiliary_area || 0;
    return living + auxiliary;
  };

  const tenureTypeLabels: { [key: string]: string } = {
    'OWNERSHIP': 'Äganderätt',
    'CONDOMINIUM': 'Bostadsrätt',
    'RENTAL': 'Hyresrätt',
    'COOPERATIVE': 'Andelslägenhet'
  };
  const tierBadgeLabels = {
    free: 'Grund',
    plus: 'Plus',
    premium: 'Exklusiv'
  };
  
  // Helper function to get next scheduled viewing
  const getNextViewing = () => {
    if (!property.viewing_times || property.viewing_times.length === 0) return null;
    
    const now = new Date();
    const upcoming = property.viewing_times
      .filter(v => v.status === 'scheduled')
      .filter(v => {
        const viewingDate = new Date(v.date + 'T' + v.time.split('-')[0]);
        return viewingDate > now;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time.split('-')[0]);
        const dateB = new Date(b.date + 'T' + b.time.split('-')[0]);
        return dateA.getTime() - dateB.getTime();
      });
    
    return upcoming[0] || null;
  };
  
  const nextViewing = getNextViewing();
  
  const tierBadgeColors = {
    free: 'bg-muted text-muted-foreground',
    plus: 'bg-info text-info-foreground',
    premium: 'bg-gradient-to-r from-accent to-primary text-white'
  };
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if disableClick is true
    if (disableClick) {
      return;
    }
    // Prevent navigation if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Check if we're in management mode (broker viewing from broker portal)
    if (managementMode) {
      // Route to correct management page
      if (isRental && (property as any).ad_id) {
        navigate(`/hantera-uthyrning/${(property as any).ad_id}`);
      } else {
        // Fallback to broker property details for sales
        navigate(`/broker/property/${property.id}`);
      }
    } else {
      // Navigate to nyproduktion project page for projects
      if (property.is_nyproduktion && !property.nyproduktion_project_id && property.nyproduktion_total_units && property.nyproduktion_total_units > 0) {
        navigate(`/nyproduktion/${property.id}`);
      } else {
        // Navigate to the property ad page
        navigate(`/annons/${property.id}`);
      }
    }
  };
  
  // Rental properties always use the compact unified style with unique rental branding
  if (isRental) {
    return <Card className={cn("w-full overflow-hidden hover:shadow-xl transition-all duration-300 group border-l-4 border-l-rental", !disableClick && "cursor-pointer")} onClick={handleCardClick}>
        <div className="flex flex-col sm:flex-row h-full bg-gradient-to-r from-rental/5 to-transparent">
          {/* Image Section - 50% width, 16:9 aspect */}
          <div className="relative sm:w-[50%] flex-shrink-0">
            <div className="aspect-[16/9] overflow-hidden bg-muted"
              onMouseEnter={() => showVideoFirst && setIsVideoHovered(true)}
              onMouseLeave={() => showVideoFirst && setIsVideoHovered(false)}>
              {showVideoFirst && videoEmbedUrl ? (
                <iframe
                  ref={videoRef as any}
                  src={videoEmbedUrl}
                  className="w-full h-full object-cover"
                  allow="autoplay; loop; muted"
                  frameBorder="0"
                />
              ) : (
                <img src={currentImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" loading="lazy" onError={e => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/400/400';
                }} />
              )}
            </div>
            
            {/* Status Badge for Rentals - Unique Rental Branding */}
            <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
              <Badge className="bg-rental text-rental-foreground px-2 py-0.5 text-xs font-semibold shadow-lg border-2 border-rental-foreground/20 backdrop-blur-sm">
                UTHYRNING
              </Badge>
              {property.rental_info?.contract_type === 'Korttid' && (
                <Badge className="bg-warning text-warning-foreground px-2 py-0.5 text-xs font-semibold shadow-md">
                  Korttid
                </Badge>
              )}
              {property.rental_info?.contract_type === 'Långtid' && (
                <Badge className="bg-success text-success-foreground px-2 py-0.5 text-xs font-semibold shadow-md">
                  Långtid
                </Badge>
              )}
              {property.is_nyproduktion && (
                <Badge className="bg-premium text-premium-foreground px-2 py-0.5 text-xs font-semibold shadow-lg border-2 border-premium-foreground/20 backdrop-blur-sm">
                  Nyproduktion
                </Badge>
              )}
            </div>
            
            {/* Image Navigation */}
            {hasMultipleImages && <>
                <Button variant="ghost" size="icon" className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={previousImage}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {images.map((_, index) => <div key={index} className={cn("h-0.5 rounded-full transition-all", index === currentImageIndex ? "w-3 bg-white" : "w-0.5 bg-white/50")} />)}
                </div>
              </>}
            
            {/* Favorite button */}
            <div className="absolute bottom-2 right-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/90 hover:bg-white shadow-md rounded-full" onClick={toggleFavorite} disabled={isLoading}>
                <Heart className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-foreground hover:text-red-500")} />
              </Button>
            </div>
          </div>
          
          {/* Info Section - 50% width with compact layout - Rental Specific */}
          <div className="sm:w-[50%] p-4 flex flex-col justify-between bg-background">
            <div className="space-y-2">
              {/* Headline if present */}
              {property.headline && (
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">{property.headline}</p>
              )}
              
              {/* Title */}
              <h3 className="font-semibold text-base leading-tight line-clamp-2 text-foreground">{property.title}</h3>
              
              {/* Address */}
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 text-rental" />
                <span className="line-clamp-1">{property.address_street}, {property.address_city}</span>
              </div>
              
              {/* Price - Emphasized for Rentals */}
              <div className="text-xl font-bold text-rental flex items-center gap-2">
                {formatPrice(property.price, property.status)}
                <span className="text-xs font-normal text-muted-foreground">
                  ({property.living_area ? `${Math.round(property.price / property.living_area)} kr/m²` : ''})
                </span>
              </div>
              
              {/* Property Details - Compact Grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs py-1">
                <div>
                  <span className="text-muted-foreground">Storlek:</span>{' '}
                  <span className="font-semibold">
                    {property.living_area ? `${property.living_area} m²` : 'Ej angivet'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Typ:</span>{' '}
                  <span className="font-semibold">{propertyTypeLabels[property.property_type]}</span>
                </div>
                {property.rooms && (
                  <div>
                    <span className="text-muted-foreground">Rum:</span>{' '}
                    <span className="font-semibold">{property.rooms}</span>
                  </div>
                )}
                {property.bedrooms && (
                  <div>
                    <span className="text-muted-foreground">Sovrum:</span>{' '}
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                )}
              </div>
              
              {/* Rental-Specific Information - Highlighted */}
              {property.rental_info && (
                <div className="mt-2 pt-2 border-t-2 border-rental/20 bg-rental/5 -mx-2 px-2 py-2 rounded">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-rental" />
                      <div>
                        <span className="text-muted-foreground">Tillgänglig:</span>{' '}
                        <span className="font-semibold">{new Date(property.rental_info.available_from).toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-3 w-3 text-rental" />
                      <div>
                        <span className="text-muted-foreground">Möblerad:</span>{' '}
                        <span className="font-semibold">{property.rental_info.furnished ? 'Ja' : 'Nej'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Husdjur:</span>{' '}
                      <span className="font-semibold">{property.rental_info.pets_allowed ? 'Ja' : 'Nej'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-rental" />
                      <div>
                        <span className="text-muted-foreground">Kontrakt:</span>{' '}
                        <span className="font-semibold">{property.rental_info.contract_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  {(property.rental_info.kitchen_amenities?.length || property.rental_info.bathroom_amenities?.length || 
                    property.rental_info.tech_amenities?.length || property.rental_info.other_amenities?.length) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {property.rental_info.kitchen_amenities?.slice(0, 2).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 h-5">{amenity}</Badge>
                      ))}
                      {property.rental_info.tech_amenities?.slice(0, 2).map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 h-5">{amenity}</Badge>
                      ))}
                      {(property.rental_info.other_amenities?.length || 0) + (property.rental_info.bathroom_amenities?.length || 0) > 0 && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-5">
                          +{(property.rental_info.other_amenities?.length || 0) + (property.rental_info.bathroom_amenities?.length || 0)} till
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Contact Button - Rental Styled */}
            {onContactClick && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button 
                  size="sm" 
                  className="w-full bg-rental hover:bg-rental/90 text-rental-foreground font-semibold shadow-md" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick();
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Kontakta uthyrare
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>;
  }

  // Sale properties use different tiers (Exklusiv, Plus, Grund)
  if (cardSize === 'large') {
    // EXKLUSIVPAKET - Premium showcase with large image
    return <Card className={cn("w-full mx-auto overflow-hidden hover:shadow-2xl transition-all duration-500 group border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5", !disableClick && "cursor-pointer", maxWidthClass ?? (forceWide ? "max-w-7xl" : "max-w-6xl"))} onClick={handleCardClick}>
        <div className={cn("flex h-full lg:h-[480px]", forceWide ? "flex-row" : "flex-col lg:flex-row")}>
          {/* Image Section - 70% width */}
          <div className={cn("relative flex-shrink-0", forceWide ? "w-[70%] self-stretch" : "lg:w-[70%] lg:self-stretch") }>
            <div className={cn("aspect-[16/9] overflow-hidden bg-muted", forceWide ? "hidden" : "lg:hidden") }
              onMouseEnter={() => showVideoFirst && setIsVideoHovered(true)}
              onMouseLeave={() => showVideoFirst && setIsVideoHovered(false)}>
              {showVideoFirst && videoEmbedUrl ? (
                <iframe
                  ref={videoRef as any}
                  src={videoEmbedUrl}
                  className="w-full h-full object-cover"
                  allow="autoplay; loop; muted"
                  frameBorder="0"
                />
              ) : (
                <img src={currentImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" onError={e => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/1200/675';
                }} />
              )}
            </div>
            <div className={cn("relative h-full bg-muted overflow-hidden", forceWide ? "block" : "hidden lg:block") }
              onMouseEnter={() => showVideoFirst && setIsVideoHovered(true)}
              onMouseLeave={() => showVideoFirst && setIsVideoHovered(false)}>
              {showVideoFirst && videoEmbedUrl ? (
                <iframe
                  ref={videoRef as any}
                  src={videoEmbedUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  allow="autoplay; loop; muted"
                  frameBorder="0"
                />
              ) : (
                <img src={currentImage} alt={property.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" onError={e => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/1200/675';
                }} />
              )}
            </div>
            
            {/* Image Navigation */}
            {hasMultipleImages && <>
                <Button variant="ghost" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={previousImage}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => <div key={index} className={cn("h-1.5 rounded-full transition-all", index === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50")} />)}
                </div>
              </>}
            
            {/* Premium Badge */}
            <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
              <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-2.5 py-1 text-xs font-semibold shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                <span className="mr-1" style={{fontSize: '0.6rem'}}>👑</span>
                {tierBadgeLabels[property.ad_tier!]}
              </Badge>
              
              {/* Nyproduktion Badge */}
              {property.is_nyproduktion && (
                <Badge className="bg-premium text-premium-foreground px-2.5 py-1 text-xs font-semibold shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                  <Building2 className="h-3.5 w-3.5 mr-1" />
                  Nyproduktion
                </Badge>
              )}
              
              {/* Bidding Badge */}
              {property.show_bidding && property.status === 'FOR_SALE' && (
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-2.5 py-1 text-xs font-semibold shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                  <Gavel className="h-3.5 w-3.5 mr-1" />
                  Budgivning
                </Badge>
              )}
              
              {/* Coming Soon Badge */}
              {property.status === 'COMING_SOON' && (
                <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-semibold shadow-md border border-accent/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Snart till salu
                </Badge>
              )}
              
              {/* Viewing Time Badge */}
              {nextViewing && (
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2.5 py-1 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-2 border-green-400/50 ring-2 ring-black/20">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Visning {new Date(nextViewing.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })} kl {nextViewing.time}
                </Badge>
              )}
              
              {/* Commercial Property Badges */}
              {property.property_type === 'COMMERCIAL' && (
                <Badge className="bg-purple-600 text-white px-2.5 py-1 text-xs font-semibold shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                  Kommersiellt
                </Badge>
              )}
            </div>

            {/* Video Icon - TEST: Always visible */}
            {(property.video_url || true) && (
              <div className="absolute top-5 right-5">
                <div className="h-10 w-10 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border-2 border-white/30">
                  <Video className="h-5 w-5 text-white" />
                </div>
              </div>
            )}

            {/* Units badge for nyproduktion projects */}
            {property.is_nyproduktion && !property.nyproduktion_project_id && property.nyproduktion_total_units && property.nyproduktion_total_units > 0 && (
              <div className="absolute bottom-5 left-5">
                <Badge className="bg-black/80 text-white px-3 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-sm border border-white/20">
                  <Home className="h-3.5 w-3.5 mr-1.5" />
                  {property.nyproduktion_total_units} enheter
                </Badge>
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute bottom-5 right-5 flex gap-3">
              <Button variant="ghost" size="icon" className="h-12 w-12 bg-white/95 hover:bg-white shadow-xl backdrop-blur-md rounded-full border border-white/50" onClick={toggleFavorite} disabled={isLoading}>
                <Heart className={cn("h-6 w-6 transition-all duration-300", isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-foreground hover:text-red-500")} />
              </Button>
              {userGroup && <Button variant="ghost" size="icon" className="h-12 w-12 bg-white/95 hover:bg-white shadow-xl backdrop-blur-md rounded-full border border-white/50" onClick={addToGroup} disabled={isLoading} title="Lägg till i gruppen">
                  <Users className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
                </Button>}
            </div>
          </div>
          
          {/* Info Section - 30% width */}
          <div className={cn("p-6 flex flex-col justify-between overflow-hidden", forceWide ? "w-[30%]" : "lg:w-[30%]")}>
            <div className="space-y-3">
              {/* Headline if present */}
              {property.headline && (
                <p className="text-sm font-bold text-primary uppercase tracking-wide">{property.headline}</p>
              )}
              
              <h3 className="font-bold text-xl leading-tight text-foreground">{property.title}</h3>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <div className="text-sm font-medium">
                  {property.address_street}, {property.address_city}
                </div>
              </div>
              
              <div className="py-3">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {formatPrice(property.price, property.status)}
                </div>
              </div>
              
              <div className="space-y-2 py-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Storlek</div>
                    <div className="font-bold text-sm">
                      {property.living_area && property.auxiliary_area 
                        ? `${property.living_area} + ${property.auxiliary_area} m²`
                        : property.living_area 
                        ? `${property.living_area} m²`
                        : 'Ej angivet'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Bostadstyp</div>
                    <div className="font-bold text-sm">{propertyTypeLabels[property.property_type] || property.property_type}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.tenure_type && <div>
                    <div className="text-xs text-muted-foreground">Upplåtelsetyp</div>
                    <div className="font-bold text-sm">{tenureTypeLabels[property.tenure_type] || property.tenure_type}</div>
                  </div>}
                  {property.rooms && <div>
                    <div className="text-xs text-muted-foreground">Rum</div>
                    <div className="font-bold text-sm">{property.rooms} rum</div>
                  </div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.plot_area && <div>
                    <div className="text-xs text-muted-foreground">Tomtstorlek</div>
                    <div className="font-bold text-sm">{property.plot_area} m²</div>
                  </div>}
                  {property.property_type === 'Lägenhet' && property.floor_number !== undefined && <div>
                    <div className="text-xs text-muted-foreground">Våningsplan</div>
                    <div className="font-bold text-sm">Våning {property.floor_number}</div>
                  </div>}
                </div>
                {property.price_per_sqm && <div>
                  <div className="text-xs text-muted-foreground">Pris per m²</div>
                  <div className="font-bold text-sm">{property.price_per_sqm.toLocaleString('sv-SE')} kr/m²</div>
                </div>}
              </div>
              
              {property.broker && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-start gap-3">
                    {property.broker.avatar_url && (
                      <img 
                        src={property.broker.avatar_url} 
                        alt={property.broker.name}
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground">{property.broker.name}</div>
                      {property.broker.office_name && (
                        <div className="text-xs text-muted-foreground">{property.broker.office_name}</div>
                      )}
                      {property.broker.office_logo && (
                        <div className="mt-2">
                          <img 
                            src={property.broker.office_logo} 
                            alt="Mäklarfirma logotyp"
                            className="h-8 w-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>;
  }

  if (cardSize === 'medium') {
    // PLUSPAKET - Medium showcase
    return <Card className={cn("w-full max-w-5xl mx-auto overflow-hidden hover:shadow-xl transition-all duration-400 group border border-info/40 bg-gradient-to-br from-background to-info/5", !disableClick && "cursor-pointer")} onClick={handleCardClick}>
        <div className="flex flex-col sm:flex-row h-full">
          {/* Image Section - 58% width */}
          <div className="relative sm:w-[58%] flex-shrink-0">
            <div className="aspect-[16/9] overflow-hidden bg-muted"
              onMouseEnter={() => showVideoFirst && setIsVideoHovered(true)}
              onMouseLeave={() => showVideoFirst && setIsVideoHovered(false)}>
              {showVideoFirst && videoEmbedUrl ? (
                <iframe
                  ref={videoRef as any}
                  src={videoEmbedUrl}
                  className="w-full h-full object-cover"
                  allow="autoplay; loop; muted"
                  frameBorder="0"
                />
              ) : (
                <img src={currentImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={e => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/800/600';
                }} />
              )}
            </div>
            
            {/* Image Navigation */}
            {hasMultipleImages && <>
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={previousImage}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => <div key={index} className={cn("h-1 rounded-full transition-all", index === currentImageIndex ? "w-4 bg-white" : "w-1 bg-white/50")} />)}
                </div>
              </>}
            
            {/* Plus Badge */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 text-xs font-semibold shadow-lg border border-white/30 backdrop-blur-sm">
                <span className="mr-1" style={{fontSize: '0.6rem'}}>⭐</span>
                {tierBadgeLabels[property.ad_tier!]}
              </Badge>
              
              {/* Bidding Badge */}
              {property.show_bidding && property.status === 'FOR_SALE' && (
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-0.5 text-xs font-semibold shadow-lg border border-white/30 backdrop-blur-sm">
                  <Gavel className="h-3.5 w-3.5 mr-1" />
                  Budgivning
                </Badge>
              )}
              
              {/* Coming Soon Badge */}
              {property.status === 'COMING_SOON' && (
                <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-semibold shadow-md border border-accent/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Snart till salu
                </Badge>
              )}
              
              {/* Viewing Time Badge */}
              {nextViewing && (
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-0.5 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-2 border-green-400/50 ring-2 ring-black/20">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(nextViewing.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} kl {nextViewing.time}
                </Badge>
              )}
              
              {/* Commercial Property Badges */}
              {property.property_type === 'COMMERCIAL' && (
                <Badge className="bg-purple-600 text-white px-2 py-0.5 text-xs font-semibold shadow-lg border border-white/30 backdrop-blur-sm">
                  Verksamhetslokal
                </Badge>
              )}
            </div>

            {/* Video Icon */}
            {property.video_url && (
              <div className="absolute top-3 right-3">
                <div className="h-9 w-9 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30">
                  <Video className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg backdrop-blur-md rounded-full" onClick={toggleFavorite} disabled={isLoading}>
                <Heart className={cn("h-5 w-5 transition-colors duration-300", isFavorite ? "fill-red-500 text-red-500" : "text-foreground hover:text-red-500")} />
              </Button>
              {userGroup && <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg backdrop-blur-md rounded-full" onClick={addToGroup} disabled={isLoading} title="Lägg till i gruppen">
                  <Users className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
                </Button>}
            </div>
          </div>
          
          {/* Info Section - 42% width */}
          <div className="sm:w-[42%] p-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <h3 className="font-bold text-lg leading-tight">{property.title}</h3>
              
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                <div className="font-medium">
                  {property.address_street}, {property.address_city}
                </div>
              </div>
              
              <div className="py-2">
                <div className="text-xl font-extrabold text-primary">
                  {formatPrice(property.price, property.status)}
                </div>
              </div>
              
              <div className="space-y-1.5 py-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Storlek: </span>
                    <span className="font-bold">
                      {property.living_area && property.auxiliary_area 
                        ? `${property.living_area}+${property.auxiliary_area} m²`
                        : property.living_area 
                        ? `${property.living_area} m²`
                        : 'Ej angivet'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Typ: </span>
                    <span className="font-bold">{propertyTypeLabels[property.property_type]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.tenure_type && <div>
                    <span className="text-muted-foreground">Upplåtelsetyp: </span>
                    <span className="font-bold">{tenureTypeLabels[property.tenure_type]}</span>
                  </div>}
                  {property.rooms && <div>
                    <span className="text-muted-foreground">Rum: </span>
                    <span className="font-bold">{property.rooms} rum</span>
                  </div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.plot_area && <div>
                    <span className="text-muted-foreground">Tomt: </span>
                    <span className="font-bold">{property.plot_area} m²</span>
                  </div>}
                  {property.property_type === 'Lägenhet' && property.floor_number !== undefined && <div>
                    <span className="text-muted-foreground">Våning: </span>
                    <span className="font-bold">{property.floor_number}</span>
                  </div>}
                </div>
                {property.price_per_sqm && <div>
                  <span className="text-muted-foreground">Pris/m²: </span>
                  <span className="font-bold">{property.price_per_sqm.toLocaleString('sv-SE')} kr</span>
                </div>}
              </div>
              
              {property.broker && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-start gap-2.5">
                    {property.broker.avatar_url && (
                      <img 
                        src={property.broker.avatar_url} 
                        alt={property.broker.name}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground">{property.broker.name}</div>
                      {property.broker.office_name && (
                        <div className="text-xs text-muted-foreground">{property.broker.office_name}</div>
                      )}
                    </div>
                    {property.broker.office_logo && (
                      <div className="flex items-center ml-auto">
                        <img 
                          src={property.broker.office_logo} 
                          alt="Mäklarfirma logotyp"
                          className="h-7 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>;
  }

  // GRUNDPAKET (small size) - Compact design
  return <Card className={cn("w-full max-w-5xl mx-auto overflow-hidden hover:shadow-lg transition-all duration-300 group", !disableClick && "cursor-pointer")} onClick={handleCardClick}>
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image Section - 50% width */}
        <div className="relative sm:w-[50%] flex-shrink-0">
          <div className="aspect-[16/9] overflow-hidden bg-muted"
            onMouseEnter={() => showVideoFirst && setIsVideoHovered(true)}
            onMouseLeave={() => showVideoFirst && setIsVideoHovered(false)}>
            {showVideoFirst && videoEmbedUrl ? (
              <iframe
                ref={videoRef as any}
                src={videoEmbedUrl}
                className="w-full h-full object-cover"
                allow="autoplay; loop; muted"
                frameBorder="0"
              />
            ) : (
              <img src={currentImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" loading="lazy" onError={e => {
                (e.target as HTMLImageElement).src = '/api/placeholder/400/400';
              }} />
            )}
          </div>
          
          {/* Grund Badge */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            <Badge className="bg-muted text-muted-foreground px-2 py-0.5 text-xs font-semibold shadow-md border border-border backdrop-blur-sm">
              {tierBadgeLabels[property.ad_tier!]}
            </Badge>
            
            {/* Bidding Badge */}
            {property.show_bidding && property.status === 'FOR_SALE' && (
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-0.5 text-xs font-semibold shadow-md border border-white/30 backdrop-blur-sm">
                <Gavel className="h-3 w-3 mr-1" />
                Budgivning
              </Badge>
            )}
            
            {/* Coming Soon Badge */}
            {property.status === 'COMING_SOON' && (
              <Badge className="bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-semibold shadow-md border border-accent/30">
                <Clock className="h-3 w-3 mr-1" />
                Snart till salu
              </Badge>
            )}
            
            {/* Viewing Time Badge */}
            {nextViewing && (
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-0.5 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-2 border-green-400/50 ring-2 ring-black/20">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(nextViewing.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} {nextViewing.time}
              </Badge>
            )}
            
            {/* Commercial Property Badges */}
            {property.property_type === 'COMMERCIAL' && (
              <Badge className="bg-purple-600 text-white px-2 py-0.5 text-xs font-semibold shadow-md backdrop-blur-sm">
                Kommersiell
              </Badge>
            )}
          </div>
          
          {/* Image Navigation */}
          {hasMultipleImages && <>
              <Button variant="ghost" size="icon" className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={previousImage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                {images.map((_, index) => <div key={index} className={cn("h-0.5 rounded-full transition-all", index === currentImageIndex ? "w-3 bg-white" : "w-0.5 bg-white/50")} />)}
              </div>
            </>}
          
          {/* Video Icon */}
          {property.video_url && (
            <div className="absolute top-2 right-2">
              <div className="h-8 w-8 bg-black/70 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-white/30">
                <Video className="h-4 w-4 text-white" />
              </div>
            </div>
          )}

          {/* Favorite button */}
          <div className="absolute bottom-2 right-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 bg-white/90 hover:bg-white shadow-md rounded-full" onClick={toggleFavorite} disabled={isLoading}>
              <Heart className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-foreground hover:text-red-500")} />
            </Button>
          </div>
        </div>
        
        {/* Info Section - 50% width */}
        <div className="sm:w-[50%] p-4 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Headline if present */}
            {property.headline && (
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">{property.headline}</p>
            )}
            
            <h3 className="font-semibold text-base leading-tight line-clamp-2">{property.title}</h3>
            
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{property.address_street}, {property.address_city}</span>
            </div>
            
            <div className="text-lg font-bold text-primary">
              {formatPrice(property.price, property.status)}
            </div>
            
            <div className="space-y-1 text-sm py-2">
              <div>
                <span className="text-muted-foreground">Storlek: </span>
                <span className="font-semibold">
                  {property.living_area && property.auxiliary_area 
                    ? `${property.living_area}+${property.auxiliary_area} m²`
                    : property.living_area 
                    ? `${property.living_area} m²`
                    : 'Ej angivet'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Typ: </span>
                <span className="font-semibold">{propertyTypeLabels[property.property_type]}</span>
              </div>
              {property.tenure_type && <div>
                <span className="text-muted-foreground">Upplåtelsetyp: </span>
                <span className="font-semibold">{tenureTypeLabels[property.tenure_type]}</span>
              </div>}
              {property.rooms && <div>
                <span className="text-muted-foreground">Rum: </span>
                <span className="font-semibold">{property.rooms} rum</span>
              </div>}
              {property.plot_area && <div>
                <span className="text-muted-foreground">Tomt: </span>
                <span className="font-semibold">{property.plot_area} m²</span>
              </div>}
              {property.property_type === 'Lägenhet' && property.floor_number !== undefined && <div>
                <span className="text-muted-foreground">Våning: </span>
                <span className="font-semibold">{property.floor_number}</span>
              </div>}
              {property.price_per_sqm && <div>
                <span className="text-muted-foreground">Pris/m²: </span>
                <span className="font-semibold">{property.price_per_sqm.toLocaleString('sv-SE')} kr</span>
              </div>}
            </div>
            
            {property.broker && (
              <div className="mt-2.5 pt-2.5 border-t border-border/50">
                <div className="flex items-start gap-2">
                  {property.broker.avatar_url && (
                    <img 
                      src={property.broker.avatar_url} 
                      alt={property.broker.name}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-foreground">{property.broker.name}</div>
                    {property.broker.office_name && (
                      <div className="text-[10px] text-muted-foreground">{property.broker.office_name}</div>
                    )}
                  </div>
                  {property.broker.office_logo && (
                    <div className="flex items-center ml-auto">
                      <img 
                        src={property.broker.office_logo} 
                        alt="Mäklarfirma logotyp"
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>;
}
export { PropertyCard };
