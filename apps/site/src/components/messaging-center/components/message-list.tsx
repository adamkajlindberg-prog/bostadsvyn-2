"use client";

import { memo } from "react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollToBottom } from "../hooks";
import type { MessageWithProfile } from "../types";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: MessageWithProfile[];
  currentUserId: string;
}

export const MessageList = memo(function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const { ref: messagesEndRef } = useScrollToBottom({
    trigger: messages.length,
  });

  return (
    <CardContent className="flex-1 p-0 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-3 sm:p-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </CardContent>
  );
});
