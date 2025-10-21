"use client"

import { BotIcon, Building2Icon, Calculator, ChartColumnIcon, ChevronLeft, ChevronRight, HouseIcon, SparklesIcon, UserCheckIcon, XIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation"
import { Message, MessageAvatar, MessageContent } from "@/components/ai-elements/message"
import { PromptInput, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { useState } from "react"
import Link from "next/link"

const quickQuestions = [
  {
    icon: <ChartColumnIcon />,
    question: "Marknadsutsikter 2026?"
  },
  {
    icon: <HouseIcon />,
    question: "Områden för familjer?"
  },
  {
    icon: <Calculator />,
    question: "Lånemöjligheter?"
  },
  {
    icon: <Building2Icon />,
    question: "Priser i Göteborg?"
  },
  {
    icon: <UserCheckIcon />,
    question: "Mäklare i området"
  }
]

const ChatSidebar = () => {
  const { open, toggleSidebar } = useSidebar()

  const [hideQuickQuestions, setHideQuickQuestions] = useState<boolean>(false)
  
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
                    <h3 className="text-lg text-foreground font-semibold">AI-Rådgivare</h3>
                    <div className="text-xs text-muted-foreground">Powered by advanced AI</div>
                  </div>
                </div>  

                <div className="inline-flex gap-1 items-center text-xs text-primary font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to primary/10 border border-primary/20">
                  <SparklesIcon size={12} /> 
                  GPT-4
                </div>
              </div>  

              <button className="sm:hidden absolute right-1.5 top-1.5" onClick={toggleSidebar}>
                <XIcon size={16} />
              </button>
            </SidebarGroupLabel>
            <SidebarGroupContent className={`${open ? "flex flex-col flex-1" : "flex flex-col flex-1 sm:hidden"}`}>
              {!hideQuickQuestions && (
                <div className="px-6 pb-6 mt-1">
                  <div className="text-xs text-muted-foreground font-medium mb-4">Snabbfrågor</div>
                  <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-2">
                    {quickQuestions.map((item, index) => (
                      <Button key={`quick-question-${index}`} variant="outline" className="w-full text-xs py-4 sm:py-6 lg:py-4 xl:py-6 px-2.5 sm:px-4 lg:px-2.5 xl:px-4 bg-card/20 hover:text-primary-foreground items-center flex justify-start shadow-xs" onClick={() => setHideQuickQuestions(true)}>
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
              

              <div className="flex-1 px-2 border-t border-neutral-200">
                 <Conversation className="relative w-full">
                    <ConversationContent className="py-2">
                      <Message from="assistant" className="items-start">
                        <MessageContent className="group-[.is-assistant]:bg-muted">Hej! Jag är din AI-fastighetrådgivare. Vad kan jag hjälpa dig med?</MessageContent>
                        <MessageAvatar name="AI Assistant" src={"https://github.com/openai.png"} />
                      </Message>
                    </ConversationContent>
                  </Conversation>
              </div>
              
              <div className="px-6 pt-4 pb-1.5 border-t border-neutral-200">
                <PromptInput className="relative w-full mb-2.5" onSubmit={() => {}}>
                  <PromptInputTextarea className="pr-12 text-sm" placeholder="Skriv ditt meddelande här..." />
                  <PromptInputSubmit className="absolute bottom-1 right-1 cursor-pointer" />
                </PromptInput>

                <div className="text-xs text-center text-muted-foreground">
                  <Link href="/login" className="text-primary font-medium hover:opacity-80 hover:underline underline-offset-4">Logga in</Link> 
                  {` för att spara din chatthistorik`}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className={`${open ? "hidden" : "hidden sm:inline-flex"} ml-1 sticky top-1/2 -translate-y-0.5 z-40 bg-muted bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full p-2.5 ring-2 ring-primary/20`}>
        <BotIcon size={20} />
      </div>

      {/* Toggle button for medium - large screens */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="hidden sm:block sticky top-1/2 left-full -mr-5 z-40 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary-light shadow-lg cursor-pointer opacity-90"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Toggle button for small screens */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="block sm:hidden fixed top-1/2 z-40 bg-primary -ml-2 text-primary-foreground rounded-e-full py-2 pl-2 pr-1 hover:bg-primary-light shadow-lg cursor-pointer"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  )
}

export default ChatSidebar