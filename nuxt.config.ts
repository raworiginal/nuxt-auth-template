import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxtjs/better-auth"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
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
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  imports: {
    dirs: ["~/composables/auth", "~/composables/admin"],
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
});
