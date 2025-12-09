"use client";

import { ArrowLeft, Info, MoreVertical, Phone, Video } from "lucide-react";
import { memo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { getInitials, getOtherParticipant } from "../lib/utils";
import type { ConversationWithDetails } from "../types";

interface ChatHeaderProps {
  conversation: ConversationWithDetails;
  currentUserId: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ChatHeader = memo(function ChatHeader({
  conversation,
  currentUserId,
  onBack,
  showBackButton = false,
}: ChatHeaderProps) {
  const otherParticipant = getOtherParticipant(conversation, currentUserId);

  return (
    <CardHeader className="border-b shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 -ml-2"
              onClick={onBack}
              aria-label="Tillbaka till konversationer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(
                otherParticipant.profile?.name,
                otherParticipant.profile?.email,
              )}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {otherParticipant.profile?.name || "Användare"}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {conversation.property.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
});
