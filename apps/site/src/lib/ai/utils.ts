import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/env";

export const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

export const GEMINI_CHAT_MODEL = "gemini-2.5-flash-lite-preview-09-2025";
export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
export const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image-preview";

export const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const OPENAI_CHAT_MODEL = "gpt-4.1";
export const OPENAI_EMBEDDING_MODEL = "text-embedding-ada-002";
