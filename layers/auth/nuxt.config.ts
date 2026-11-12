import tailwindcss from "@tailwindcss/vite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";

const layerRoot = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  $meta: {
    name: "auth",
  },
  srcDir: join(layerRoot, "app"),
  modules: ["@nuxtjs/better-auth", "@nuxt/ui"],
  auth: {
    redirects: {
      login: "/login",
      guest: "/app",
    },
  },
  routeRules: {
    "/app/**": { auth: { only: "user", redirectTo: "/login" } },
    "/admin/**": {
      auth: { user: { role: "admin" }, redirectTo: "/app" },
    },
    "/login": { auth: { only: "guest", redirectTo: "/app" } },
    "/register": { auth: { only: "guest", redirectTo: "/app" } },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: [join(layerRoot, "app/assets/css/main.css")],
  imports: {
    dirs: [
      join(layerRoot, "app/composables/auth"),
      join(layerRoot, "app/composables/admin"),
      join(layerRoot, "app/utils"),
    ],
  },
  components: [
    {
      path: join(layerRoot, "app/components"),
      pathPrefix: false,
    },
  ],
});
