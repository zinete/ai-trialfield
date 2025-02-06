// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,

  nitro: {
    preset: 'node'
  },

  compatibilityDate: '2025-01-24'
})