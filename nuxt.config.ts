// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxthub/core"],
  ssr: true,
  runtimeConfig: {
    apiKey: process.env.NUXT_API_KEY,
    apiBaseUrl: process.env.NUXT_API_BASE_URL,
    aiModel: process.env.NUXT_AI_MODEL,
    public: {
      aiModel: process.env.NUXT_AI_MODEL,
    },
  },
  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
  },
  hub: {
    ai: true,
  },
  nitro: {
    preset: "cloudflare-pages",
    experimental: {
      openAPI: true,
    },
  },
  compatibilityDate: "2025-01-24",
});
