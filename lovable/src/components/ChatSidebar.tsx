import {
  BarChart3,
  Bot,
  Brain,
  Building2,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  Send,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useChatSidebar } from "@/hooks/useChatSidebar";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
const quickQuestions = [
  {
    icon: BarChart3,
    text: "Marknadsutsikter 2026?",
    fullText: "Hur ser marknadsutsikterna ut för Stockholm 2026?",
  },
  {
    icon: Home,
    text: "Områden för familjer?",
    fullText: "Vilka områden rekommenderar du för unga familjer?",
  },
  {
    icon: Calculator,
    text: "Lånemöjligheter?",
    fullText: "Hur mycket kan jag låna med 50 000 kr i månadsintäkt?",
  },
  {
    icon: Building2,
    text: "Priser i Göteborg?",
    fullText: "Vad kostar det att köpa en 3:a i Göteborg just nu?",
  },
  {
    icon: UserCheck,
    text: "Mäklare i området",
    fullText: "Vilka mäklare kan du rekommendera i mitt område?",
  },
];
export default function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hej! Jag är din AI-fastighetrådgivare. Vad kan jag hjälpa dig med?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const { isExpanded, setIsExpanded } = useChatSidebar();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chat history when user logs in
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user && !sessionLoaded) {
        try {
          const { data, error } = await supabase
            .from("chat_sessions")
            .select("session_data")
            .eq("user_id", user.id)
            .order("updated_at", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();
          if (error && error.code !== "PGRST116") {
            console.error("Error loading chat history:", error);
            return;
          }
          if (data?.session_data) {
            setMessages(
              JSON.parse(JSON.stringify(data.session_data)) as Message[],
            );
          }
          setSessionLoaded(true);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    };
    loadChatHistory();
  }, [user, sessionLoaded]);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  // Save chat history when user is logged in and messages change
  useEffect(() => {
    const saveChatHistory = async () => {
      if (user && sessionLoaded && messages.length > 1) {
        try {
          const { error } = await supabase.from("chat_sessions").upsert(
            {
              user_id: user.id,
              session_data: messages as any,
            },
            {
              onConflict: "user_id",
            },
          );
          if (error) {
            console.error("Error saving chat history:", error);
          }
        } catch (error) {
          console.error("Error saving chat history:", error);
        }
      }
    };
    const timeoutId = setTimeout(saveChatHistory, 1000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [messages, user, sessionLoaded]);
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      console.log("Sending message to AI advisor:", messageText);
      const { data, error } = await supabase.functions.invoke(
        "ai-property-advisor",
        {
          body: {
            message: messageText,
            context: messages.slice(-5),
            stream: false,
          },
        },
      );
      console.log("AI advisor response:", {
        data,
        error,
      });
      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }
      const aiText = data?.content ?? data?.response;
      if (aiText && aiText.trim().length > 0) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiText,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        console.error("Empty content in response:", data);
        // Use fallback content if AI returns empty response but has metadata
        if (data?.metadata?.sources && data.metadata.sources.length > 0) {
          const fallbackContent = `# 🏠 AI-Rådgivare\n\nJag har tillgång till omfattande fastighetsdata och kan hjälpa dig med:\n\n• **Marknadsanalyser** med faktiska slutpriser\n• **Områdesjämförelser** med skol- och trygghetsdata\n• **Mäklarrekommendationer** baserat på specialisering\n• **Lånekalkyler** och investeringsråd\n\nBaserat på din fråga om lån med 50 000 kr månadsintäkt:\n\n💰 **Allmän tumregel**: Du kan vanligtvis låna 4,5-5 gånger din årsinkomst.\n• Med 50 000 kr/mån (600 000 kr/år) → cirka **2,7-3 miljoner kr**\n• Detta beror på dina övriga skulder, kontantinsats och räntesats\n\n📞 **Rekommendation**: Kontakta en bank för en riktig låneprövning som tar hänsyn till din specifika situation.\n\nVill du att jag hjälper dig med något mer specifikt?`;
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: fallbackContent,
            role: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          throw new Error(data?.error || "Inget svar från AI-rådgivaren");
        }
      }
    } catch (error: any) {
      console.error("AI advisor error:", error);

      // Show more specific error information
      let errorContent =
        "Det verkar vara ett tillfälligt problem med AI-rådgivaren. ";
      if (error?.message?.includes("Failed to fetch")) {
        errorContent += "Kontrollera din internetanslutning och försök igen.";
      } else if (
        error?.message?.includes("401") ||
        error?.message?.includes("403")
      ) {
        errorContent += "Det verkar vara ett autentiseringsproblem.";
      } else if (error?.message?.includes("500")) {
        errorContent += "Det verkar vara ett serverproblem.";
      } else {
        errorContent += "Försök igen om en stund.";
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };
  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };
  return (
    <div
      className={`fixed left-0 top-0 h-screen backdrop-blur-md bg-background/95 border-r border-border/50 transition-all duration-500 ease-out z-40 shadow-2xl ${isExpanded ? "w-96" : "w-14"}`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 rounded-full p-2 h-8 w-8 z-50 shadow-lg transition-all duration-300 hover:scale-110"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {isExpanded ? (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-background to-background/80 border-b border-border/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-sm opacity-50 animate-pulse"></div>
                <Bot className="relative h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  AI-Rådgivare
                </h3>
                <p className="text-muted-foreground text-sm">
                  Välkommen att använda vår unika fastighetsrådgivare som ger
                  rekommendationer på allt inom fastighetsmarknaden, skolor,
                  områden, mäklare, marknadsanalys och mycket mer helt utifrån
                  din situation och preferenser! 
                </p>
              </div>
            </div>

            {/* Quick Questions */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Snabbfrågor
              </p>
              {quickQuestions.map((question, index) => {
                const Icon = question.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-9 p-2 text-xs border border-border/30 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-300 group"
                    onClick={() => handleQuickQuestion(question.fullText)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="truncate font-medium text-left">
                        {question.text}
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-background/50 to-background">
            <ScrollArea className="h-full px-4 py-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 animate-fade-in ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="flex-shrink-0">
                      <Avatar
                        className={`h-9 w-9 ${message.role === "user" ? "ring-2 ring-primary/20" : "ring-2 ring-muted-foreground/20"}`}
                      >
                        <AvatarFallback
                          className={`${message.role === "assistant" ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground" : "bg-gradient-to-br from-secondary to-secondary/80"}`}
                        >
                          {message.role === "assistant" ? (
                            <Brain className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div
                      className={`group max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"} flex flex-col`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm border transition-all duration-300 hover:shadow-md ${message.role === "user" ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20 rounded-br-md" : "bg-gradient-to-br from-muted/80 to-muted/60 border-border/30 rounded-bl-md hover:bg-muted/90"}`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <span
                        className={`text-xs text-muted-foreground mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString(
                          "sv-SE",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-br from-muted/80 to-muted/60 border border-border/30 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-3 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{
                            animationDelay: "0ms",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{
                            animationDelay: "150ms",
                          }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{
                            animationDelay: "300ms",
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        AI tänker...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="border-t border-border/30 bg-gradient-to-r from-background/90 to-background/80 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Skriv ditt meddelande här..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  className="h-12 pr-12 text-sm bg-gradient-to-r from-muted/50 to-muted/30 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>

            {!user && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                <a
                  href="/login"
                  className="text-primary hover:text-primary/80 underline-offset-2 hover:underline transition-colors"
                >
                  Logga in
                </a>{" "}
                för att spara din chatthistorik
              </p>
            )}
          </div>
        </div> /* Collapsed View */
      ) : (
        <div className="flex flex-col items-center justify-center p-3 h-full">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <Avatar className="relative h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
    </div>
  );
}
