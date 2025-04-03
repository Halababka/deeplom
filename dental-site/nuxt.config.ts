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
  ],
  app: {
    head: {
      title: 'Зубная клиника Дентал в Волгодонске',
      // script: [
      //   {
      //     src: "https://lidrekon.ru/slep/js/jquery.js",
      //     defer: true,
      //   },
      //   {
      //     src: "https://lidrekon.ru/slep/js/uhpv-hover-full.min.js",
      //     defer: true,
      //   },
      // ],
      meta: [
        {
          name: "description",
          content: "Стоматологическая клиника Дентал в Волгодонске. Безболезненное лечение, протезирование, детский врач"
        },
        { name: 'keywords',
          content: 'зубная, клиника, Волгодонск, Дентал, онлайн, запись, лечить, зубы, записаться' },
        {
          name: 'robots',
          content: 'index, follow'
        },
        {
          name: 'og:title',
          property: 'og:title',
          content: 'Стоматологическая клиника Дентал в Волгодонске'
        },
        {
          name: 'og:description',
          property: 'og:description',
          content: 'Стоматологическая клиника Дентал в Волгодонске. Безболезненное лечение, протезирование, детский врач'
        },
        {
          name: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'og:url',
          property: 'og:url',
          content: 'https://dental-volgodonsk.4de.run'  // Укажите свой URL
        },
      ],
    },
  },
})
