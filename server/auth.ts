import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import getDatabase from "./utils/database";
import * as authSchema from "./db/schema/auth-schema.ts";

const db = getDatabase();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: authSchema,
  }),
});
