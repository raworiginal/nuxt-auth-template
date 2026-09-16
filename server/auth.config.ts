import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { username, admin } from "better-auth/plugins";
import { db } from "./utils/db";
import * as schema from "./db/schema";

export default defineServerAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), admin()],
});
