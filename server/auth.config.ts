import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import getDatabase from "./utils/database";
import * as authSchema from "./db/schema/auth-schema";

const db = getDatabase();

export default defineServerAuth({
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  plugins: [admin()],
});
