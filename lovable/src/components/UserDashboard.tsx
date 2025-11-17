import {
  Activity,
  AlertCircle,
  BarChart3,
  Bot,
  Calculator,
  Calendar,
  Clock,
  Eye,
  Heart,
  History,
  Home,
  Lock,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import AIImageGallery from "@/components/AIImageGallery";
import { SellerAdReview } from "@/components/ads/SellerAdReview";
import { SellerProjectReview } from "@/components/ads/SellerProjectReview";
import { AIAnalysisHistory } from "@/components/ai/AIAnalysisHistory";
import AIHomestyling from "@/components/ai/AIHomestyling";
import AIMarketAnalysis from "@/components/ai/AIMarketAnalysis";
import AIPropertyAdvisor from "@/components/ai/AIPropertyAdvisor";
import AIPropertyValuation from "@/components/ai/AIPropertyValuation";
import { ChatShortcut } from "@/components/ChatShortcut";
import PropertyComparison from "@/components/comparison/PropertyComparison";
import MortgageCalculator from "@/components/mortgage/MortgageCalculator";
import { ProfileEditor } from "@/components/ProfileEditor";
import PropertyCard, { type Property } from "@/components/PropertyCard";
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt";
import { UserProfile } from "@/components/UserProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  favoriteCount: number;
  viewCount: number;
  savedSearchCount: number;
  alertCount: number;
  propertyCount?: number;
}
interface RecentActivity {
  id: string;
  type: "view" | "favorite" | "search" | "property";
  title: string;
  description: string;
  timestamp: string;
  property_id?: string;
}
export const UserDashboard: React.FC = () => {
  const { user, profile, userRoles, subscriptionTier, isPro } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    favoriteCount: 0,
    viewCount: 0,
    savedSearchCount: 0,
    alertCount: 0,
  });
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [_recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [rentalAds, setRentalAds] = useState<any[]>([]);
  const [brokerSalesAds, setBrokerSalesAds] = useState<any[]>([]);
  const [pendingApprovalAds, setPendingApprovalAds] = useState<any[]>([]);
  const [pendingApprovalProjects, setPendingApprovalProjects] = useState<any[]>(
    [],
  );
  const [adsLoading, setAdsLoading] = useState(false);
  const isPropertyOwner =
    userRoles.includes("seller") ||
    userRoles.includes("broker") ||
    userRoles.includes("admin");
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);
  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadStats(),
        loadFavoriteProperties(),
        loadRecentActivity(),
        loadUserAds(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  const loadUserAds = async () => {
    try {
      setAdsLoading(true);

      // Load pending approval ads (seller needs to review)
      const { data: pendingData, error: pendingError } = await supabase
        .from("ads")
        .select(`
          id,
          title,
          description,
          ad_tier,
          moderation_status,
          broker_form_data,
          expires_at,
          created_at,
          custom_image_url,
          ai_generated_image_url,
          property_id,
          properties (
            id,
            title,
            property_type,
            price,
            status,
            address_street,
            address_city,
            address_postal_code,
            living_area,
            rooms,
            bedrooms,
            bathrooms,
            images
          )
        `)
        .eq("user_id", user?.id)
        .eq("moderation_status", "pending_seller_approval")
        .order("created_at", {
          ascending: false,
        });
      if (pendingError) throw pendingError;

      // Add test/demo ad for demonstration
      const testAd = {
        id: "test-pending-approval-1",
        title: "Modern tvårummare i Vasastan",
        description: "Ljus och stilren lägenhet med balkong",
        ad_tier: "premium",
        moderation_status: "pending_seller_approval",
        broker_form_data: {
          recommendedPackages: {
            package: "premium",
          },
          propertyInfo: {
            address: "Vasagatan 12, 111 20 Stockholm",
            seller: {
              type: "private",
              name: "Test Säljare",
            },
          },
          paymentInfo: {
            payer: "seller",
            billingAddress: "Vasagatan 12, 111 20 Stockholm",
          },
        },
        created_at: new Date().toISOString(),
        properties: {
          id: "test-property-1",
          title: "Modern tvårummare i Vasastan",
          property_type: "APARTMENT",
          price: 3200000,
          status: "FOR_SALE",
          address_street: "Vasagatan 12",
          address_city: "Stockholm",
          address_postal_code: "111 20",
          living_area: 62,
          rooms: 2,
          bedrooms: 1,
          bathrooms: 1,
          images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
          ],
        },
      };
      setPendingApprovalAds([testAd, ...(pendingData || [])]);

      // Load pending Nyproduktion projects (seller needs to review)
      const { data: projectData, error: projectError } = await supabase
        .from("ads")
        .select(`
          id,
          title,
          description,
          ad_tier,
          moderation_status,
          broker_form_data,
          created_at,
          property_id,
          properties (
            id,
            title,
            is_nyproduktion,
            nyproduktion_total_units,
            address_street,
            address_city
          )
        `)
        .eq("user_id", user?.id)
        .eq("moderation_status", "pending_seller_approval")
        .not("properties.is_nyproduktion", "is", null)
        .order("created_at", {
          ascending: false,
        });
      if (projectError) throw projectError;
      setPendingApprovalProjects(projectData || []);

      // Load rental ads (user-managed)
      const { data: rentalData, error: rentalError } = await supabase
        .from("ads")
        .select(`
          id,
          title,
          description,
          ad_tier,
          moderation_status,
          expires_at,
          created_at,
          custom_image_url,
          ai_generated_image_url,
          property_id,
          properties (
            id,
            title,
            property_type,
            price,
            status,
            address_street,
            address_city,
            address_postal_code,
            living_area,
            rooms,
            bedrooms,
            bathrooms,
            images,
            rental_info
          )
        `)
        .eq("user_id", user?.id)
        .eq("properties.status", "FOR_RENT")
        .neq("moderation_status", "pending_seller_approval")
        .order("created_at", {
          ascending: false,
        });
      if (rentalError) throw rentalError;

      // Load broker-managed sales ads
      const { data: salesData, error: salesError } = await supabase
        .from("ads")
        .select(`
          id,
          title,
          description,
          ad_tier,
          moderation_status,
          expires_at,
          created_at,
          custom_image_url,
          ai_generated_image_url,
          property_id,
          properties (
            id,
            title,
            property_type,
            price,
            status,
            address_street,
            address_city,
            address_postal_code,
            living_area,
            rooms,
            bedrooms,
            bathrooms,
            images
          )
        `)
        .eq("user_id", user?.id)
        .eq("properties.status", "FOR_SALE")
        .neq("moderation_status", "pending_seller_approval")
        .order("created_at", {
          ascending: false,
        });
      if (salesError) throw salesError;

      setRentalAds(rentalData || []);
      setBrokerSalesAds(salesData || []);
    } catch (error) {
      console.error("Error loading user ads:", error);
    } finally {
      setAdsLoading(false);
    }
  };
  const loadStats = async () => {
    try {
      // Load favorites count
      const { count: favoriteCount } = await supabase
        .from("property_favorites")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user?.id);

      // Load saved searches count
      const { count: savedSearchCount } = await supabase
        .from("saved_searches")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user?.id);

      // Load property alerts count
      const { count: alertCount } = await supabase
        .from("property_alerts")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user?.id)
        .eq("is_active", true);

      // Load property count if user is property owner
      let propertyCount = 0;
      if (isPropertyOwner) {
        const { count } = await supabase
          .from("properties")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user?.id);
        propertyCount = count || 0;
      }
      setStats({
        favoriteCount: favoriteCount || 0,
        viewCount: 0,
        // Would need to aggregate from property_views
        savedSearchCount: savedSearchCount || 0,
        alertCount: alertCount || 0,
        propertyCount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };
  const loadFavoriteProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("property_favorites")
        .select(`
          id,
          created_at,
          property_id,
          properties (
            id,
            title,
            property_type,
            price,
            status,
            address_street,
            address_postal_code,
            address_city,
            living_area,
            rooms,
            images,
            created_at,
            user_id
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(6);
      if (error) throw error;
      const properties =
        data?.map((fav) => fav.properties).filter(Boolean) || [];
      setFavoriteProperties(properties);
    } catch (error) {
      console.error("Error loading favorite properties:", error);
    }
  };
  const loadRecentActivity = async () => {
    try {
      // This is a simplified version - in a real app you'd aggregate from multiple tables
      const activities: RecentActivity[] = [];

      // Add recent favorites
      const { data: recentFavorites } = await supabase
        .from("property_favorites")
        .select(`
          id,
          created_at,
          properties (title, id)
        `)
        .eq("user_id", user?.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);
      recentFavorites?.forEach((fav) => {
        if (fav.properties) {
          activities.push({
            id: fav.id,
            type: "favorite",
            title: "Sparad som favorit",
            description: (fav.properties as any).title,
            timestamp: fav.created_at,
            property_id: (fav.properties as any).id,
          });
        }
      });

      // Sort by timestamp
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error("Error loading recent activity:", error);
    }
  };
  const _getActivityIcon = (type: string) => {
    switch (type) {
      case "favorite":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "view":
        return <Eye className="h-4 w-4 text-primary" />;
      case "search":
        return <Search className="h-4 w-4 text-green-500" />;
      case "property":
        return <Home className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };
  const getUserInitials = () => {
    if (userRoles.includes("company") && profile?.company_name) {
      return profile.company_name.substring(0, 2).toUpperCase();
    }
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AN";
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              Välkommen,{" "}
              {userRoles.includes("company") && profile?.company_name
                ? profile.company_name
                : profile?.full_name || "Användare"}
            </h1>
            <div className="flex gap-2 items-center flex-wrap">
              {userRoles
                .filter(
                  (role) =>
                    !(role === "buyer" && userRoles.includes("company")),
                )
                .map((role) => (
                  <Badge key={role} variant="secondary">
                    {role === "buyer"
                      ? "Privatperson"
                      : role === "company"
                        ? "Företag"
                        : role === "seller"
                          ? "Säljare"
                          : role === "broker"
                            ? "Mäklare"
                            : role === "admin"
                              ? "Admin"
                              : role}
                  </Badge>
                ))}
              {subscriptionTier && (
                <Badge
                  variant={isPro ? "default" : "outline"}
                  className={
                    isPro ? "bg-gradient-to-r from-primary to-primary/60" : ""
                  }
                >
                  {subscriptionTier === "pro_plus" ? (
                    <>
                      <span className="mr-1">👑</span>
                      Pro+ konto
                    </>
                  ) : isPro ? (
                    <>
                      <span className="mr-1">👑</span>
                      Pro-konto
                    </>
                  ) : (
                    "Baskonto"
                  )}
                </Badge>
              )}
              {!isPro && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (window.location.href = "/upgrade")}
                  className="h-6 text-xs"
                >
                  Uppgradera
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="favorites">Favoriter</TabsTrigger>
          <TabsTrigger value="my-ads">Mina annonser</TabsTrigger>
          <TabsTrigger value="group">Grupp</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="tools">
            <Calculator className="h-4 w-4 mr-1" />
            Verktyg
          </TabsTrigger>
          <TabsTrigger value="ai-gallery">
            <Sparkles className="h-4 w-4 mr-1" />
            AI-bildgalleri
          </TabsTrigger>
          <TabsTrigger value="ai-tools">
            <Wand2 className="h-4 w-4 mr-1" />
            AI-verktyg
          </TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Översikt över dina sektioner
            </h2>
            <p className="text-muted-foreground">
              Välj en sektion nedan för att komma igång med att hantera dina
              annonser, favoriter och inställningar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Favoriter Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const favTab = document.querySelector(
                  '[value="favorites"]',
                ) as HTMLElement;
                favTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <Heart className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle>Favoriter</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Se och hantera alla dina sparade favoritbostäder på ett
                  ställe.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  {stats.favoriteCount} favoriter
                </div>
              </CardContent>
            </Card>

            {/* Mina Annonser Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const adsTab = document.querySelector(
                  '[value="my-ads"]',
                ) as HTMLElement;
                adsTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Home className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Mina Annonser</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {userRoles.includes("broker")
                    ? "Hantera försäljningsannonser och mäklaruppdrag via Mäklarportalen."
                    : "Skapa och hantera hyresannonser för uthyrning."}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Se annonser och statistik
                </div>
              </CardContent>
            </Card>

            {/* Grupp Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const groupTab = document.querySelector(
                  '[value="group"]',
                ) as HTMLElement;
                groupTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>Gruppkonton</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Samarbeta med familj och vänner för att hitta och rösta på
                  bostäder.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Gå till gruppkonton
                </div>
              </CardContent>
            </Card>

            {/* AI-bilder Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const aiTab = document.querySelector(
                  '[value="ai-gallery"]',
                ) as HTMLElement;
                aiTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-pink-500/10">
                    <Sparkles className="h-6 w-6 text-pink-500" />
                  </div>
                  <CardTitle>AI-bildgalleri</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Se och hantera dina AI-genererade bilder för
                  fastighetsannonser.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Öppna bildgalleri
                </div>
              </CardContent>
            </Card>

            {/* AI-verktyg Card */}
            <Card
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => {
                const aiToolsTab = document.querySelector(
                  '[value="ai-tools"]',
                ) as HTMLElement;
                aiToolsTab?.click();
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Wand2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>AI-verktyg</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Använd AI för att förbättra dina annonser och analysera
                  marknaden.
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Öppna AI-verktyg
                </div>
              </CardContent>
            </Card>

            {/* Profil Card */}

            {/* Meddelanden Card */}
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <MessageSquare className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>Meddelanden</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Se alla dina chatkonversationer och obesvarade meddelanden.
                </p>
                <ChatShortcut
                  onClick={() => (window.location.href = "/messages")}
                  variant="default"
                  className="mt-2"
                />
              </CardContent>
            </Card>

            {/* Inställningar Card */}
          </div>
        </TabsContent>

        <TabsContent value="my-ads" className="space-y-6">
          {/* Pending Approval Projects Section */}
          {pendingApprovalProjects.length > 0 && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold">
                  Nyproduktionsprojekt inväntar godkännande
                </h2>
                <Badge variant="outline" className="bg-yellow-500/10">
                  {pendingApprovalProjects.length} projekt
                  {pendingApprovalProjects.length !== 1 ? "" : ""}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Granska och godkänn Nyproduktionsprojekten nedan för att
                publicera dem.
              </p>
              {pendingApprovalProjects.map((project) => (
                <SellerProjectReview
                  key={project.id}
                  ad={project}
                  onApproved={loadUserAds}
                  onRejected={loadUserAds}
                />
              ))}
            </div>
          )}

          {/* Pending Approval Ads Section */}
          {pendingApprovalAds.length > 0 && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold">
                  Inväntar ditt godkännande
                </h2>
                <Badge variant="outline" className="bg-yellow-500/10">
                  {pendingApprovalAds.length} annons
                  {pendingApprovalAds.length !== 1 ? "er" : ""}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Granska och godkänn annonserna nedan för att publicera dem.
              </p>
              {pendingApprovalAds.map((ad) => (
                <SellerAdReview
                  key={ad.id}
                  ad={ad}
                  onApproved={loadUserAds}
                  onRejected={loadUserAds}
                />
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Mina annonser</h2>
                {!userRoles.includes("broker") && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Skapa hyresannonser för bostäder och lokaler eller följ din
                    egna bostadsförsäljning
                  </p>
                )}
              </div>
              <Button asChild>
                <a href="/skapa-hyresannons">
                  <Plus className="h-4 w-4 mr-2" />
                  Skapa hyresannons
                </a>
              </Button>
            </div>

            <div className="space-y-6">
              {adsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Laddar annonser...</p>
                </div>
              ) : (
                <>
                  {/* Rental Ads Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Uthyrning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {rentalAds.length === 0 ? (
                        <div className="text-center py-12">
                          <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            Inga hyresannonser ännu
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Skapa din första hyresannons för att börja hyra ut
                            din bostad.
                          </p>
                          <Button asChild>
                            <a href="/property-management">
                              <Plus className="h-4 w-4 mr-2" />
                              Skapa hyresannons
                            </a>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {rentalAds.slice(0, 1).map((ad) => {
                            const propertyForCard: Property = {
                              id: ad.property_id,
                              ad_id: ad.id,
                              // Pass ad ID for management navigation
                              title: ad.title,
                              description: ad.description,
                              property_type:
                                ad.properties?.property_type || "Lägenhet",
                              status: "FOR_RENT",
                              price: ad.properties?.price || 0,
                              address_street:
                                ad.properties?.address_street || "",
                              address_postal_code:
                                ad.properties?.address_postal_code || "",
                              address_city: ad.properties?.address_city || "",
                              living_area: ad.properties?.living_area,
                              rooms: ad.properties?.rooms,
                              bedrooms: ad.properties?.bedrooms,
                              bathrooms: ad.properties?.bathrooms,
                              images:
                                ad.properties?.images &&
                                ad.properties.images.length > 0
                                  ? ad.properties.images
                                  : [
                                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
                                    ],
                              created_at: ad.created_at,
                              user_id: user?.id,
                              ad_tier: ad.ad_tier as
                                | "free"
                                | "plus"
                                | "premium",
                              rental_info: ad.properties?.rental_info,
                            };
                            return (
                              <div key={ad.id} className="relative">
                                <PropertyCard
                                  property={propertyForCard}
                                  managementMode={true}
                                />

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 px-4">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Skapad:{" "}
                                    {new Date(ad.created_at).toLocaleDateString(
                                      "sv-SE",
                                    )}
                                  </span>
                                  {ad.expires_at && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Utgår:{" "}
                                      {new Date(
                                        ad.expires_at,
                                      ).toLocaleDateString("sv-SE")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Broker Sales Ads Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Försäljning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {brokerSalesAds.length === 0 ? (
                        <div className="text-center py-12">
                          <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            Inga försäljningsannonser ännu
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Här visas dina försäljningsannonser som hanteras av
                            mäklare.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {brokerSalesAds.slice(0, 1).map((ad) => {
                            const propertyForCard: Property = {
                              id: ad.property_id,
                              ad_id: ad.id,
                              // Pass ad ID for management navigation
                              title: ad.title,
                              description: ad.description,
                              property_type:
                                ad.properties?.property_type || "Villa",
                              status: "FOR_SALE",
                              price: ad.properties?.price || 0,
                              address_street:
                                ad.properties?.address_street || "",
                              address_postal_code:
                                ad.properties?.address_postal_code || "",
                              address_city: ad.properties?.address_city || "",
                              living_area: ad.properties?.living_area,
                              rooms: ad.properties?.rooms,
                              bedrooms: ad.properties?.bedrooms,
                              bathrooms: ad.properties?.bathrooms,
                              images:
                                ad.properties?.images &&
                                ad.properties.images.length > 0
                                  ? ad.properties.images
                                  : [
                                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
                                    ],
                              created_at: ad.created_at,
                              user_id: user?.id,
                              ad_tier: ad.ad_tier as
                                | "free"
                                | "plus"
                                | "premium",
                            };
                            return (
                              <div key={ad.id} className="relative">
                                <PropertyCard
                                  property={propertyForCard}
                                  managementMode={true}
                                />

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 px-4">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Publicerad:{" "}
                                    {new Date(ad.created_at).toLocaleDateString(
                                      "sv-SE",
                                    )}
                                  </span>
                                  {ad.expires_at && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Utgår:{" "}
                                      {new Date(
                                        ad.expires_at,
                                      ).toLocaleDateString("sv-SE")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mina favoriter</h2>
            <p className="text-muted-foreground">
              {stats.favoriteCount} favoriter
            </p>
          </div>

          {favoriteProperties.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Inga favoriter ännu
                </h3>
                <p className="text-muted-foreground mb-4">
                  Börja spara fastigheter som du gillar för att enkelt hitta dem
                  senare.
                </p>
                <Button asChild>
                  <a href="/search">Utforska fastigheter</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gruppkonton
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Skapa eller gå med i en grupp
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Samarbeta med familj och vänner för att hitta och rösta på
                bostäder. Fungerar för både köp, hyresrätter och kommersiella
                fastigheter.
              </p>
              <Button asChild size="lg">
                <a href="/familjekonton">
                  <Users className="h-4 w-4 mr-2" />
                  Gå till gruppkonton
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
                Verktyg & Tjänster
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Kraftfulla verktyg för att hjälpa dig i din fastighetsresa
              </p>
            </div>

            <Tabs defaultValue="comparison" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="comparison"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Jämför fastigheter
                </TabsTrigger>
                <TabsTrigger
                  value="calculator"
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Lånekalkylator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comparison">
                <PropertyComparison />
              </TabsContent>

              <TabsContent value="calculator">
                <MortgageCalculator />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="ai-gallery" className="space-y-6">
          <AIImageGallery />
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          <Tabs defaultValue="advisor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 gap-1">
              <TabsTrigger
                value="advisor"
                className="flex items-center gap-1 text-xs px-2"
              >
                <Bot className="h-3 w-3" />
                <span className="hidden sm:inline">AI-Rådgivare</span>
              </TabsTrigger>
              <TabsTrigger
                value="homestyling"
                className="flex items-center gap-1 text-xs px-2"
                disabled={!isPro}
              >
                {!isPro && <Lock className="h-3 w-3" />}
                <Home className="h-3 w-3" />
                <span className="hidden sm:inline">Homestyling</span>
                {!isPro && <span className="text-xs ml-1">(Pro)</span>}
              </TabsTrigger>
              <TabsTrigger
                value="valuation"
                className="flex items-center gap-1 text-xs px-2"
              >
                <Calculator className="h-3 w-3" />
                <span className="hidden sm:inline">Värdering</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-1 text-xs px-2"
                disabled={!isPro}
              >
                {!isPro && <Lock className="h-3 w-3" />}
                <History className="h-3 w-3" />
                <span className="hidden sm:inline">Historik</span>
                {!isPro && <span className="text-xs ml-1">(Pro)</span>}
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="flex items-center gap-1 text-xs px-2"
              >
                <BarChart3 className="h-3 w-3" />
                <span className="hidden sm:inline">Marknadsanalys</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advisor">
              <AIPropertyAdvisor />
            </TabsContent>

            <TabsContent value="homestyling">
              {isPro ? (
                <AIHomestyling />
              ) : (
                <UpgradePrompt feature="AI Homestyling" />
              )}
            </TabsContent>

            <TabsContent value="valuation">
              <AIPropertyValuation />
            </TabsContent>

            <TabsContent value="analysis">
              <AIMarketAnalysis />
            </TabsContent>

            <TabsContent value="history">
              {isPro ? (
                <AIAnalysisHistory />
              ) : (
                <UpgradePrompt feature="Analyshistorik" />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <ProfileEditor />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};
