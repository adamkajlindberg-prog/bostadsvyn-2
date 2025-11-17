import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Heart,
  Home,
  ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PropertyAnalytics from "@/components/analytics/PropertyAnalytics";
import Navigation from "@/components/Navigation";
import PropertyMarketing from "@/components/PropertyMarketing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: string;
  price: number;
  original_price?: number;
  show_price_change?: boolean;
  price_change_format?: string;
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
  video_url?: string;
  use_video_as_first_image?: boolean;
  floor_plan_url?: string;
  threed_tour_url?: string;
  created_at: string;
  updated_at: string;
  last_renewed_at?: string;
  user_id: string;
  ad_tier: string;
  viewing_times?: any;
}
interface PropertyOwner {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
}
interface PropertyInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiry_type: string;
  status: string;
  created_at: string;
  responded_at?: string;
}
interface PropertyStats {
  total_views: number;
  total_inquiries: number;
  favorite_count: number;
  broker_contact_clicks?: number;
}
interface AIToolsStats {
  total_ai_edits: number;
  unique_users_edited: number;
  edited_images: Array<{
    image_url: string;
    edit_count: number;
    last_edited: string;
  }>;
}
interface ViewStats {
  date: string;
  views: number;
}
const statusLabels = {
  FOR_SALE: "Till salu",
  FOR_RENT: "Till uthyrning",
  COMING_SOON: "Kommer snart",
  SOLD: "Såld",
  DRAFT: "Utkast",
};
const statusColors = {
  FOR_SALE: "bg-success",
  FOR_RENT: "bg-info",
  COMING_SOON: "bg-warning",
  SOLD: "bg-muted",
  DRAFT: "bg-secondary",
};
const tierLabels = {
  free: "Grund",
  plus: "Plus",
  premium: "Exklusiv",
};
const tierBadgeStyles = {
  free: "bg-muted text-muted-foreground border border-border",
  plus: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-white/30",
  premium:
    "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-2 border-white/30 shadow-lg",
};
const _inquiryTypeLabels = {
  general: "Allmän förfrågan",
  viewing: "Önskar visning",
  price_info: "Vill veta slutpris",
  mortgage: "Lånefrågor",
};
const BrokerPropertyDetails = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { user, userRoles, profile } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyOwner, setPropertyOwner] = useState<PropertyOwner | null>(
    null,
  );
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [watchers, _setWatchers] = useState<any[]>([
    {
      id: "example-1",
      name: "Anna Svensson",
      email: "anna.svensson@email.se",
      phone: "070-123 45 67",
      created_at: new Date().toISOString(),
      status: "active",
      notify_via_email: true,
      notify_via_sms: true,
      reason_for_interest:
        "Jag är intresserad av att köpa en liknande lägenhet i samma område och vill veta vad denna slutar på för att få en bättre förståelse för marknadspriset.",
      message:
        "Hej! Jag och min familj letar aktivt efter lägenhet i området. Skulle vara mycket tacksam för att få veta slutpriset.",
      planning_to_sell: true,
      estimated_sale_timeframe: "within_3_months",
      current_living_situation: "Hyresrätt",
    },
  ]);
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [aiStats, setAiStats] = useState<AIToolsStats | null>(null);
  const [viewsHistory, setViewsHistory] = useState<ViewStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [statsPeriod, setStatsPeriod] = useState<"current" | "total">(
    "current",
  ); // Nuvarande eller Totalt
  const [currentWeek, setCurrentWeek] = useState(0); // For navigating weeks
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [editedVideoUrl, setEditedVideoUrl] = useState("");
  const [useVideoAsFirstImage, setUseVideoAsFirstImage] = useState(false);
  const [isEditing3D, setIsEditing3D] = useState(false);
  const [edited3DUrl, setEdited3DUrl] = useState("");

  // Bypass mode for development/preview
  const params = new URLSearchParams(window.location.search);
  const bypass =
    params.get("preview") === "1" ||
    params.get("bypass") === "1" ||
    params.get("bypass") === "true";
  const isBroker =
    bypass || userRoles.includes("broker") || userRoles.includes("admin");

  // Check if current user is the property owner (not broker)
  const isPropertyOwner =
    user && property && user.id === property.user_id && !isBroker;
  useEffect(() => {
    if (id) {
      loadPropertyData();
    }
  }, [id, loadPropertyData]);

  // Helper function to get test properties
  const getTestProperty = (propertyId: string): Property | null => {
    // Import test property broker logos
    const testProperties: any[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        title: "Exklusiv villa med havsutsikt",
        price: 18500000,
        address_street: "Strandvägen 42",
        address_postal_code: "182 68",
        address_city: "Djursholm",
        property_type: "Villa",
        status: "FOR_SALE",
        rooms: 8,
        living_area: 285,
        bedrooms: 5,
        bathrooms: 3,
        monthly_fee: 8500,
        year_built: 2018,
        energy_class: "A",
        latitude: 59.4015,
        longitude: 18.0512,
        features: ["Balkong", "Garage", "Pool", "Bastu", "Havsutsikt"],
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=675&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop",
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "test",
        description:
          "Magnifik villa i absolut toppskick med panoramautsikt över havet.",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        title: "Arkitektritad sekelskiftesvåning",
        price: 24900000,
        address_street: "Östermalmsvägen 12",
        address_postal_code: "114 33",
        address_city: "Stockholm",
        property_type: "Lägenhet",
        status: "FOR_SALE",
        rooms: 7,
        living_area: 198,
        bedrooms: 4,
        bathrooms: 2,
        monthly_fee: 12400,
        year_built: 1905,
        energy_class: "B",
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=675&fit=crop",
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "test",
        description:
          "Extraordinär sekelskiftesvåning med ursprungliga detaljer.",
        features: ["Balkong", "Hiss", "Stuckatur", "Kakelugn"],
      },
    ];
    const found = testProperties.find((p) => p.id === propertyId);
    return found || null;
  };
  const loadPropertyData = async () => {
    try {
      // Load property
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      // If no property in database, check for test properties
      if (!propertyData) {
        const testProperty = getTestProperty(id!);
        if (testProperty) {
          setProperty(testProperty);
          setLoading(false);
          return;
        }
        throw new Error("Property not found");
      }
      if (propertyError) throw propertyError;

      // Check if user has access (owns property or is broker/admin) - but allow bypass
      if (!bypass && user && propertyData.user_id !== user?.id && !isBroker) {
        toast({
          title: "Åtkomst nekad",
          description: "Du har inte behörighet att se denna sida",
          variant: "destructive",
        });
        navigate("/property-management");
        return;
      }
      setProperty(propertyData);

      // Load property owner info (skip if in bypass mode without user)
      if (propertyData.user_id) {
        const { data: ownerData } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone")
          .eq("user_id", propertyData.user_id)
          .maybeSingle();
        if (ownerData) {
          setPropertyOwner(ownerData);
        }
      }

      // Load inquiries
      const { data: inquiriesData } = await supabase
        .from("property_inquiries")
        .select("*")
        .eq("property_id", id)
        .order("created_at", {
          ascending: false,
        });
      setInquiries(inquiriesData || []);

      // Load final price watchers (leads)
      // Commented out to show example data
      // const {
      //   data: watchersData
      // } = await supabase.from('property_final_price_watchers').select('*').eq('property_id', id).order('created_at', {
      //   ascending: false
      // });
      // setWatchers(watchersData || []);

      // Load statistics
      const [
        viewsResult,
        favoritesResult,
        brokerContactsResult,
        viewsHistoryResult,
      ] = await Promise.all([
        supabase
          .from("property_views")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("property_id", id),
        supabase
          .from("property_favorites")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("property_id", id),
        // Count broker contact clicks (from property_inquiries with type 'broker_contact')
        supabase
          .from("property_inquiries")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("property_id", id)
          .eq("inquiry_type", "broker_contact"),
        // Get views history for chart
        supabase
          .from("property_views")
          .select("viewed_at")
          .eq("property_id", id)
          .order("viewed_at", {
            ascending: true,
          }),
      ]);
      setStats({
        total_views: viewsResult.count || 0,
        total_inquiries: inquiriesData?.length || 0,
        favorite_count: favoritesResult.count || 0,
        broker_contact_clicks: brokerContactsResult.count || 0,
      });

      // Process views history for weekly chart
      if (viewsHistoryResult.data) {
        const viewsByDate = new Map<string, number>();
        viewsHistoryResult.data.forEach((view) => {
          const date = new Date(view.viewed_at).toLocaleDateString("sv-SE");
          viewsByDate.set(date, (viewsByDate.get(date) || 0) + 1);
        });

        // Get last 7 days
        const last7Days = Array.from(
          {
            length: 7,
          },
          (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString("sv-SE");
          },
        );
        const chartData = last7Days.map((date) => ({
          date,
          views: viewsByDate.get(date) || 0,
        }));
        setViewsHistory(chartData);
      }

      // Load AI tools stats if premium tier
      if (propertyData.ad_tier === "premium") {
        const { data: aiEditsData } = await supabase
          .from("user_ai_edits")
          .select("*")
          .eq("property_id", id)
          .order("created_at", {
            ascending: false,
          });
        if (aiEditsData && aiEditsData.length > 0) {
          // Group edits by image
          const imageEditMap = new Map<
            string,
            {
              count: number;
              lastEdited: string;
            }
          >();
          const uniqueUsers = new Set<string>();
          aiEditsData.forEach((edit) => {
            uniqueUsers.add(edit.user_id);
            const existing = imageEditMap.get(edit.original_image_url);
            if (existing) {
              existing.count++;
              if (new Date(edit.created_at) > new Date(existing.lastEdited)) {
                existing.lastEdited = edit.created_at;
              }
            } else {
              imageEditMap.set(edit.original_image_url, {
                count: 1,
                lastEdited: edit.created_at,
              });
            }
          });
          const editedImages = Array.from(imageEditMap.entries()).map(
            ([url, data]) => ({
              image_url: url,
              edit_count: data.count,
              last_edited: data.lastEdited,
            }),
          );
          setAiStats({
            total_ai_edits: aiEditsData.length,
            unique_users_edited: uniqueUsers.size,
            edited_images: editedImages,
          });
        }
      }
    } catch (error: any) {
      console.error("Error loading property data:", error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda fastighetsdata",
        variant: "destructive",
      });
      navigate("/property-management");
    } finally {
      setLoading(false);
    }
  };
  const _updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("property_inquiries")
        .update({
          status,
          responded_at:
            status === "responded" ? new Date().toISOString() : null,
        })
        .eq("id", inquiryId);
      if (error) throw error;
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === inquiryId
            ? {
                ...inq,
                status,
                responded_at:
                  status === "responded"
                    ? new Date().toISOString()
                    : inq.responded_at,
              }
            : inq,
        ),
      );
      toast({
        title: "Status uppdaterad",
        description: "Förfrågans status har uppdaterats",
      });
    } catch (_error) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera status",
        variant: "destructive",
      });
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Laddar objektinformation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Fastighet hittades inte
              </h3>
              <Button onClick={() => navigate("/property-management")}>
                Tillbaka till annonshantering
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  const _priceInfoInquiries = inquiries.filter(
    (inq) => inq.inquiry_type === "price_info",
  );

  // Calculate today's and yesterday's views
  const todayViews = viewsHistory[viewsHistory.length - 1]?.views || 0;
  const yesterdayViews = viewsHistory[viewsHistory.length - 2]?.views || 0;
  const _viewsChange = todayViews - yesterdayViews;

  // Calculate last week's views (last 7 days)
  const lastWeekViews = viewsHistory
    .slice(-7)
    .reduce((sum, day) => sum + (day?.views || 0), 0);

  // Render enhanced statistics view for property owners (non-brokers)
  if (isPropertyOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() =>
                navigate(isBroker ? "/property-management" : "/dashboard")
              }
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isBroker
                ? "Tillbaka till annonshantering"
                : "Tillbaka till mina annonser"}
            </Button>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {property.address_street}, {property.address_city}
                  </div>
                  <Badge
                    className={
                      statusColors[property.status as keyof typeof statusColors]
                    }
                  >
                    {statusLabels[property.status as keyof typeof statusLabels]}
                  </Badge>
                  <Badge
                    className={
                      tierBadgeStyles[
                        property.ad_tier as keyof typeof tierBadgeStyles
                      ]
                    }
                  >
                    {property.ad_tier === "premium" && (
                      <Crown className="h-3 w-3 mr-1" />
                    )}
                    {property.ad_tier === "plus" && (
                      <Star className="h-3 w-3 mr-1" />
                    )}
                    {tierLabels[property.ad_tier as keyof typeof tierLabels] ||
                      property.ad_tier}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(`/annons/${property.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Visa annons
              </Button>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant={statsPeriod === "current" ? "default" : "outline"}
                onClick={() => setStatsPeriod("current")}
                className="rounded-full"
              >
                Sen senaste förnyelsen
              </Button>
              <Button
                variant={statsPeriod === "total" ? "default" : "outline"}
                onClick={() => setStatsPeriod("total")}
                className="rounded-full"
              >
                Totalt sen publicering
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Notera att antalet som sparat och bevakar slutpris på din annons
              inte återställs mellan annonsperioder.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Besök */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Besök</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats boxes */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Total
                      </p>
                      <p className="text-4xl font-bold mb-1">
                        {stats?.total_views || 0}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Senaste veckan
                      </p>
                      <p className="text-4xl font-bold mb-1">{lastWeekViews}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Idag</p>
                      <p className="text-4xl font-bold mb-1">{todayViews}</p>
                    </div>
                  </div>

                  {/* Weekly Chart */}
                  {viewsHistory.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setCurrentWeek(Math.max(0, currentWeek - 1))
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <p className="font-medium">Besök senaste 7 dagarna</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCurrentWeek(currentWeek + 1)}
                          disabled={currentWeek >= 0}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={viewsHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            tick={{
                              fontSize: 12,
                            }}
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            tick={{
                              fontSize: 12,
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="views"
                            name="Från Till salu-annonsen"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>

                      <p className="text-sm text-muted-foreground mt-4">
                        Grafen uppdateras så fort du uppdaterar sidan.
                      </p>
                    </div>
                  )}

                  {/* Comparison with Hemnet placeholder */}
                </CardContent>
              </Card>

              {/* AI Tools Stats - Only for Premium */}
              {property.ad_tier === "premium" && (
                <Card className="overflow-hidden border-premium/20 shadow-xl">
                  <div className="relative bg-gradient-to-br from-premium/10 via-accent/5 to-primary/10 p-6 border-b border-premium/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-premium/5 rounded-full blur-3xl -z-10" />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-premium/10 rounded-lg border border-premium/20">
                            <Zap className="h-6 w-6 text-premium" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">
                              AI-Bildredigerare Statistik
                            </CardTitle>
                            <CardDescription className="mt-1">
                              För Exklusivpaketet
                            </CardDescription>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                          Se hur dina bilder engagerar spekulanter med
                          AI-verktyg och vilka rum som väcker mest intresse!
                        </p>
                      </div>
                      <Badge className={tierBadgeStyles.premium}>
                        <Crown className="h-3 w-3 mr-1" />
                        Exklusiv
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-8">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-premium/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-premium/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-premium/10 rounded-lg">
                              <ImageIcon className="h-6 w-6 text-premium" />
                            </div>
                            <TrendingUp className="h-4 w-4 text-success" />
                          </div>
                          <p className="text-5xl font-bold mb-2 bg-gradient-to-br from-premium to-primary bg-clip-text text-transparent">
                            {aiStats?.total_ai_edits || 0}
                          </p>
                          <p className="text-sm font-semibold mb-1">
                            Totala AI-redigeringar
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Antal gånger besökare använt bildredigeraren
                          </p>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-premium/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-accent/10 rounded-lg">
                              <Users className="h-6 w-6 text-accent" />
                            </div>
                            <Activity className="h-4 w-4 text-accent" />
                          </div>
                          <p className="text-5xl font-bold mb-2 bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
                            {aiStats?.unique_users_edited || 0}
                          </p>
                          <p className="text-sm font-semibold mb-1">
                            Unika användare
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Olika personer som redigerat bilder
                          </p>
                        </div>
                      </div>

                      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-premium/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <Activity className="h-6 w-6 text-primary" />
                            </div>
                            <Star className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-5xl font-bold mb-2 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                            {aiStats?.edited_images.length || 0}
                          </p>
                          <p className="text-sm font-semibold mb-1">
                            Redigerade bilder
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Av {property.images?.length || 0} totala bilder i
                            annonsen
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Engagement metrics */}
                    <div className="relative overflow-hidden rounded-xl border border-premium/20 bg-gradient-to-br from-premium/5 via-background to-accent/5 p-6 shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-premium/10 rounded-full blur-2xl" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-premium/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-premium" />
                          </div>
                          <h4 className="text-lg font-bold">Engagemangsmått</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground font-medium">
                              Redigeringsgrad
                            </p>
                            <div className="flex items-end gap-2">
                              <p className="text-4xl font-bold bg-gradient-to-br from-premium to-accent bg-clip-text text-transparent">
                                {property.images?.length
                                  ? Math.round(
                                      ((aiStats?.edited_images.length || 0) /
                                        property.images.length) *
                                        100,
                                    )
                                  : 0}
                                %
                              </p>
                              <div className="mb-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs border-premium/30 text-premium"
                                >
                                  {aiStats?.edited_images.length || 0}/
                                  {property.images?.length || 0}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              av dina bilder har redigerats
                            </p>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                              <div
                                className="bg-gradient-to-r from-premium to-accent h-2 rounded-full transition-all"
                                style={{
                                  width: `${property.images?.length ? Math.round(((aiStats?.edited_images.length || 0) / property.images.length) * 100) : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground font-medium">
                              Genomsnitt per bild
                            </p>
                            <div className="flex items-end gap-2">
                              <p className="text-4xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
                                {aiStats?.edited_images.length
                                  ? (
                                      aiStats.total_ai_edits /
                                      aiStats.edited_images.length
                                    ).toFixed(1)
                                  : "0"}
                              </p>
                              <span className="text-sm text-muted-foreground mb-2">
                                redigeringar
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              per redigerad bild i genomsnitt
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed image statistics */}
                    {aiStats && aiStats.edited_images.length > 0 ? (
                      <div className="space-y-6">
                        <Separator />
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h4 className="text-xl font-bold flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-premium" />
                                Alla redigerade bilder
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {aiStats.edited_images.length} bilder har
                                redigerats av köpare
                              </p>
                            </div>
                            <Badge className="bg-premium/10 text-premium border-premium/30">
                              Sorterat efter popularitet
                            </Badge>
                          </div>
                          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {aiStats.edited_images.map((img, idx) => (
                              <div
                                key={idx}
                                className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-premium/30 hover:shadow-lg transition-all duration-300"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-premium/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-start gap-6 p-5">
                                  {/* Image with ranking badge */}
                                  <div className="relative shrink-0">
                                    <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
                                      <img
                                        src={img.image_url}
                                        alt={`Bild ${idx + 1}`}
                                        className="w-40 h-40 object-cover transition-transform group-hover:scale-105 duration-300"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                    <div className="absolute -top-3 -left-3">
                                      <div className="relative">
                                        <div className="absolute inset-0 bg-premium blur-md" />
                                        <Badge className="relative bg-gradient-to-br from-premium to-accent text-white border-0 shadow-lg font-bold text-base px-3 py-1">
                                          #{idx + 1}
                                        </Badge>
                                      </div>
                                    </div>
                                    {img.edit_count >= 10 && (
                                      <div className="absolute -bottom-2 -right-2">
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                                          <Star className="h-3 w-3 mr-1 fill-white" />
                                          Toppbild
                                        </Badge>
                                      </div>
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0 space-y-4">
                                    {/* Stats row */}
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="flex items-baseline gap-3 mb-2">
                                          <p className="text-5xl font-bold bg-gradient-to-br from-premium via-accent to-primary bg-clip-text text-transparent">
                                            {img.edit_count}
                                          </p>
                                          <div className="space-y-0.5">
                                            <p className="text-sm font-semibold text-foreground">
                                              redigeringar
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              totalt för denna bild
                                            </p>
                                          </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex items-center gap-2">
                                          {img.edit_count >= 10 && (
                                            <Badge className="bg-premium/10 text-premium border-premium/20">
                                              Extremt populär
                                            </Badge>
                                          )}
                                          {img.edit_count >= 5 &&
                                            img.edit_count < 10 && (
                                              <Badge className="bg-accent/10 text-accent border-accent/20">
                                                Mycket populär
                                              </Badge>
                                            )}
                                          {img.edit_count < 5 && (
                                            <Badge
                                              variant="outline"
                                              className="text-muted-foreground"
                                            >
                                              Populär
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Last edited */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                                      <Calendar className="h-4 w-4 text-primary" />
                                      <span className="font-medium">
                                        Senast redigerad:
                                      </span>
                                      <span>
                                        {new Date(
                                          img.last_edited,
                                        ).toLocaleDateString("sv-SE", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>

                                    {/* Insight */}
                                    <div
                                      className={`flex items-start gap-3 p-3 rounded-lg border ${img.edit_count >= 10 ? "bg-premium/5 border-premium/20" : img.edit_count >= 5 ? "bg-accent/5 border-accent/20" : "bg-muted/30 border-border"}`}
                                    >
                                      <div className="shrink-0 mt-0.5">
                                        {img.edit_count >= 10 ? (
                                          <div className="p-1.5 bg-premium/10 rounded-full">
                                            <Zap className="h-4 w-4 text-premium" />
                                          </div>
                                        ) : img.edit_count >= 5 ? (
                                          <div className="p-1.5 bg-accent/10 rounded-full">
                                            <TrendingUp className="h-4 w-4 text-accent" />
                                          </div>
                                        ) : (
                                          <div className="p-1.5 bg-primary/10 rounded-full">
                                            <Eye className="h-4 w-4 text-primary" />
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-xs leading-relaxed">
                                        {img.edit_count >= 10
                                          ? "🔥 Extremt högt intresse! Köpare visualiserar aktivt sitt framtida hem här. Detta är en mycket stark köpsignal."
                                          : img.edit_count >= 5
                                            ? "✨ Starkt intresse - denna bild engagerar köpare och får dem att utforska möjligheterna."
                                            : "👀 Köpare undersöker möjligheterna med denna bild och hur rummet kan användas."}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Insights - Enhanced design */}
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            <Zap className="h-5 w-5 text-premium" />
                            AI-Insikter
                          </h4>

                          <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-premium/10 via-accent/5 to-transparent border border-premium/20 shadow-sm">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-premium/10 rounded-full blur-2xl" />
                            <div className="relative flex items-start gap-4">
                              <div className="p-3 bg-premium/10 rounded-xl shrink-0">
                                <Zap className="h-6 w-6 text-premium" />
                              </div>
                              <div>
                                <p className="font-bold text-premium mb-2 text-lg">
                                  Köpsignaler från AI-redigeringar
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  Bilder som redigeras många gånger visar att
                                  köpare aktivt försöker visualisera hur de
                                  skulle inreda eller förändra utrymmet. Detta
                                  är en av de starkaste indikatorerna på
                                  köpintresse! Köpare som använder AI-verktyg är
                                  ofta mer seriösa och längre fram i
                                  köpprocessen.
                                </p>
                              </div>
                            </div>
                          </div>

                          {aiStats.total_ai_edits > 20 && (
                            <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-success/10 via-accent/5 to-transparent border border-success/20 shadow-sm">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-2xl" />
                              <div className="relative flex items-start gap-4">
                                <div className="p-3 bg-success/10 rounded-xl shrink-0">
                                  <TrendingUp className="h-6 w-6 text-success" />
                                </div>
                                <div>
                                  <p className="font-bold text-success mb-2 text-lg">
                                    Exceptionellt högt engagemang!
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    Med över {aiStats.total_ai_edits}{" "}
                                    AI-redigeringar ligger din fastighet i
                                    absolut toppskiktet för köparintresse. Detta
                                    indikerar att flera seriösa köpare aktivt
                                    överväger din bostad och utforskar olika
                                    möjligheter.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {aiStats.edited_images.length ===
                            property.images?.length && (
                            <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent border border-accent/20 shadow-sm">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
                              <div className="relative flex items-start gap-4">
                                <div className="p-3 bg-accent/10 rounded-xl shrink-0">
                                  <Star className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                  <p className="font-bold text-accent mb-2 text-lg">
                                    Fullständig täckning uppnådd
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    Alla dina bilder har redigerats! Detta visar
                                    att köpare är genuint intresserade av hela
                                    fastigheten, inte bara enskilda rum. Ett
                                    mycket positivt tecken på brett intresse.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="inline-flex p-6 bg-muted/30 rounded-full mb-4">
                          <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-semibold mb-2">
                          Inga AI-redigeringar ännu
                        </p>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          När köpare börjar använda bildredigeraren kommer
                          detaljerad statistik att visas här. AI-redigeringar är
                          en stark indikator på köpintresse.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Additional seller tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Tips för att öka intresset
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          1
                        </span>
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          Uppdatera regelbundet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Annonser som uppdateras får i genomsnitt 40% fler
                          visningar. Lägg till nya bilder eller justera
                          beskrivningen.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          2
                        </span>
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          Boka fler visningstider
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Fastigheter med fler visningstider får 3x fler
                          förfrågningar. Överväg att lägga till extra
                          visningstider.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          3
                        </span>
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          Svara snabbt på förfrågningar
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Säljare som svarar inom 24 timmar har 65% högre chans
                          att sälja snabbare.
                        </p>
                      </div>
                    </div>

                    {property.ad_tier !== "premium" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-premium/10 border border-premium/20">
                        <Crown className="h-5 w-5 text-premium shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium mb-1 text-premium">
                            Uppgradera till Exklusiv
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Få tillgång till AI-verktyg, detaljerad statistik
                            och 3x högre synlighet.
                          </p>
                          <Button size="sm" className="mt-2" variant="default">
                            Se fördelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Intresse */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Intresse för din annons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Favorites */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                    <Heart className="h-6 w-6 text-success shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-3xl font-bold mb-1">
                        {stats?.favorite_count || 0}
                      </p>
                      <p className="text-sm">
                        Antal personer som har sparat annonsen
                      </p>
                    </div>
                  </div>

                  {/* Final price watchers */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <Bell className="h-6 w-6 text-warning shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-3xl font-bold mb-1">
                        {watchers.length}
                      </p>
                      <p className="text-sm">Bevakar slutpriset</p>
                    </div>
                  </div>

                  {/* Viewing interest */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-info/10 border border-info/20">
                    <Calendar className="h-6 w-6 text-info shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-3xl font-bold mb-1">
                        {
                          inquiries.filter((i) => i.inquiry_type === "viewing")
                            .length
                        }
                      </p>
                      <p className="text-sm">
                        Har sparat kontaktat mäklaren för visning
                      </p>
                      <p className="text-xs text-muted-foreground mt-2"></p>
                    </div>
                  </div>

                  {/* Broker page visits */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <Users className="h-6 w-6 text-accent shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-3xl font-bold mb-1">
                        {stats?.broker_contact_clicks || 0}
                      </p>
                      <p className="text-sm">
                        Har besökt fastighetsmäklarens hemsida
                      </p>
                      <p className="text-xs text-muted-foreground mt-2"></p>
                    </div>
                  </div>

                  {/* Image browsing in search */}

                  {/* Broker contact clicks */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <Phone className="h-6 w-6 text-secondary-foreground shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-3xl font-bold mb-1">
                        {stats?.broker_contact_clicks || 0}
                      </p>
                      <p className="text-sm">
                        Har klickat på fastighetsmäklaren separata
                        kontaktuppgifter, nummer/mejl
                      </p>
                      <p className="text-xs text-muted-foreground mt-2"></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render full broker view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/property-management")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka till annonshantering
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.address_street}, {property.address_city}
                </div>
                <Badge
                  className={
                    statusColors[property.status as keyof typeof statusColors]
                  }
                >
                  {statusLabels[property.status as keyof typeof statusLabels]}
                </Badge>
                <Badge
                  className={
                    tierBadgeStyles[
                      property.ad_tier as keyof typeof tierBadgeStyles
                    ]
                  }
                >
                  {property.ad_tier === "premium" && (
                    <Crown className="h-3 w-3 mr-1" />
                  )}
                  {property.ad_tier === "plus" && (
                    <Star className="h-3 w-3 mr-1" />
                  )}
                  {tierLabels[property.ad_tier as keyof typeof tierLabels] ||
                    property.ad_tier}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/annons/${property.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Gå till annons
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Visningar
                    </p>
                    <p className="text-2xl font-bold">{stats.total_views}</p>
                  </div>
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Förfrågningar
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.total_inquiries}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Sparad som favorit
                    </p>
                    <p className="text-2xl font-bold">{stats.favorite_count}</p>
                  </div>
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pris
                    </p>
                    <p className="text-xl font-bold">
                      {property.price.toLocaleString("sv-SE")} kr
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">
              <Home className="h-4 w-4 mr-2" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="seller">
              <Users className="h-4 w-4 mr-2" />
              Säljare
            </TabsTrigger>
            <TabsTrigger value="ad">
              <FileText className="h-4 w-4 mr-2" />
              Annons
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistik
            </TabsTrigger>
            <TabsTrigger value="marketing" disabled className="relative">
              <Badge
                variant="secondary"
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0 pointer-events-none whitespace-nowrap"
              >
                Kommer snart
              </Badge>
              <TrendingUp className="h-4 w-4 mr-2" />
              Marknadsföring
            </TabsTrigger>
            <TabsTrigger value="packages">
              <Package className="h-4 w-4 mr-2" />
              Paket
            </TabsTrigger>
            <TabsTrigger value="renewal">
              <Activity className="h-4 w-4 mr-2" />
              Förnya annons
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Bell className="h-4 w-4 mr-2" />
              Leads ({watchers.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Säljare
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propertyOwner ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {propertyOwner.full_name && (
                      <div>
                        <p className="text-sm text-muted-foreground">Namn</p>
                        <p className="font-medium">{propertyOwner.full_name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">E-post</p>
                      <p className="font-medium">{propertyOwner.email}</p>
                    </div>
                    {propertyOwner.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telefon</p>
                        <p className="font-medium">{propertyOwner.phone}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Säljarinformation kunde inte laddas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Current Package */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Annonspaket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {property.ad_tier === "free" && (
                        <Star className="h-4 w-4 text-muted-foreground" />
                      )}
                      {property.ad_tier === "plus" && (
                        <Star className="h-4 w-4 text-accent" />
                      )}
                      {property.ad_tier === "premium" && (
                        <Crown className="h-4 w-4 text-premium" />
                      )}
                      <span className="font-semibold">
                        {property.ad_tier === "free" && "Grundpaket"}
                        {property.ad_tier === "plus" && "Pluspaket"}
                        {property.ad_tier === "premium" && "Exklusivpaket"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {property.ad_tier === "free" && "Kostnadsfri grundannons"}
                      {property.ad_tier === "plus" &&
                        "Större annons med ökad synlighet - 1 995 kr"}
                      {property.ad_tier === "premium" &&
                        "Störst synlighet och AI-verktyg - 3 995 kr"}
                    </p>
                  </div>
                  <Badge
                    className={
                      tierBadgeStyles[
                        property.ad_tier as keyof typeof tierBadgeStyles
                      ]
                    }
                  >
                    {property.ad_tier === "premium" && (
                      <Crown className="h-3 w-3 mr-1" />
                    )}
                    {property.ad_tier === "plus" && (
                      <Star className="h-3 w-3 mr-1" />
                    )}
                    {tierLabels[property.ad_tier as keyof typeof tierLabels]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Object Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Objektstatistik
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Visningar
                      </p>
                      <p className="text-2xl font-bold">{stats.total_views}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Förfrågningar
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.total_inquiries}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Sparad som favorit
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.favorite_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Leads
                      </p>
                      <p className="text-2xl font-bold">{watchers.length}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leads Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Leads ({watchers.length})
                </CardTitle>
                <CardDescription>
                  Personer som vill få slutpriset
                </CardDescription>
              </CardHeader>
              <CardContent>
                {watchers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Inga leads ännu
                  </p>
                ) : (
                  <div className="space-y-3">
                    {watchers.map((watcher) => (
                      <div
                        key={watcher.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{watcher.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {watcher.email}
                            </span>
                            {watcher.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {watcher.phone}
                              </span>
                            )}
                          </div>
                          {watcher.planning_to_sell &&
                            watcher.estimated_sale_timeframe ===
                              "within_3_months" && (
                              <Badge variant="secondary" className="mt-2">
                                🔥 Vill sälja inom 3 månader
                              </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const subject = encodeURIComponent(
                                `Slutprisbevakning - ${property?.address_street || "Fastighet"}`,
                              );
                              window.location.href = `mailto:${watcher.email}?subject=${subject}`;
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          {watcher.phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                (window.location.href = `tel:${watcher.phone}`)
                              }
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scheduled Viewings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Planerade visningar
                </CardTitle>
                <CardDescription>
                  Visningstider publicerade via affärssystemet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {property.viewing_times &&
                Array.isArray(property.viewing_times) &&
                property.viewing_times.length > 0 ? (
                  <div className="space-y-3">
                    {property.viewing_times.map(
                      (viewing: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                        >
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">
                              {new Date(
                                viewing.date || viewing.datetime,
                              ).toLocaleDateString("sv-SE", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(
                                viewing.date || viewing.datetime,
                              ).toLocaleTimeString("sv-SE", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {viewing.description &&
                                ` - ${viewing.description}`}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Inga planerade visningar just nu
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Viewing Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Visningsförfrågningar
                </CardTitle>
                <CardDescription>
                  Kommer snart - visningsförfrågningar visas här
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ingen data tillgänglig ännu
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seller Tab */}
          <TabsContent value="seller">
            <Card>
              <CardHeader>
                <CardTitle>Säljarinformation</CardTitle>
                <CardDescription>
                  Kontaktinformation för objektets ägare
                </CardDescription>
              </CardHeader>
              <CardContent>
                {propertyOwner ? (
                  <div className="space-y-4">
                    {propertyOwner.full_name && (
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Namn</p>
                          <p className="font-medium">
                            {propertyOwner.full_name}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">E-post</p>
                        <p className="font-medium">{propertyOwner.email}</p>
                      </div>
                    </div>
                    {propertyOwner.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Telefon
                          </p>
                          <p className="font-medium">{propertyOwner.phone}</p>
                        </div>
                      </div>
                    )}
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `mailto:${propertyOwner.email}`)
                        }
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Skicka e-post
                      </Button>
                      {propertyOwner.phone && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `tel:${propertyOwner.phone}`)
                          }
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Ring
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Säljarinformation kunde inte laddas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ad Tab */}
          <TabsContent value="ad">
            <Card>
              <CardHeader>
                <CardTitle>Annonsinformation</CardTitle>
                <CardDescription>
                  Detaljer och innehåll för denna annons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Annonstitel</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Redigera titel
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Redigera annonstitel</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <label
                                htmlFor="title"
                                className="text-sm font-medium"
                              >
                                Titel
                              </label>
                              <Input
                                id="title"
                                defaultValue={property.title}
                                maxLength={20}
                                onChange={(e) => {
                                  const input = e.target;
                                  const remaining = 20 - input.value.length;
                                  const counter =
                                    input.parentElement?.querySelector(
                                      ".character-counter",
                                    );
                                  if (counter) {
                                    counter.textContent = `${remaining} tecken kvar`;
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground mt-1 character-counter">
                                {20 - property.title.length} tecken kvar
                              </p>
                            </div>
                            <Button
                              onClick={async () => {
                                const input = document.getElementById(
                                  "title",
                                ) as HTMLInputElement;
                                const newTitle = input.value.trim();
                                if (!newTitle) {
                                  toast({
                                    title: "Titeln kan inte vara tom",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                const { error } = await supabase
                                  .from("properties")
                                  .update({
                                    title: newTitle,
                                  })
                                  .eq("id", property.id);
                                if (error) {
                                  toast({
                                    title: "Kunde inte uppdatera titel",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                toast({
                                  title: "Titel uppdaterad",
                                });
                                window.location.reload();
                              }}
                            >
                              Spara ändringar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-lg">{property.title}</p>
                  </div>

                  <Separator />

                  <Separator />

                  {/* Price Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Prisinformation</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">
                          Utgångspris
                        </p>
                        <p className="text-2xl font-bold">
                          {(
                            property.original_price || property.price
                          ).toLocaleString("sv-SE")}{" "}
                          kr
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">
                          Aktuellt pris
                        </p>
                        <p className="text-2xl font-bold">
                          {property.price.toLocaleString("sv-SE")} kr
                        </p>
                      </div>
                    </div>

                    {property.original_price &&
                      property.original_price !== property.price && (
                        <div className="border rounded-lg p-4 bg-accent/5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold mb-1">
                                Prisjustering
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Priset har ändrats från{" "}
                                {property.original_price.toLocaleString(
                                  "sv-SE",
                                )}{" "}
                                kr
                              </p>
                              <div className="mt-2 flex items-center gap-4">
                                <span className="text-sm">
                                  <span className="font-medium">
                                    Förändring:
                                  </span>{" "}
                                  {property.price > property.original_price
                                    ? "+"
                                    : ""}
                                  {(
                                    property.price - property.original_price
                                  ).toLocaleString("sv-SE")}{" "}
                                  kr (
                                  {(
                                    ((property.price -
                                      property.original_price) /
                                      property.original_price) *
                                    100
                                  ).toFixed(1)}
                                  %)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="show-price-change"
                                checked={property.show_price_change !== false}
                                onChange={async (e) => {
                                  await supabase
                                    .from("properties")
                                    .update({
                                      show_price_change: e.target.checked,
                                    })
                                    .eq("id", property.id);
                                  window.location.reload();
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <label
                                htmlFor="show-price-change"
                                className="text-sm font-medium"
                              >
                                Visa prisjustering i annonsen
                              </label>
                            </div>

                            {property.show_price_change !== false && (
                              <div className="ml-6 space-y-2">
                                <p className="text-sm text-muted-foreground mb-2">
                                  Visa justering som:
                                </p>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    id="format-amount"
                                    name="price-format"
                                    value="amount"
                                    checked={
                                      property.price_change_format !==
                                      "percentage"
                                    }
                                    onChange={async () => {
                                      await supabase
                                        .from("properties")
                                        .update({
                                          price_change_format: "amount",
                                        })
                                        .eq("id", property.id);
                                      window.location.reload();
                                    }}
                                    className="h-4 w-4"
                                  />
                                  <label
                                    htmlFor="format-amount"
                                    className="text-sm"
                                  >
                                    Kronor (
                                    {Math.abs(
                                      property.price - property.original_price,
                                    ).toLocaleString("sv-SE")}{" "}
                                    kr)
                                  </label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    id="format-percentage"
                                    name="price-format"
                                    value="percentage"
                                    checked={
                                      property.price_change_format ===
                                      "percentage"
                                    }
                                    onChange={async () => {
                                      await supabase
                                        .from("properties")
                                        .update({
                                          price_change_format: "percentage",
                                        })
                                        .eq("id", property.id);
                                      window.location.reload();
                                    }}
                                    className="h-4 w-4"
                                  />
                                  <label
                                    htmlFor="format-percentage"
                                    className="text-sm"
                                  >
                                    Procent (
                                    {Math.abs(
                                      ((property.price -
                                        property.original_price) /
                                        property.original_price) *
                                        100,
                                    ).toFixed(1)}
                                    %)
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <Separator />

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <Badge
                      variant={
                        property.status === "FOR_SALE" ? "default" : "secondary"
                      }
                    >
                      {property.status === "FOR_SALE"
                        ? "Till salu"
                        : property.status === "SOLD"
                          ? "Såld"
                          : property.status === "FOR_RENT"
                            ? "Till uthyrning"
                            : property.status}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Media Links */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Medialänkar</h3>

                    <div className="space-y-2">
                      {!isEditingVideo ? (
                        <div className="border rounded-lg p-4 bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                Filmlänk
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditingVideo(true);
                                setEditedVideoUrl(property.video_url || "");
                                setUseVideoAsFirstImage(
                                  property.use_video_as_first_image || false,
                                );
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>

                          {property.video_url ? (
                            <div className="space-y-2">
                              <a
                                href={property.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline block"
                              >
                                {property.video_url}
                              </a>
                              {property.use_video_as_first_image && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Check className="h-4 w-4 text-success" />
                                  <span>Används som förstabild</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Ingen film uppladdad
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="border rounded-lg p-4 bg-card space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Redigera filmlänk
                            </span>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">
                              Filmlänk (URL)
                            </label>
                            <Input
                              value={editedVideoUrl}
                              onChange={(e) =>
                                setEditedVideoUrl(e.target.value)
                              }
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full"
                            />
                          </div>

                          {editedVideoUrl && (
                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="checkbox"
                                id="use-video-as-first"
                                checked={useVideoAsFirstImage}
                                onChange={(e) =>
                                  setUseVideoAsFirstImage(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <label
                                htmlFor="use-video-as-first"
                                className="text-sm"
                              >
                                Använd film som förstabild
                              </label>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from("properties")
                                    .update({
                                      video_url: editedVideoUrl || null,
                                      use_video_as_first_image: editedVideoUrl
                                        ? useVideoAsFirstImage
                                        : false,
                                    })
                                    .eq("id", property.id);
                                  if (error) throw error;
                                  toast({
                                    title: "Filmlänk uppdaterad",
                                    description:
                                      "Filmlänken har uppdaterats framgångsrikt",
                                  });
                                  setProperty({
                                    ...property,
                                    video_url: editedVideoUrl || undefined,
                                    use_video_as_first_image: editedVideoUrl
                                      ? useVideoAsFirstImage
                                      : false,
                                  });
                                  setIsEditingVideo(false);
                                } catch (_error) {
                                  toast({
                                    title: "Ett fel uppstod",
                                    description:
                                      "Kunde inte uppdatera filmlänken",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Spara
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsEditingVideo(false);
                                setEditedVideoUrl("");
                                setUseVideoAsFirstImage(false);
                              }}
                            >
                              Avbryt
                            </Button>
                          </div>
                        </div>
                      )}

                      {!isEditing3D ? (
                        <div className="border rounded-lg p-4 bg-card">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                3D-visning
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing3D(true);
                                setEdited3DUrl(property.threed_tour_url || "");
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>

                          {property.threed_tour_url ? (
                            <a
                              href={property.threed_tour_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline block"
                            >
                              {property.threed_tour_url}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Ingen 3D-visning uppladdad
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="border rounded-lg p-4 bg-card space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Redigera 3D-visning
                            </span>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm text-muted-foreground">
                              3D-visningslänk (URL)
                            </label>
                            <Input
                              value={edited3DUrl}
                              onChange={(e) => setEdited3DUrl(e.target.value)}
                              placeholder="https://matterport.com/..."
                              className="w-full"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={async () => {
                                try {
                                  const { error } = await supabase
                                    .from("properties")
                                    .update({
                                      threed_tour_url: edited3DUrl || null,
                                    })
                                    .eq("id", property.id);
                                  if (error) throw error;
                                  toast({
                                    title: "3D-visning uppdaterad",
                                    description:
                                      "3D-visningslänken har uppdaterats framgångsrikt",
                                  });
                                  setProperty({
                                    ...property,
                                    threed_tour_url: edited3DUrl || undefined,
                                  });
                                  setIsEditing3D(false);
                                } catch (_error) {
                                  toast({
                                    title: "Ett fel uppstod",
                                    description:
                                      "Kunde inte uppdatera 3D-visningslänken",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Spara
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setIsEditing3D(false);
                                setEdited3DUrl("");
                              }}
                            >
                              Avbryt
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <PropertyAnalytics
              propertyId={property.id}
              adTier={property.ad_tier}
            />
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <PropertyMarketing
              property={{
                id: property.id,
                title: property.title,
                description: property.description,
                images: property.images,
                price: property.price,
                address_street: property.address_street,
                address_city: property.address_city,
              }}
            />
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <div className="space-y-6">
              {/* Current Package Card */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {property.ad_tier === "free" && (
                          <>
                            <Star className="h-5 w-5 text-foreground" />
                            Grundpaket
                          </>
                        )}
                        {property.ad_tier === "plus" && (
                          <>
                            <TrendingUp className="h-5 w-5 text-accent" />
                            Pluspaket
                          </>
                        )}
                        {property.ad_tier === "premium" && (
                          <>
                            <Crown className="h-5 w-5 text-premium" />
                            Exklusivpaket
                          </>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {property.ad_tier === "free" &&
                          "Kostnadsfri grundannons för alla"}
                        {property.ad_tier === "plus" &&
                          "Större annons med kostnadsfri förnyelse var 4:e vecka - 1 995 kr"}
                        {property.ad_tier === "premium" &&
                          "Störst synlighet, unika AI-verktyg och kostnadsfri förnyelse varje månad - 3 995 kr"}
                      </CardDescription>
                    </div>
                    <Badge className="text-sm px-3 py-1">Aktivt paket</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">
                        Vad ingår i ditt nuvarande paket:
                      </h4>
                      <div className="grid gap-3">
                        {property.ad_tier === "free" && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-muted-foreground">
                              Grundläggande publicering
                            </h5>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Standard annonsformat
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Tillhörande statistik för mäklare och säljare
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Bläddra genom alla bilder utan att gå in på
                                annonsen
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Fri publicering för alla säljare
                              </span>
                            </div>
                          </div>
                        )}
                        {property.ad_tier === "plus" && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-muted-foreground">
                              Ökad synlighet
                            </h5>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Allt som ingår i Grundpaketet + större annons
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Hamnar över Grundpaketet i publiceringslistan
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">Plus-badge</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                              <span className="text-sm">
                                Kostnadsfri förnyelse varje månad
                              </span>
                            </div>
                          </div>
                        )}
                        {property.ad_tier === "premium" && (
                          <>
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-muted-foreground">
                                Maximerad synlighet
                              </h5>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Allt som ingår i Pluspaketet + största
                                  annonsen
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Hamnar över Pluspaketet i publiceringslistan
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Exklusiv-badge som sticker ut
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Kostnadsfri förnyelse varje vecka
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-muted-foreground">
                                Exklusiva AI-verktyg
                              </h5>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  AI-Bildredigering som levererar otroliga
                                  resultat
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Unik AI-statistik i mäklarens och säljarens
                                  kundportal
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Detaljerad intressestatistik för mäklare och
                                  säljare
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-success mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  Mest trafik till annonsen
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Options */}
              {property.ad_tier !== "premium" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Uppgradera ditt paket
                  </h3>

                  {property.ad_tier === "free" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Plus Package */}
                      <Card className="border-2 border-accent/30 hover:border-accent transition-colors">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-accent" />
                            <CardTitle>Pluspaket</CardTitle>
                            <Badge variant="secondary" className="ml-auto">
                              Populär
                            </Badge>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">1 995 kr</span>
                          </div>
                          <CardDescription className="mt-2">
                            Större annons med kostnadsfri förnyelse var 4:e
                            vecka
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">
                              Ökad synlighet:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Allt som ingår i Grundpaketet + större annons
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Hamnar över Grundpaketet i publiceringslistan
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">Plus-badge</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Kostnadsfri förnyelse varje månad
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Premium Package */}
                      <Card className="border-2 border-premium/30 hover:border-premium transition-colors bg-gradient-to-br from-premium/5 to-primary/5">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-5 w-5 text-premium" />
                            <CardTitle>Exklusivpaket</CardTitle>
                            <Badge className="ml-auto bg-gradient-to-r from-premium to-primary text-white">
                              Bäst
                            </Badge>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">3 995 kr</span>
                          </div>
                          <CardDescription className="mt-2">
                            Störst synlighet, unika AI-verktyg och kostnadsfri
                            förnyelse varje månad
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">
                              Maximerad synlighet:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Allt som ingår i Pluspaketet + största
                                  annonsen
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Hamnar över Pluspaketet i publiceringslistan
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Premium-badge som sticker ut
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Kostnadsfri förnyelse var 4:e vecka
                                </span>
                              </div>
                            </div>
                            <h4 className="font-semibold text-sm mt-3">
                              Exklusiva AI-verktyg:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  AI-Bildredigering som levererar otroliga
                                  resultat
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Unik AI-statistik i mäklarens och säljarens
                                  kundportal
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Detaljerad intressestatistik för mäklare och
                                  säljare
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-success mt-0.5" />
                                <span className="text-sm">
                                  Mest trafik till annonsen
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {property.ad_tier === "plus" && (
                    <Card className="border-2 border-premium/30 hover:border-premium transition-colors bg-gradient-to-br from-premium/5 to-primary/5">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-5 w-5 text-premium" />
                          <CardTitle>Uppgradera till Exklusivpaket</CardTitle>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-muted-foreground line-through">
                            3 995 kr
                          </span>
                          <span className="text-3xl font-bold">+2 000 kr</span>
                        </div>
                        <CardDescription className="mt-2">
                          Störst synlighet, unika AI-verktyg och kostnadsfri
                          förnyelse varje månad
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            Ytterligare fördelar när du uppgraderar:
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-xs font-semibold text-muted-foreground mb-2">
                                Maximerad synlighet:
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    Allt som ingår i Pluspaketet + största
                                    annonsen
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    Hamnar över Pluspaketet i publiceringslistan
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    Premium-badge som sticker ut
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    Kostnadsfri förnyelse var 4:e vecka
                                    (istället för varje månad)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-muted-foreground mb-2">
                                Exklusiva AI-verktyg:
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    <strong>Nytt:</strong> AI-Bildredigering som
                                    levererar otroliga resultat
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    <strong>Nytt:</strong> Unik AI-statistik i
                                    mäklarens och säljarens kundportal
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    <strong>Nytt:</strong> Detaljerad
                                    intressestatistik för mäklare och säljare
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-success mt-0.5" />
                                  <span className="text-sm">
                                    <strong>Nytt:</strong> Mest trafik till
                                    annonsen
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-premium/10 p-4 rounded-lg border border-premium/20 mb-4">
                          <p className="text-sm text-muted-foreground">
                            <strong>Genomsnittlig försäljningstid:</strong>{" "}
                            Exklusivpaket säljer <strong>40% snabbare</strong>{" "}
                            än Plus och får{" "}
                            <strong>3x fler köpintresserade</strong>
                          </p>
                        </div>
                        <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                          <h5 className="font-semibold text-sm mb-2">
                            Hur uppgraderar jag?
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Kontakta din kontoansvarige eller klicka på
                            uppgraderingsknappen nedan för att direkt uppgradera
                            ditt paket. Uppgraderingen träder i kraft omedelbart
                            och din annons får ökad synlighet direkt.
                          </p>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-premium to-primary hover:from-premium/90 hover:to-primary/90 mt-4"
                          size="lg"
                        >
                          Uppgradera till Exklusiv för +2 000 kr
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {property.ad_tier === "premium" && (
                <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
                  <CardContent className="p-6">
                    <div className="text-center space-y-2">
                      <Crown className="h-12 w-12 mx-auto text-accent" />
                      <h3 className="text-xl font-semibold">
                        Du har det bästa paketet!
                      </h3>
                      <p className="text-muted-foreground">
                        Du använder redan vårt mest avancerade paket med alla
                        funktioner och högst exponering.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Renewal Tab - Ad Renewal for All Tiers */}
          <TabsContent value="renewal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Förnya annons
                </CardTitle>
                <CardDescription>
                  {property.ad_tier === "premium"
                    ? "Med Exklusivpaket kan du förnya annonsen kostnadsfritt varje månad"
                    : property.ad_tier === "plus"
                      ? "Med Pluspaket kan du förnya annonsen kostnadsfritt varje månad"
                      : "Förnya din Grundannons för 399 kr"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  // Calculate exact time since property was created/last renewed
                  // Use last_renewed_at if available, otherwise fall back to created_at
                  const renewalBaseDate = property.last_renewed_at
                    ? new Date(property.last_renewed_at)
                    : new Date(property.created_at);
                  const now = new Date();

                  // Calculate next renewal date - exactly one month after last renewal/creation
                  const nextRenewalDate = new Date(renewalBaseDate);
                  nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);

                  // Check if we can renew (current time is after renewal date)
                  const canRenew = now >= nextRenewalDate;

                  // Calculate time remaining until renewal
                  const timeUntilRenewal =
                    nextRenewalDate.getTime() - now.getTime();
                  const daysUntilRenewal = Math.floor(
                    timeUntilRenewal / (1000 * 60 * 60 * 24),
                  );
                  const hoursUntilRenewal = Math.floor(
                    (timeUntilRenewal % (1000 * 60 * 60 * 24)) /
                      (1000 * 60 * 60),
                  );
                  return (
                    <>
                      {/* Renewal Status Card */}
                      <Card
                        className={
                          canRenew
                            ? "border-2 border-success/50 bg-success/5"
                            : "border-2 border-muted"
                        }
                      >
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            {canRenew ? (
                              <>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-2">
                                  <Zap className="h-8 w-8 text-success" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold mb-2">
                                    Redo att förnya!
                                  </h3>
                                  <p className="text-muted-foreground">
                                    Din annons kan nu förnyas kostnadsfritt.
                                    Förnyelsen ger annonsen högre placering i
                                    sökresultaten.
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
                                  <Calendar className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold mb-2">
                                    {daysUntilRenewal > 0
                                      ? `${daysUntilRenewal} dagar och ${hoursUntilRenewal} timmar kvar`
                                      : `${hoursUntilRenewal} timmar kvar`}
                                  </h3>
                                  <p className="text-muted-foreground">
                                    Du kan förnya annonsen kostnadsfritt den{" "}
                                    {nextRenewalDate.toLocaleDateString(
                                      "sv-SE",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      },
                                    )}{" "}
                                    kl.{" "}
                                    {nextRenewalDate.toLocaleTimeString(
                                      "sv-SE",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Information about renewal */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">
                            Varför förnya annonsen?
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium mb-1">
                                  Högre placering i sökresultaten
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  När du förnyar din annons flyttas den högst
                                  upp i listan och blir mer synlig för nya
                                  köpare.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                              <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium mb-1">
                                  Ökad synlighet och fler visningar
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Fastigheter som förnyas får i genomsnitt 45%
                                  fler visningar under de kommande veckorna.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                              <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium mb-1">
                                  Nya köpintresserade
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Genom att förnya annonsen når du köpare som
                                  börjat söka sedan din ursprungliga
                                  publicering.
                                </p>
                              </div>
                            </div>

                            <div
                              className={`flex items-start gap-3 p-3 rounded-lg ${property.ad_tier === "free" ? "bg-warning/10 border border-warning/20" : "bg-success/10 border border-success/20"}`}
                            >
                              {property.ad_tier === "free" ? (
                                <DollarSign className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                              ) : (
                                <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="font-medium mb-1">
                                  {property.ad_tier === "free"
                                    ? "Förnyelse för 399 kr"
                                    : "Helt kostnadsfritt"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {property.ad_tier === "premium"
                                    ? "Med Exklusivpaket ingår kostnadsfri förnyelse varje månad."
                                    : property.ad_tier === "plus"
                                      ? "Med Pluspaket ingår kostnadsfri förnyelse varje månad."
                                      : "För Grundannonser kostar förnyelse 399 kr. Uppgradera till Plus eller Exklusiv för kostnadsfri förnyelse."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Statistics about renewal impact */}
                        <Card className="bg-gradient-to-br from-primary/5 to-accent/5"></Card>

                        {/* Renewal button */}
                        <Button
                          onClick={async () => {
                            if (!canRenew) {
                              const timeText =
                                daysUntilRenewal > 0
                                  ? `${daysUntilRenewal} dagar och ${hoursUntilRenewal} timmar`
                                  : `${hoursUntilRenewal} timmar`;
                              toast({
                                title: "Kan inte förnya ännu",
                                description: `Du kan förnya annonsen om ${timeText}`,
                                variant: "destructive",
                              });
                              return;
                            }

                            // For free tier, redirect to payment (to be implemented)
                            if (property.ad_tier === "free") {
                              toast({
                                title: "Betalning krävs",
                                description:
                                  "Du kommer snart att dirigeras till betalning för att förnya din annons för 399 kr.",
                              });
                              // TODO: Implement Stripe payment flow for renewal
                              return;
                            }
                            try {
                              // For Plus and Premium: free renewal
                              // Update last_renewed_at to move ad to top and reset timer
                              const now = new Date().toISOString();
                              const { error } = await supabase
                                .from("properties")
                                .update({
                                  last_renewed_at: now,
                                  updated_at: now,
                                })
                                .eq("id", property.id);
                              if (error) throw error;
                              toast({
                                title: "Annons förnyad!",
                                description:
                                  "Din annons har flyttats upp i sökresultaten och timern är återställd.",
                              });

                              // Reload property data to show updated timer
                              loadPropertyData();
                            } catch (error) {
                              console.error("Error renewing ad:", error);
                              toast({
                                title: "Fel",
                                description:
                                  "Kunde inte förnya annonsen. Försök igen senare.",
                                variant: "destructive",
                              });
                            }
                          }}
                          disabled={!canRenew}
                          size="lg"
                          className="w-full"
                        >
                          <Activity className="h-5 w-5 mr-2" />
                          {canRenew
                            ? property.ad_tier === "free"
                              ? "Betala 399 kr och förnya annons"
                              : "Förnya annons nu kostnadsfritt"
                            : daysUntilRenewal > 0
                              ? `Kan förnyas om ${daysUntilRenewal} dagar och ${hoursUntilRenewal} timmar`
                              : `Kan förnyas om ${hoursUntilRenewal} timmar`}
                        </Button>

                        {!canRenew && (
                          <p className="text-xs text-center text-muted-foreground">
                            Nästa förnyelse:{" "}
                            {nextRenewalDate.toLocaleDateString("sv-SE", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            kl.{" "}
                            {nextRenewalDate.toLocaleTimeString("sv-SE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab - Final Price Watchers */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Slutprisbevakning - Leads</CardTitle>
                <CardDescription>
                  Personer som vill få ett meddelande när slutpriset är klart
                </CardDescription>
              </CardHeader>
              <CardContent>
                {watchers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Inga personer bevakar slutpriset ännu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {watchers.map((watcher) => (
                      <Card key={watcher.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {watcher.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Anmäld:{" "}
                                {new Date(
                                  watcher.created_at,
                                ).toLocaleDateString("sv-SE", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <Badge
                              variant={
                                watcher.status === "notified"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {watcher.status === "active" && "Aktiv"}
                              {watcher.status === "notified" && "Notifierad"}
                              {watcher.status === "cancelled" && "Avbruten"}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={`mailto:${watcher.email}`}
                                className="hover:underline"
                              >
                                {watcher.email}
                              </a>
                              {watcher.notify_via_email && (
                                <Badge variant="outline" className="text-xs">
                                  E-post notis
                                </Badge>
                              )}
                            </div>
                            {watcher.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={`tel:${watcher.phone}`}
                                  className="hover:underline"
                                >
                                  {watcher.phone}
                                </a>
                                {watcher.notify_via_sms && (
                                  <Badge variant="outline" className="text-xs">
                                    SMS notis
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {watcher.reason_for_interest && (
                            <div className="mb-3 border-t pt-3">
                              <p className="text-sm font-medium mb-1">
                                Varför vill de veta slutpriset:
                              </p>
                              <p className="text-sm bg-muted p-3 rounded">
                                {watcher.reason_for_interest}
                              </p>
                            </div>
                          )}

                          {watcher.message && (
                            <div className="mb-3 border-t pt-3">
                              <p className="text-sm font-medium mb-1">
                                Meddelande:
                              </p>
                              <p className="text-sm bg-muted p-3 rounded">
                                {watcher.message}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3 mb-3 border-t pt-3">
                            {watcher.planning_to_sell !== null && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Planerar att sälja:
                                </p>
                                <p className="text-sm font-medium">
                                  {watcher.planning_to_sell ? "✅ Ja" : "Nej"}
                                </p>
                              </div>
                            )}

                            {watcher.estimated_sale_timeframe && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Tidram för försäljning:
                                </p>
                                <p className="text-sm font-medium">
                                  {watcher.estimated_sale_timeframe ===
                                  "within_3_months"
                                    ? "🔥 Inom 3 månader"
                                    : watcher.estimated_sale_timeframe ===
                                        "3_6_months"
                                      ? "3-6 månader"
                                      : watcher.estimated_sale_timeframe ===
                                          "6_12_months"
                                        ? "6-12 månader"
                                        : watcher.estimated_sale_timeframe ===
                                            "1_2_years"
                                          ? "1-2 år"
                                          : watcher.estimated_sale_timeframe ===
                                              "over_2_years"
                                            ? "Över 2 år"
                                            : watcher.estimated_sale_timeframe}
                                </p>
                              </div>
                            )}

                            {watcher.current_living_situation && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Nuvarande boende:
                                </p>
                                <p className="text-sm font-medium">
                                  {watcher.current_living_situation === "owner"
                                    ? "🏠 Bor i egen bostad"
                                    : watcher.current_living_situation ===
                                        "renter"
                                      ? "Hyr bostad"
                                      : watcher.current_living_situation ===
                                          "living_with_parents"
                                        ? "Bor hos föräldrar"
                                        : watcher.current_living_situation ===
                                            "other"
                                          ? "Annat"
                                          : watcher.current_living_situation}
                                </p>
                              </div>
                            )}

                            {watcher.budget_range && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Budgetram:
                                </p>
                                <p className="text-sm font-medium">
                                  {watcher.budget_range === "under_2m"
                                    ? "Under 2 mkr"
                                    : watcher.budget_range === "2m_4m"
                                      ? "2-4 mkr"
                                      : watcher.budget_range === "4m_6m"
                                        ? "4-6 mkr"
                                        : watcher.budget_range === "6m_8m"
                                          ? "6-8 mkr"
                                          : watcher.budget_range === "8m_10m"
                                            ? "8-10 mkr"
                                            : watcher.budget_range ===
                                                "over_10m"
                                              ? "💎 Över 10 mkr"
                                              : watcher.budget_range}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 border-t pt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const subject = encodeURIComponent(
                                  `Slutprisbevakning - ${property?.address_street || "Fastighet"}`,
                                );
                                window.location.href = `mailto:${watcher.email}?subject=${subject}`;
                              }}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Skicka e-post
                            </Button>
                            {watcher.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  (window.location.href = `tel:${watcher.phone}`)
                                }
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Ring
                              </Button>
                            )}
                          </div>

                          {watcher.notified_at && (
                            <p className="text-xs text-muted-foreground mt-3 border-t pt-3">
                              Notifierad om slutpris:{" "}
                              {new Date(watcher.notified_at).toLocaleDateString(
                                "sv-SE",
                              )}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default BrokerPropertyDetails;
