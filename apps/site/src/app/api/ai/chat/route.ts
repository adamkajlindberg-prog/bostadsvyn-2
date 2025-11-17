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
import getPublishedIndex from "@/lib/actions/ai-chat-tools/get-published-index";
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

  const systemPrompt = `You are a helpful assistant who only uses information from tool calls.
		When you receive data from a tool, summarize and answer the user's question based on that information.
		If the question is about a location, analyze relevant events from the Police API and draw conclusions about safety or other requests.
		If no relevant information is found, reply: "Tyvärr har jag ingen information om det."
		Always reply in Swedish.`;

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
          "get information from your knowledge base to answer questions.",
        execute: async ({ question }) => findRelevantContent(question),
        inputSchema: questionSchema,
      }),
      // getPoliceEvents: tool({
      // 	description: "get information from Polisen events API to answer questions.",
      // 	execute: async ({ location }) => getPoliceEvents(location),
      // 	inputSchema: z.object({
      // 		location: z.string().describe("the location to search for police events"),
      // 	})
      // }),
      // getTrafficInformation:  tool({
      // 	description: "get information from Trafikverket API for traffic information.",
      // 	execute: async () => getTrafficInfo(),
      // 	inputSchema: questionSchema
      // }),
      // getMonetaryPolicyData: tool({
      // 	description: "get information such as GDP, GDP gap, policy rate, population, employed persons, labour force, unemployment rate, nominal exchange rate, CPI, CPIF, General government net lending, hourly labour cost, hourly wage, and annual percentage change from monetary policy data.",
      // 	execute: async ({ question }) => getMonetaryPolicyData(question),
      // 	inputSchema: questionSchema
      // }),
      // getSweaObservation: tool({
      // 	description: "get information such as exchange rate, policy rate, deposit rate, lending rate, liquidity facility rate, marginal rate, reference rate, discount rate, STIBOR, Swedish Treasury Bill, Swedish Government Bond, Swedish Fixing Rate, Swedish Mortgage Bond, Swedish Corporate certificate, Swedish TWC-index, Euro market rate, International Government Bond, Special Drawing Rights, Svenskt KIX-index, and SEK/USD Forward Premium from Swea API.",
      // 	execute: async ({ question }) => getSweaObservation(question),
      // 	inputSchema: questionSchema
      // }),
      getInterestRate: tool({
        description: "get information for interest rate from SWESTR API.",
        execute: async ({ question }) => getInterestRate(question),
        inputSchema: questionSchema,
      }),
      getCompoundedAverage: tool({
        description:
          "get information for published compounded average from SWESTR API.",
        execute: async ({ question }) => getCompoundedAverage(question),
        inputSchema: questionSchema,
      }),
      getPublishedIndex: tool({
        description: "get information for published index from SWESTR API.",
        execute: async ({ question }) => getPublishedIndex(question),
        inputSchema: questionSchema,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
