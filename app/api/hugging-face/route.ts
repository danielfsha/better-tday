import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Qwen/Qwen-Image-Layered",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: bytes,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Hugging Face request failed",
          details: errorText,
        },
        { status: response.status },
      );
    }

    /**
     * Depending on the endpoint,
     * Hugging Face may return:
     * - image blob
     * - JSON
     * - binary output
     */

    const contentType = response.headers.get("content-type");

    // JSON response
    if (contentType?.includes("application/json")) {
      const data = await response.json();

      return NextResponse.json(data);
    }

    // Image response
    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType || "image/png",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
