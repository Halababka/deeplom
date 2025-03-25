// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE, // путь к api
      imgBase: process.env.NUXT_PUBLIC_MEDIA_API_URL_BASE // путь к медиа файлам
    }
  },
  css: [
    '~/assets/scss/main.scss'
  ]
})
