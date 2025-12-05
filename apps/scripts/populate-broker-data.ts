import { eq, getDbClient, hittaMaklare } from "db";
import puppeteer from "puppeteer";
import { generateEmbeddings } from "@/lib/ai/embedding";
import { setTimeoutDelay } from "@/utils/set-timeout-delay";

type T_Broker_Data = {
  name: string;
  realEstateAgency: string;
  office: string;
  telephone: string;
  email: string;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
  postalCode: string;
  background: string;
  presentation: string[];
  ratings: {
    title: string;
    description: string;
    rating: string;
  }[];
  reviews: {
    title: string;
    description: string;
    count: string;
  }[];
  urlPath: string;
};

const db = await getDbClient();

// Simple argument parser for --page
const getArg = (flag: string) => {
  const arg = process.argv.find((a) => a.startsWith(`${flag}=`));
  return arg ? arg.split("=")[1] : undefined;
};

const page = parseInt(getArg("--page") || "1", 10);

const baseUrl = "https://www.hittamaklare.se";

// Get broker links
const getBrokerLinks = async (pageNumber: number = 1) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/maklare?page=${pageNumber}`);

  const brokerLinks = await page.evaluate(() => {
    // @ts-expect-error
    const cards = document.querySelectorAll(".person_card");
    const hrefs: string[] = [];
    // @ts-expect-error
    cards.forEach((card) => {
      const firstLink = card.querySelector("a");
      if (firstLink?.getAttribute("href")) {
        hrefs.push(firstLink.getAttribute("href") || "");
      }
    });

    return hrefs;
  });

  await browser.close();
  return brokerLinks;
};

// Extract broker data from each link
const extractData = async (brokers: string[]) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const path of brokers) {
    // check if broker already exists in DB
    const existing = await db
      .select()
      .from(hittaMaklare)
      .where(eq(hittaMaklare.urlPath, path));

    if (existing.length > 0) continue; // proceed to next broker if exists

    console.log(`Processing broker path: ${path}`);
    await setTimeoutDelay(3000); // 3 seconds delay for each process
    await page.goto(`${baseUrl}${path}`);

    const brokerData = await page.evaluate(() => {
      // Extract name and real estate agency
      // @ts-expect-error
      const hasName = document.querySelector("h1");
      const name: string = hasName?.innerText ?? "";

      let realEstateAgency: string = "";
      if (hasName) {
        const agencyLink = hasName.nextElementSibling;
        if (agencyLink && agencyLink.tagName === "A") {
          realEstateAgency = agencyLink.innerText.trim();
        }
      }

      // Extract office
      let office = "";
      // @ts-expect-error
      const hasOffice = [...document.querySelectorAll("h3")].find(
        (el) => el.textContent?.trim() === "Kontor",
      );
      if (hasOffice) {
        const officeLink = hasOffice.nextElementSibling;
        if (officeLink && officeLink.tagName === "A") {
          office = officeLink.innerText.trim();
        }
      }

      // Extract contact info and address from LD+JSON
      let telephone = "";
      let email = "";
      let streetAddress = "";
      let postalCode = "";
      let addressLocality = "";
      let addressCountry = "";

      // @ts-expect-error
      const jsonScript = document.querySelector(
        'script[type="application/ld+json"]',
      );
      if (jsonScript) {
        try {
          const json = JSON.parse(jsonScript.textContent || "{}");
          telephone = json.telephone || "";
          email = json.email || "";
          if (json.address) {
            streetAddress = json.address.streetAddress || "";
            postalCode = json.address.postalCode || "";
            addressLocality = json.address.addressLocality || "";
            addressCountry = json.address.addressCountry || "";
          }
        } catch (e) {
          console.error("Error parsing LD+JSON:", e);
        }
      }

      // Extract background
      let background = "";
      // @ts-expect-error
      const hasBackground = [...document.querySelectorAll("h3")].find(
        (el) => el.textContent?.trim() === "Bakgrund",
      );
      if (hasBackground) {
        const content = hasBackground.nextElementSibling;
        if (content && content.tagName === "P")
          background = content.innerText.trim();
      }

      // Extract presentation
      const presentation: string[] = [];
      // @ts-expect-error
      const hasPresentation = [...document.querySelectorAll("h3")].find(
        (el) => el.textContent?.trim() === "Presentation",
      );
      if (hasPresentation) {
        let elem = hasPresentation.nextElementSibling;
        while (elem && elem.tagName === "P") {
          presentation.push(elem.innerText.replace(/\n/g, "").trim());
          elem = elem.nextElementSibling;
        }
      }

      // Extract ratings and reviews
      const ratings: Array<{
        title: string;
        description: string;
        rating: string;
      }> = [];
      const reviews: Array<{
        title: string;
        description: string;
        count: string;
      }> = [];

      // @ts-expect-error
      const flexContainer = document.querySelector(
        ".tw-flex.tw-mt-8.tw-flex-wrap",
      );
      if (flexContainer) {
        const sections = flexContainer.querySelectorAll(".tw-flex-1");

        // Extract ratings
        if (sections[0]) {
          const ratingGrid = sections[0].querySelector(
            ".tw-grid.tw-gap-y-4.tw-grid-cols-\\[1fr_max-content\\]",
          );
          if (ratingGrid) {
            const ratingRows = ratingGrid.querySelectorAll(
              ".tw-border-0.tw-border-b",
            );
            for (let i = 0; i < ratingRows.length; i += 2) {
              const titleElement = ratingRows[i]?.querySelector(".tw-text-lg");
              const descriptionElement =
                ratingRows[i]?.querySelector(".tw-text-sm");
              const ratingElement = ratingRows[i + 1];

              if (titleElement && descriptionElement && ratingElement) {
                ratings.push({
                  title: titleElement.innerText.trim(),
                  description: descriptionElement.innerText.trim(),
                  rating: ratingElement.innerText.trim(),
                });
              }
            }
          }
        }

        // Extract reviews
        if (sections[1]) {
          const reviewGrid = sections[1].querySelector(
            ".tw-grid.tw-gap-y-4.tw-grid-cols-\\[1fr_max-content\\]",
          );
          if (reviewGrid) {
            const reviewRows = reviewGrid.querySelectorAll(
              ".tw-border-0.tw-border-b",
            );
            for (let i = 0; i < reviewRows.length; i += 2) {
              const titleElement = reviewRows[i]?.querySelector(".tw-text-lg");
              const descriptionElement =
                reviewRows[i]?.querySelector(".tw-text-sm");
              const countElement = reviewRows[i + 1];

              if (titleElement && descriptionElement && countElement) {
                reviews.push({
                  title: titleElement.innerText.trim(),
                  description: descriptionElement.innerText.trim(),
                  count: countElement.innerText.trim(),
                });
              }
            }
          }
        }
      }

      return {
        name,
        realEstateAgency,
        office,
        telephone,
        email,
        streetAddress,
        addressLocality,
        addressCountry,
        postalCode,
        background,
        presentation,
        ratings,
        reviews,
      };
    });

    await insertData({ ...brokerData, urlPath: path });
    console.log(`Inserted broker: ${brokerData.name}`);
  }

  await browser.close();
};

// Insert broker data into DB
const insertData = async (brokerData: T_Broker_Data) => {
  const dataToEmbed = [
    brokerData.office,
    brokerData.streetAddress,
    brokerData.addressLocality,
  ]
    .filter(Boolean)
    .join(", ");

  const embeddingQuery = await generateEmbeddings(dataToEmbed);

  await db.insert(hittaMaklare).values({
    ...brokerData,
    embedding: embeddingQuery?.[0]?.embedding ?? [],
  });
};

// Main function to populate broker data
const populateBrokerData = async () => {
  console.log(`Retrieving broker links from Hitta Mäklare (page ${page})...`);
  const brokerLinks = await getBrokerLinks(page);
  await extractData(brokerLinks);
  console.log("SUCCESS! Broker data population completed.");
};

/** 
Example command to run the script:
bun apps/scripts/populate-broker-data --page="1"

Note: 
The --page argument is optional and defaults to 1 if not provided.
*/
populateBrokerData();
