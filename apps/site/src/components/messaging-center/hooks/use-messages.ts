"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getMessagesWithProfiles,
  markMessagesAsRead,
  sendMessage as sendMessageAction,
} from "@/lib/actions/messaging";
import type { MessageWithProfile, UseMessagesReturn } from "../types";

interface UserInfo {
  id: string;
  name?: string | null;
  email: string;
}

export function useMessages(
  conversationId: string | null,
  user: UserInfo | null,
): UseMessagesReturn {
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getMessagesWithProfiles(conversationId);
      setMessages(data);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (_error) {
      toast.error("Kunde inte ladda meddelanden");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!content.trim() || !conversationId || !user) {
        return false;
      }

      try {
        setSendingMessage(true);

        const result = await sendMessageAction(
          conversationId,
          content.trim(),
          "text",
        );

        if (!result.success) {
          throw new Error(result.error || "Kunde inte skicka meddelande");
        }

        // Add the new message to the list
        if (result.message) {
          const newMsg: MessageWithProfile = {
            ...result.message,
            senderProfile: {
              name: user.name || null,
              email: user.email,
            },
          };
          setMessages((prev) => [...prev, newMsg]);
        }

        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Kunde inte skicka meddelande";
        toast.error(message);
        return false;
      } finally {
        setSendingMessage(false);
      }
    },
    [conversationId, user],
  );

  return {
    messages,
    loading,
    sendingMessage,
    sendMessage,
    refresh: loadMessages,
  };
}
