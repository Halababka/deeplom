export const useLoading = () => {
    // Состояние загрузки
    const isLoading = ref(false);

    // Функция для начала загрузки
    const startLoading = () => {
        isLoading.value = true;
    };

    // Функция для завершения загрузки
    const stopLoading = () => {
        isLoading.value = false;
    };

    return {
        isLoading,
        startLoading,
        stopLoading,
    };
};