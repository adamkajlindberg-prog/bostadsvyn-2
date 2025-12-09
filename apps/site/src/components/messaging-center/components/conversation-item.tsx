"use client";

import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  formatTime,
  getInitials,
  getOtherParticipant,
  hasUnreadMessages,
} from "../lib/utils";
import type { ConversationWithDetails } from "../types";

interface ConversationItemProps {
  conversation: ConversationWithDetails;
  currentUserId: string;
  isSelected: boolean;
  onSelect: (conversation: ConversationWithDetails) => void;
}

export const ConversationItem = memo(function ConversationItem({
  conversation,
  currentUserId,
  isSelected,
  onSelect,
}: ConversationItemProps) {
  const otherParticipant = getOtherParticipant(conversation, currentUserId);
  const hasUnread = hasUnreadMessages(conversation, currentUserId);

  return (
    <button
      type="button"
      className={cn(
        "w-full p-3 text-left transition-colors hover:bg-muted/50 border-b",
        isSelected && "bg-muted",
      )}
      onClick={() => onSelect(conversation)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(
              otherParticipant.profile?.name,
              otherParticipant.profile?.email,
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-sm truncate">
              {otherParticipant.profile?.name || "Användare"}
            </h4>
            {conversation.lastMessage && (
              <span className="text-xs text-muted-foreground shrink-0">
                {formatTime(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs shrink-0">
              {otherParticipant.role}
            </Badge>
            {hasUnread && (
              <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate mt-1">
            {conversation.property.title}
          </p>

          {conversation.lastMessage && (
            <p className="text-sm text-muted-foreground truncate mt-1">
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </button>
  );
});
