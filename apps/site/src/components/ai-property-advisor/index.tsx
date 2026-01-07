"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Send,
  TrendingUp,
  MapPin,
  Calculator,
  School,
  Shield,
  Loader2,
  Home,
  DollarSign,
  BarChart3,
  Sparkles,
  MessageSquare,
  Settings,
  Plus,
  History,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import ReactMarkdown from "react-markdown";
import { PersonalizationPanel } from "./personalization-panel";
import { useIsMobile } from "@/hooks/use-mobile";

const quickQuestions = [
  {
    icon: TrendingUp,
    text: "Gör en djup marknadsanalys för Stockholm med prognoser för 2025",
    category: "marknad",
  },
  {
    icon: MapPin,
    text: "Jämför och analysera de bästa familjområdena i Stockholm med skolor, trygghet och framtidspotential",
    category: "områden",
  },
  {
    icon: Calculator,
    text: "Beräkna min lånekapacitet och ge strategier för optimal finansiering med 50 000 kr månadsintäkt",
    category: "lån",
  },
  {
    icon: School,
    text: "Analysera skolkvalitet och dess påverkan på fastighetspriser i Danderyd vs Nacka",
    category: "skolor",
  },
  {
    icon: DollarSign,
    text: "Detaljerad prisanalys för 3:or i Göteborg - historik, nuläge och framtid",
    category: "priser",
  },
  {
    icon: Shield,
    text: "Trygghetsutveckling i Malmö: områdesanalys med investeringsperspektiv",
    category: "säkerhet",
  },
  {
    icon: BarChart3,
    text: "Vilka fastighetstyper har bäst avkastningspotential de kommande åren?",
    category: "investering",
  },
  {
    icon: Home,
    text: "Analysera för- och nackdelar med att köpa nyproduktion vs befintlig bostad 2025",
    category: "kommunservice",
  },
];

export function AIPropertyAdvisor() {
  const { messages, sendMessage, status } = useChat({
    api: "/api/ai/chat",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const isMobile = useIsMobile();

  const handleQuickQuestion = (question: string) => {
    sendMessage({ content: question });
    setSelectedQuestion(""); // Reset select after sending
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chat" className="space-y-6">
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

        <TabsContent value="chat" className="space-y-6">
          <div
            className={`grid grid-cols-1 gap-6 transition-all duration-300 ${sidebarCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-4"
              }`}
          >
            {/* Sidebar */}
            {!sidebarCollapsed && (
              <div className="lg:col-span-1 space-y-4">
                {/* Mobile: Snabbfrågor Dropdown (first) */}
                {isMobile && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Snabbfrågor
                    </label>
                    <Select
                      value={selectedQuestion}
                      onValueChange={(value) => {
                        setSelectedQuestion(value);
                        handleQuickQuestion(value);
                      }}
                      disabled={status === "submitted" || status === "streaming"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Välj en snabbstartfråga..." />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        align="start"
                        sideOffset={4}
                        className="max-w-[calc(100vw-2rem)] w-[var(--radix-select-trigger-width)]"
                      >
                        {quickQuestions.map((q, index) => {
                          const Icon = q.icon;
                          return (
                            <SelectItem key={index} value={q.text}>
                              <div className="flex items-start gap-2 w-full">
                                <Icon className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                                <span className="line-clamp-2 text-left break-words">{q.text}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Konversationer Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Konversationer
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {/* Placeholder - will be populated with actual conversations */}
                        <div className="text-xs text-muted-foreground text-center py-8">
                          Inga konversationer ännu
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Desktop: Snabbfrågor Card (below Konversationer) */}
                {!isMobile && (
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
                          {quickQuestions.map((q, index) => {
                            const Icon = q.icon;
                            return (
                              <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start h-auto p-2 text-left text-xs"
                                onClick={() => handleQuickQuestion(q.text)}
                                disabled={
                                  status === "submitted" ||
                                  status === "streaming"
                                }
                              >
                                <div className="flex items-start gap-2">
                                  <Icon className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                                  <span className="truncate">{q.text}</span>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Main Chat Area */}
            <div
              className={`transition-all duration-300 ${sidebarCollapsed ? "lg:col-span-1" : "lg:col-span-3"
                }`}
            >
              <Card className="h-[600px] flex flex-col shadow-card">
                <CardHeader className="flex-shrink-0 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSidebarCollapsed(!sidebarCollapsed)
                        }
                        className="h-8 w-8 p-0"
                      >
                        {sidebarCollapsed ? (
                          <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                          <PanelLeftClose className="h-4 w-4" />
                        )}
                      </Button>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        AI Fastighetrådgivare
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden pt-0">
                  <Conversation className="h-full">
                    <ConversationContent>
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <div className="space-y-2">
                            <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">
                              Hej! Jag är din AI-fastighetsrådgivare. Ställ en fråga eller välj en snabbstartfråga nedan.
                            </p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <Message key={message.id} from={message.role}>
                            <MessageContent variant="contained">
                              {message.role === "user" ? (
                                <p>{message.content}</p>
                              ) : (
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                              )}
                            </MessageContent>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.role === "user" ? "DU" : "AI"}
                              </AvatarFallback>
                            </Avatar>
                          </Message>
                        ))
                      )}
                      {status === "submitted" || status === "streaming" ? (
                        <Message from="assistant">
                          <MessageContent variant="contained">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Skriver...</span>
                            </div>
                          </MessageContent>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        </Message>
                      ) : null}
                    </ConversationContent>
                  </Conversation>
                </CardContent>

                {/* Input area */}
                <div className="flex-shrink-0 p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      id="chat-input"
                      placeholder="Ställ din fastighetsfråga här..."
                      disabled={status === "submitted" || status === "streaming"}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            sendMessage({ content: input.value });
                            input.value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "chat-input",
                        ) as HTMLInputElement;
                        if (input?.value.trim()) {
                          sendMessage({ content: input.value });
                          input.value = "";
                        }
                      }}
                      disabled={status === "submitted" || status === "streaming"}
                      size="sm"
                    >
                      {status === "submitted" || status === "streaming" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <PersonalizationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

