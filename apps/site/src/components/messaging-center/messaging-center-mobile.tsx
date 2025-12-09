"use client";

import { useCallback, useState } from "react";
import { authClient } from "@/auth/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ChatHeader,
  ConversationList,
  EmptyState,
  MessageInput,
  MessageList,
} from "./components";
import { useConversations, useMessages } from "./hooks";
import type { ConversationWithDetails } from "./types";

export function MessagingCenterMobile() {
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { messages, sendingMessage, sendMessage } = useMessages(
    selectedConversation?.id ?? null,
    user ?? null,
  );

  const handleSelectConversation = useCallback(
    (conversation: ConversationWithDetails) => {
      setSelectedConversation(conversation);
      setIsSheetOpen(true);
    },
    [],
  );

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      const success = await sendMessage(content);
      if (success) {
        refreshConversations();
      }
      return success;
    },
    [sendMessage, refreshConversations],
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
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
    <div className="container mx-auto px-4 py-4">
      <div className="h-[calc(100vh-7rem)]">
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversation?.id ?? null}
          currentUserId={user.id}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectConversation={handleSelectConversation}
          className="h-full flex flex-col"
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full p-0 flex flex-col"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Konversation</SheetTitle>
            <SheetDescription>
              Chatta med{" "}
              {selectedConversation?.buyerProfile?.name ||
                selectedConversation?.sellerProfile?.name ||
                "användare"}
            </SheetDescription>
          </SheetHeader>

          {selectedConversation ? (
            <div className="flex flex-col h-full">
              <ChatHeader
                conversation={selectedConversation}
                currentUserId={user.id}
                onBack={handleCloseSheet}
                showBackButton
              />

              <Card className="flex-1 flex flex-col border-0 rounded-none shadow-none">
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <MessageList messages={messages} currentUserId={user.id} />
                </CardContent>
              </Card>

              <MessageInput
                onSend={handleSendMessage}
                sending={sendingMessage}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                title="Ingen konversation vald"
                description="Välj en konversation för att börja chatta"
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
