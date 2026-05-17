import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

export const runtime = "nodejs";
export const maxDuration = 300;

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = "facebook/detr-resnet-50-panoptic";

if (!HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is not set in environment variables");
}

const hf = new HfInference(HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageUrl: string | undefined = body?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing 'url' in request body" },
        { status: 400 },
      );
    }

    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image from R2: ${imageRes.status}` },
        { status: 502 },
      );
    }

    const imageBlob = await imageRes.blob();

    const result = await hf.imageSegmentation({
      model: MODEL,
      inputs: imageBlob,
    });

    console.log("Segmentation result:", result);

    return NextResponse.json({
      message: "Image processed successfully",
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
