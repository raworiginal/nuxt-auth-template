import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "../db/schema/relations.ts";

export default function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const queryClient = postgres(databaseUrl);

  const db = drizzle({ client: queryClient, relations });

  return db;
}
