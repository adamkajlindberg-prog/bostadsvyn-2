"use server";

import {
  and,
  type Conversation,
  conversations,
  desc,
  eq,
  getDbClient,
  type Message,
  messages,
  type NewPropertyInquiry,
  type NewViewingRequest,
  or,
  properties,
  propertyInquiries,
  user,
  viewingRequests,
} from "db";
import { getServerSession } from "@/auth/server-session";

export async function createPropertyInquiry(
  input: Omit<NewPropertyInquiry, "id" | "createdAt">,
) {
  try {
    const session = await getServerSession();

    const db = getDbClient();
    const [inquiry] = await db
      .insert(propertyInquiries)
      .values({
        ...input,
        inquirerId: session?.user?.id || null,
      })
      .returning();

    return { success: true, inquiry };
  } catch (error) {
    console.error("Error creating property inquiry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createViewingRequest(
  input: Omit<
    NewViewingRequest,
    "id" | "createdAt" | "updatedAt" | "requesterId"
  >,
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Du måste logga in för att boka visning",
      };
    }

    const db = getDbClient();
    const [request] = await db
      .insert(viewingRequests)
      .values({
        ...input,
        requesterId: session.user.id,
      })
      .returning();

    return { success: true, request };
  } catch (error) {
    console.error("Error creating viewing request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export interface ConversationWithDetails extends Conversation {
  property: {
    id: string;
    title: string;
    addressStreet: string;
    images?: string[] | null;
  };
  buyerProfile?: {
    name?: string | null;
    email: string;
  };
  sellerProfile?: {
    name?: string | null;
    email: string;
  };
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
  };
}

export async function getConversationsWithDetails(
  userId: string,
): Promise<ConversationWithDetails[]> {
  try {
    const db = getDbClient();
    const userConversations = await db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.buyerId, userId),
          eq(conversations.sellerId, userId),
        ),
      )
      .orderBy(desc(conversations.lastMessageAt));

    // Load property and user details for each conversation
    const conversationsWithDetails = await Promise.all(
      userConversations.map(async (conv) => {
        // Get property
        const [property] = await db
          .select({
            id: properties.id,
            title: properties.title,
            addressStreet: properties.addressStreet,
            images: properties.images,
          })
          .from(properties)
          .where(eq(properties.id, conv.propertyId))
          .limit(1);

        // Get buyer profile
        const [buyer] = await db
          .select({
            name: user.name,
            email: user.email,
          })
          .from(user)
          .where(eq(user.id, conv.buyerId))
          .limit(1);

        // Get seller profile
        const [seller] = await db
          .select({
            name: user.name,
            email: user.email,
          })
          .from(user)
          .where(eq(user.id, conv.sellerId))
          .limit(1);

        // Get last message
        const [lastMsg] = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, conv.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        return {
          ...conv,
          property: property || {
            id: conv.propertyId,
            title: "",
            addressStreet: "",
            images: null,
          },
          buyerProfile: buyer || undefined,
          sellerProfile: seller || undefined,
          lastMessage: lastMsg
            ? {
                id: lastMsg.id,
                content: lastMsg.content,
                senderId: lastMsg.senderId,
                createdAt: lastMsg.createdAt,
              }
            : undefined,
        };
      }),
    );

    return conversationsWithDetails;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

export interface MessageWithProfile extends Message {
  senderProfile?: {
    name?: string | null;
    email: string;
  };
}

export async function getMessagesWithProfiles(
  conversationId: string,
): Promise<MessageWithProfile[]> {
  try {
    const db = getDbClient();
    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));

    // Load sender profiles
    const messagesWithProfiles = await Promise.all(
      conversationMessages.map(async (msg) => {
        const [sender] = await db
          .select({
            name: user.name,
            email: user.email,
          })
          .from(user)
          .where(eq(user.id, msg.senderId))
          .limit(1);

        return {
          ...msg,
          senderProfile: sender || undefined,
        };
      }),
    );

    return messagesWithProfiles.reverse(); // Reverse to show oldest first
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function markMessagesAsRead(conversationId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return;
    }

    const db = getDbClient();
    await db
      .update(messages)
      .set({
        readAt: new Date(),
      })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.senderId, session.user.id),
        ),
      );
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: string = "text",
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Du måste logga in för att skicka meddelanden",
      };
    }

    const db = getDbClient();
    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: session.user.id,
        content,
        messageType,
      })
      .returning();

    // Update conversation last_message_at
    await db
      .update(conversations)
      .set({
        lastMessageAt: message.createdAt,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));

    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
