"use server";

import { randomUUID } from "node:crypto";
import { eq, getDbClient, properties } from "db";
import { getServerSession } from "@/auth/server-session";
import { getImageClient } from "@/image";
import type { RentalFormData } from "@/lib/schemas/rental-form";

function assertSession(session: Awaited<ReturnType<typeof getServerSession>>) {
  if (!session?.user?.id) {
    throw new Error("Du måste vara inloggad");
  }
  return session;
}

async function uploadPropertyImages(files: File[], userId: string) {
  if (!files?.length) return [] as string[];

  const client = getImageClient();
  const uploaded: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name?.split(".").pop() || "jpg";
    const key = `${userId}/${randomUUID()}.${ext}`;
    await client.upload({
      id: `properties/${key}`,
      body: arrayBuffer,
      mimeType: file.type || "application/octet-stream",
    });
    uploaded.push(key);
  }

  return uploaded;
}

function buildRentalInfo(data: RentalFormData) {
  // Build amenities arrays
  const kitchenAmenities: string[] = [];
  if (data.has_dishwasher) kitchenAmenities.push("Diskmaskin");
  if (data.has_microwave) kitchenAmenities.push("Mikrovågsugn");
  if (data.has_oven) kitchenAmenities.push("Ugn");
  if (data.has_freezer) kitchenAmenities.push("Kyl/Frys");

  const bathroomAmenities: string[] = [];
  if (data.has_washing_machine) bathroomAmenities.push("Tvättmaskin");
  if (data.has_dryer) bathroomAmenities.push("Torktumlare");
  if (data.has_bathtub) bathroomAmenities.push("Badkar");
  if (data.has_shower) bathroomAmenities.push("Dusch");
  if (data.has_bidet) bathroomAmenities.push("Bidé");
  if (data.has_floor_heating) bathroomAmenities.push("Golvvärme");

  const techAmenities: string[] = [];
  if (data.has_wifi) techAmenities.push("Wifi/Internet");
  if (data.has_tv) techAmenities.push("TV");
  if (data.has_air_conditioning) techAmenities.push("AC");
  if (data.has_heating) techAmenities.push("Uppvärmning");
  if (data.has_alarm_system) techAmenities.push("Inbrottslarm");
  if (data.has_ev_charger) techAmenities.push("Laddmöjlighet till bil");

  const otherAmenities: string[] = [];
  if (data.has_fireplace) otherAmenities.push("Öppen spis");
  if (data.has_sauna) otherAmenities.push("Bastu");
  if (data.has_storage) otherAmenities.push("Förråd");
  if (data.has_bike_room) otherAmenities.push("Cykelrum");
  if (data.has_stroller_room) otherAmenities.push("Barnvagnsrum");
  if (data.has_gym) otherAmenities.push("Gym");
  if (data.has_common_room) otherAmenities.push("Gemensamhetslokal");
  if (data.has_pool) otherAmenities.push("Pool");
  if (data.has_jacuzzi) otherAmenities.push("Bubbelpool");
  if (data.has_security_door) otherAmenities.push("Säkerhetsdörr");
  if (data.has_garage_in_amenities) otherAmenities.push("Garageplats");
  if (data.has_parking_in_amenities) otherAmenities.push("Parkering");

  // Build basic features array
  const basicFeatures: string[] = [];
  if (data.furnished) basicFeatures.push("Möblerad");
  if (data.pets_allowed) basicFeatures.push("Husdjur tillåtna");
  if (data.smoking_allowed) basicFeatures.push("Rökning tillåten");
  if (data.utilities_included) basicFeatures.push("El/värme inkluderat");
  if (data.is_shared) basicFeatures.push("Inneboende");
  if (data.internet_included) basicFeatures.push("Internet inkluderat");
  if (data.has_elevator) basicFeatures.push("Hiss finns");
  if (data.has_balcony) basicFeatures.push("Balkong");
  if (data.has_garden) basicFeatures.push("Trädgård/uteplats");
  if (data.has_garage) basicFeatures.push("Garageplats tillgänglig");
  if (data.parking_available) basicFeatures.push("Parkering tillgänglig");

  return {
    contract_type:
      data.contract_type === "first_hand"
        ? "Förstahandskontrakt"
        : "Andrahandskontrakt",
    available_from: data.available_from,
    lease_duration: data.lease_duration,
    pets_allowed: data.pets_allowed,
    smoking_allowed: data.smoking_allowed,
    furnished: data.furnished,
    utilities_included: data.utilities_included,
    internet_included: data.internet_included,
    is_shared: data.is_shared,
    floor_level: data.floor_level,
    has_elevator: data.has_elevator,
    has_balcony: data.has_balcony,
    has_garden: data.has_garden,
    has_garage: data.has_garage,
    parking_available: data.parking_available,
    parking_type: data.parking_type,
    building_year: data.building_year,
    energy_rating: data.energy_rating,
    min_income: data.min_income,
    min_age: data.min_age,
    max_occupants: data.max_occupants,
    references_required: data.references_required,
    neighborhood_description: data.neighborhood_description,
    nearest_metro: data.nearest_metro,
    transport_description: data.transport_description,
    contact_phone: data.contact_phone,
    viewing_instructions: data.viewing_instructions,
    preferred_contact_method: data.preferred_contact_method,
    kitchen_amenities: kitchenAmenities,
    bathroom_amenities: bathroomAmenities,
    tech_amenities: techAmenities,
    other_amenities: otherAmenities,
  };
}

export async function createRentalProperty(
  data: RentalFormData,
  images: File[] = [],
  existingImageUrls: string[] = [],
) {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();
    const uploaded = await uploadPropertyImages(images, session.user.id);

    // Combine existing images with new uploads
    const allImageUrls = [...existingImageUrls, ...uploaded];

    // Build rental info
    const rentalInfo = buildRentalInfo(data);

    // Build features array
    const features: string[] = [];
    if (data.furnished) features.push("Möblerad");
    if (data.pets_allowed) features.push("Husdjur tillåtna");
    if (data.smoking_allowed) features.push("Rökning tillåten");
    if (data.utilities_included) features.push("El/värme inkluderat");
    if (data.is_shared) features.push("Inneboende");
    if (data.internet_included) features.push("Internet inkluderat");
    if (data.has_elevator) features.push("Hiss finns");
    if (data.has_balcony) features.push("Balkong");
    if (data.has_garden) features.push("Trädgård/uteplats");
    if (data.has_garage) features.push("Garageplats tillgänglig");
    if (data.parking_available) features.push("Parkering tillgänglig");

    // Determine property type - default to APARTMENT for rentals
    const propertyType = "APARTMENT";

    await db.insert(properties).values({
      userId: session.user.id,
      title: data.title,
      description: data.description,
      propertyType: propertyType,
      status: "FOR_RENT",
      price: BigInt(data.rent),
      addressStreet: data.address_street,
      addressPostalCode: data.address_postal_code,
      addressCity: data.address_city,
      addressCountry: "SE",
      livingArea: data.area,
      rooms: data.rooms,
      yearBuilt: data.building_year,
      energyClass: data.energy_rating as "A" | "B" | "C" | "D" | "E" | "F" | "G" | null,
      monthlyFee: data.utilities_included ? 0 : null,
      images: allImageUrls,
      features: features,
      rentalInfo: rentalInfo,
      adTier: "free",
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating rental property:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Kunde inte skapa hyresannons",
    };
  }
}

export async function updateRentalProperty(
  id: string,
  data: RentalFormData,
  images: File[] = [],
  existingImageUrls: string[] = [],
) {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    const [existing] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Hyresannons hittades inte" };
    }

    if (existing.userId !== session.user.id) {
      return { success: false, error: "Saknar behörighet" };
    }

    const uploaded = await uploadPropertyImages(images, existing.userId);

    // Combine existing images with new uploads
    const allImageUrls = [...existingImageUrls, ...uploaded];

    // Build rental info
    const rentalInfo = buildRentalInfo(data);

    // Build features array
    const features: string[] = [];
    if (data.furnished) features.push("Möblerad");
    if (data.pets_allowed) features.push("Husdjur tillåtna");
    if (data.smoking_allowed) features.push("Rökning tillåten");
    if (data.utilities_included) features.push("El/värme inkluderat");
    if (data.is_shared) features.push("Inneboende");
    if (data.internet_included) features.push("Internet inkluderat");
    if (data.has_elevator) features.push("Hiss finns");
    if (data.has_balcony) features.push("Balkong");
    if (data.has_garden) features.push("Trädgård/uteplats");
    if (data.has_garage) features.push("Garageplats tillgänglig");
    if (data.parking_available) features.push("Parkering tillgänglig");

    await db
      .update(properties)
      .set({
        title: data.title,
        description: data.description,
        price: BigInt(data.rent),
        addressStreet: data.address_street,
        addressPostalCode: data.address_postal_code,
        addressCity: data.address_city,
        livingArea: data.area,
        rooms: data.rooms,
        yearBuilt: data.building_year,
        energyClass: data.energy_rating as "A" | "B" | "C" | "D" | "E" | "F" | "G" | null,
        monthlyFee: data.utilities_included ? 0 : null,
        images: allImageUrls,
        features: features,
        rentalInfo: rentalInfo,
      })
      .where(eq(properties.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error updating rental property:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte uppdatera hyresannons",
    };
  }
}

