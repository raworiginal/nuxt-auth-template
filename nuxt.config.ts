// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/better-auth"],
  routeRules: {
    "/admin/**": { auth: { user: { role: "admin" } } },
  },
  vite: {
    plugins: [tailwindcss()]
  },
  css: ["~/assets/css/main.css"]
});
