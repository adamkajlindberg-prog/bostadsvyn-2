"use server";

import { DrizzleQueryError, getDbClient, properties } from "db";
import { DatabaseError } from "pg";
import { getServerSession } from "@/auth/server-session";

export const addProperty = async (
  title: string,
  type: string,
  objectId: string,
) => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized. Please log in.",
    };
  }

  if (!title || !type || !objectId) {
    return {
      success: false,
      error: "Missing required fields.",
    };
  }

  let endpointType: string;
  switch (type) {
    case "APARTMENT":
      endpointType = "HousingCooperative";
      break;
    case "HOUSE":
      endpointType = "House";
      break;
    case "COTTAGE":
      endpointType = "Cottage";
      break;
    case "PLOT":
      endpointType = "Plot";
      break;
    case "FARM":
      endpointType = "Farm";
      break;
    case "COMMERCIAL":
      endpointType = "CommercialProperty";
      break;
    default:
      return {
        success: false,
        error: "Unsupported property type",
      };
  }

  const url = `https://connect-qa.maklare.vitec.net/PublicAdvertising/${endpointType}/${process.env.VITEC_DEMO_CUSTOMER_ID}/${objectId}`;
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
      error: "Property not found in Vitec system",
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
    await db.insert(properties).values({
      userId: session.user.id,
      objectId,
      title,
      description: data?.texts?.saleDescription,
      propertyType: type,
      status,
      price: data?.price?.swedishCurrency,
      addressStreet: data?.address?.streetAddress,
      addressPostalCode: data?.address?.zipCode,
      addressCity: data?.address?.city,
      addressCountry: data?.address?.countryCode,
      livingArea: data?.building?.livingSpace,
      plotArea: data?.plotInfo?.plotSize,
      rooms: data?.building?.numberOfRooms,
      yearBuilt: data?.building?.yearBuilt,
      energyClass: data?.energyDeclaration?.energyClass || null,
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
    if (error instanceof DrizzleQueryError) {
      if (error.cause instanceof DatabaseError) {
        if (error.cause.code === "23505") {
          return {
            success: false,
            error: "Property with this Object ID already exists.",
          };
        }
      }
    }

    return {
      success: false,
      error: "Something went wrong. Please try again later.",
      details: (error as Error).message,
    };
  }
};
