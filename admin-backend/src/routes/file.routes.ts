import {Router} from "express";
import {uploadMiddleware} from "../middleware/multer.middleware";
import {FileController} from "../controllers/file.controller";
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";
import multer from "multer";

const router = Router();

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Папка для загрузки файлов
    },
    filename: (req, file, cb) => {
        // Генерируем длинное случайное число
        const randomNum = Date.now(); // Используем текущее время в миллисекундах
        // Сохраняем файл с рандомным числом и оригинальным именем
        const fileName = `${randomNum}-${decodeURIComponent(file.originalname)}`;
        cb(null, fileName); // Устанавливаем имя файла
    }
});

// Создаем экземпляр multer с настройками хранения
const upload = multer({storage: storage});

// Роут для загрузки нескольких файлов
router.post("/upload", authenticateJWT, checkAdmin, upload.array("files", 10), FileController.uploadFiles); // Загрузка до 10 файлов
// Роут для получения списка файлов
router.get("/", authenticateJWT, checkAdmin, FileController.listFiles);
// Роут для удаления файла по ID
router.delete("/:id", authenticateJWT, checkAdmin, FileController.deleteFile);
// Роут для удаления нескольких файлов
router.delete("/", authenticateJWT, checkAdmin, FileController.deleteMultipleFiles);


export default router;
