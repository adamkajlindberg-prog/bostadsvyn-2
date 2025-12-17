"use server";

import { createId } from "@bostadsvyn/common/id";
import {
  and,
  count,
  desc,
  eq,
  getDbClient,
  groupMembers,
  groupProperties,
  groupPropertyVotes,
  groups,
  properties,
  user,
} from "db";
import { getServerSession } from "@/auth/server-session";

// Generate a random invite code (8 characters, alphanumeric)
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export interface GroupWithMemberCount {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: Date;
  memberCount: number;
  role: string;
}

export async function getUserGroups(
  userId: string,
): Promise<GroupWithMemberCount[]> {
  try {
    const db = getDbClient();

    // Get all groups where user is a member
    const userGroups = await db
      .select({
        group: groups,
        memberRole: groupMembers.role,
      })
      .from(groupMembers)
      .innerJoin(groups, eq(groupMembers.groupId, groups.id))
      .where(eq(groupMembers.userId, userId));

    // Get member counts for each group
    const groupsWithCounts = await Promise.all(
      userGroups.map(async (ug) => {
        const [memberCountResult] = await db
          .select({ count: count() })
          .from(groupMembers)
          .where(eq(groupMembers.groupId, ug.group.id));

        return {
          ...ug.group,
          memberCount: memberCountResult?.count || 0,
          role: ug.memberRole,
        };
      }),
    );

    return groupsWithCounts;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return [];
  }
}

export async function createGroup(
  name: string,
  userId: string,
): Promise<{ success: boolean; group?: GroupWithMemberCount; error?: string }> {
  try {
    const db = getDbClient();

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let attempts = 0;
    while (attempts < 10) {
      const [existing] = await db
        .select()
        .from(groups)
        .where(eq(groups.inviteCode, inviteCode))
        .limit(1);

      if (!existing) break;
      inviteCode = generateInviteCode();
      attempts++;
    }

    if (attempts >= 10) {
      return {
        success: false,
        error: "Kunde inte generera unik inbjudningskod",
      };
    }

    const groupId = createId();
    const now = new Date();

    // Create group
    await db.insert(groups).values({
      id: groupId,
      name: name.trim(),
      inviteCode,
      createdBy: userId,
      createdAt: now,
    });

    // Add creator as admin member
    await db.insert(groupMembers).values({
      id: createId(),
      groupId,
      userId,
      role: "admin",
      joinedAt: now,
    });

    const [memberCountResult] = await db
      .select({ count: count() })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    const newGroup: GroupWithMemberCount = {
      id: groupId,
      name: name.trim(),
      inviteCode,
      createdBy: userId,
      createdAt: now,
      memberCount: memberCountResult?.count || 1,
      role: "admin",
    };

    return { success: true, group: newGroup };
  } catch (error) {
    console.error("Error creating group:", error);
    return {
      success: false,
      error: "Kunde inte skapa grupp",
    };
  }
}

export async function joinGroup(
  inviteCode: string,
  userId: string,
): Promise<{ success: boolean; group?: GroupWithMemberCount; error?: string }> {
  try {
    const db = getDbClient();

    // Find group by invite code
    const [foundGroup] = await db
      .select()
      .from(groups)
      .where(eq(groups.inviteCode, inviteCode.trim().toUpperCase()))
      .limit(1);

    if (!foundGroup) {
      return {
        success: false,
        error: "Ogiltig inbjudningskod",
      };
    }

    // Check if already a member
    const [existingMember] = await db
      .select()
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, foundGroup.id),
          eq(groupMembers.userId, userId),
        ),
      )
      .limit(1);

    if (existingMember) {
      return {
        success: false,
        error: "Du är redan medlem i denna grupp",
      };
    }

    // Join group
    await db.insert(groupMembers).values({
      id: createId(),
      groupId: foundGroup.id,
      userId,
      role: "member",
      joinedAt: new Date(),
    });

    const [memberCountResult] = await db
      .select({ count: count() })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, foundGroup.id));

    const group: GroupWithMemberCount = {
      ...foundGroup,
      memberCount: memberCountResult?.count || 0,
      role: "member",
    };

    return { success: true, group };
  } catch (error) {
    console.error("Error joining group:", error);
    return {
      success: false,
      error: "Kunde inte ansluta till grupp",
    };
  }
}

export async function leaveGroup(
  groupId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDbClient();

    await db
      .delete(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.userId, userId),
        ),
      );

    return { success: true };
  } catch (error) {
    console.error("Error leaving group:", error);
    return {
      success: false,
      error: "Kunde inte lämna gruppen",
    };
  }
}

export interface GroupMemberWithProfile {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  name: string | null;
  email: string;
}

export async function getGroupMembers(
  groupId: string,
): Promise<GroupMemberWithProfile[]> {
  try {
    const db = getDbClient();

    const members = await db
      .select({
        id: groupMembers.id,
        groupId: groupMembers.groupId,
        userId: groupMembers.userId,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
        name: user.name,
        email: user.email,
      })
      .from(groupMembers)
      .innerJoin(user, eq(groupMembers.userId, user.id))
      .where(eq(groupMembers.groupId, groupId));

    return members.map((m) => ({
      id: m.id,
      groupId: m.groupId,
      userId: m.userId,
      role: m.role,
      joinedAt: m.joinedAt,
      name: m.name,
      email: m.email,
    }));
  } catch (error) {
    console.error("Error fetching group members:", error);
    return [];
  }
}

export interface GroupPropertyWithDetails {
  id: string;
  groupId: string;
  propertyId: string;
  addedBy: string;
  status: string;
  createdAt: Date;
  property: {
    id: string;
    title: string;
    price: number;
    addressStreet: string;
    addressCity: string;
    images: string[] | null;
    propertyType: string;
    livingArea: number | null;
    rooms: number | null;
    status: string;
  };
  addedByName: string | null;
}

export async function getGroupProperties(
  groupId: string,
): Promise<GroupPropertyWithDetails[]> {
  try {
    const db = getDbClient();

    const groupProps = await db
      .select({
        groupProperty: groupProperties,
        property: properties,
        addedByName: user.name,
      })
      .from(groupProperties)
      .innerJoin(properties, eq(groupProperties.propertyId, properties.id))
      .leftJoin(user, eq(groupProperties.addedBy, user.id))
      .where(eq(groupProperties.groupId, groupId))
      .orderBy(desc(groupProperties.createdAt));

    return groupProps.map((gp) => ({
      id: gp.groupProperty.id,
      groupId: gp.groupProperty.groupId,
      propertyId: gp.groupProperty.propertyId,
      addedBy: gp.groupProperty.addedBy,
      status: gp.groupProperty.status,
      createdAt: gp.groupProperty.createdAt,
      property: {
        id: gp.property.id,
        title: gp.property.title,
        price: Number(gp.property.price),
        addressStreet: gp.property.addressStreet,
        addressCity: gp.property.addressCity,
        images: gp.property.images,
        propertyType: gp.property.propertyType,
        livingArea: gp.property.livingArea,
        rooms: gp.property.rooms,
        status: gp.property.status,
      },
      addedByName: gp.addedByName,
    }));
  } catch (error) {
    console.error("Error fetching group properties:", error);
    return [];
  }
}

export async function addPropertyToGroup(
  groupId: string,
  propertyId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDbClient();

    // Check if property already exists in group
    const [existing] = await db
      .select()
      .from(groupProperties)
      .where(
        and(
          eq(groupProperties.groupId, groupId),
          eq(groupProperties.propertyId, propertyId),
        ),
      )
      .limit(1);

    if (existing) {
      return {
        success: false,
        error: "Objektet finns redan i gruppen",
      };
    }

    // Add property to group
    await db.insert(groupProperties).values({
      id: createId(),
      groupId,
      propertyId,
      addedBy: userId,
      status: "voting",
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding property to group:", error);
    return {
      success: false,
      error: "Kunde inte lägga till objekt",
    };
  }
}

export interface PropertyVote {
  id: string;
  userId: string;
  vote: "yes" | "no" | "maybe";
  userName: string | null;
}

export async function getPropertyVotes(
  groupId: string,
  propertyId: string,
): Promise<PropertyVote[]> {
  try {
    const db = getDbClient();

    const votes = await db
      .select({
        id: groupPropertyVotes.id,
        userId: groupPropertyVotes.userId,
        vote: groupPropertyVotes.vote,
        userName: user.name,
      })
      .from(groupPropertyVotes)
      .leftJoin(user, eq(groupPropertyVotes.userId, user.id))
      .where(
        and(
          eq(groupPropertyVotes.groupId, groupId),
          eq(groupPropertyVotes.propertyId, propertyId),
        ),
      );

    return votes.map((v) => ({
      id: v.id,
      userId: v.userId,
      vote: v.vote as "yes" | "no" | "maybe",
      userName: v.userName,
    }));
  } catch (error) {
    console.error("Error fetching property votes:", error);
    return [];
  }
}

export async function castVote(
  groupId: string,
  propertyId: string,
  userId: string,
  vote: "yes" | "no" | "maybe",
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDbClient();

    // Check if user already voted
    const [existingVote] = await db
      .select()
      .from(groupPropertyVotes)
      .where(
        and(
          eq(groupPropertyVotes.groupId, groupId),
          eq(groupPropertyVotes.propertyId, propertyId),
          eq(groupPropertyVotes.userId, userId),
        ),
      )
      .limit(1);

    if (existingVote) {
      // Update existing vote
      await db
        .update(groupPropertyVotes)
        .set({ vote })
        .where(eq(groupPropertyVotes.id, existingVote.id));
    } else {
      // Create new vote
      await db.insert(groupPropertyVotes).values({
        id: createId(),
        groupId,
        propertyId,
        userId,
        vote,
        createdAt: new Date(),
      });
    }

    // Update group property status based on votes
    const votes = await getPropertyVotes(groupId, propertyId);
    const yesCount = votes.filter((v) => v.vote === "yes").length;
    const noCount = votes.filter((v) => v.vote === "no").length;
    const maybeCount = votes.filter((v) => v.vote === "maybe").length;
    const totalVotes = votes.length;

    let newStatus = "voting";
    if (totalVotes > 0) {
      if (yesCount > noCount && yesCount > maybeCount) {
        newStatus = "approved";
      } else if (noCount > yesCount && noCount > maybeCount) {
        newStatus = "rejected";
      } else if (maybeCount > yesCount && maybeCount > noCount) {
        newStatus = "maybe";
      }
    }

    // Update group property status
    await db
      .update(groupProperties)
      .set({ status: newStatus })
      .where(
        and(
          eq(groupProperties.groupId, groupId),
          eq(groupProperties.propertyId, propertyId),
        ),
      );

    return { success: true };
  } catch (error) {
    console.error("Error casting vote:", error);
    return {
      success: false,
      error: "Kunde inte registrera röst",
    };
  }
}

