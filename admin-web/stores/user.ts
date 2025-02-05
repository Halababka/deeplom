import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as null | { name: string },
        isAuthenticated: false,
    }),
    actions: {
        setUser(userData: { name: string }) {
            this.user = userData;
            this.isAuthenticated = true;
        },
        logout() {
            this.user = null;
            this.isAuthenticated = false;
            navigateTo("/auth")
        },
        async fetchUser() {
            try {
                const token = useCookie('auth_token'); // Получаем токен из cookies
                const api = useRuntimeConfig().public.apiBase; // Базовый URL API

                const response = await fetch(`${api}/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token.value}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    new Error(`Ошибка запроса: ${response.status}`);
                }

                const userData = await response.json();
                this.setUser(userData); // Обновляем состояние пользователя
            } catch (error) {
                console.error('Не удалось получить данные пользователя:', error);
                return navigateTo('/')
                this.logout(); // Сбрасываем состояние пользователя при ошибке
            }
        },
    },
});
