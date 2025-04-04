import express from "express";
import requestRoutes from "./routes/request.routes";
import timetableRoutes from "./routes/timetable.routes";
import bookingRoutes from "./routes/booking.routes";
import doctorRoutes from "./routes/doctor.routes";
import scheduleIdentRequests from "./identScheduler";
import cors from "cors"

// Настройки CORS
const corsOptions = {
    origin: "*", // Разрешить ваш фронтенд
    methods: 'GET,POST,PUT,DELETE',

};
const app = express();
// app.use(express.json());

app.use(cors(corsOptions));

// Увеличиваем лимит тела запроса
// :TODO либо разбить POST запрос расписания на несколько частей
app.use(express.json({ limit: "10mb" })); // Замените 10mb на необходимый лимит
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Маршруты
app.use("/api/requests", requestRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/doctors", doctorRoutes);

// Обработка несуществующих маршрутов
app.use((req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
});

// Запуск имитации запросов от IDENT
// scheduleIdentRequests();

export default app;