"use server";

import { brokers, getDbClient } from "db";
import { headers } from "next/headers";
import { auth } from "@/auth/config";

export type T_Office_Broker = {
  office: {
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
  broker: {
    brokerName: string;
    brokerEmail: string;
    brokerPhone: string;
    licenseNumber: string;
  };
};

// Function to add office and broker
export async function addOfficeBroker(data: T_Office_Broker) {
  const db = getDbClient();
  let organizationId: string | undefined;
  let brokerId: string | undefined;

  try {
    // Create organization first
    const organization = await auth.api.createOrganization({
      body: {
        name: data.office.name,
        slug: data.office.slug,
        metadata: data.office.metadata,
      },
      headers: await headers(),
    });

    organizationId = organization?.id;

    // Then create broker
    const [broker] = await db
      .insert(brokers)
      .values({
        userId: organization?.members[0]?.userId ?? "",
        organizationId: organization?.id ?? "",
        brokerName: data.broker.brokerName,
        brokerEmail: data.broker.brokerEmail,
        brokerPhone: data.broker.brokerPhone,
        licenseNumber: data.broker.licenseNumber,
      })
      .returning();

    brokerId = broker.id;

    // Set the newly created organization as active
    await auth.api.setActiveOrganization({
      body: {
        organizationId: organization?.id ?? "",
        organizationSlug: data.office.slug,
      },
      headers: await headers(),
    });

    return { success: true, brokerId };
  } catch (error) {
    console.error("Error adding office and broker:", error);

    // Clean up organization if it was created
    if (organizationId) {
      try {
        await auth.api.deleteOrganization({
          body: {
            organizationId,
          },
          headers: await headers(),
        });
      } catch (deleteError) {
        console.error("Failed to rollback organization:", deleteError);
      }
    }

    return null;
  }
}
