"use client";

import { useCallback, useState } from "react";
import { authClient } from "@/auth/client";
import { ChatView, ConversationList } from "./components";
import { useConversations } from "./hooks";
import type { ConversationWithDetails } from "./types";

export function MessagingCenterDesktop() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const {
    filteredConversations,
    loading,
    searchTerm,
    setSearchTerm,
    refresh: refreshConversations,
  } = useConversations(user?.id);

  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithDetails | null>(null);

  const handleSelectConversation = useCallback(
    (conversation: ConversationWithDetails) => {
      setSelectedConversation(conversation);
    },
    [],
  );

  const handleMessageSent = useCallback(() => {
    refreshConversations();
  }, [refreshConversations]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Laddar meddelanden...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex h-[calc(100vh-8rem)] max-w-7xl mx-auto gap-6">
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversation?.id ?? null}
          currentUserId={user.id}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectConversation={handleSelectConversation}
          className="w-1/3 flex flex-col"
        />

        <ChatView
          conversation={selectedConversation}
          user={user}
          onMessageSent={handleMessageSent}
          className="flex-1 flex flex-col"
        />
      </div>
    </div>
  );
}
