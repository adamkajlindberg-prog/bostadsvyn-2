import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ConversationStarter from './ConversationStarter';
import MessageSummary from './MessageSummary';
import PersonalizationPanel from './PersonalizationPanel';
import TypingIndicator from './TypingIndicator';
import { Bot, Send, Sparkles, TrendingUp, MapPin, Calculator, School, Shield, Loader2, User, Home, DollarSign, BarChart3, Download, FileText, Plus, History, Settings, Star, Clock, CheckCircle, MessageSquare, Copy, ThumbsUp, ThumbsDown, Heart, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  followUpQuestions?: string[];
  rating?: number;
  category?: string;
  isPersonalized?: boolean;
  reactions?: {
    thumbsUp: number;
    thumbsDown: number;
    heart: number;
    userReaction?: 'thumbsUp' | 'thumbsDown' | 'heart' | null;
  };
}
interface ChatSession {
  id: string;
  session_data: any; // Will be Json from Supabase but we'll handle conversion
  created_at: string;
  updated_at: string;
}
const quickQuestions = [{
  icon: TrendingUp,
  text: "Gör en djup marknadsanalys för Stockholm med prognoser för 2025",
  category: "marknad"
}, {
  icon: MapPin,
  text: "Jämför och analysera de bästa familjområdena i Stockholm med skolor, trygghet och framtidspotential",
  category: "områden"
}, {
  icon: Calculator,
  text: "Beräkna min lånekapacitet och ge strategier för optimal finansiering med 50 000 kr månadsintäkt",
  category: "lån"
}, {
  icon: School,
  text: "Analysera skolkvalitet och dess påverkan på fastighetspriser i Danderyd vs Nacka",
  category: "skolor"
}, {
  icon: DollarSign,
  text: "Detaljerad prisanalys för 3:or i Göteborg - historik, nuläge och framtid",
  category: "priser"
}, {
  icon: Shield,
  text: "Trygghetsutveckling i Malmö: områdesanalys med investeringsperspektiv",
  category: "säkerhet"
}, {
  icon: BarChart3,
  text: "Vilka fastighetstyper har bäst avkastningspotential de kommande åren?",
  category: "investering"
}, {
  icon: Home,
  text: "Analysera för- och nackdelar med att köpa nyproduktion vs befintlig bostad 2025",
  category: "kommunservice"
}];
export default function AIPropertyAdvisorContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    user
  } = useAuth();
  const {
    preferences
  } = useUserPreferences();
  const {
    toast
  } = useToast();
  const getPersonalizedWelcomeMessage = (userPreferences: any): Message => {
    const personalizedSections = [];
    if (userPreferences.interestedAreas?.length > 0) {
      personalizedSections.push(`🎯 **Dina intresserade områden:** ${userPreferences.interestedAreas.join(', ')}`);
    }
    if (userPreferences.budgetRange?.min || userPreferences.budgetRange?.max) {
      const min = userPreferences.budgetRange.min ? `${userPreferences.budgetRange.min.toLocaleString()} kr` : 'Ingen min-gräns';
      const max = userPreferences.budgetRange.max ? `${userPreferences.budgetRange.max.toLocaleString()} kr` : 'Ingen max-gräns';
      personalizedSections.push(`💰 **Din budget:** ${min} - ${max}`);
    }
    if (userPreferences.preferredPropertyTypes?.length > 0) {
      personalizedSections.push(`🏡 **Föredragna fastighetstyper:** ${userPreferences.preferredPropertyTypes.join(', ')}`);
    }
    const personalizedIntro = personalizedSections.length > 0 ? `\n\n## 👤 **Dina inställningar:**\n\n${personalizedSections.join('\n\n')}\n\n---\n\n` : '\n\n';
    return {
      id: 'welcome',
      content: `# 🏠 Hej! Jag är din personliga AI-Fastighetrådgivare\n\n**Jag använder GPT-5 och Real-time data från svenska myndigheter för att ge dig skräddarsydd rådgivning.**${personalizedIntro}## 🚀 **Mina förmågor:**\n\n### 📊 **Aktuell Data & Statistik:**\n- **🏫 Skolverket** - Senaste skolresultat, betyg och ranking\n- **👮‍♂️ Polisen & BRÅ** - Aktuell brottsstatistik och trygghetsmätningar\n- **🏛️ SCB & Kommuner** - Befolkning, ekonomi och kommunal service\n- **📈 Mäklarstatistik** - Slutpriser och marknadstrender\n- **📋 Lantmäteriet** - Officiella fastighetsvärden\n\n### 💡 **Personaliserad AI-Analys:**\n- **🔮 Skräddarsydda prognoser** baserat på dina preferenser\n- **💰 Investeringsråd** anpassat till din budget och mål\n- **🔨 Renoveringsrekommendationer** med ROI-kalkyler\n- **📍 Områdesjämförelser** fokuserat på dina intresseområden\n\n### 📄 **Dokumentgenerering:**\n- **Skapa professionella rapporter** i PDF- eller Word-format\n- **Komplett källdokumentation** för alla upplysningar\n- **Nedladdningsbara analyser** för dina fastighetsärenden\n\n---\n\n**Fråga mig om allt inom fastigheter!** Jag ger dig personliga råd baserat på Sveriges mest avancerade AI-teknik.\n\n*Vad kan jag hjälpa dig med idag?*`,
      role: 'assistant',
      timestamp: new Date(),
      isPersonalized: personalizedSections.length > 0
    };
  };

  // Load chat sessions on mount and when preferences change
  useEffect(() => {
    if (user) {
      loadChatSessions();
    } else {
      // If not logged in, show welcome message
      setMessages([getPersonalizedWelcomeMessage({})]);
      setIsLoadingSessions(false);
    }
  }, [user, preferences]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    // Use setTimeout to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Also scroll when loading starts/stops
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  const loadChatSessions = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('chat_sessions').select('*').eq('user_id', user.id).order('updated_at', {
        ascending: false
      });
      if (error) throw error;
      setChatSessions(data || []);

      // Load the most recent session or create a new one
      if (data && data.length > 0) {
        const latestSession = data[0];
        setCurrentSessionId(latestSession.id);
        // Convert Json to Message[] with date conversion
        const sessionMessages = Array.isArray(latestSession.session_data) ? latestSession.session_data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) : [getPersonalizedWelcomeMessage(preferences)];
        setMessages(sessionMessages);
      } else {
        // Create first session
        await createNewSession();
      }
    } catch (error: any) {
      console.error('Error loading chat sessions:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda tidigare konversationer.",
        variant: "destructive"
      });
      setMessages([getPersonalizedWelcomeMessage(preferences)]);
    } finally {
      setIsLoadingSessions(false);
    }
  };
  const createNewSession = async () => {
    if (!user) return;
    try {
      const welcomeMessage = getPersonalizedWelcomeMessage(preferences);
      // Convert messages to plain objects for JSON storage
      const sessionData = [welcomeMessage].map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
      const {
        data,
        error
      } = await supabase.from('chat_sessions').insert([{
        user_id: user.id,
        session_data: sessionData
      }]).select().single();
      if (error) throw error;
      setCurrentSessionId(data.id);
      setMessages([welcomeMessage]);
      setChatSessions(prev => [data, ...prev]);
      toast({
        title: "Ny konversation",
        description: "En ny chat-session har skapats."
      });
    } catch (error: any) {
      console.error('Error creating new session:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skapa ny session.",
        variant: "destructive"
      });
    }
  };
  const loadSession = async (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      // Convert Json to Message[] with date conversion
      const sessionMessages = Array.isArray(session.session_data) ? session.session_data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })) : [getPersonalizedWelcomeMessage(preferences)];
      setMessages(sessionMessages);
    }
  };
  const saveSession = async (updatedMessages: Message[]) => {
    if (!user || !currentSessionId) return;
    try {
      // Convert messages to plain objects for JSON storage
      const sessionData = updatedMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
      const {
        error
      } = await supabase.from('chat_sessions').update({
        session_data: sessionData,
        updated_at: new Date().toISOString()
      }).eq('id', currentSessionId);
      if (error) throw error;

      // Update local state
      setChatSessions(prev => prev.map(session => session.id === currentSessionId ? {
        ...session,
        session_data: sessionData,
        updated_at: new Date().toISOString()
      } : session));
    } catch (error: any) {
      console.error('Error saving session:', error);
    }
  };
  const sendMessage = async (messageText: string, category?: string) => {
    if (!messageText.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
      category
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    // Create assistant message placeholder for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date()
    };
    const messagesWithAssistant = [...updatedMessages, assistantMessage];
    setMessages(messagesWithAssistant);
    try {
      // Try streaming first - get auth token if user is logged in
      const {
        data: sessionData
      } = await supabase.auth.getSession();
      const authToken = sessionData.session?.access_token;
      const response = await fetch(`https://evgzebvzrihsqfqhmwxo.functions.supabase.co/ai-property-advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: messageText,
          context: messages.slice(-5),
          stream: true,
          userPreferences: preferences
        })
      });
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream available');
        const decoder = new TextDecoder();
        let accumulatedContent = '';
        let metadata: any = null;
        while (true) {
          const {
            done,
            value
          } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content') {
                  accumulatedContent += parsed.content;
                  // Update the assistant message with streaming content
                  setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? {
                    ...msg,
                    content: accumulatedContent
                  } : msg));
                } else if (parsed.type === 'metadata') {
                  metadata = parsed.metadata;
                } else if (parsed.type === 'error') {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        }

        // Finalize the message with metadata
        const finalAssistantMessage: Message = {
          id: assistantMessageId,
          content: accumulatedContent,
          role: 'assistant',
          timestamp: new Date(),
          followUpQuestions: metadata?.followUpQuestions || []
        };
        const finalMessages = [...updatedMessages, finalAssistantMessage];
        setMessages(finalMessages);
        // Only save session if user is logged in
        if (user) {
          await saveSession(finalMessages);
        }

        // Show metadata toasts
        if (metadata?.realTimeDataUsed) {
          toast({
            title: "✅ Aktuell information hämtad",
            description: "Svaret baseras på färsk data från Skolverket, kommuner, polisen och andra officiella källor.",
            duration: 4000
          });
        }
        if (metadata?.fallbackMode) {
          toast({
            title: "📊 Databas-läge aktivt",
            description: "Vissa källor var otillgängliga. Rekommenderar att kontrollera senaste data direkt hos myndigheter.",
            duration: 3000
          });
        }
      } else {
        // Handle non-streaming response as fallback
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }
        const assistantResponse: Message = {
          id: assistantMessageId,
          content: data.content,
          role: 'assistant',
          timestamp: new Date(),
          followUpQuestions: data.metadata?.followUpQuestions || []
        };
        const finalMessages = [...updatedMessages, assistantResponse];
        setMessages(finalMessages);
        // Only save session if user is logged in
        if (user) {
          await saveSession(finalMessages);
        }
        if (data.metadata?.realTimeDataUsed) {
          toast({
            title: "✅ Aktuell information hämtad",
            description: "Svaret baseras på färsk data från Skolverket, kommuner, polisen och andra officiella källor.",
            duration: 4000
          });
        }
        if (data.metadata?.fallbackMode) {
          toast({
            title: "📊 Databas-läge aktivt",
            description: "Vissa källor var otillgängliga. Rekommenderar att kontrollera senaste data direkt hos myndigheter.",
            duration: 3000
          });
        }
      }
    } catch (error: any) {
      console.error('AI advisor error:', error);

      // Check for rate limit error
      if (error.message?.includes('Rate limit') || error.message?.includes('429')) {
        toast({
          title: "Rate limit nådd",
          description: "Du har skickat för många förfrågningar. Vänta några minuter innan du försöker igen.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Fel vid AI-rådgivning",
          description: error.message || "Kunde inte få svar från AI-rådgivaren. Försök igen.",
          variant: "destructive"
        });
      }

      // Replace the assistant message with error message
      const errorMessages = messagesWithAssistant.map(msg => msg.id === assistantMessageId ? {
        ...msg,
        content: 'Ursäkta, jag kunde inte besvara din fråga just nu. Försök igen eller kontakta support om problemet kvarstår.'
      } : msg);
      setMessages(errorMessages);
      // Only save session if user is logged in
      if (user) {
        await saveSession(errorMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };
  const handleQuickQuestion = (question: string, category?: string) => {
    sendMessage(question, category);
  };
  const rateMessage = async (messageId: string, rating: number) => {
    setMessages(prev => prev.map(msg => msg.id === messageId ? {
      ...msg,
      rating
    } : msg));

    // Save rating to current session
    await saveSession(messages.map(msg => msg.id === messageId ? {
      ...msg,
      rating
    } : msg));
    toast({
      title: rating >= 4 ? "Tack för positiv feedback!" : "Tack för din feedback!",
      description: rating >= 4 ? "Vi är glada att svaret var hjälpsamt." : "Vi arbetar ständigt för att förbättra våra svar."
    });
  };
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Kopierat!",
        description: "Meddelandet har kopierats till urklipp."
      });
    } catch (error) {
      toast({
        title: "Kunde inte kopiera",
        description: "Det gick inte att kopiera meddelandet.",
        variant: "destructive"
      });
    }
  };
  const reactToMessage = async (messageId: string, reaction: 'thumbsUp' | 'thumbsDown' | 'heart') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.reactions || {
          thumbsUp: 0,
          thumbsDown: 0,
          heart: 0,
          userReaction: null
        };

        // Remove previous reaction if exists
        if (currentReactions.userReaction) {
          currentReactions[currentReactions.userReaction]--;
        }

        // Add new reaction or remove if same
        if (currentReactions.userReaction === reaction) {
          currentReactions.userReaction = null;
        } else {
          currentReactions[reaction]++;
          currentReactions.userReaction = reaction;
        }
        return {
          ...msg,
          reactions: currentReactions
        };
      }
      return msg;
    }));

    // Save reactions to current session
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const currentReactions = msg.reactions || {
          thumbsUp: 0,
          thumbsDown: 0,
          heart: 0,
          userReaction: null
        };
        if (currentReactions.userReaction) {
          currentReactions[currentReactions.userReaction]--;
        }
        if (currentReactions.userReaction === reaction) {
          currentReactions.userReaction = null;
        } else {
          currentReactions[reaction]++;
          currentReactions.userReaction = reaction;
        }
        return {
          ...msg,
          reactions: currentReactions
        };
      }
      return msg;
    });
    await saveSession(updatedMessages);
    const reactionEmojis = {
      thumbsUp: '👍',
      thumbsDown: '👎',
      heart: '❤️'
    };
    toast({
      title: `${reactionEmojis[reaction]} Reaktion sparad!`,
      description: "Din reaktion hjälper oss förbättra AI:n."
    });
  };
  const generateDocument = async (messageContent: string, title: string, type: 'pdf' | 'docx') => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('ai-document-generator', {
        body: {
          title,
          content: messageContent,
          type,
          area: extractAreaFromMessage(messageContent),
          category: extractCategoryFromMessage(messageContent)
        }
      });
      if (error) throw error;

      // Create download link
      const blob = new Blob([data], {
        type: type === 'pdf' ? 'text/html' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9åäöÅÄÖ\s-]/g, '').replace(/\s+/g, '-')}.${type === 'pdf' ? 'html' : 'docx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Dokument genererat",
        description: `${type.toUpperCase()}-dokument har laddats ned.`
      });
    } catch (error) {
      console.error('Document generation error:', error);
      toast({
        title: "Fel",
        description: "Kunde inte generera dokument. Försök igen.",
        variant: "destructive"
      });
    }
  };
  const extractAreaFromMessage = (content: string): string => {
    const areas = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Sundsvall', 'Täby', 'Danderyd', 'Nacka', 'Solna', 'Lidingö'];
    for (const area of areas) {
      if (content.toLowerCase().includes(area.toLowerCase())) {
        return area;
      }
    }
    return 'Sverige';
  };
  const extractCategoryFromMessage = (content: string): string => {
    const keywords = {
      'Marknadanalys': ['marknad', 'trend', 'utveckling', 'prognos'],
      'Områdesanalys': ['område', 'stadsdel', 'kommun', 'skola', 'transport'],
      'Investeringsanalys': ['investering', 'avkastning', 'kapital', 'risk'],
      'Prisanalys': ['pris', 'kostnad', 'värde', 'budget']
    };
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => content.toLowerCase().includes(word))) {
        return category;
      }
    }
    return 'Allmän fastighetsinformation';
  };
  const getPersonalizedQuickQuestions = () => {
    const personalizedQuestions = [...quickQuestions];

    // Add personalized questions based on user preferences
    if (preferences.interestedAreas.length > 0) {
      personalizedQuestions.unshift({
        icon: MapPin,
        text: `Vad kostar det att köpa en lägenhet i ${preferences.interestedAreas[0]} just nu?`,
        category: "personalized-prices"
      });
    }
    if (preferences.budgetRange.min || preferences.budgetRange.max) {
      const budget = preferences.budgetRange.max || 5000000;
      personalizedQuestions.unshift({
        icon: Calculator,
        text: `Vad kan jag få för ${(budget / 1000000).toFixed(1)} miljoner kr?`,
        category: "personalized-budget"
      });
    }
    if (preferences.preferredPropertyTypes.length > 0) {
      personalizedQuestions.unshift({
        icon: Home,
        text: `Visa mig de bästa områdena för ${preferences.preferredPropertyTypes[0].toLowerCase()}`,
        category: "personalized-type"
      });
    }
    return personalizedQuestions.slice(0, 8); // Limit to 8 questions
  };
  if (isLoadingSessions) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="w-full mx-auto px-2">
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'chat' | 'settings')}>
        <TabsList className="mb-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Rådgivare
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Inställningar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className={`grid grid-cols-1 gap-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:grid-cols-1' : 'lg:grid-cols-4'}`}>
            {/* Chat Sessions Sidebar */}
            {!sidebarCollapsed && <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Konversationer</CardTitle>
                    <Button onClick={createNewSession} size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {chatSessions.map(session => <Button key={session.id} onClick={() => loadSession(session.id)} variant={currentSessionId === session.id ? "default" : "ghost"} className="w-full justify-start h-auto p-2 text-left">
                          <div className="flex items-center gap-2 truncate">
                            <History className="h-3 w-3 flex-shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-medium truncate">
                                {new Date(session.created_at).toLocaleDateString('sv-SE')}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {new Date(session.created_at).toLocaleTimeString('sv-SE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                              </div>
                            </div>
                          </div>
                        </Button>)}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Questions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Snabbfrågor
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-80">
                    <div className="space-y-2">
                      {getPersonalizedQuickQuestions().map((question, index) => <Button key={index} onClick={() => handleQuickQuestion(question.text, question.category)} variant="ghost" className="w-full justify-start h-auto p-2 text-left text-xs" disabled={isLoading}>
                          <div className="flex items-start gap-2">
                            <question.icon className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                            <span className="truncate">{question.text}</span>
                            {question.category?.startsWith('personalized') && <Star className="h-3 w-3 text-accent-gold" />}
                          </div>
                        </Button>)}
                    </div>
                  </ScrollArea>
                </CardContent>
                </Card>
              </div>}

            {/* Main Chat Area */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-shrink-0 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="h-8 w-8 p-0">
                        {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                      </Button>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        AI Fastighetrådgivare
                        
                       </CardTitle>
                    </div>
                    {user && preferences.interestedAreas.length > 0 && <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Personaliserad
                      </Badge>}
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden pt-0">
                  <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    {messages.length === 0 ? <ConversationStarter onSelectStarter={handleQuickQuestion} /> : <div className="space-y-4">
                        {messages.map(message => <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {message.role === 'assistant' && <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>}
                          
                          <div className={`flex-1 max-w-[85%] group ${message.role === 'user' ? 'order-first' : ''}`}>
                            <div className={`rounded-lg p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'}`}>
                              {message.role === 'assistant' ? <>
                                  <div className="prose prose-sm max-w-none dark:prose-invert 
                                    prose-headings:text-foreground prose-headings:mb-3 prose-headings:mt-4 prose-headings:font-semibold
                                    prose-h1:text-xl prose-h1:border-b prose-h1:border-border prose-h1:pb-2
                                    prose-h2:text-lg prose-h2:text-primary prose-h2:mb-4 prose-h2:mt-6
                                    prose-h3:text-base prose-h3:text-foreground prose-h3:mb-3 prose-h3:mt-4
                                    prose-h4:text-sm prose-h4:text-muted-foreground prose-h4:mb-2 prose-h4:mt-3
                                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                                    prose-strong:text-foreground prose-strong:font-semibold prose-strong:bg-accent/20 prose-strong:px-1 prose-strong:rounded
                                    prose-ul:text-muted-foreground prose-ul:ml-6 prose-ul:mb-4 prose-ul:space-y-1
                                    prose-ol:text-muted-foreground prose-ol:ml-6 prose-ol:mb-4 prose-ol:space-y-1
                                    prose-li:mb-1 prose-li:leading-relaxed prose-li:pl-1
                                    prose-li:marker:text-primary
                                    prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary prose-blockquote:border-l-4 
                                    prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:rounded-r prose-blockquote:my-4
                                    prose-code:text-primary prose-code:bg-accent prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-xs
                                    prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border
                                    prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-primary/80
                                    prose-table:text-sm prose-table:border prose-table:border-border prose-table:rounded
                                    prose-th:text-foreground prose-th:bg-muted prose-th:font-semibold prose-th:p-3 
                                    prose-td:text-muted-foreground prose-td:p-3 prose-td:border-t prose-td:border-border
                                    prose-hr:border-border prose-hr:my-6">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {message.content}
                                    </ReactMarkdown>
                                  </div>
                                  <MessageSummary message={message} onQuickQuestion={handleQuickQuestion} />
                                </> : <p className="text-sm">{message.content}</p>}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {message.timestamp.toLocaleTimeString('sv-SE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                                {message.isPersonalized && <Badge variant="outline" className="text-xs h-4 px-1">
                                    <Star className="h-2 w-2 mr-1" />
                                    Personlig
                                  </Badge>}
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Copy button */}
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyMessage(message.content)}>
                                  <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </Button>

                                {/* Emoji reactions for assistant messages */}
                                {message.role === 'assistant' && <div className="flex items-center gap-1">
                                    <Button size="sm" variant="ghost" className={`h-6 w-6 p-0 transition-colors ${message.reactions?.userReaction === 'thumbsUp' ? 'text-green-600 bg-green-100 dark:bg-green-900' : 'text-muted-foreground hover:text-green-600'}`} onClick={() => reactToMessage(message.id, 'thumbsUp')}>
                                      <ThumbsUp className="h-3 w-3" />
                                      {message.reactions?.thumbsUp > 0 && <span className="ml-1 text-xs">{message.reactions.thumbsUp}</span>}
                                    </Button>
                                    
                                    <Button size="sm" variant="ghost" className={`h-6 w-6 p-0 transition-colors ${message.reactions?.userReaction === 'heart' ? 'text-red-600 bg-red-100 dark:bg-red-900' : 'text-muted-foreground hover:text-red-600'}`} onClick={() => reactToMessage(message.id, 'heart')}>
                                      <Heart className="h-3 w-3" />
                                      {message.reactions?.heart > 0 && <span className="ml-1 text-xs">{message.reactions.heart}</span>}
                                    </Button>

                                    <Button size="sm" variant="ghost" className={`h-6 w-6 p-0 transition-colors ${message.reactions?.userReaction === 'thumbsDown' ? 'text-orange-600 bg-orange-100 dark:bg-orange-900' : 'text-muted-foreground hover:text-orange-600'}`} onClick={() => reactToMessage(message.id, 'thumbsDown')}>
                                      <ThumbsDown className="h-3 w-3" />
                                      {message.reactions?.thumbsDown > 0 && <span className="ml-1 text-xs">{message.reactions.thumbsDown}</span>}
                                    </Button>
                                  </div>}

                                {/* Star rating for assistant messages */}
                                {message.role === 'assistant' && message.content.length > 100 && <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {[1, 2, 3, 4, 5].map(rating => <Button key={rating} size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => rateMessage(message.id, rating)}>
                                        <Star className={`h-3 w-3 ${message.rating && message.rating >= rating ? 'text-accent-gold fill-current' : 'text-muted-foreground'}`} />
                                      </Button>)}
                                  </div>}
                              </div>
                            </div>

                            {/* Follow-up questions */}
                            {message.followUpQuestions && message.followUpQuestions.length > 0 && <div className="mt-3 space-y-2">
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  Uppföljningsfrågor:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {message.followUpQuestions.map((question, index) => <Button key={index} size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleQuickQuestion(question, 'followup')} disabled={isLoading}>
                                      {question}
                                    </Button>)}
                                </div>
                              </div>}
                          </div>

                          {message.role === 'user' && <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-secondary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>}
                        </div>)}

                        {isLoading && <TypingIndicator />}
                      </div>}
                  </ScrollArea>
                </CardContent>

                {/* Input */}
                <div className="flex-shrink-0 p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder="Ställ din fastighetsfråga här..." disabled={isLoading} className="flex-1" />
                    <Button type="submit" disabled={isLoading} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  {!user && <div className="mt-2 text-xs text-muted-foreground text-center">
                      💡 Logga in för att spara din chatthistorik och få personliga rekommendationer
                    </div>}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <PersonalizationPanel />
        </TabsContent>
      </Tabs>
    </div>;
}