import type {
  ConversationWithDetails,
  MessageWithProfile,
} from "@/lib/actions/messaging";

export type { ConversationWithDetails, MessageWithProfile };

export interface ParticipantInfo {
  profile?: {
    name?: string | null;
    email: string;
  };
  role: "Säljare" | "Köpare";
}

export interface UseConversationsReturn {
  conversations: ConversationWithDetails[];
  filteredConversations: ConversationWithDetails[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  refresh: () => Promise<void>;
}

export interface UseMessagesReturn {
  messages: MessageWithProfile[];
  loading: boolean;
  sendingMessage: boolean;
  sendMessage: (content: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}
