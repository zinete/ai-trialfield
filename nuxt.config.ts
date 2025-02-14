// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxthub/core'],
  ssr: true,

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }
  },
  nitro: {
    preset: "cloudflare-pages",
  },
 
  compatibilityDate: '2025-01-24'
})