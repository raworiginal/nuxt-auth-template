import { defineServerAuth } from "@nuxtjs/better-auth/config";
import { admin } from "better-auth/plugins";
import { getConfiguredSocialProviders } from "./utils/social-providers";

export default defineServerAuth(({ runtimeConfig }) => {
  const socialProviders = getConfiguredSocialProviders(runtimeConfig);

  return {
    emailAndPassword: { enabled: true },
    ...(Object.keys(socialProviders).length > 0 ? { socialProviders } : {}),
    plugins: [admin()],
  };
});
