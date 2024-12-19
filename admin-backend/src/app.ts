import express from "express"
import doctorRoutes from "./routes/doctor.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from './routes/auth.routes';
import selfRoutes from "./routes/self.routes";
import path from "path";
import fileRoutes from "./routes/file.routes";
import companyRoutes from './routes/company.routes';
import cors from "cors"

// Настройки CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Разрешить ваш фронтенд
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

const app = express();
app.use(express.json());

app.use(cors(corsOptions));

// Middleware для статической раздачи файлов http://localhost:8090/uploads/<имя_файла>
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Подключение маршрутов
app.use("/api/doctors", doctorRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/me", selfRoutes)
app.use('/api/companies', companyRoutes);

// Обработка несуществующих маршрутов
app.use((req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
});
export default app;
