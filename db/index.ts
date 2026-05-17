import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const connection = postgres(process.env.DATABASE_URL, { max: 1 });
export const db = drizzle(connection);
