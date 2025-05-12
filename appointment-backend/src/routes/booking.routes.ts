/**
 * Маршруты для работы с бронированиями
 * Обрабатывает запросы, связанные с управлением записями к врачам
 */
import { Router } from "express";
import {
    getAvailableSlots,
    cancelBooking,
    confirmBooking, requestBookingConfirmation
} from "../controllers/booking.controller";

const router = Router();

/**
 * GET /api/booking/slots
 * Получение доступных слотов для записи
 * Возвращает список свободных временных интервалов
 */
router.get("/slots", getAvailableSlots);

/**
 * POST /api/booking/request-confirmation
 * Запрос на верификацию бронирования
 * Проверяет возможность записи на выбранное время
 */
router.post("/request-confirmation", requestBookingConfirmation);

/**
 * DELETE /api/booking/:bookingId
 * Отмена существующей записи
 * @param bookingId - ID записи для отмены
 */
router.delete("/:bookingId", cancelBooking);

/**
 * POST /api/booking/confirm
 * Подтверждение и создание записи
 * Создает новую запись после верификации
 */
router.post("/confirm", confirmBooking);

export default router;
