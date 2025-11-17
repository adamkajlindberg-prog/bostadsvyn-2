import { Send, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Conversation {
  id: string;
  buyer_id: string;
  last_message_at: string;
  status: string;
  buyer_name?: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_name?: string;
}

interface RentalChatProps {
  adId: string;
  propertyId: string;
}

export default function RentalChat({ adId, propertyId }: RentalChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation, loadMessages]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("property_id", propertyId)
        .eq("seller_id", user?.id)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      // Mock buyer names for demo
      const conversationsWithNames = (data || []).map((conv, idx) => ({
        ...conv,
        buyer_name: `Intressent ${idx + 1}`,
      }));

      setConversations(conversationsWithNames);

      if (conversationsWithNames.length > 0) {
        setSelectedConversation(conversationsWithNames[0].id);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Mock sender names for demo
      const messagesWithNames = (data || []).map((msg) => ({
        ...msg,
        sender_name: msg.sender_id === user?.id ? "Du" : "Intressent",
      }));

      setMessages(messagesWithNames);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversation,
        sender_id: user?.id,
        content: newMessage,
        message_type: "text",
      });

      if (error) throw error;

      // Update conversation last message time
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedConversation);

      setNewMessage("");
      loadMessages(selectedConversation);
      loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka meddelandet",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chattkonversationer</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Inga chattkonversationer ännu. När någon kontaktar dig via annonsen
            visas det här.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Konversationer</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conv.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {conv.buyer_name?.[0] || "I"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">
                          {conv.buyer_name}
                        </p>
                        <p className="text-xs opacity-70">
                          {new Date(conv.last_message_at).toLocaleDateString(
                            "sv-SE",
                          )}
                        </p>
                      </div>
                    </div>
                    {conv.status === "active" && (
                      <Badge variant="secondary" className="text-xs">
                        Aktiv
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {selectedConv?.buyer_name?.[0] || "I"}
              </AvatarFallback>
            </Avatar>
            {selectedConv?.buyer_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] mb-4">
            <div className="space-y-4 pr-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Inga meddelanden ännu. Starta konversationen!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender_id === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString("sv-SE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
