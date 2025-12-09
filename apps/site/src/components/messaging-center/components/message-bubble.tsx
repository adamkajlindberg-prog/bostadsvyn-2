"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "../lib/utils";
import type { MessageWithProfile } from "../types";

interface MessageBubbleProps {
  message: MessageWithProfile;
  isOwn: boolean;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
}: MessageBubbleProps) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[80%] sm:max-w-[70%]", isOwn && "order-2")}>
        <div
          className={cn(
            "rounded-lg px-3 py-2",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {formatTime(message.createdAt)}
          {isOwn && message.readAt && <span className="ml-2">✓</span>}
        </p>
      </div>
    </div>
  );
});
