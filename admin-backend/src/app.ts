/**
 * Основной файл приложения Express
 * Настраивает middleware и маршруты
 */
import express from "express"
import doctorRoutes from "./routes/doctor.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from './routes/auth.routes';
import selfRoutes from "./routes/self.routes";
import path from "path";
import fileRoutes from "./routes/file.routes";
import companyRoutes from './routes/company.routes';
import serviceRoutes from './routes/service.routes';
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

// Middleware для парсинга JSON
app.use(express.json());

// Подключаем CORS с настройками
app.use(cors(corsOptions));

/**
 * Middleware для статической раздачи файлов
 * Доступ к загруженным файлам через /uploads/<имя_файла>
 * Доступ к файлам для сида через /seed-files/<имя_файла>
 */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/seed-files", express.static(path.join(__dirname, "../seed-files")));

/**
 * Подключение всех маршрутов API
 * Каждый маршрут обрабатывает свой набор эндпоинтов
 */
app.use("/api/doctors", doctorRoutes);      // Маршруты для работы с врачами
app.use("/api/categories", categoryRoutes); // Маршруты для работы с категориями
app.use('/api/auth', authRoutes);          // Маршруты аутентификации
app.use("/api/files", fileRoutes);         // Маршруты для работы с файлами
app.use("/api/me", selfRoutes);            // Маршруты для работы с текущим пользователем
app.use('/api/companies', companyRoutes);   // Маршруты для работы с компаниями
app.use('/api/services', serviceRoutes);    // Маршруты для работы с услугами

/**
 * Middleware для обработки несуществующих маршрутов
 * Возвращает 404 ошибку, если запрошенный ресурс не найден
 */
app.use((req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
});

export default app;
