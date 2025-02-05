// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    }
  },
  modules: ['vue-yandex-maps/nuxt'],
  yandexMaps: {
    apikey: '50c73745-8e71-4c20-8098-8be1d741af6f',
  },
  css: [
    '~/assets/scss/main.scss'
  ],
})
