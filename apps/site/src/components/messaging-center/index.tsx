"use client";

import {
  Info,
  MessageCircle,
  MoreVertical,
  Phone,
  Search,
  Send,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type ConversationWithDetails,
  getConversationsWithDetails,
  getMessagesWithProfiles,
  type MessageWithProfile,
  markMessagesAsRead,
  sendMessage,
} from "@/lib/actions/messaging";

export const MessagingCenter: React.FC = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    [],
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithDetails | null>(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      const conversationsData = await getConversationsWithDetails(user.id);
      setConversations(conversationsData);
    } catch (_error) {
      toast.error("Kunde inte ladda konversationer");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const messagesData = await getMessagesWithProfiles(conversationId);
      setMessages(messagesData);
    } catch (_error) {
      toast.error("Kunde inte ladda meddelanden");
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      setSendingMessage(true);

      const result = await sendMessage(
        selectedConversation.id,
        newMessage.trim(),
        "text",
      );

      if (!result.success) {
        throw new Error(result.error || "Kunde inte skicka meddelande");
      }

      // Add the new message to the list
      if (result.message) {
        const newMsg: MessageWithProfile = {
          ...result.message,
          senderProfile: {
            name: user.name || null,
            email: user.email,
          },
        };
        setMessages((prev) => [...prev, newMsg]);
      }

      setNewMessage("");

      // Refresh conversations list
      await loadConversations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kunde inte skicka meddelande";
      toast.error(message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conversation: ConversationWithDetails) => {
    if (conversation.buyerId === user?.id) {
      return {
        profile: conversation.sellerProfile,
        role: "Säljare",
      };
    } else {
      return {
        profile: conversation.buyerProfile,
        role: "Köpare",
      };
    }
  };

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "AN";
  };

  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("sv-SE", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("sv-SE", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;

    const otherParticipant = getOtherParticipant(conv);
    const searchLower = searchTerm.toLowerCase();

    return (
      conv.property.title.toLowerCase().includes(searchLower) ||
      conv.property.addressStreet.toLowerCase().includes(searchLower) ||
      otherParticipant.profile?.name?.toLowerCase().includes(searchLower) ||
      otherParticipant.profile?.email.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar meddelanden...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex h-[calc(100vh-8rem)] max-w-7xl mx-auto gap-6">
        {/* Conversations List */}
        <Card className="w-1/3 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Meddelanden
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök konversationer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Inga konversationer hittades"
                      : "Inga meddelanden ännu"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const isSelected =
                      selectedConversation?.id === conversation.id;
                    const hasUnread =
                      conversation.lastMessage &&
                      conversation.lastMessage.senderId !== user?.id;

                    return (
                      <button
                        type="button"
                        key={conversation.id}
                        className={`p-3 cursor-pointer hover:bg-muted/50 border-b w-full text-left ${
                          isSelected ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(
                                otherParticipant.profile?.name,
                                otherParticipant.profile?.email,
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm truncate">
                                {otherParticipant.profile?.name || "Användare"}
                              </h4>
                              {conversation.lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(
                                    conversation.lastMessage.createdAt,
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {otherParticipant.role}
                              </Badge>
                              {hasUnread && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {conversation.property.title}
                            </p>

                            {conversation.lastMessage && (
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(
                          getOtherParticipant(selectedConversation).profile
                            ?.name,
                          getOtherParticipant(selectedConversation).profile
                            ?.email,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {getOtherParticipant(selectedConversation).profile
                          ?.name || "Användare"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.property.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}
                          >
                            <div
                              className={`rounded-lg px-3 py-2 ${
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {message.content}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">
                              {formatTime(message.createdAt)}
                              {isOwn && message.readAt && (
                                <span className="ml-2">✓</span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Skriv ett meddelande..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={sendingMessage}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Välj en konversation
                </h3>
                <p className="text-muted-foreground">
                  Välj en konversation från listan för att börja chatta
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MessagingCenter;
