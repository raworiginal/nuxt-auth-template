import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import getDatabase from "./utils/database";
import { getConfiguredSocialProviders } from "./utils/social-providers";
import * as authSchema from "./db/schema/auth-schema";

const db = getDatabase();

export default defineServerAuth(({ runtimeConfig }) => {
  const socialProviders = getConfiguredSocialProviders(runtimeConfig);

  return {
    emailAndPassword: { enabled: true },
    ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
    }),
    plugins: [admin()],
  };
});
