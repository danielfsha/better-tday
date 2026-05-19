import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge";

const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error(
    "GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables",
  );
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Messages array required" }), {
      status: 400,
    });
  }

  const result = await streamText({
    model: google("gemini-1.5-pro"),
    messages,
    maxOutputTokens: 2048,
  });

  return result.toUIMessageStreamResponse();
}
