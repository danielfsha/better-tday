import { NextRequest, NextResponse } from "next/server";
import Firecrawl from "@mendable/firecrawl-js";

export const maxDuration = 300;

if (!process.env.FIRECRAWL_API_KEY) {
  throw new Error("FIRECRAWL_API_KEY is not set in environment variables");
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    const firecrawl = new Firecrawl({
      apiKey: process.env.FIRECRAWL_API_KEY,
    });

    // STEP 1 — Initial scrape
    const scrape = await firecrawl.scrape(url, {
      formats: [
        "markdown",
        "html",
        "summary",
        "branding",
        "screenshot",
        "images",
      ],
    });

    const scrapeId = scrape.metadata?.scrapeId;

    // STEP 4 — Return everything
    return NextResponse.json({
      success: true,
      scrape,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
