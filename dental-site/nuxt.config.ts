// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false, // Отключаем SSR, так как сайт статически генерируется
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE, // путь к api
      imgBase: process.env.NUXT_PUBLIC_MEDIA_API_URL_BASE, // путь к медиа файлам
      appointmentBase: process.env.NUXT_PUBLIC_APPOINTMENT_API_URL_BASE, // путь к api
      siteUrl: 'https://dental-volgodonsk.4de.run'
    }
  },
  css: [
    '~/assets/scss/main.scss'
  ],
  app: {
    head: {
      title: 'Зубная клиника Дентал в Волгодонске',
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Стоматологическая клиника Дентал",
            "description": "Стоматологическая клиника Дентал в Волгодонске. Безболезненное лечение, протезирование, детский врач. Запись онлайн.",
            "url": "https://dental-volgodonsk.4de.run",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Строителей 2е",
              "addressLocality": "Волгодонск",
              "addressRegion": "Ростовская область",
              "addressCountry": "RU"
            },
            "telephone": "+7-938-130-3333",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
                ],
                "opens": "09:00",
                "closes": "19:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "14:00"
              }
            ],
            "priceRange": "₽₽₽",
            "image": "https://dental-volgodonsk.4de.run/logo.png",
            "medicalSpecialty": [
              {
                "@type": "MedicalSpecialty",
                "name": "Общая стоматология",
                "alternateName": "GeneralDentistry"
              },
              {
                "@type": "MedicalSpecialty",
                "name": "Ортодонтия",
                "alternateName": "Orthodontics"
              },
              {
                "@type": "MedicalSpecialty",
                "name": "Протезирование",
                "alternateName": "Prosthodontics"
              },
              {
                "@type": "MedicalSpecialty",
                "name": "Детская стоматология",
                "alternateName": "PediatricDentistry"
              }
            ],
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 47.510765,
              "longitude": 42.190817
            },
            "sameAs": [
              "https://yandex.ru/maps/org/dental/135910965001/"
            ]
          })
        },
      ],
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: "description",
          content: "Стоматологическая клиника Дентал в Волгодонске. Безболезненное лечение, протезирование, детский врач. Запись онлайн."
        },
        {
          name: 'keywords',
          content: 'зубная клиника, стоматология, Волгодонск, Дентал, лечение зубов, протезирование, детский стоматолог, запись к врачу'
        },
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
          content: 'https://dental-volgodonsk.4de.run'
        },
        {
          name: 'og:image',
          property: 'og:image',
          content: 'https://dental-volgodonsk.4de.run/logo-social.webp'
        },
        {
          name: 'og:image:width',
          property: 'og:image:width',
          content: '1280'
        },
        {
          name: 'og:image:height',
          property: 'og:image:height',
          content: '853'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          content: 'Стоматологическая клиника Дентал в Волгодонске'
        },
        {
          name: 'twitter:description',
          content: 'Стоматологическая клиника Дентал в Волгодонске. Безболезненное лечение, протезирование, детский врач'
        },
        {
          name: 'twitter:image',
          content: 'https://dental-volgodonsk.4de.run/logo-social.webp'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
          sizes: '32x32'
        },
        {
          rel: 'canonical',
          href: 'https://dental-volgodonsk.4de.run'
        }
      ]
    },
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  }
})
