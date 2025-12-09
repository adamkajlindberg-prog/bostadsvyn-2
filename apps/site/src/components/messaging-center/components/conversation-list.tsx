"use client";

import { MessageCircle, Search } from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ConversationWithDetails } from "../types";
import { ConversationItem } from "./conversation-item";
import { EmptyState } from "./empty-state";

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  selectedConversationId: string | null;
  currentUserId: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectConversation: (conversation: ConversationWithDetails) => void;
  className?: string;
}

export const ConversationList = memo(function ConversationList({
  conversations,
  selectedConversationId,
  currentUserId,
  searchTerm,
  onSearchChange,
  onSelectConversation,
  className,
}: ConversationListProps) {
  return (
    <Card className={className}>
      <CardHeader className="shrink-0 space-y-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Meddelanden
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök konversationer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          {conversations.length === 0 ? (
            <EmptyState
              title={
                searchTerm
                  ? "Inga konversationer hittades"
                  : "Inga meddelanden ännu"
              }
              description={
                searchTerm
                  ? "Försök med en annan sökning"
                  : "Starta en konversation genom att kontakta en säljare"
              }
            />
          ) : (
            <div>
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  currentUserId={currentUserId}
                  isSelected={selectedConversationId === conversation.id}
                  onSelect={onSelectConversation}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});
