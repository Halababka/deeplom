export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('auth_token'); // Читаем токен из cookie

    if (!token.value && to.path !== '/auth') {
        return navigateTo('/auth');
    }
});
