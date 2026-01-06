import { and, eq, getDbClient, member } from "db";
import { headers } from "next/headers";
import { cache } from "react";
import { auth, type Session } from "./config";
import type { roles } from "./permissions";
import { type OrganizationRole, organizationRoles } from "./permissions";

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export async function isServerAuthenticated(
  session?: Session | null,
): Promise<Session | null> {
  const currentSession = session ?? (await getServerSession());
  return currentSession?.user ? currentSession : null;
}

type Role = keyof typeof roles;

export async function isServerRole(
  acceptableRoles: Role[],
  session?: Session | null,
): Promise<Session | null> {
  const currentSession = session ?? (await getServerSession());
  if (!currentSession?.user?.role) {
    return null;
  }
  return acceptableRoles.includes(currentSession.user.role as Role)
    ? currentSession
    : null;
}

/**
 * Get user's role in a specific organization
 */
export async function getOrganizationMemberRole(
  organizationId: string,
  userId?: string,
  session?: Session | null,
): Promise<OrganizationRole | null> {
  const currentSession = session ?? (await getServerSession());
  const targetUserId = userId ?? currentSession?.user?.id;

  if (!targetUserId) {
    return null;
  }

  const db = getDbClient();
  const memberRecord = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, organizationId),
      eq(member.userId, targetUserId),
    ),
    columns: {
      role: true,
    },
  });

  if (!memberRecord?.role) {
    return null;
  }

  const role = memberRecord.role as OrganizationRole;
  if (role in organizationRoles) {
    return role;
  }

  return null;
}

/**
 * Get all organizations a user belongs to with their roles
 */
export async function getUserOrganizations(
  session?: Session | null,
): Promise<Array<{ organizationId: string; role: OrganizationRole }>> {
  const currentSession = session ?? (await getServerSession());
  const userId = currentSession?.user?.id;

  if (!userId) {
    return [];
  }

  const db = getDbClient();
  const members = await db.query.member.findMany({
    where: eq(member.userId, userId),
    columns: {
      organizationId: true,
      role: true,
    },
  });

  return members
    .filter((m) => m.role && m.role in organizationRoles)
    .map((m) => ({
      organizationId: m.organizationId,
      role: m.role as OrganizationRole,
    }));
}

/**
 * Check if user has a specific role in an organization
 */
export async function isServerOrganizationRole(
  organizationId: string,
  acceptableRoles: OrganizationRole[],
  session?: Session | null,
): Promise<{ session: Session; role: OrganizationRole } | null> {
  const currentSession = session ?? (await getServerSession());
  if (!currentSession?.user) {
    return null;
  }

  const userRole = await getOrganizationMemberRole(
    organizationId,
    currentSession.user.id,
    currentSession,
  );

  if (!userRole || !acceptableRoles.includes(userRole)) {
    return null;
  }

  return {
    session: currentSession,
    role: userRole,
  };
}

/**
 * Check if user has a specific permission in an organization context
 */
export async function hasOrganizationPermission(
  organizationId: string,
  resource: "organization" | "property",
  permission: string,
  session?: Session | null,
): Promise<boolean> {
  const currentSession = session ?? (await getServerSession());
  if (!currentSession?.user) {
    return false;
  }

  const userRole = await getOrganizationMemberRole(
    organizationId,
    currentSession.user.id,
    currentSession,
  );

  if (!userRole) {
    return false;
  }

  // Define role permissions mapping for direct checking
  const rolePermissionsMap: Record<
    OrganizationRole,
    {
      organization?: string[];
      property?: string[];
    }
  > = {
    owner: {
      organization: ["create", "update", "delete", "invite", "manage_members"],
      property: ["create", "update", "delete", "publish"],
    },
    admin: {
      organization: ["update", "invite", "manage_members"],
      property: ["create", "update", "delete", "publish"],
    },
    broker: {
      property: ["create", "update", "delete", "publish"],
    },
    member: {},
  };

  const rolePermissions = rolePermissionsMap[userRole];
  const resourcePermissions = rolePermissions[resource];

  if (!resourcePermissions) {
    return false;
  }

  // Check if permission is granted (either specific permission or "all")
  return (
    resourcePermissions.includes(permission) ||
    resourcePermissions.includes("all")
  );
}
