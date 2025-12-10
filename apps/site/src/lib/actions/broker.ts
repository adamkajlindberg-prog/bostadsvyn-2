"use server";

import { brokers, getDbClient, type NewBroker } from "db";
import { headers } from "next/headers";
import { auth } from "@/auth/config";

type T_Office = {
  name: string;
  slug: string;
  metadata: {
    type: string;
    office: {
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      email: string;
    };
  };
};

export async function addBroker(brokerData: NewBroker) {
  try {
    const db = getDbClient();

    const [createdBroker] = await db
      .insert(brokers)
      .values(brokerData)
      .returning();

    return createdBroker ?? null;
  } catch (error) {
    console.error("Error adding broker:", error);
    return null;
  }
}

export async function addOfficeAndBroker(office: T_Office) {
  try {
    const db = getDbClient();

    await db.transaction(async (trx) => {
      await auth.api.createOrganization({
        body: {
          name: office.name,
          slug: office.slug,
          metadata: office.metadata,
        },
        headers: await headers(),
      });
    });
  } catch (error) {
    console.error("Error adding office and broker:", error);
    return null;
  }
}
