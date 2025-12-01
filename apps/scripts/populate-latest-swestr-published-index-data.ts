import { getDbClient, riksbankSwestrPublishedIndex } from "db";

type T_Api_Response = {
  value: number;
  date: string;
  publicationTime: string;
  republication: boolean;
};

// Main function to populate latest SWESTR published index data
const populateLatestSwestrPublishedIndexData = async () => {
  const db = getDbClient();

  console.log(
    "Retrieving latest data from Riksbank API (SWESTR - Published Index)...",
  );

  const response = await fetch(
    "https://api.riksbank.se/swestr/v1/index/latest/SWESTRINDEX",
  );
  const data = (await response.json()) as T_Api_Response;

  console.log("Upserting data...");

  // Insert or update SWESTR published index into DB
  await db
    .insert(riksbankSwestrPublishedIndex)
    .values({
      value: data.value,
      date: data.date,
      publicationTime: new Date(data.publicationTime),
      republication: data.republication,
    })
    .onConflictDoUpdate({
      target: riksbankSwestrPublishedIndex.date,
      set: {
        value: data.value,
        date: data.date,
        publicationTime: new Date(data.publicationTime),
        republication: data.republication,
        updatedAt: new Date(),
      },
    });

  console.log("Data upserted.");
  console.log(
    "SUCCESS! Latest SWESTR published index data populated successfully.",
  );
};

populateLatestSwestrPublishedIndexData();
