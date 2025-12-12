"use server";

import { and, brokers, eq, getDbClient } from "db";
import { headers } from "next/headers";
import { auth } from "@/auth/config";
import { getServerSession } from "@/auth/server-session";

export async function getUserProfiles() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return [];

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const result = [
    {
      id: user.id,
      type: "private",
      name: user.name,
      slug: null,
    },
    ...organizations.map((row) => ({
      id: row.id,
      type: row.metadata ? JSON.parse(row.metadata).type : "broker",
      name: row.name,
      slug: row.slug,
    })),
  ];

  return result;
}

export async function getOrganizationBroker(organizationId: string) {
  const db = getDbClient();

  const session = await getServerSession();
  const userId = session?.user?.id ?? "";

  const broker = await db.query.brokers.findFirst({
    where: and(
      eq(brokers.userId, userId),
      eq(brokers.organizationId, organizationId),
    ),
    columns: {
      id: true,
      brokerName: true,
      brokerEmail: true,
      licenseNumber: true,
    },
  });

  return broker;
}
