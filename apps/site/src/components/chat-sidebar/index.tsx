"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  BotIcon,
  Building2Icon,
  Calculator,
  ChartColumnIcon,
  ChevronLeft,
  ChevronRight,
  HouseIcon,
  LoaderCircleIcon,
  SparklesIcon,
  UserCheckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

const quickQuestions = [
  {
    icon: <ChartColumnIcon />,
    question: "Marknadsutsikter 2026?",
  },
  {
    icon: <HouseIcon />,
    question: "Områden för familjer?",
  },
  {
    icon: <Calculator />,
    question: "Lånemöjligheter?",
  },
  {
    icon: <Building2Icon />,
    question: "Priser i Göteborg?",
  },
  {
    icon: <UserCheckIcon />,
    question: "Mäklare i området",
  },
];

const ChatSidebar = () => {
  const { open, toggleSidebar } = useSidebar();

  const [hideQuickQuestions, setHideQuickQuestions] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  });

  const handleSubmit = () => {
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div>
      <Sidebar collapsible="icon" className="border-r border-neutral-200">
        <SidebarContent className="flex flex-col h-full">
          <SidebarGroup className="px-0 pt-5 flex flex-col flex-1">
            <SidebarGroupLabel className="px-6 mb-6">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 text-primary-deep">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-sm opacity-50 animate-pulse" />
                    <BotIcon />
                  </div>
                  <div>
                    <h3 className="text-lg text-foreground font-semibold">
                      AI-Rådgivare
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      Powered by advanced AI
                    </div>
                  </div>
                </div>

                <div className="inline-flex gap-1 items-center text-xs text-primary font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to primary/10 border border-primary/20">
                  <SparklesIcon size={12} />
                  GPT-4
                </div>
              </div>

              <button
                type="button"
                className="sm:hidden absolute right-1.5 top-1.5"
                onClick={toggleSidebar}
              >
                <XIcon size={16} />
              </button>
            </SidebarGroupLabel>
            <SidebarGroupContent
              className={`${open ? "flex flex-col flex-1" : "flex flex-col flex-1 sm:hidden"}`}
            >
              {!hideQuickQuestions && (
                <div className="px-6 pb-6 mt-1">
                  <div className="text-xs text-muted-foreground font-medium mb-4">
                    Snabbfrågor
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-2">
                    {quickQuestions.map((item, index) => (
                      <Button
                        key={`quick-question-${index}`}
                        variant="outline"
                        className="w-full text-xs py-4 sm:py-6 lg:py-4 xl:py-6 px-2.5 sm:px-4 lg:px-2.5 xl:px-4 bg-card/20 hover:text-primary-foreground items-center flex justify-start shadow-xs"
                        onClick={() => setHideQuickQuestions(true)}
                      >
                        <div className="hidden sm:block lg:hidden xl:block rounded-md p-2 bg-primary/10 text-primary">
                          {item.icon}
                        </div>
                        <span className="line-clamp-1 truncate">
                          {item.question}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-[1_1_0] px-2 border-t border-neutral-200 overflow-y-auto">
                <Conversation className="relative w-full">
                  <ConversationContent className="py-2">
                    <Message from="assistant" className="items-start">
                      <MessageContent className="group-[.is-assistant]:bg-muted">
                        Hej! Jag är din AI-fastighetrådgivare. Vad kan jag
                        hjälpa dig med?
                      </MessageContent>
                      <MessageAvatar name="AI Assistant" src="/bot.svg" />
                    </Message>

                    {messages.map((message) => (
                      <Message
                        from={message.role}
                        key={message.id}
                        className="items-start"
                      >
                        <MessageContent className="group-[.is-assistant]:bg-muted">
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <div key={`response-${message.id}-${i}`}>
                                    <Response>{part.text}</Response>
                                  </div>
                                );
                              default:
                                return null;
                            }
                          })}
                        </MessageContent>
                        {message.role === "assistant" && (
                          <MessageAvatar name="AI Assistant" src="/bot.svg" />
                        )}
                      </Message>
                    ))}

                    {status === "submitted" && (
                      <Message from="assistant" className="items-start">
                        <MessageContent className="group-[.is-assistant]:bg-muted group-[.is-assistant]:text-muted-foreground flex flex-row items-center">
                          <LoaderCircleIcon className="animate-spin text-primary" />{" "}
                          AI tänker...
                        </MessageContent>
                        <MessageAvatar name="AI Assistant" src="/bot.svg" />
                      </Message>
                    )}

                    {status === "error" && (
                      <Message from="assistant" className="items-start">
                        <MessageContent className="group-[.is-assistant]:bg-muted">
                          Oj, något gick fel när jag försökte bearbeta din
                          begäran. Kan du försöka igen?
                        </MessageContent>
                        <MessageAvatar name="AI Assistant" src="/bot.svg" />
                      </Message>
                    )}
                  </ConversationContent>
                </Conversation>
              </div>

              <div className="px-6 pt-4 pb-1.5 border-t border-neutral-200">
                <PromptInput
                  className="relative w-full mb-2.5"
                  onSubmit={handleSubmit}
                >
                  <PromptInputTextarea
                    className="pr-12 text-sm"
                    placeholder="Skriv ditt meddelande här..."
                    onChange={(e) => setInput(e.currentTarget.value)}
                    value={input}
                  />
                  <PromptInputSubmit
                    className="absolute bottom-1 right-1 cursor-pointer"
                    disabled={
                      !input.trim() ||
                      status === "submitted" ||
                      status === "streaming"
                    }
                    status={status === "streaming" ? "streaming" : "ready"}
                  />
                </PromptInput>

                <div className="text-xs text-center text-muted-foreground">
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:opacity-80 hover:underline underline-offset-4"
                  >
                    Logga in
                  </Link>
                  {` för att spara din chatthistorik`}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div
        className={`${open ? "hidden" : "hidden sm:inline-flex"} ml-1 sticky top-1/2 -translate-y-0.5 z-40 bg-muted bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full p-2.5 ring-2 ring-primary/20`}
      >
        <span className="absolute inset-0 flex items-center justify-center -z-10">
          <span className="inline-flex h-2/3 w-2/3 rounded-full bg-primary opacity-60 animate-ping"></span>
        </span>
        <BotIcon size={20} />
      </div>

      {/* Toggle button for medium - large screens */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="hidden sm:block sticky top-1/2 left-full -mr-5 z-40 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary-light shadow-lg cursor-pointer opacity-90"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Toggle button for small screens */}
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="block sm:hidden fixed top-1/2 z-40 bg-primary -ml-2 text-primary-foreground rounded-e-full py-2 pl-2 pr-1 hover:bg-primary-light shadow-lg cursor-pointer"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default ChatSidebar;
