import { headers } from "next/headers";
import { cache } from "react";
import { auth, type Session } from "./config";
import type { roles } from "./permissions";

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
