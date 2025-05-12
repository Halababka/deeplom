/**
 * Маршруты для работы с заявками
 * Обрабатывает запросы, связанные с получением заявок от системы IDENT
 */
import { Router } from "express";
import { getTicketsController } from "../controllers/request.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * GET /api/requests/GetTickets
 * Получение списка заявок
 * 
 * Требует аутентификацию через authMiddleware
 * Используется для получения заявок от системы IDENT
 */
router.get("/GetTickets", (req, res, next) => authMiddleware(req, res, next), getTicketsController);

export default router;
