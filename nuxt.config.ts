// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  ssr: true,

  nitro: {
    preset: 'node-server',
    output: {
      dir: './dist',  // Specify the output directory
      serverDir: './dist/server',
      publicDir: './dist/public'
    }
  },

  compatibilityDate: '2025-01-24'
})