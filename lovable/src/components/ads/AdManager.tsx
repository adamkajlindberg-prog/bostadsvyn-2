import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Star, TrendingUp, Eye, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Ad {
  id: string;
  title: string;
  description: string;
  ad_tier: string;
  property_id: string;
  is_featured: boolean;
  priority_score: number;
  expires_at: string | null;
  created_at: string;
  custom_image_url: string | null;
  ai_generated_image_url: string | null;
}

interface AdTierFeature {
  feature_name: string;
  feature_description: string;
  ad_tier: string;
  is_enabled: boolean;
}

const AdManager = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [tierFeatures, setTierFeatures] = useState<AdTierFeature[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    ad_tier: 'free',
    is_featured: false,
    expires_at: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user's ads
      const { data: adsData } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch user's properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, title, address_street, address_city')
        .eq('user_id', user?.id);

      // Fetch ad tier features
      const { data: featuresData } = await supabase
        .from('ad_tier_features')
        .select('*')
        .eq('is_enabled', true)
        .order('ad_tier');

      setAds(adsData || []);
      setProperties(propertiesData || []);
      setTierFeatures(featuresData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAd = async () => {
    if (!selectedProperty || !newAd.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const adData = {
        ...newAd,
        user_id: user?.id,
        property_id: selectedProperty,
        expires_at: newAd.expires_at || null
      };

      const { error } = await supabase
        .from('ads')
        .insert([adData]);

      if (error) throw error;

      toast.success('Ad created successfully!');
      setShowCreateForm(false);
      setNewAd({
        title: '',
        description: '',
        ad_tier: 'free',
        is_featured: false,
        expires_at: ''
      });
      setSelectedProperty('');
      fetchUserData();
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error('Failed to create ad');
    }
  };

  const upgradeAd = async (adId: string, newTier: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ ad_tier: newTier })
        .eq('id', adId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success(`Ad upgraded to ${newTier} tier!`);
      fetchUserData();
    } catch (error) {
      console.error('Error upgrading ad:', error);
      toast.error('Failed to upgrade ad');
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-gradient-to-r from-amber-500 to-yellow-600';
      case 'professional': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'basic': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getTierFeatures = (tier: string) => {
    return tierFeatures.filter(feature => feature.ad_tier === tier);
  };

  const isAdExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading ads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ad Manager</h2>
          <p className="text-muted-foreground">Manage your property advertisements and boost visibility</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Ad
        </Button>
      </div>

      {/* Create Ad Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Advertisement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {property.address_street}, {property.address_city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">Ad Tier</Label>
                <Select value={newAd.ad_tier} onValueChange={(value) => setNewAd({ ...newAd, ad_tier: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Ad Title</Label>
              <Input
                id="title"
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                placeholder="Create an engaging title for your ad"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAd.description}
                onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                placeholder="Describe what makes this property special"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={newAd.is_featured}
                onCheckedChange={(checked) => setNewAd({ ...newAd, is_featured: checked })}
              />
              <Label htmlFor="featured">Feature this ad (requires premium tier)</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expiration Date (optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={newAd.expires_at}
                onChange={(e) => setNewAd({ ...newAd, expires_at: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={createAd}>Create Ad</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Ads */}
      <div className="grid gap-4">
        {ads.length === 0 ? (
          <Card>
            <CardContent className="text-center p-8">
              <div className="text-muted-foreground mb-4">No ads created yet</div>
              <Button onClick={() => setShowCreateForm(true)}>Create Your First Ad</Button>
            </CardContent>
          </Card>
        ) : (
          ads.map((ad) => (
            <Card key={ad.id} className={`relative ${isAdExpired(ad.expires_at) ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{ad.title}</h3>
                      <Badge className={`${getTierColor(ad.ad_tier)} text-white border-0`}>
                        {ad.ad_tier.toUpperCase()}
                      </Badge>
                      {ad.is_featured && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                      {isAdExpired(ad.expires_at) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{ad.description}</p>
                    
                    {/* Ad Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features included:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getTierFeatures(ad.ad_tier).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature.feature_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>Priority: {ad.priority_score}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {ad.expires_at && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Expires: {new Date(ad.expires_at).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex gap-2 mt-2">
                      {ad.ad_tier === 'free' && (
                        <Button size="sm" onClick={() => upgradeAd(ad.id, 'basic')}>
                          Upgrade to Basic
                        </Button>
                      )}
                      {ad.ad_tier === 'basic' && (
                        <Button size="sm" onClick={() => upgradeAd(ad.id, 'professional')}>
                          Upgrade to Pro
                        </Button>
                      )}
                      {ad.ad_tier === 'professional' && (
                        <Button size="sm" onClick={() => upgradeAd(ad.id, 'premium')}>
                          Upgrade to Premium
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pricing Tiers Info */}
      <Card>
        <CardHeader>
          <CardTitle>Advertising Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['free', 'basic', 'professional', 'premium'].map((tier) => (
              <div key={tier} className={`p-4 rounded-lg ${getTierColor(tier)} text-white`}>
                <h3 className="font-semibold text-lg mb-2 capitalize">{tier}</h3>
                <ul className="space-y-1 text-sm">
                  {getTierFeatures(tier).map((feature, index) => (
                    <li key={index}>• {feature.feature_name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdManager;