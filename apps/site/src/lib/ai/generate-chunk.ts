import fs from "node:fs";
import path from "node:path";
import { generateText } from "ai";
import { env } from "@/env";
import { google, openai, GEMINI_CHAT_MODEL, OPENAI_CHAT_MODEL } from "./utils";

export const generateChunks = async () => {
  const prompt = `You are given a plain text file containing information for a website.
					Your task is to extract only the informative content (such as descriptions, explanations, FAQs, and long-form texts) and ignore non-informative entries (such as button labels, short navigation items, or generic phrases like "Back to start", "Close", "Name", etc).
					For each informative context, split the text into individual sentences.
					For each sentence, replace any instance of "we" or "our" with "Bostadsvyn" or "Bostadsvyn's" as appropriate for clarity and professionalism.
					Output each sentence as a separate line of plain text. Do not include context keys, non-informative keys, or any extra formatting. Only output the informative sentences, one per line.
					Here is the website data:
					${fs.readFileSync(path.join(__dirname, "../../data/data.txt"), "utf-8")}
					`;

  const { text } = await generateText({
    model:
      env.AI_CHAT_AGENT === "GEMINI"
        ? google(GEMINI_CHAT_MODEL)
        : openai(OPENAI_CHAT_MODEL),
    prompt,
  });

  // Optionally, write the output to a file for inspection
  // const outputPath = path.join(__dirname, "data-chunks.txt");
  // fs.writeFileSync(outputPath, text, "utf-8");

  return text;
};
