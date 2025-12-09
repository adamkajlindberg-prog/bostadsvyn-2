import type { ConversationWithDetails, ParticipantInfo } from "../types";

/**
 * Get initials from a name or email for avatar display
 */
export function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return "AN";
}

/**
 * Format timestamp to a human-readable relative time
 */
export function formatTime(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffInHours < 168) {
    // 7 days
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get the other participant's info in a conversation
 */
export function getOtherParticipant(
  conversation: ConversationWithDetails,
  currentUserId: string,
): ParticipantInfo {
  if (conversation.buyerId === currentUserId) {
    return {
      profile: conversation.sellerProfile,
      role: "Säljare",
    };
  }
  return {
    profile: conversation.buyerProfile,
    role: "Köpare",
  };
}

/**
 * Check if a conversation has unread messages for the current user
 */
export function hasUnreadMessages(
  conversation: ConversationWithDetails,
  currentUserId: string,
): boolean {
  return Boolean(
    conversation.lastMessage &&
      conversation.lastMessage.senderId !== currentUserId,
  );
}

/**
 * Filter conversations based on search term
 */
export function filterConversations(
  conversations: ConversationWithDetails[],
  searchTerm: string,
  currentUserId: string,
): ConversationWithDetails[] {
  if (!searchTerm.trim()) return conversations;

  const searchLower = searchTerm.toLowerCase();

  return conversations.filter((conv) => {
    const otherParticipant = getOtherParticipant(conv, currentUserId);

    return (
      conv.property.title.toLowerCase().includes(searchLower) ||
      conv.property.addressStreet.toLowerCase().includes(searchLower) ||
      otherParticipant.profile?.name?.toLowerCase().includes(searchLower) ||
      otherParticipant.profile?.email.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });
}
