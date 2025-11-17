import { GEMINI_IMAGE_MODEL, google } from "@/lib/ai/utils";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";

export const maxDuration = 60; // Allow streaming responses up to 60 seconds

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = await streamText({
    model: google(GEMINI_IMAGE_MODEL),
    providerOptions: {
      google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    messages: convertToModelMessages(messages),
    // system: "You are a helpful assistant who can only create new images based on the images or files provided by the user. Do not generate new images that are unrelated to the user's uploaded images. Respond in Swedish."
    system: "You are a helpful assistant. Respond in Swedish."
  })

  return result.toUIMessageStreamResponse()
}
