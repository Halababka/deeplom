import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as null | { username: string },
        isAuthenticated: false,
    }),
    actions: {
        setUser(userData: { username: string }) {
            this.user = userData;
            this.isAuthenticated = true;
        },
        logout() {
            this.user = null;
            this.isAuthenticated = false;
            useCookie('auth_token').value = ""
            navigateTo("/auth")
        },
        async fetchUser() {
            try {
                const token = useCookie('auth_token'); // Получаем токен из cookies
                if (!token.value) {
                    throw new Error('Authentication token is missing');
                }
                const api = useRuntimeConfig().public.apiBase; // Базовый URL API

                const response = await fetch(`${api}/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token.value}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }

                const userData = await response.json();
                this.setUser(userData); // Обновляем состояние пользователя
            } catch (error) {
                console.error('Не удалось получить данные пользователя:', error);
                this.logout(); // Сбрасываем состояние пользователя при ошибке
                // Получаем текущий маршрут
                const route = useRoute();

                // Проверяем, не находимся ли уже на странице авторизации
                if (route.path !== '/auth') {
                    return navigateTo('/auth');
                }

                // Дополнительная логика, если уже на /auth
            }
        },
    },
});
