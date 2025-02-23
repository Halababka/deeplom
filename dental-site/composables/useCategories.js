export const useCategories = () => {
    // Глобальное состояние для хранения категорий
    const categoriesState = useState('categories', () => null);

    // Глобальное состояние для загрузки
    const loadingState = useState('categoriesLoading', () => false);

    // Глобальное состояние для ошибок
    const errorState = useState('categoriesError', () => null);

    // Метод для получения категорий
    const fetchCategories = async (force = false) => {
        try {
            // Если данные уже есть и force не указан, возвращаем сохраненные данные
            if (categoriesState.value && !force) {
                return categoriesState.value;
            }

            // Устанавливаем флаг загрузки
            loadingState.value = true;

            // Получаем базовый URL API из конфигурации
            const runtimeConfig = useRuntimeConfig();
            const apiBase = runtimeConfig.public.apiBase;

            // Делаем запрос на сервер
            const response = await $fetch(`${apiBase}/categories`, {
                method: 'GET',
            });

            // Сохраняем полученные данные в глобальное состояние
            categoriesState.value = response;
            errorState.value = null; // Сбрасываем ошибку, если она была
        } catch (err) {
            // Обработка ошибки
            errorState.value = err;
            console.error('Ошибка при загрузке категорий:', err);
        } finally {
            // Сбрасываем флаг загрузки
            loadingState.value = false;
        }
    };

    // Возвращаем управляемые значения и методы
    return {
        categories: categoriesState,
        isLoading: loadingState,
        error: errorState,
        fetchCategories,
    };
};