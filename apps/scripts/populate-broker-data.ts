import puppeteer from "puppeteer";
import { setTimeoutDelay } from "@/utils/set-timeout-delay";

const baseUrl = "https://www.hittamaklare.se";

const getBrokerLinks = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/maklare`);

  const brokerLinks = await page.evaluate(() => {
    // @ts-expect-error
    const cards = document.querySelectorAll(".person_card");
    const hrefs: string[] = [];
    // @ts-expect-error
    cards.forEach((card) => {
      const firstLink = card.querySelector("a");
      if (firstLink && firstLink.getAttribute("href")) {
        hrefs.push(firstLink.getAttribute("href") || "");
      }
    });

    return hrefs;
  });

  await browser.close();
  return brokerLinks;
};

const upsertData = async (brokers: string[]) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const link of brokers) {
    await setTimeoutDelay(3000); // 3 seconds delay for each process
    await page.goto(`${baseUrl}${link}`);

    const brokerData = await page.evaluate(() => {
      // Extract name and real estate agency
      // @ts-expect-error
      const hasName = document.querySelector("h1");
      const name = hasName?.innerText ?? "";

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
        background,
        presentation,
        ratings,
        reviews,
      };
    });

    console.log(brokerData);
  }

  await browser.close();
};

const populateBrokerData = async () => {
  console.log("Retrieving broker links from Hitta Mäklare...");
  const brokerLinks = await getBrokerLinks();
  await upsertData(brokerLinks);
};

populateBrokerData();
