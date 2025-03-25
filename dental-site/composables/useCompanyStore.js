export const useCompanyStore = async (force = false) => {
    const company = useState("company", () => {
    });

    if ((!company.value) || force) {
        company.value = await initCompany();
    }

    return company;
};

// Метод для получения данных о компании
const initCompany = async () => {
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
        } = await useFetch(`${apiBase}/companies/1`, {
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
        console.error('Ошибка при загрузке данных о компании:', err);
    } finally {

    }
};
