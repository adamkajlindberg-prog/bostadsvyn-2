import { embed, embedMany } from "ai";
import { cosineDistance, desc, embeddings, getDbClient, gt, sql } from "db";
import { env } from "@/env";
import {
  GEMINI_EMBEDDING_MODEL,
  google,
  OPENAI_EMBEDDING_MODEL,
  openai,
} from "./utils";

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const embeddingModel =
    env.AI_CHAT_AGENT === "GEMINI"
      ? google.textEmbedding(GEMINI_EMBEDDING_MODEL)
      : openai.textEmbedding(OPENAI_EMBEDDING_MODEL);

  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    providerOptions:
      env.AI_CHAT_AGENT === "GEMINI"
        ? {
            google: {
              outputDimensionality: env.EMBEDDING_DIMENSIONALITY,
            },
          }
        : {
            openai: {
              outputDimensionality: env.EMBEDDING_DIMENSIONALITY,
            },
          },
    values: chunks,
  });

  return embeddings.map((e, i) => ({
    content: chunks[i] ?? "",
    embedding: e,
  }));
};

const generateEmbedding = async (value: string): Promise<number[]> => {
  const embeddingModel =
    env.AI_CHAT_AGENT === "GEMINI"
      ? google.textEmbedding(GEMINI_EMBEDDING_MODEL)
      : openai.textEmbedding(OPENAI_EMBEDDING_MODEL);

  const input = value.replaceAll("\\n", " ");

  const { embedding } = await embed({
    model: embeddingModel,
    providerOptions:
      env.AI_CHAT_AGENT === "GEMINI"
        ? {
            google: {
              outputDimensionality: env.EMBEDDING_DIMENSIONALITY,
            },
          }
        : {
            openai: {
              outputDimensionality: env.EMBEDDING_DIMENSIONALITY,
            },
          },
    value: input,
  });

  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const db = getDbClient();

  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;

  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return similarGuides;
};
