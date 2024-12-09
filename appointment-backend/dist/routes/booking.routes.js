"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
router.get("/slots", booking_controller_1.getAvailableSlots);
router.post("/request-confirmation", booking_controller_1.requestBookingConfirmation); // Запрос на верификацию
router.delete("/:bookingId", booking_controller_1.cancelBooking); // Удаление записи
router.post("/confirm", booking_controller_1.confirmBooking); // Подтверждение и создание записи
exports.default = router;
