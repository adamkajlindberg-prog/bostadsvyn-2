import { Calendar, Eye, MessageSquare, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface RentalPropertyAnalyticsProps {
  propertyId: string;
  adId: string;
}
interface ViewStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}
interface ChatStats {
  chatClicks: number;
  newMessages: number;
  totalConversations: number;
}
interface DailyViewData {
  date: string;
  views: number;
}
export default function RentalPropertyAnalytics({
  propertyId,
  adId,
}: RentalPropertyAnalyticsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewStats, setViewStats] = useState<ViewStats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
  });
  const [chatStats, setChatStats] = useState<ChatStats>({
    chatClicks: 0,
    newMessages: 0,
    totalConversations: 0,
  });
  const [dailyViews, setDailyViews] = useState<DailyViewData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);
  const loadAnalytics = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadViewStatistics(),
        loadChatStatistics(),
        loadDailyViewsData(),
      ]);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda statistik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const loadViewStatistics = async () => {
    try {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      const startOfMonth = new Date(now);
      startOfMonth.setDate(now.getDate() - 30);

      // Get all views for this property
      const { data: allViews } = await supabase
        .from("property_views")
        .select("viewed_at")
        .eq("property_id", propertyId);
      if (allViews) {
        const todayViews = allViews.filter(
          (v) => new Date(v.viewed_at) >= startOfToday,
        ).length;
        const weekViews = allViews.filter(
          (v) => new Date(v.viewed_at) >= startOfWeek,
        ).length;
        const monthViews = allViews.filter(
          (v) => new Date(v.viewed_at) >= startOfMonth,
        ).length;
        setViewStats({
          today: todayViews,
          thisWeek: weekViews,
          thisMonth: monthViews,
          total: allViews.length,
        });
      }
    } catch (error) {
      console.error("Error loading view statistics:", error);
    }
  };
  const loadChatStatistics = async () => {
    try {
      // Load conversations for this property
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id, created_at")
        .eq("property_id", propertyId);
      if (conversations) {
        const chatClicks = conversations.length;
        const newMessages = 0; // Placeholder until message tracking is implemented

        setChatStats({
          chatClicks,
          newMessages,
          totalConversations: conversations.length,
        });
      }
    } catch (error) {
      console.error("Error loading chat statistics:", error);
    }
  };
  const loadDailyViewsData = async () => {
    try {
      const now = new Date();
      const last14Days = new Date(now);
      last14Days.setDate(now.getDate() - 14);

      // Get views for last 14 days
      const { data: views } = await supabase
        .from("property_views")
        .select("viewed_at")
        .eq("property_id", propertyId)
        .gte("viewed_at", last14Days.toISOString());

      // Group views by day
      const viewsByDay: {
        [key: string]: number;
      } = {};

      // Initialize all days with 0
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        viewsByDay[dateStr] = 0;
      }

      // Count views per day
      if (views) {
        views.forEach((view) => {
          const dateStr = new Date(view.viewed_at).toISOString().split("T")[0];
          if (viewsByDay[dateStr] !== undefined) {
            viewsByDay[dateStr]++;
          }
        });
      }

      // Convert to array format for chart
      const chartData = Object.entries(viewsByDay).map(([date, views]) => ({
        date: new Date(date).toLocaleDateString("sv-SE", {
          month: "short",
          day: "numeric",
        }),
        views,
      }));
      setDailyViews(chartData);
    } catch (error) {
      console.error("Error loading daily views:", error);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* View Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Idag</p>
                <p className="text-2xl font-bold">{viewStats.today}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Senaste veckan</p>
                <p className="text-2xl font-bold">{viewStats.thisWeek}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Senaste månaden</p>
                <p className="text-2xl font-bold">{viewStats.thisMonth}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Totalt</p>
                <p className="text-2xl font-bold">{viewStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visningar per dag</CardTitle>
          <CardDescription>Senaste 14 dagarna</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chat Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Chattstatistik</CardTitle>
          <CardDescription>Aktivitet och meddelanden</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Chatt-klick</p>
                  <p className="text-xl font-bold">{chatStats.chatClicks}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge
                  variant="destructive"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {chatStats.newMessages}
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nya meddelanden
                  </p>
                  <p className="text-xl font-bold">{chatStats.newMessages}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Konversationer
                  </p>
                  <p className="text-xl font-bold">
                    {chatStats.totalConversations}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
    </div>
  );
}
