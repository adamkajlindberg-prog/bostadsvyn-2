import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MapPin, Crown, Zap, Bell, Sparkles, Images, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  address_street: string;
  address_city: string;
  price: number;
  status: string;
  images?: string[];
  ad_tier?: 'free' | 'plus' | 'premium';
  created_at?: string;
  viewing_times?: Array<{ date: string; time: string }>;
}

interface BrokerPropertyCardProps {
  property: Property;
}

const tierBadgeConfig = {
  free: {
    label: 'Grund',
    className: 'bg-muted text-muted-foreground border border-border',
    icon: null
  },
  plus: {
    label: 'Plus',
    className: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-white/30',
    icon: Zap
  },
  premium: {
    label: 'Exklusiv',
    className: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-2 border-white/30',
    icon: Crown
  }
};

export default function BrokerPropertyCard({ property }: BrokerPropertyCardProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    viewsToday: 0,
    viewsThisWeek: 0,
    viewsTotal: 0,
    favorites: 0,
    finalPriceInterest: 0,
    aiEditUsers: 0,
    aiEditTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropertyStats();
  }, [property.id]);

  const loadPropertyStats = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Get start of week (Monday)
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      weekStart.setHours(0, 0, 0, 0);

      // Get all views
      const { data: allViews } = await supabase
        .from('property_views')
        .select('viewed_at')
        .eq('property_id', property.id);

      const viewsArray = allViews || [];
      
      // Calculate views by time period
      const viewsToday = viewsArray.filter(v => 
        new Date(v.viewed_at) >= todayStart
      ).length;
      
      const viewsThisWeek = viewsArray.filter(v => 
        new Date(v.viewed_at) >= weekStart
      ).length;

      // Get favorites count
      const { count: favCount } = await supabase
        .from('property_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', property.id);

      // Get final price interest count
      const { count: finalPriceCount } = await supabase
        .from('property_final_price_interest')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', property.id);

      // Get AI edit stats for premium properties
      let aiEditUsers = 0;
      let aiEditTotal = 0;
      
      if (property.ad_tier === 'premium') {
        const { data: aiEdits } = await supabase
          .from('user_ai_edits')
          .select('user_id')
          .eq('property_id', property.id);

        if (aiEdits && aiEdits.length > 0) {
          aiEditTotal = aiEdits.length;
          aiEditUsers = new Set(aiEdits.map(edit => edit.user_id)).size;
        }
      }

      setStats({
        viewsToday,
        viewsThisWeek,
        viewsTotal: viewsArray.length,
        favorites: favCount || 0,
        finalPriceInterest: finalPriceCount || 0,
        aiEditUsers,
        aiEditTotal
      });
    } catch (error) {
      console.error('Error loading property stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`/broker/property/${property.id}`);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('sv-SE')} kr`;
  };

  const getRenewalDate = () => {
    if (!property.created_at || (property.ad_tier !== 'plus' && property.ad_tier !== 'premium')) {
      return null;
    }
    
    const createdDate = new Date(property.created_at);
    const renewalDate = new Date(createdDate);
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    
    return renewalDate.toLocaleString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tierConfig = tierBadgeConfig[property.ad_tier || 'free'];
  const TierIcon = tierConfig.icon;
  const currentImage = property.images?.[0] || '/api/placeholder/120/120';
  const renewalDate = getRenewalDate();

  // Get next viewing time
  const getNextViewing = () => {
    if (!property.viewing_times || property.viewing_times.length === 0) return null;
    
    const now = new Date();
    const upcomingViewings = property.viewing_times
      .map(v => ({
        ...v,
        dateTime: new Date(`${v.date} ${v.time}`)
      }))
      .filter(v => v.dateTime > now)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    
    return upcomingViewings[0] || null;
  };

  const nextViewing = getNextViewing();

  return (
    <Card 
      className="w-full hover:shadow-lg transition-all duration-300 cursor-pointer group border"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Image Section - Tall Rectangle */}
          <div className="w-40 flex-shrink-0 relative rounded-lg overflow-hidden bg-muted">
            <img 
              src={currentImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/api/placeholder/120/120';
              }}
            />
            
            {/* Tier Badge on Image */}
            <div className="absolute top-2 left-2">
              <Badge className={cn("px-1.5 py-0.5 text-[10px] font-semibold shadow-md flex items-center gap-1", tierConfig.className)}>
                {TierIcon && <TierIcon className="h-2.5 w-2.5" />}
                {tierConfig.label}
              </Badge>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header with Title and ID */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-base leading-tight line-clamp-1 text-foreground">
                {property.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                {property.status === 'COMING_SOON' && (
                  <Badge className="text-xs whitespace-nowrap bg-accent text-accent-foreground border border-accent/30 hover:bg-accent/90 flex items-center gap-1 px-2 py-0.5">
                    <Calendar className="h-3 w-3" />
                    Snart till salu
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs whitespace-nowrap font-medium px-2 py-0.5">
                  AnnonsID: #{property.id.slice(0, 8)}
                </Badge>
              </div>
            </div>
            
            {/* Address and Price - Side by Side */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="line-clamp-1">{property.address_street}, {property.address_city}</span>
              </div>
              <div className="text-xl font-bold text-foreground whitespace-nowrap">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Compact Stats Row */}
            <div className="flex items-center gap-2.5 text-xs mb-2 flex-wrap">
              {nextViewing && (
                <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  <Calendar className="h-3 w-3 text-green-600" />
                  <span className="text-muted-foreground">Nästa visning:</span>
                  <span className="font-bold text-foreground">
                    {new Date(nextViewing.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })} kl {nextViewing.time}
                  </span>
                </div>
              )}
              {renewalDate && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded border border-border/50">
                  <Zap className="h-3 w-3 text-accent" />
                  <span className="text-muted-foreground">Förnyelse:</span>
                  <span className="font-semibold text-foreground">{renewalDate}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                <Bell className="h-3 w-3 text-blue-500" />
                <span className="text-muted-foreground">Bevakare:</span>
                <span className="font-bold text-foreground">{loading ? '...' : stats.finalPriceInterest}</span>
              </div>
              {property.ad_tier === 'premium' && (
                <>
                  <div className="flex items-center gap-1.5 bg-purple-500/5 px-2 py-1 rounded border border-purple-500/10">
                    <Users className="h-3 w-3 text-purple-500" />
                    <span className="text-muted-foreground">Bildredigerare:</span>
                    <span className="font-bold text-foreground">{loading ? '...' : stats.aiEditUsers}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-pink-500/5 px-2 py-1 rounded border border-pink-500/10">
                    <Images className="h-3 w-3 text-pink-500" />
                    <span className="text-muted-foreground">Bilder redigerade:</span>
                    <span className="font-bold text-foreground">{loading ? '...' : stats.aiEditTotal}</span>
                  </div>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t mt-auto">
              {/* Clicks Today */}
              <div className="flex flex-col items-center text-center gap-0.5">
                <div className="text-sm font-bold text-foreground">
                  {loading ? '...' : stats.viewsToday}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">Sidvisningar<br />idag</div>
              </div>

              {/* Clicks This Week */}
              <div className="flex flex-col items-center text-center gap-0.5">
                <div className="text-sm font-bold text-foreground">
                  {loading ? '...' : stats.viewsThisWeek}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">Sidvisningar<br />veckan</div>
              </div>

              {/* Total Clicks */}
              <div className="flex flex-col items-center text-center gap-0.5">
                <div className="text-sm font-bold text-foreground">
                  {loading ? '...' : stats.viewsTotal}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">Sidvisningar<br />totalt</div>
              </div>

              {/* Favorites */}
              <div className="flex flex-col items-center text-center gap-0.5">
                <div className="text-sm font-bold text-foreground">
                  {loading ? '...' : stats.favorites}
                </div>
                <div className="text-xs text-muted-foreground">Sparade</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
