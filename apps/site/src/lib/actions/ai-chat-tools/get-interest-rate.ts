import { generateText } from "ai";
import { env } from "@/env";
import {
  GEMINI_CHAT_MODEL,
  google,
  OPENAI_CHAT_MODEL,
  openai,
} from "@/lib/ai/utils";

const getInterestRate = async (question: string) => {
  const today = new Date().toISOString().slice(0, 10);

  // Intialize prompt for AI to extract date
  const prompt = `User question: "${question}"

    For the user question above:
    1. Extract the desired date from the question if provided. If the question mentions a relative date (e.g., "yesterday", "last week"), convert it to an explicit date in YYYY-MM-DD format using "${today}" as the base date. If no date is mentioned or the question relates to today's date, use "${today}" as the date.

    Return the result in this format:

    {
        date: <desired date or today's date in YYYY-MM-DD format>
    }

    Only output the JSON object as shown above.`;

  const initialPrompt = await generateText({
    prompt: prompt,
    model:
      env.AI_CHAT_AGENT === "GEMINI"
        ? google(GEMINI_CHAT_MODEL)
        : openai(OPENAI_CHAT_MODEL),
  });

  // Parse the JSON from the AI response
  let extracted: { date: string };
  try {
    const text = initialPrompt.text.replace(/```json|```/g, "").trim();
    extracted = JSON.parse(text) as { date: string };
  } catch (_e) {
    throw new Error("Failed to parse AI response");
  }

  const { date } = extracted;

  // Fetch interest rate data
  try {
    const response = await fetch(
      `https://api.riksbank.se/swestr/v1/SWESTR?fromDate=${date}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();

    return JSON.stringify(data);
  } catch (error) {
    console.error("Fetch failed (SWESTR API). Error:", error);
    return "Could not retrieve information from the SWESTR API at this time.";
  }
};

export default getInterestRate;
