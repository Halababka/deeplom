/**
 * Основной конфигурационный файл Nuxt.js приложения
 * Содержит настройки для SEO, метаданных и интеграции с API
 */
export default defineNuxtConfig({
  // Дата совместимости для обеспечения стабильности
  compatibilityDate: '2024-11-01',
  
  // Отключение инструментов разработчика
  devtools: { enabled: false },
  
  // Отключение SSR для статической генерации сайта
  ssr: false,
  
  // Конфигурация переменных окружения
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,        // Базовый URL API
      imgBase: process.env.NUXT_PUBLIC_MEDIA_API_URL_BASE, // Базовый URL для медиа файлов
      appointmentBase: process.env.NUXT_PUBLIC_APPOINTMENT_API_URL_BASE, // URL для API записи
      siteUrl: 'https://dental-volgodonsk.4de.run'      // Основной URL сайта
    }
  },
  
  // Подключение глобальных стилей
  css: [
    '~/assets/scss/main.scss'
  ],
  
  // Конфигурация приложения
  app: {
    head: {
      // Заголовок сайта
      title: 'Зубная клиника Дентал в Волгодонске',
      
      // Структурированные данные для поисковых систем
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Стоматологическая клиника Дентал",
            "description": "Стоматологическая клиника Дентал в Волгодонске. Безболезненное лечение, протезирование, детский врач. Запись онлайн.",
            "url": "https://dental-volgodonsk.4de.run",
            // Адрес клиники
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "ул. Строителей 2е",
              "addressLocality": "Волгодонск",
              "addressRegion": "Ростовская область",
              "addressCountry": "RU"
            },
            "telephone": "+7-938-130-3333",
            // Часы работы
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
            // Специализации клиники
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
            // Геолокация клиники
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 47.510765,
              "longitude": 42.190817
            },
            // Ссылки на внешние ресурсы
            "sameAs": [
              "https://yandex.ru/maps/org/dental/135910965001/"
            ]
          })
        },
      ],
      
      // Мета-теги для SEO
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
          content: 'noindex, nofollow'
        },
        // Open Graph мета-теги для социальных сетей
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
        // Twitter Card мета-теги
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
      
      // Ссылки на иконки и канонический URL
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
  
  // Настройки предварительного рендеринга
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'] // Предварительный рендеринг sitemap.xml
    }
  }
})
