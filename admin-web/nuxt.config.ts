/**
 * Основной конфигурационный файл Nuxt.js приложения
 * Содержит настройки темы, локализации и модулей
 */
import {defineNuxtConfig} from 'nuxt/config';
import Aura from "@primevue/themes/aura"
import {definePreset} from "@primeuix/styled";

/**
 * Настройка основной темы приложения на основе Aura
 * Использует цветовую схему cyan для primary цветов
 */
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

/**
 * Конфигурация Nuxt.js приложения
 */
export default defineNuxtConfig({
    // Дата совместимости для обеспечения стабильности
    compatibilityDate: '2024-11-01',
    
    // Отключение SSR для SPA приложения
    ssr: false,
    
    // Отключение инструментов разработчика
    devtools: {enabled: false},
    
    // Конфигурация переменных окружения
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE,        // Базовый URL API
            imgBase: process.env.NUXT_PUBLIC_MEDIA_API_URL_BASE // Базовый URL для медиа файлов
        }
    },
    
    // Подключенные модули
    modules: [
        '@primevue/nuxt-module',    // UI компоненты PrimeVue
        '@nuxtjs/tailwindcss',      // CSS фреймворк Tailwind
        '@pinia/nuxt'              // Управление состоянием Pinia
    ],
    
    // Конфигурация PrimeVue
    primevue: {
        options: {
            // Настройка темы
            theme: {
                preset: MainPreset
            },
            // Локализация компонентов
            locale: {
                // Тексты для фильтров
                startsWith: "Начинается с",
                contains: "Содержит",
                notContains: "Не содержит",
                endsWith: "Заканчивается на",
                equals: "Равно",
                notEquals: "Не равно",
                noFilter: "Без фильтра",
                lt: "Меньше чем",
                lte: "Меньше или равно",
                gt: "Больше чем",
                gte: "Больше или равно",
                
                // Тексты для работы с датами
                dateIs: "Дата равна",
                dateIsNot: "Дата не равна",
                dateBefore: "Дата до",
                dateAfter: "Дата после",
                
                // Общие действия
                clear: "Очистить",
                apply: "Применить",
                matchAll: "Совпадает со всеми",
                matchAny: "Совпадает с любым",
                addRule: "Добавить правило",
                removeRule: "Удалить правило",
                accept: "Принять",
                reject: "Отклонить",
                choose: "Выбрать",
                upload: "Загрузить",
                cancel: "Отмена",
                completed: "Завершено",
                pending: "В ожидании",
                
                // Единицы измерения
                fileSizeTypes: ["КБ", "МБ", "ГБ"],
                
                // Названия дней недели
                dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                
                // Названия месяцев
                monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
                
                // Тексты для навигации по календарю
                chooseYear: "Выберите год",
                chooseMonth: "Выберите месяц",
                chooseDate: "Выберите дату",
                prevDecade: "Предыдущее десятилетие",
                nextDecade: "Следующее десятилетие",
                prevYear: "Предыдущий год",
                nextYear: "Следующий год",
                prevMonth: "Предыдущий месяц",
                nextMonth: "Следующий месяц",
                prevHour: "Предыдущий час",
                nextHour: "Следующий час",
                prevMinute: "Предыдущая минута",
                nextMinute: "Следующая минута",
                prevSecond: "Предыдущая секунда",
                nextSecond: "Следующая секунда",
                
                // Форматы времени
                am: 'AM',
                pm: 'PM',
                today: 'Сегодня',
                weekHeader: 'Неделя',
                firstDayOfWeek: 1, // Понедельник
                showMonthAfterYear: false,
                dateFormat: 'dd.mm.yy',
                
                // Индикаторы силы пароля
                weak: 'Слабый',
                medium: 'Средний',
                strong: 'Сильный',
                
                // Системные сообщения
                passwordPrompt: 'Введите пароль',
                emptyFilterMessage: 'Нет данных для отображения',
                searchMessage: 'Поиск...',
                selectionMessage: 'Выбрано элементов',
                emptySelectionMessage: 'Ничего не выбрано',
                emptySearchMessage: 'Ничего не найдено',
                emptyMessage: 'Нет данных',
                fileChosenMessage: 'Файл выбран',
                noFileChosenMessage: 'Файл не выбран',
            }
        }
    },
    
    // Глобальные стили
    css: [
        '~/assets/css/global.css'
    ],
})
