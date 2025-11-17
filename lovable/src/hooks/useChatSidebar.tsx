import { createContext, type ReactNode, useContext, useState } from "react";

interface ChatSidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(
  undefined,
);

export function ChatSidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <ChatSidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </ChatSidebarContext.Provider>
  );
}

export function useChatSidebar() {
  const context = useContext(ChatSidebarContext);
  if (context === undefined) {
    throw new Error("useChatSidebar must be used within a ChatSidebarProvider");
  }
  return context;
}
