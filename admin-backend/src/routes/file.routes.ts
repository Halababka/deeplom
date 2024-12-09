import { Router } from "express";
import { uploadMiddleware } from "../middleware/multer.middleware";
import { FileController } from "../controllers/file.controller";
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";

const router = Router();

// Роут для загрузки нескольких файлов
router.post("/upload", authenticateJWT, checkAdmin, uploadMiddleware.array("files", 10), FileController.uploadFiles); // Загрузка до 10 файлов
// Роут для получения списка файлов
router.get("/", authenticateJWT, checkAdmin, FileController.listFiles);
// Роут для удаления файла по ID
router.delete("/:id", authenticateJWT, checkAdmin, FileController.deleteFile);
// Роут для удаления нескольких файлов
router.delete("/", FileController.deleteMultipleFiles);


export default router;
