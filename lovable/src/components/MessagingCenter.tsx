import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Trash2
} from 'lucide-react';

interface Conversation {
  id: string;
  property_id: string;
  buyer_id: string;
  seller_id: string;
  subject?: string;
  status: string;
  last_message_at?: string;
  created_at: string;
  property: {
    title: string;
    address_street: string;
    images?: string[];
  };
  buyer_profile?: {
    full_name?: string;
    email: string;
  };
  seller_profile?: {
    full_name?: string;
    email: string;
  };
  last_message?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  read_at?: string;
  created_at: string;
  sender_profile?: {
    full_name?: string;
    email: string;
  };
}

export const MessagingCenter: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          properties!inner(title, address_street, images)
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load profiles and last messages separately to avoid complex joins
      const conversationsWithDetails = await Promise.all(
        (data || []).map(async (conv) => {
          // Load buyer profile
          const { data: buyerProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', conv.buyer_id)
            .single();

          // Load seller profile  
          const { data: sellerProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', conv.seller_id)
            .single();

          // Load last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('id, content, sender_id, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            property: conv.properties,
            buyer_profile: buyerProfile,
            seller_profile: sellerProfile,
            last_message: lastMessage,
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda konversationer',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Load sender profiles separately
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: senderProfile,
          };
        })
      );

      setMessages(messagesWithProfiles);
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda meddelanden',
        variant: 'destructive',
      });
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user?.id)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      setSendingMessage(true);

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text',
        }])
        .select('*')
        .single();

      if (error) throw error;

      // Load sender profile for the new message
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', user.id)
        .single();

      const messageWithProfile = {
        ...data,
        sender_profile: senderProfile,
      };

      setMessages(prev => [...prev, messageWithProfile]);
      setNewMessage('');

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      // Refresh conversations list
      loadConversations();
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: error.message || 'Kunde inte skicka meddelande',
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (conversation.buyer_id === user?.id) {
      return {
        profile: conversation.seller_profile,
        role: 'Säljare',
      };
    } else {
      return {
        profile: conversation.buyer_profile,
        role: 'Köpare',
      };
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'AN';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('sv-SE', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('sv-SE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;

    const otherParticipant = getOtherParticipant(conv);
    const searchLower = searchTerm.toLowerCase();

    return (
      conv.property.title.toLowerCase().includes(searchLower) ||
      conv.property.address_street.toLowerCase().includes(searchLower) ||
      otherParticipant.profile?.full_name?.toLowerCase().includes(searchLower) ||
      otherParticipant.profile?.email.toLowerCase().includes(searchLower) ||
      conv.last_message?.content.toLowerCase().includes(searchLower)
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
                    {searchTerm ? 'Inga konversationer hittades' : 'Inga meddelanden ännu'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation);
                    const isSelected = selectedConversation?.id === conversation.id;
                    const hasUnread = conversation.last_message &&
                      conversation.last_message.sender_id !== user?.id;

                    return (
                      <div
                        key={conversation.id}
                        className={`p-3 cursor-pointer hover:bg-muted/50 border-b ${isSelected ? 'bg-muted' : ''
                          }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getInitials(
                                otherParticipant.profile?.full_name,
                                otherParticipant.profile?.email
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm truncate">
                                {otherParticipant.profile?.full_name || 'Användare'}
                              </h4>
                              {conversation.last_message && (
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.last_message.created_at)}
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

                            {conversation.last_message && (
                              <p className="text-sm text-muted-foreground truncate mt-1">
                                {conversation.last_message.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
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
                          getOtherParticipant(selectedConversation).profile?.full_name,
                          getOtherParticipant(selectedConversation).profile?.email
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {getOtherParticipant(selectedConversation).profile?.full_name || 'Användare'}
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
                      const isOwn = message.sender_id === user?.id;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-lg px-3 py-2 ${isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                                }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">
                              {formatTime(message.created_at)}
                              {isOwn && message.read_at && (
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
                    onClick={sendMessage}
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
                <h3 className="text-lg font-semibold mb-2">Välj en konversation</h3>
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