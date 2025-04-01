export const useCategoriesStore = async (force = false) => {
    const categories = useState("categories", () => {
    });

    if ((!categories.value) || force) {
        categories.value = await initCategories();
    }

    return categories;
};

// Метод для получения данных о компании
const initCategories = async () => {
    try {

        // Получаем базовый URL API из конфигурации
        const runtimeConfig = useRuntimeConfig();
        const apiBase = runtimeConfig.public.apiBase;

        const company = {
            data: [],
            pending: [],
            error: [],
            refresh: []
        };

        // Делаем запрос на сервер
        const {
            data,
            pending,
            error,
            refresh
        } = useFetch(`${apiBase}/categories`, {
            onRequest({request, options}) {
                options.headers = {
                    "Content-type": "application/json"
                }

            }
        });

        company.data = data;
        company.pending = pending;
        company.error = error;
        company.refresh = refresh;

        return company;
    } catch (err) {
        // Обработка ошибки
        console.error('Ошибка при загрузке категорий:', err);
    } finally {

    }
};
