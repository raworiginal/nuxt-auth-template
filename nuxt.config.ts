export default defineNuxtConfig({
  extends: ["./layers/auth"],
  srcDir: "app/",
  components: [{ path: "~/components", pathPrefix: false }],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    googleClientId: "",
    googleClientSecret: "",
    githubClientId: "",
    githubClientSecret: "",
  },
  css: ["~~/app/assets/css/main.css"],
});
