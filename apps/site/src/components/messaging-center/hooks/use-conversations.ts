"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getConversationsWithDetails } from "@/lib/actions/messaging";
import { filterConversations } from "../lib/utils";
import type { ConversationWithDetails, UseConversationsReturn } from "../types";

export function useConversations(
  userId: string | undefined,
): UseConversationsReturn {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadConversations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getConversationsWithDetails(userId);
      setConversations(data);
    } catch (_error) {
      toast.error("Kunde inte ladda konversationer");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const filteredConversations = useMemo(
    () => filterConversations(conversations, searchTerm, userId ?? ""),
    [conversations, searchTerm, userId],
  );

  return {
    conversations,
    filteredConversations,
    loading,
    searchTerm,
    setSearchTerm,
    refresh: loadConversations,
  };
}
