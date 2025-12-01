import { getDbClient, riksbankSwestrInterestRate } from "db";
import { setTimeoutDelay } from "../site/src/utils/set-timeout-delay";

type T_Interest_Rate = {
  rate: number;
  date: string;
  pctl12_5: number;
  pctl87_5: number;
  volume: number;
  alternativeCalculation: boolean;
  alternativeCalculationReason: string | null;
  publicationTime: string;
  republication: boolean;
  numberOfTransactions: number;
  numberOfAgents: number;
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

// Main function to populate SWESTR interest rate data by date range
const populateSwestrInterestRateData = async (
  dateFrom: string,
  dateTo: string,
) => {
  if (!dateFrom || !dateTo) {
    console.error(
      `Error: You must provide date range (--dateFrom="YYYY-MM-DD" --dateTo="YYYY-MM-DD") in the script.`,
    );
    process.exit(1);
  }

  console.log("Retrieving data from Riksbank API (SWESTR - Interest Rate)...");
  console.log(`Using date range: ${dateFrom} to ${dateTo}`);

  const response = await fetch(
    `https://api.riksbank.se/swestr/v1/SWESTR?fromDate=${dateFrom}&toDate=${dateTo}`,
  );
  const data = (await response.json()) as T_Interest_Rate[];

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(data.length / BATCH_SIZE)}...`,
    );

    // Insert or update data in batches
    await db.transaction(async (tx) => {
      for (const item of batch) {
        await tx
          .insert(riksbankSwestrInterestRate)
          .values({
            rate: item.rate,
            date: item.date,
            pctl125: item.pctl12_5,
            pctl875: item.pctl87_5,
            volume: item.volume,
            alternativeCalculation: item.alternativeCalculation,
            alternativeCalculationReason: item.alternativeCalculationReason,
            publicationTime: new Date(item.publicationTime),
            republication: item.republication,
            numberOfTransactions: item.numberOfTransactions,
            numberOfAgents: item.numberOfAgents,
          })
          .onConflictDoUpdate({
            target: riksbankSwestrInterestRate.date,
            set: {
              rate: item.rate,
              date: item.date,
              pctl125: item.pctl12_5,
              pctl875: item.pctl87_5,
              volume: item.volume,
              alternativeCalculation: item.alternativeCalculation,
              alternativeCalculationReason: item.alternativeCalculationReason,
              publicationTime: new Date(item.publicationTime),
              republication: item.republication,
              numberOfTransactions: item.numberOfTransactions,
              numberOfAgents: item.numberOfAgents,
              updatedAt: new Date(),
            },
          });
      }
    });
    console.log(`Batch processed.`);

    await setTimeoutDelay(3000); // 3 seconds delay after each batch
  }

  console.log("SUCCESS! All SWESTR interest rate data populated successfully.");
};

/** 
Example command to run the script:
bun scripts/populate-swestr-interest-rate-data --dateFrom="2025-11-01" --dateTo="2025-11-20"
*/
populateSwestrInterestRateData(dateFrom, dateTo);
