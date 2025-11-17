import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const DATABASE_URL = process.env.DATABASE_URL;

export const EMBEDDING_DIMENSIONALITY = process.env.EMBEDDING_DIMENSIONALITY
  ? parseInt(process.env.EMBEDDING_DIMENSIONALITY, 10)
  : 1536;
export const AI_CHAT_AGENT = process.env.AI_CHAT_AGENT || "OPENAI";
