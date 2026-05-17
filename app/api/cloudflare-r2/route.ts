import { NextRequest, NextResponse } from "next/server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const CLOUDFLARE_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME;
const CLOUDFLARE_BUCKET_S3_REGION =
  process.env.CLOUDFLARE_BUCKET_S3_REGION ?? "auto";
const CLOUDFLARE_BUCKET_S3_ENDPOINT = process.env.CLOUDFLARE_BUCKET_S3_ENDPOINT;
const CLOUDFLARE_BUCKET_S3_API_TOKEN_VALUE =
  process.env.CLOUDFLARE_BUCKET_S3_API_TOKEN_VALUE;
const CLOUDFLARE_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const CLOUDFLARE_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (
  !CLOUDFLARE_BUCKET_NAME ||
  !CLOUDFLARE_BUCKET_S3_ENDPOINT ||
  !CLOUDFLARE_BUCKET_S3_API_TOKEN_VALUE ||
  !CLOUDFLARE_ACCESS_KEY_ID ||
  !CLOUDFLARE_SECRET_ACCESS_KEY
) {
  throw new Error("CLOUDFLARE variables are not set in environment variables");
}

const r2 = new S3Client({
  region: CLOUDFLARE_BUCKET_S3_REGION ?? "auto",
  endpoint: CLOUDFLARE_BUCKET_S3_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file: File = formData.get("file") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // i want to put it insie the images/ folder in the bucket
    const putObjectCommand = new PutObjectCommand({
      Bucket: CLOUDFLARE_BUCKET_NAME,
      Key: `images/${file.name}`,
      Body: buffer,
    });

    const response = await r2.send(putObjectCommand);

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        url: `https://${CLOUDFLARE_BUCKET_NAME}.${CLOUDFLARE_BUCKET_S3_ENDPOINT}/${putObjectCommand.input.Key}`,
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
