import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const prompt = await req.json();

    // generate the image and return it as a blob
    const generatedImage = "";

    // save to s3 for later use

    return NextResponse.json(
      {
        generatedImage,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
