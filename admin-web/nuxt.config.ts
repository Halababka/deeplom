import {defineNuxtConfig} from 'nuxt/config';
import Aura from "@primevue/themes/aura"
import {definePreset} from "@primeuix/styled";

const MainPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{cyan.50}',
            100: '{cyan.100}',
            200: '{cyan.200}',
            300: '{cyan.300}',
            400: '{cyan.400}',
            500: '{cyan.500}',
            600: '{cyan.600}',
            700: '{cyan.700}',
            800: '{cyan.800}',
            900: '{cyan.900}',
            950: '{cyan.950}'
        }
    }
});

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    ssr: true,
    devtools: {enabled: false},
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE,
        }
    },
    modules: ['@primevue/nuxt-module', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
    primevue: {
        options: {
            theme: {
                preset: MainPreset
            }
        }
    },
    css: [
        '~/assets/css/global.css'
    ],
})
