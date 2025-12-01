import { getDbClient, scb } from "db";
import { generateEmbeddings } from "../site/src/lib/ai/embedding";
import { setTimeoutDelay } from "../site/src/utils/set-timeout-delay";

type T_Scb_Table = {
  id: string;
  label: string;
  title: string;
  firstPeriod: string;
  lastPeriod: string;
};

type T_Scb_Tables = {
  tables: T_Scb_Table[];
};

// Retrieve all SCB data
const getAllScb = async () => {
  const response = await fetch(
    "https://api.scb.se/OV0104/v2beta/api/v2/tables",
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  return data as T_Scb_Tables;
};

// Main function to populate SCB data
const populateScbData = async () => {
  const db = getDbClient();

  console.log("Retrieving data from SCB API...");
  const scbData = await getAllScb();
  const scbTables = scbData.tables;

  for (let i = 0; i < scbTables.length; i++) {
    const table = scbTables[i];
    if (!table) continue; // skip if table is undefined

    console.log(
      `Upserting data [${table.id}] (${i + 1}/${scbTables.length})...`,
    );

    const tableData = await fetch(
      `https://api.scb.se/OV0104/v2beta/api/v2/tables/${table.id}/data?outputFormat=px`,
    );
    const tableDataText = await tableData.text();

    const embeddingQuery = await generateEmbeddings(table.label);

    await db
      .insert(scb)
      .values({
        scbId: table.id,
        label: table.label,
        firstPeriod: table.firstPeriod,
        lastPeriod: table.lastPeriod,
        data: tableDataText,
        embedding: embeddingQuery?.[0]?.embedding ?? [],
      })
      .onConflictDoUpdate({
        target: scb.scbId,
        set: {
          label: table.title,
          firstPeriod: table.firstPeriod,
          lastPeriod: table.lastPeriod,
          data: tableDataText,
          embedding: embeddingQuery?.[0]?.embedding,
          updatedAt: new Date(),
        },
      });

    console.log(`Data upserted (${i + 1}/${scbTables.length}).`);
    await setTimeoutDelay(5000); // 5 seconds delay after each batch
  }

  console.log("SUCCESS! All SCB data populated successfully.");
};

populateScbData();
