import { ArrowLeft, Loader2, Save } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EditAd = () => {
  const { adId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ad, setAd] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    if (user && adId) {
      loadAdData();
    }
  }, [user, adId, loadAdData]);

  const loadAdData = async () => {
    try {
      setLoading(true);

      // Load ad with property details
      const { data: adData, error: adError } = await supabase
        .from("ads")
        .select(`
          id,
          title,
          description,
          user_id,
          property_id,
          ad_tier,
          moderation_status,
          created_at,
          expires_at,
          custom_image_url,
          ai_generated_image_url,
          properties (
            id,
            title,
            description,
            price,
            living_area,
            rooms,
            bedrooms,
            bathrooms,
            address_street,
            address_postal_code,
            address_city,
            property_type,
            status,
            images,
            rental_info
          )
        `)
        .eq("id", adId)
        .eq("user_id", user?.id)
        .single();

      if (adError) throw adError;

      if (!adData) {
        toast({
          title: "Fel",
          description: "Annonsen hittades inte eller du har inte behörighet",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setAd(adData);
      setProperty(adData.properties);
    } catch (error: any) {
      console.error("Error loading ad:", error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda annons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ad || !property) return;

    try {
      setSaving(true);

      // Update ad
      const { error: adError } = await supabase
        .from("ads")
        .update({
          title: ad.title,
          description: ad.description,
        })
        .eq("id", adId);

      if (adError) throw adError;

      // Update property
      const { error: propertyError } = await supabase
        .from("properties")
        .update({
          title: property.title,
          description: property.description,
          price: property.price,
          living_area: property.living_area,
          rooms: property.rooms,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          address_street: property.address_street,
          address_postal_code: property.address_postal_code,
          address_city: property.address_city,
        })
        .eq("id", property.id);

      if (propertyError) throw propertyError;

      toast({
        title: "Sparat!",
        description: "Annonsen har uppdaterats",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving ad:", error);
      toast({
        title: "Fel",
        description: "Kunde inte spara ändringar",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!ad || !property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tillbaka till Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-6">Redigera annons</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Annonsinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ad-title">Annonsrubrik</Label>
                <Input
                  id="ad-title"
                  value={ad.title}
                  onChange={(e) => setAd({ ...ad, title: e.target.value })}
                  placeholder="T.ex. Mysig 2:a i centrala Stockholm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ad-description">Annonsbeskrivning</Label>
                <Textarea
                  id="ad-description"
                  value={ad.description || ""}
                  onChange={(e) =>
                    setAd({ ...ad, description: e.target.value })
                  }
                  placeholder="Beskriv bostaden..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fastighetsinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Hyra (kr/mån)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={property.price}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="living-area">Boarea (m²)</Label>
                  <Input
                    id="living-area"
                    type="number"
                    value={property.living_area || ""}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        living_area: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="rooms">Antal rum</Label>
                  <Input
                    id="rooms"
                    type="number"
                    value={property.rooms || ""}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        rooms: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Antal sovrum</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={property.bedrooms || ""}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        bedrooms: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Antal badrum</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={property.bathrooms || ""}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        bathrooms: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="address-street">Gatuadress</Label>
                  <Input
                    id="address-street"
                    value={property.address_street}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        address_street: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal-code">Postnummer</Label>
                    <Input
                      id="postal-code"
                      value={property.address_postal_code}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          address_postal_code: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Stad</Label>
                    <Input
                      id="city"
                      value={property.address_city}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          address_city: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sparar...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Spara ändringar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAd;
