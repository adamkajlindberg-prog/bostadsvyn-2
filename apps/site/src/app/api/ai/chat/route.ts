import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import type { NextRequest } from "next/server";
import z from "zod";
import { env } from "@/env";
import getCompoundedAverage from "@/lib/actions/ai-chat-tools/get-compounded-average";
import getInterestRate from "@/lib/actions/ai-chat-tools/get-interest-rate";
import getLantmateriet from "@/lib/actions/ai-chat-tools/get-lantmateriet";
import getMonetaryPolicyData from "@/lib/actions/ai-chat-tools/get-monetary-policy-data";
import getPoliceEvents from "@/lib/actions/ai-chat-tools/get-police-events";
import getPublishedIndex from "@/lib/actions/ai-chat-tools/get-published-index";
import getScbInfo from "@/lib/actions/ai-chat-tools/get-scb-info";
import getSchoolUnits from "@/lib/actions/ai-chat-tools/get-school-units";
import getSweaObservation from "@/lib/actions/ai-chat-tools/get-swea-observation";
import getTrafficSituations from "@/lib/actions/ai-chat-tools/get-traffic-situations";
import { findRelevantContent } from "@/lib/ai//embedding";
import {
  GEMINI_CHAT_MODEL,
  google,
  OPENAI_CHAT_MODEL,
  openai,
} from "@/lib/ai/utils";

export const maxDuration = 30; // Allow streaming responses up to 30 seconds

const questionSchema = z.object({
  question: z.string().describe("the users question"),
});

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // const systemPrompt = `You are a helpful assistant who primarily uses information from tool calls.
  // 	When you receive data from a tool, summarize and answer the user's question based on that information.
  // 	If no relevant information is found, reply: "Tyvärr har jag ingen information om det."
  // 	Always reply in Swedish.`;

  const systemPrompt = `You are a helpful assistant for Bostadsvyn, a housing portal website for Sweden and abroad. When answering questions, you should primarily use information from your tools and Bostadsvyn's knowledge base. If you cannot find relevant information, answer: "Unfortunately, I have no information about it." Always answer in Swedish.`;

  const result = streamText({
    messages: convertToModelMessages(messages),
    model:
      env.AI_CHAT_AGENT === "GEMINI"
        ? google(GEMINI_CHAT_MODEL)
        : openai(OPENAI_CHAT_MODEL),
    temperature: 0,
    stopWhen: stepCountIs(6),
    system: systemPrompt,
    tools: {
      getInformation: tool({
        description:
          "get website (bostadsvyn) information from your knowledge base to answer questions.",
        execute: async ({ question }) => findRelevantContent(question),
        inputSchema: questionSchema,
      }),
      getPoliceEvents: tool({
        description:
          "get information such as safety and incidents from your knowledge base to answer questions.",
        execute: async ({ location }) => getPoliceEvents(location),
        inputSchema: z.object({
          location: z
            .string()
            .describe("the location to search for police events"),
        }),
      }),
      getTrafficSituations: tool({
        description:
          "get information such as traffic situations and traffic status from your knowledge base to answer questions.",
        execute: async ({ question }) => getTrafficSituations(question),
        inputSchema: questionSchema,
      }),
      getMonetaryPolicyData: tool({
        description:
          "get information such as GDP, GDP gap, policy rate, population, employed persons, labour force, unemployment rate, nominal exchange rate, CPI, CPIF, General government net lending, hourly labour cost, hourly wage, and annual percentage change from your knowledge base to answer questions.",
        execute: async ({ question }) => getMonetaryPolicyData(question),
        inputSchema: questionSchema,
      }),
      getSweaObservation: tool({
        description:
          "get information such as exchange rate, policy rate, deposit rate, lending rate, liquidity facility rate, marginal rate, reference rate, discount rate, STIBOR, Swedish Treasury Bill, Swedish Government Bond, Swedish Fixing Rate, Swedish Mortgage Bond, Swedish Corporate certificate, Swedish TWC-index, Euro market rate, International Government Bond, Special Drawing Rights, Svenskt KIX-index, and SEK/USD Forward Premium from your knowledge base to answer questions.",
        execute: async ({ question }) => getSweaObservation(question),
        inputSchema: questionSchema,
      }),
      getInterestRate: tool({
        description:
          "get information for interest rate from your knowledge base to answer questions.",
        execute: async () => getInterestRate(),
        inputSchema: questionSchema,
      }),
      getCompoundedAverage: tool({
        description:
          "get information for published compounded average from your knowledge base to answer questions.",
        execute: async () => getCompoundedAverage(),
        inputSchema: questionSchema,
      }),
      getPublishedIndex: tool({
        description:
          "get information for published index from your knowledge base to answer questions.",
        execute: async () => getPublishedIndex(),
        inputSchema: questionSchema,
      }),
      getLantmateriet: tool({
        description:
          "get information such as buildings, cadastral parcels, physical water, hydrography network, and land cover from your knowledge base to answer questions.",
        execute: async ({ question }) => getLantmateriet(question),
        inputSchema: questionSchema,
      }),
      getSchoolUnits: tool({
        description:
          "get school information from your knowledge base to answer questions.",
        execute: async ({ question }) => getSchoolUnits(question),
        inputSchema: questionSchema,
      }),
      getScbInfo: tool({
        description:
          "get information such as statistics, population, labour market, export, import, inflation, etc. from your knowledge base to answer questions.",
        execute: async ({ question }) => getScbInfo(question),
        inputSchema: questionSchema,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
