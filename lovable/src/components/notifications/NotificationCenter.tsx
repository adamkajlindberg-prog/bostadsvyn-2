import {
  AlertCircle,
  Bell,
  BellOff,
  Calendar,
  Check,
  Home,
  MessageSquare,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  user_id: string;
  type:
    | "property_match"
    | "price_change"
    | "new_message"
    | "viewing_scheduled"
    | "market_update"
    | "system";
  title: string;
  message: string;
  is_read: boolean;
  priority: "low" | "medium" | "high";
  related_id?: string;
  metadata?: any;
  created_at: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  property_matches: boolean;
  price_changes: boolean;
  messages: boolean;
  viewings: boolean;
  market_updates: boolean;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: false,
    property_matches: true,
    price_changes: true,
    messages: true,
    viewings: true,
    market_updates: false,
  });
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadNotificationSettings();
      // Set up real-time subscription
      const subscription = setupRealtimeSubscription();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [user, loadNotificationSettings, loadNotifications]);

  const loadNotifications = async () => {
    try {
      // In a real implementation, you'd have a notifications table
      // For now, we'll simulate with mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          user_id: user?.id || "",
          type: "property_match",
          title: "Ny fastighet matchar dina kriterier",
          message:
            'En 3:a i Stockholm för 4 500 000 kr har lagts upp som matchar din sparade sökning "Lägenhet Stockholm".',
          is_read: false,
          priority: "high",
          related_id: "property-123",
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        },
        {
          id: "2",
          user_id: user?.id || "",
          type: "price_change",
          title: "Prisändring på bevakad fastighet",
          message:
            'Priset på "Mysig 2:a i Södermalm" har sänkts med 200 000 kr.',
          is_read: false,
          priority: "medium",
          related_id: "property-456",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: "3",
          user_id: user?.id || "",
          type: "new_message",
          title: "Nytt meddelande från mäklare",
          message: "Anna Svensson har svarat på din förfrågan om visning.",
          is_read: true,
          priority: "medium",
          related_id: "conversation-789",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        },
        {
          id: "4",
          user_id: user?.id || "",
          type: "viewing_scheduled",
          title: "Visning bekräftad",
          message:
            'Din visning av "Villa med havsutsikt" är bekräftad för imorgon kl 15:00.',
          is_read: true,
          priority: "high",
          related_id: "viewing-101",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
        {
          id: "5",
          user_id: user?.id || "",
          type: "market_update",
          title: "Marknadsrapport Stockholm",
          message:
            "Nya prisstatistik visar 2,3% ökning i ditt bevakade område.",
          is_read: true,
          priority: "low",
          created_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 2,
          ).toISOString(), // 2 days ago
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      // Load from user preferences or use defaults
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (preferences) {
        setSettings({
          email_notifications: preferences.email_notifications,
          push_notifications: false, // Would need push setup
          property_matches: true,
          price_changes: true,
          messages: true,
          viewings: true,
          market_updates: preferences.marketing_emails,
        });
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  const setupRealtimeSubscription = () => {
    // In a real implementation, you'd subscribe to notification changes
    return null;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({
        title: "Framgång",
        description: "Alla notifieringar markerade som lästa",
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast({
        title: "Framgång",
        description: "Notifiering borttagen",
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const updateSettings = async (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      // Update user preferences
      await supabase.from("user_preferences").upsert({
        user_id: user?.id,
        email_notifications: newSettings.email_notifications,
        marketing_emails: newSettings.market_updates,
      });

      toast({
        title: "Inställningar sparade",
        description: "Dina notifieringsinställningar har uppdaterats",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Fel",
        description: "Kunde inte spara inställningar",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "property_match":
        return <Home className="h-4 w-4 text-blue-500" />;
      case "price_change":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "new_message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "viewing_scheduled":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "market_update":
        return <AlertCircle className="h-4 w-4 text-info" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-critical";
      case "medium":
        return "border-l-warning";
      case "low":
        return "border-l-muted";
      default:
        return "border-l-muted";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just nu";
    if (diffInMinutes < 60) return `${diffInMinutes}m sedan`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h sedan`;
    return `${Math.floor(diffInMinutes / 1440)}d sedan`;
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifieringar</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} nya
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Inställningar
              </Button>

              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Markera alla som lästa
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Notifieringsinställningar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Leveransmetoder</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">E-postnotifieringar</p>
                    <p className="text-sm text-muted-foreground">
                      Få notifieringar via e-post
                    </p>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) =>
                      updateSettings("email_notifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push-notifieringar</p>
                    <p className="text-sm text-muted-foreground">
                      Direktnotifieringar i webbläsaren
                    </p>
                  </div>
                  <Switch
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) =>
                      updateSettings("push_notifications", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Typer av notifieringar</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Fastighetsträffar</p>
                      <p className="text-sm text-muted-foreground">
                        När nya fastigheter matchar dina sökningar
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.property_matches}
                    onCheckedChange={(checked) =>
                      updateSettings("property_matches", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">Prisändringar</p>
                      <p className="text-sm text-muted-foreground">
                        När priser ändras på bevakade fastigheter
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.price_changes}
                    onCheckedChange={(checked) =>
                      updateSettings("price_changes", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Meddelanden</p>
                      <p className="text-sm text-muted-foreground">
                        Nya meddelanden från mäklare
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.messages}
                    onCheckedChange={(checked) =>
                      updateSettings("messages", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-medium">Visningar</p>
                      <p className="text-sm text-muted-foreground">
                        Bekräftelser och påminnelser om visningar
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.viewings}
                    onCheckedChange={(checked) =>
                      updateSettings("viewings", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-info" />
                    <div>
                      <p className="font-medium">Marknadsuppdateringar</p>
                      <p className="text-sm text-muted-foreground">
                        Nyheter och trender från fastighetsmarknaden
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.market_updates}
                    onCheckedChange={(checked) =>
                      updateSettings("market_updates", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Inga notifieringar</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.is_read ? "bg-muted/20" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm truncate">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.is_read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
