import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar, Crown, Eye, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Ad = Database["public"]["Tables"]["ads"]["Row"];

export default function PublishedAds() {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPublishedAds();
    }
  }, [user, loadPublishedAds]);

  const loadPublishedAds = async () => {
    try {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user?.id)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error("Error loading published ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPackageInfo = (tier: string) => {
    switch (tier) {
      case "premium":
        return {
          name: "Exklusivpaket",
          price: "3 995 kr",
          icon: Crown,
          color: "text-premium",
          bgColor: "bg-premium/10",
          borderColor: "border-premium/30",
        };
      case "plus":
        return {
          name: "Pluspaket",
          price: "1 995 kr",
          icon: TrendingUp,
          color: "text-accent",
          bgColor: "bg-accent/10",
          borderColor: "border-accent/30",
        };
      default:
        return {
          name: "Grundpaket",
          price: "Gratis",
          icon: Star,
          color: "text-foreground",
          bgColor: "bg-muted/10",
          borderColor: "border-muted/30",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar publicerade annonser...</p>
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12 text-center">
          <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Inga publicerade annonser
          </h3>
          <p className="text-muted-foreground mb-4">
            Du har inga publicerade annonser ännu. När säljare godkänner och
            betalar för sina annonser kommer de att visas här.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Publicerade annonser ({ads.length})
        </h2>
      </div>

      <div className="grid gap-4">
        {ads.map((ad) => {
          const packageInfo = getPackageInfo(ad.ad_tier);
          const PackageIcon = packageInfo.icon;

          // Parse broker form data for additional info
          const brokerData = ad.broker_form_data as any;
          const propertyAddress =
            brokerData?.property_address || "Ingen adress angiven";
          const sellerName = brokerData?.seller_name || "Ej angivet";
          const sellerEmail = brokerData?.seller_email || "";

          return (
            <Card
              key={ad.id}
              className={`shadow-card ${packageInfo.borderColor} border-2`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${packageInfo.bgColor} rounded-lg p-2`}>
                        <PackageIcon
                          className={`h-5 w-5 ${packageInfo.color}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{ad.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {propertyAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={ad.ad_tier === "premium" ? "gold" : "secondary"}
                    className="ml-4"
                  >
                    {packageInfo.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Säljare:</p>
                    <p className="font-medium">{sellerName}</p>
                    <p className="text-muted-foreground text-xs">
                      {sellerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Skapad:</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {format(new Date(ad.created_at), "PPP", { locale: sv })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Paket:</p>
                    <p className="font-medium">
                      {packageInfo.name} - {packageInfo.price}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`/statistik/${ad.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visa statistik
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
