export default defineNuxtConfig({
  extends: ["@raworiginal/nuxt-auth-layer"],
  srcDir: "app/",
  components: [{ path: "~/components", pathPrefix: false }],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
});
