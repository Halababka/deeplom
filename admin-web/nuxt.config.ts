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
            },
            locale: {
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
                dateIs: "Дата равна",
                dateIsNot: "Дата не равна",
                dateBefore: "Дата до",
                dateAfter: "Дата после",
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
                fileSizeTypes: ["КБ", "МБ", "ГБ"], // Пример значений, можно изменить по необходимости
                dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
                dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
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
                am: 'AM',
                pm: 'PM',
                today: 'Сегодня',
                weekHeader: 'Неделя',
                firstDayOfWeek: 1, // Понедельник
                showMonthAfterYear: false,
                dateFormat: 'dd.mm.yy', // Пример формата даты
                weak: 'Слабый',
                medium: 'Средний',
                strong: 'Сильный',
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
    css: [
        '~/assets/css/global.css'
    ],
})
