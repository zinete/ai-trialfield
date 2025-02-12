// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxthub/core'],
  ssr: true,

  nitro: {
    preset: "cloudflare-pages",
  },

  compatibilityDate: '2025-01-24'
})