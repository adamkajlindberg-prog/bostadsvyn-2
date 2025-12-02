"use client";

import { Loader2, MessageCircle, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getMessagesWithProfiles,
  getOrCreateConversation,
  type MessageWithProfile,
  sendMessage,
} from "@/lib/actions/messaging";

interface RentalChatProps {
  propertyId: string;
  propertyOwnerId: string;
  propertyOwner?: {
    fullName?: string;
    email: string;
  };
}

export function RentalChat({
  propertyId,
  propertyOwnerId,
  propertyOwner,
}: RentalChatProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const loadOrCreateConversation = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await getOrCreateConversation(propertyId, propertyOwnerId);

      if (result.success && result.conversation) {
        setConversationId(result.conversation.id);
      } else {
        toast.error(result.error || "Kunde inte skapa konversation");
      }
    } catch {
      toast.error("Kunde inte ladda konversation");
    } finally {
      setLoading(false);
    }
  }, [user, propertyId, propertyOwnerId]);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const messagesData = await getMessagesWithProfiles(conversationId);
      setMessages(messagesData);
    } catch {
      // Error handled silently
    }
  }, [conversationId]);

  useEffect(() => {
    if (user && propertyOwnerId !== user.id) {
      loadOrCreateConversation();
    } else {
      setLoading(false);
    }
  }, [user, propertyOwnerId, loadOrCreateConversation]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !user) return;

    setSending(true);
    try {
      const result = await sendMessage(
        conversationId,
        newMessage.trim(),
        "text",
      );

      if (result.success && result.message) {
        const newMsg: MessageWithProfile = {
          ...result.message,
          senderProfile: {
            name: user.name || null,
            email: user.email,
          },
        };
        setMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
      } else {
        toast.error(result.error || "Kunde inte skicka meddelande");
      }
    } catch {
      toast.error("Kunde inte skicka meddelande");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatTime = (timestamp: Date | string) => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Logga in för att chatta med uthyraren
          </p>
          <Button onClick={() => window.location.assign("/login")}>
            Logga in
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (propertyOwnerId === user.id) {
    return null; // Don't show chat to property owner on their own listing
  }

  if (!showChat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chatta med uthyraren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Har du frågor om bostaden? Starta en konversation med uthyraren
            direkt här.
          </p>
          <Button className="w-full" onClick={() => setShowChat(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Öppna chatt
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">Laddar chatt...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chatta med uthyraren
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
            Minimera
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Inga meddelanden ännu. Skriv något för att starta
                  konversationen!
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === user.id;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isOwn ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }
                      >
                        {isOwn
                          ? getInitials(user.name, user.email)
                          : getInitials(
                              propertyOwner?.fullName,
                              propertyOwner?.email,
                            )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`flex-1 ${isOwn ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block max-w-[80%] rounded-lg p-3 ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Skriv ditt meddelande..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Alla meddelanden sparas och kan ses under "Meddelanden" i din profil
        </p>
      </CardContent>
    </Card>
  );
}
