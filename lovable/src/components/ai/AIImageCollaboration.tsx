import { Crown, Share2, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Participant {
  id: string;
  name: string;
  role: "owner" | "viewer" | "editor";
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

interface AIImageCollaborationProps {
  imageUrl: string;
  onCollaborativeEdit: (edit: any) => void;
}

export default function AIImageCollaboration({
  imageUrl,
  onCollaborativeEdit,
}: AIImageCollaborationProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && sessionId) {
      setupRealtimeCollaboration();
    }
  }, [user, sessionId, setupRealtimeCollaboration]);

  const setupRealtimeCollaboration = () => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`image-collaboration:${sessionId}`)
      .on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const activeParticipants = Object.keys(presenceState).map((userId) => {
          const presence = presenceState[userId][0] as any;
          return {
            id: userId,
            name: presence?.name || userId.split("-")[0] || "Anonym användare",
            role: (presence?.role || "viewer") as "owner" | "viewer" | "editor",
            isOnline: presence?.isOnline || true,
            lastSeen: presence?.lastSeen
              ? new Date(presence.lastSeen)
              : new Date(),
          } as Participant;
        });
        setParticipants(activeParticipants);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        toast({
          title: "Ny deltagare",
          description: `${newPresences[0].name} gick med i sessionen`,
        });
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        toast({
          title: "Deltagare lämnade",
          description: `${leftPresences[0].name} lämnade sessionen`,
        });
      })
      .on("broadcast", { event: "image_edit" }, (payload) => {
        onCollaborativeEdit(payload);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && user) {
          await channel.track({
            name: user.email?.split("@")[0] || "Anonym användare",
            role: "editor",
            isOnline: true,
            lastSeen: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const startCollaborationSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("collaboration_sessions")
        .insert([
          {
            created_by: user.id,
            session_name: `AI Bildredigering - ${new Date().toLocaleDateString("sv-SE")}`,
            session_type: "image_editing",
            property_id: null, // Could be linked to a property if needed
            is_public: false,
            session_data: { imageUrl, editHistory: [] },
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setIsSessionActive(true);

      // Generate share link
      const link = `${window.location.origin}/ai-tools?collaboration=${data.id}`;
      setShareLink(link);

      toast({
        title: "Kollaborationssession skapad! 👥",
        description: "Andra kan nu gå med och hjälpa till med redigeringen.",
      });
    } catch (error: any) {
      console.error("Error starting collaboration:", error);
      toast({
        title: "Kunde inte starta session",
        description: "Kollaborationssession kunde inte skapas.",
        variant: "destructive",
      });
    }
  };

  const shareSession = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Länk kopierad! 📋",
        description:
          "Dela länken med andra för att bjuda in dem till sessionen.",
      });
    } catch (_error) {
      toast({
        title: "Kunde inte kopiera länk",
        description: "Försök kopiera länken manuellt.",
        variant: "destructive",
      });
    }
  };

  const _broadcastEdit = async (editData: any) => {
    if (!sessionId) return;

    const channel = supabase.channel(`image-collaboration:${sessionId}`);
    await channel.send({
      type: "broadcast",
      event: "image_edit",
      payload: {
        ...editData,
        timestamp: new Date().toISOString(),
        userId: user?.id,
        userName: user?.email?.split("@")[0] || "Anonym",
      },
    });
  };

  if (!isSessionActive) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <Users className="h-5 w-5" />
            Kollaborativ AI-redigering
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Starta en session för att arbeta tillsammans med andra
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={startCollaborationSession}
            className="flex items-center gap-2"
            disabled={!user}
          >
            <UserPlus className="h-4 w-4" />
            Starta kollaborationssession
          </Button>
          {!user && (
            <p className="text-xs text-muted-foreground mt-2">
              Logga in för att använda kollaborationsfunktionen
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Live Kollaboration
            <Badge className="bg-green-100 text-green-800">Aktiv session</Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={shareSession}>
            <Share2 className="h-4 w-4 mr-1" />
            Dela
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-2 bg-muted rounded-full px-3 py-1"
              >
                <div
                  className={`w-2 h-2 rounded-full ${participant.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                />
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {participant.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{participant.name}</span>
                {participant.role === "owner" && (
                  <Crown className="h-3 w-3 text-yellow-500" />
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>👥 {participants.length} aktiva deltagare</p>
            <p>🔗 Dela länken för att bjuda in fler</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
