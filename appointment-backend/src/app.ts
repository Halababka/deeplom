/**
 * Основной файл приложения Express
 * Настраивает middleware и маршруты для API
 */
import express from "express";
import requestRoutes from "./routes/request.routes";
import timetableRoutes from "./routes/timetable.routes";
import bookingRoutes from "./routes/booking.routes";
import doctorRoutes from "./routes/doctor.routes";
import scheduleIdentRequests from "./identScheduler";
import cors from "cors"

/**
 * Настройки CORS для безопасности
 * Разрешаем запросы со всех источников (в продакшене следует ограничить)
 */
const corsOptions = {
    origin: "*", // Разрешить ваш фронтенд
    methods: 'GET,POST,PUT,DELETE',
};

// Инициализация Express приложения
const app = express();

// Подключаем CORS с настройками
app.use(cors(corsOptions));

/**
 * Настройка парсинга JSON и URL-encoded данных
 * Увеличенный лимит для обработки больших объемов данных
 * TODO: Рассмотреть возможность разбиения POST запросов расписания на части
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * Подключение маршрутов API
 * Каждый маршрут обрабатывает свой набор эндпоинтов
 */
app.use("/api/requests", requestRoutes);    // Маршруты для работы с заявками
app.use("/api/timetable", timetableRoutes); // Маршруты для работы с расписанием
app.use("/api/booking", bookingRoutes);     // Маршруты для работы с бронированиями
app.use("/api/doctors", doctorRoutes);      // Маршруты для работы с врачами

/**
 * Middleware для обработки несуществующих маршрутов
 * Возвращает 404 ошибку, если запрошенный ресурс не найден
 */
app.use((req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
});

/**
 * Запуск имитации запросов от IDENT
 * Используется для тестирования интеграции с системой IDENT
 */
scheduleIdentRequests();

export default app;