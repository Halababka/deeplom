import { Router } from "express";
import {
    getAvailableSlots,
    cancelBooking,
    confirmBooking, requestBookingConfirmation
} from "../controllers/booking.controller";

const router = Router();

router.get("/slots", getAvailableSlots);
router.post("/request-confirmation", requestBookingConfirmation); // Запрос на верификацию
router.delete("/:bookingId", cancelBooking); // Удаление записи
router.post("/confirm", confirmBooking); // Подтверждение и создание записи
export default router;
