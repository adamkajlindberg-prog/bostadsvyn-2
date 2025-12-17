"use server"

import { getServerSession } from "@/auth/server-session";
import { getDbClient, propertiesTwo } from "db";

export const propertyAdd = async (title: string, objectId: string) => {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized. Please log in.",
    };
  }

  if (!title || !objectId) {
    return {
      success: false,
      error: "Missing required fields.",
    };
  }

  const url = `https://connect-qa.maklare.vitec.net/PublicAdvertising/HousingCooperative/${process.env.VITEC_DEMO_CUSTOMER_ID}/${objectId}`;
  const auth = process.env.VITEC_DEMO_AUTH_TOKEN;

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return {
      success: false,
      error: "Failed to fetch from Vitec",
    };
  }

  const data = await res.json();
  const db = getDbClient();

  let status: string;

  switch (data?.status) {
    case "SoonForSale":
      status = "COMING_SOON";
      break;
    case "ForSale":
      status = "FOR_SALE";
      break;
    case "Sold":
      status = "SOLD";
      break;
    case "ForRental":
      status = "FOR_RENT";
      break;
    default:
      status = "DRAFT";
  }

  try {
    await db.insert(propertiesTwo).values({
      userId: session.user.id,
      objectId,
      title,
      description: data?.texts?.saleDescription,
      propertyType: data?.type?.toUpperCase(),
      status,
      price: data?.price?.swedishCurrency,
      addressStreet: data?.address?.streetAddress,
      addressPostalCode: data?.address?.zipCode,
      addressCity: data?.address?.city,
      addressCountry: data?.address?.countryCode,
      livingArea: data?.building?.livingSpace,
      rooms: data?.building?.numberOfRooms,
      yearBuilt: data?.building?.yearBuilt,
      energyClass: data?.energyDeclaration?.energyClass,
      monthlyFee: data?.expenses?.monthlyFee,
      images: data?.images?.map((img: { id: string }) => img.id) || [],
      latitude: data?.address?.wgs84Coordinate?.latitude,
      longitude: data?.address?.wgs84Coordinate?.longitude,
      operatingCosts: data?.expenses?.operatingCosts,
    });
    
    return {
      success: true,
      message: "Property added successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to insert property",
      details: (error as Error).message,
    };
  }
};