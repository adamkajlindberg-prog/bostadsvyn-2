import { getDbClient, riksbankSwestrCompoundedAverage } from "db";
import { setTimeoutDelay } from "../site/src/utils/set-timeout-delay";

type T_Compounded_Average = {
  rate: number;
  date: string;
  startDate: string;
  publicationTime: string;
  republication: boolean;
};

const BATCH_SIZE = 100;

const db = getDbClient();

// Simple argument parser for --dateFrom and --dateTo
const getArg = (flag: string) => {
  const arg = process.argv.find((a) => a.startsWith(flag + "="));
  return arg ? arg.split("=")[1] : undefined;
};

const dateFrom = getArg("--dateFrom") || "";
const dateTo = getArg("--dateTo") || "";

// Main function to populate SWESTR compounded average data by date range
const populateSwestrCompoundedAverageData = async (
  dateFrom: string,
  dateTo: string,
) => {
  if (!dateFrom || !dateTo) {
    console.error(
      `Error: You must provide date range (--dateFrom="YYYY-MM-DD" --dateTo="YYYY-MM-DD") in the script.`,
    );
    process.exit(1);
  }

  console.log(
    "Retrieving data from Riksbank API (SWESTR - Compounded Average)...",
  );
  console.log(`Using date range: ${dateFrom} to ${dateTo}`);

  const response = await fetch(
    `https://api.riksbank.se/swestr/v1/avg/SWESTRAVG1W?fromDate=${dateFrom}&toDate=${dateTo}`,
  );
  const data = (await response.json()) as T_Compounded_Average[];

  // Insert or update data in batches
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.length / BATCH_SIZE)}...`,
    );

    await db.transaction(async (tx) => {
      for (const item of batch) {
        await tx
          .insert(riksbankSwestrCompoundedAverage)
          .values({
            rate: item.rate,
            date: item.date,
            startDate: item.startDate,
            publicationTime: new Date(item.publicationTime),
            republication: item.republication,
          })
          .onConflictDoUpdate({
            target: riksbankSwestrCompoundedAverage.date,
            set: {
              rate: item.rate,
              date: item.date,
              startDate: item.startDate,
              publicationTime: new Date(item.publicationTime),
              updatedAt: new Date(),
            },
          });
      }
    });
    console.log(`Batch processed.`);

    await setTimeoutDelay(3000); // 3 seconds delay after each batch
  }

  console.log(
    "SUCCESS! All SWESTR compounded average data populated successfully.",
  );
};

/** 
Example command to run the script:
bun scripts/populate-swestr-compounded-average-data --dateFrom="2025-11-01" --dateTo="2025-11-20"
*/
populateSwestrCompoundedAverageData(dateFrom, dateTo);
