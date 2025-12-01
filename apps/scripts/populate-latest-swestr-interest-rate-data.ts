import { getDbClient, riksbankSwestrInterestRate } from "db";

type T_Api_Response = {
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

// Main function to populate latest SWESTR interest rate data
const populateLatestSwestrInterestRateData = async () => {
  const db = getDbClient();

  console.log(
    "Retrieving latest data from Riksbank API (SWESTR - Interest Rate)...",
  );

  const response = await fetch(
    "https://api.riksbank.se/swestr/v1/latest/SWESTR",
  );
  const data = (await response.json()) as T_Api_Response;

  console.log("Upserting data...");

  // Insert or update SWESTR interest rate into DB
  await db
    .insert(riksbankSwestrInterestRate)
    .values({
      rate: data.rate,
      date: data.date,
      pctl125: data.pctl12_5,
      pctl875: data.pctl87_5,
      volume: data.volume,
      alternativeCalculation: data.alternativeCalculation,
      alternativeCalculationReason: data.alternativeCalculationReason,
      publicationTime: new Date(data.publicationTime),
      republication: data.republication,
      numberOfTransactions: data.numberOfTransactions,
      numberOfAgents: data.numberOfAgents,
    })
    .onConflictDoUpdate({
      target: riksbankSwestrInterestRate.date,
      set: {
        rate: data.rate,
        date: data.date,
        pctl125: data.pctl12_5,
        pctl875: data.pctl87_5,
        volume: data.volume,
        alternativeCalculation: data.alternativeCalculation,
        alternativeCalculationReason: data.alternativeCalculationReason,
        publicationTime: new Date(data.publicationTime),
        republication: data.republication,
        numberOfTransactions: data.numberOfTransactions,
        numberOfAgents: data.numberOfAgents,
        updatedAt: new Date(),
      },
    });

  console.log("Data upserted.");
  console.log(
    "SUCCESS! Latest SWESTR interest rate data populated successfully.",
  );
};

populateLatestSwestrInterestRateData();
