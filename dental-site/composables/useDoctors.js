export const useDoctorsStore = async (force = false) => {
    const doctors = useState("doctors", () => {
    });

    if ((!doctors.value) || force) {
        doctors.value = await initDoctors();
    }

    return doctors;
};

// Метод для получения данных о компании
const initDoctors = async () => {
    try {
        // Получаем базовый URL API из конфигурации
        const runtimeConfig = useRuntimeConfig();
        const apiBase = runtimeConfig.public.apiBase;

        const doctors = {
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
        } = useFetch(`${apiBase}/doctors`, {
            onRequest({request, options}) {
                options.headers = {
                    "Content-type": "application/json"
                }

            }
        });

        doctors.data = data;
        doctors.pending = pending;
        doctors.error = error;
        doctors.refresh = refresh;

        return doctors;
    } catch (err) {
        // Обработка ошибки
        console.error('Ошибка при загрузке данных о докторах:', err);
    } finally {

    }
};

