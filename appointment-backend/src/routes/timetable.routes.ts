/**
 * Маршруты для работы с расписанием
 * Обрабатывает запросы, связанные с управлением расписанием врачей
 */
import { Router } from "express";
import { postTimeTableController } from "../controllers/timetable.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * POST /api/timetable/PostTimeTable
 * Обновление расписания врачей
 * 
 * Требует аутентификацию через authMiddleware
 * Используется для обновления расписания в системе IDENT
 */
router.post("/PostTimeTable", authMiddleware, postTimeTableController);

export default router;
