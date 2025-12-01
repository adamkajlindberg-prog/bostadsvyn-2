import { getDbClient, schoolUnits } from "db";
import { generateEmbeddings } from "../site/src/lib/ai/embedding";
import { chunkArray } from "../site/src/utils/chunk-array";
import { setTimeoutDelay } from "../site/src/utils/set-timeout-delay";

type T_School_Unit = {
  schoolUnitCode: string;
  schoolName?: string;
  displayName: string;
  status: string;
  url?: string;
  email?: string;
  phoneNumber?: string;
  headMaster?: string;
  streetAddress?: string;
  locality?: string;
  postalCode?: string;
  orientationType?: string;
  schoolUnitType?: string;
  municipalityCode?: string;
  specialSupportSchool?: boolean;
  hospitalSchool?: boolean;
  startDate?: Date;
  endDate?: Date;
};

type T_School_Address = {
  type: string;
  streetAddress?: string;
  postalCode?: string;
  locality?: string;
};

type T_School_Unit_Response = {
  data: {
    schoolUnitCode: string;
    attributes: T_School_Unit_Attribute;
  };
};

type T_School_Unit_Attribute = {
  schoolName?: string;
  displayName: string;
  status: string;
  url?: string;
  email?: string;
  phoneNumber?: string;
  headMaster?: string;
  addresses?: T_School_Address[];
  orientationType?: string;
  schoolUnitType?: string;
  municipalityCode?: string;
  specialSupportSchool?: boolean;
  hospitalSchool?: boolean;
  startdate?: string;
  endDate?: string;
};

type T_School_Units = {
  data: {
    attributes: T_School_Unit[];
  };
};

const BATCH_SIZE = 100;

const db = getDbClient();

// Retrieve existing school unit codes from DB
const getExistingData = async () => {
  const data = await db
    .select({ schoolUnitCode: schoolUnits.schoolUnitCode })
    .from(schoolUnits);

  return data.map((row) => row.schoolUnitCode);
};

// Retrieve all school units
const getAllSchoolUnits = async () => {
  const response = await fetch(
    "https://api.skolverket.se/skolenhetsregistret/v2/school-units",
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  return data as T_School_Units;
};

// Retrieve specific school unit information
const retrieveData = async (schoolUnitCode: string) => {
  const response = await fetch(
    `https://api.skolverket.se/skolenhetsregistret/v2/school-units/${schoolUnitCode}`,
  );
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  return data as T_School_Unit_Response;
};

// Prepare school unit data for insertion
const prepareData = async (code: string): Promise<T_School_Unit | null> => {
  try {
    const schoolUnit = await retrieveData(code);
    const visitAddress = schoolUnit.data.attributes.addresses?.find(
      (address: T_School_Address) => address.type === "BESOKSADRESS",
    );

    return {
      schoolUnitCode: schoolUnit.data.schoolUnitCode,
      schoolName: schoolUnit.data.attributes.schoolName,
      displayName: schoolUnit.data.attributes.displayName,
      status: schoolUnit.data.attributes.status,
      url: schoolUnit.data.attributes.url,
      email: schoolUnit.data.attributes.email,
      phoneNumber: schoolUnit.data.attributes.phoneNumber,
      headMaster: schoolUnit.data.attributes.headMaster,
      streetAddress: visitAddress?.streetAddress,
      locality: visitAddress?.locality,
      postalCode: visitAddress?.postalCode,
      orientationType: schoolUnit.data.attributes.orientationType,
      schoolUnitType: schoolUnit.data.attributes.schoolUnitType,
      municipalityCode: schoolUnit.data.attributes.municipalityCode,
      specialSupportSchool: schoolUnit.data.attributes.specialSupportSchool,
      hospitalSchool: schoolUnit.data.attributes.hospitalSchool,
      startDate: schoolUnit.data.attributes.startdate
        ? new Date(schoolUnit.data.attributes.startdate)
        : undefined,
      endDate: schoolUnit.data.attributes.endDate
        ? new Date(schoolUnit.data.attributes.endDate)
        : undefined,
    };
  } catch {
    return null;
  }
};

// Insert batch of school units through transaction into DB
const insertBatch = async (batch: T_School_Unit[]) => {
  await db.transaction(async (tx) => {
    for (const data of batch) {
      if (!data) continue;

      const dataToEmbed = [
        data.displayName,
        data.schoolName,
        data.status,
        data.streetAddress,
        data.locality,
      ]
        .filter(Boolean)
        .join(", ");

      const embeddingQuery = await generateEmbeddings(dataToEmbed);

      await tx.insert(schoolUnits).values({
        ...data,
        startDate: data.startDate
          ? data.startDate.toISOString().slice(0, 10)
          : null,
        endDate: data.endDate ? data.endDate.toISOString().slice(0, 10) : null,
        embedding: embeddingQuery?.[0]?.embedding ?? [],
      });
    }
  });
};

// Main function to populate school units data
const populateSchoolUnitsData = async () => {
  try {
    console.log("Retrieving data from Skolverket API...");

    const existingData = await getExistingData();
    const schoolUnits = await getAllSchoolUnits();

    const schoolUnitCodes = schoolUnits.data.attributes.map(
      (unit) => unit.schoolUnitCode,
    ); // extract school unit codes from API
    const freshCodes = schoolUnitCodes.filter(
      (code: string) => !existingData.includes(code),
    ); // filter out existing codes

    // const freshCodes = [
    //     "11808146",
    //     "12852899",
    //     "36589800",
    //     "73048821",
    //     "46826772",
    //     "30030749",
    //     "19207279",
    //     "46379730",
    //     "18317903",
    //     "30850713",
    //     "19321596",
    //     "61184554"
    // ]

    const batches: string[][] = chunkArray(freshCodes, BATCH_SIZE);
    const totalBatches = batches.length;

    for (const batchCodes of batches) {
      const batchNumber = batches.indexOf(batchCodes);
      console.log(
        `Inserting batch ${batchNumber + 1}/${totalBatches} (${batchCodes.length} school units)...`,
      );

      const batchData: (T_School_Unit | null)[] = await Promise.all(
        batchCodes.map(prepareData),
      );

      await insertBatch(batchData.filter(Boolean) as T_School_Unit[]);
      console.log(`Inserted batch ${batchNumber + 1}/${totalBatches}.`);

      await setTimeoutDelay(5000); // 5 seconds delay after each batch
    }

    console.log("SUCCESS! School Units data population completed.");
  } catch (error) {
    console.error(
      "Fetch failed (Skolverket API - School Units). Error:",
      error,
    );
  }
};

populateSchoolUnitsData();
