import { DeleteObjectCommand } from "@aws-sdk/client-s3";
export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    // Extract object key from public URL
    const base =
      normalizePublicBaseUrl(CLOUDFLARE_BUCKET_PUBLIC_BASE_URL) +
      "/" +
      CLOUDFLARE_BUCKET_NAME +
      "/";
    if (!url.startsWith(base)) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }
    const objectKey = decodeURIComponent(url.slice(base.length));

    const deleteCommand = new DeleteObjectCommand({
      Bucket: CLOUDFLARE_BUCKET_NAME,
      Key: objectKey,
    });
    await r2.send(deleteCommand);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
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
const CLOUDFLARE_BUCKET_PUBLIC_BASE_URL =
  process.env.CLOUDFLARE_BUCKET_PUBLIC_BASE_URL;

function normalizePublicBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function encodeObjectKeyForUrl(key: string): string {
  return key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

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
    if (!CLOUDFLARE_BUCKET_PUBLIC_BASE_URL) {
      return NextResponse.json(
        { error: "CLOUDFLARE_BUCKET_PUBLIC_BASE_URL is not set" },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    // Only allow a single image file
    const entries = Array.from(formData.entries()).filter(
      ([key]) => key === "file",
    );
    if (entries.length !== 1) {
      return NextResponse.json(
        { error: "Only one file can be uploaded at a time." },
        { status: 400 },
      );
    }
    const file = entries[0][1] as File;
    if (!file || !(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const objectKey = `images/${file.name}`;

    // Upload into the images/ prefix in the bucket.
    const putObjectCommand = new PutObjectCommand({
      Bucket: CLOUDFLARE_BUCKET_NAME,
      Key: objectKey,
      Body: buffer,
      ContentType: file.type || undefined,
      ContentDisposition: "inline",
    });

    await r2.send(putObjectCommand);

    // append bucket name before
    const publicUrl = `${normalizePublicBaseUrl(CLOUDFLARE_BUCKET_PUBLIC_BASE_URL)}/${CLOUDFLARE_BUCKET_NAME}/${encodeObjectKeyForUrl(objectKey)}`;

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        url: publicUrl,
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
