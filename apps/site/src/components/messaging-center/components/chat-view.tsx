"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMessages } from "../hooks";
import type { ConversationWithDetails } from "../types";
import { ChatHeader } from "./chat-header";
import { EmptyState } from "./empty-state";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

interface UserInfo {
  id: string;
  name?: string | null;
  email: string;
}

interface ChatViewProps {
  conversation: ConversationWithDetails | null;
  user: UserInfo;
  onBack?: () => void;
  showBackButton?: boolean;
  onMessageSent?: () => void;
  className?: string;
}

export const ChatView = memo(function ChatView({
  conversation,
  user,
  onBack,
  showBackButton = false,
  onMessageSent,
  className,
}: ChatViewProps) {
  const { messages, sendingMessage, sendMessage } = useMessages(
    conversation?.id ?? null,
    user,
  );

  const handleSendMessage = async (content: string) => {
    const success = await sendMessage(content);
    if (success) {
      onMessageSent?.();
    }
    return success;
  };

  if (!conversation) {
    return (
      <Card className={className}>
        <CardContent className="flex-1 flex items-center justify-center h-full">
          <EmptyState
            title="Välj en konversation"
            description="Välj en konversation från listan för att börja chatta"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <ChatHeader
        conversation={conversation}
        currentUserId={user.id}
        onBack={onBack}
        showBackButton={showBackButton}
      />

      <MessageList messages={messages} currentUserId={user.id} />

      <MessageInput onSend={handleSendMessage} sending={sendingMessage} />
    </Card>
  );
});
