"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmBooking = exports.cancelBooking = exports.requestBookingConfirmation = exports.getAvailableSlots = void 0;
const bookingService = __importStar(require("../services/booking.service"));
const smsService = __importStar(require("../services/sms.service"));
// Получение доступных временных слотов
const getAvailableSlots = async (req, res) => {
    const { branchId, doctorId, date } = req.query;
    if (!branchId || !doctorId || !date) {
        res.status(400).json({ error: "Не указаны обязательные параметры" });
        return;
    }
    try {
        const slots = await bookingService.getAvailableSlots(Number(branchId), Number(doctorId), date);
        res.json(slots);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Произошла неизвестная ошибка" });
        }
    }
};
exports.getAvailableSlots = getAvailableSlots;
const requestBookingConfirmation = async (req, res) => {
    const { clientPhone } = req.body;
    if (!clientPhone) {
        res.status(400).json({ error: "Не указан номер телефона" });
        return;
    }
    try {
        // Отправка Call Password запроса
        const response = await smsService.sendCallPassword(clientPhone);
        if (!response.success) {
            res.status(500).json({
                error: "Ошибка при отправке вызова",
                details: response.error,
            });
            return;
        }
        await smsService.saveVerificationCode(response.result.id, clientPhone, response.result.code);
        // Возвращаем requestId клиенту
        const requestId = response.result?.id;
        res.status(200).json({
            message: "Подтверждение отправлено. Ожидайте звонка.",
            requestId: requestId,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.requestBookingConfirmation = requestBookingConfirmation;
// Отмена записи
const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const result = await bookingService.cancelBooking(bookingId);
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Произошла неизвестная ошибка" });
        }
    }
};
exports.cancelBooking = cancelBooking;
const confirmBooking = async (req, res) => {
    const { requestId, verificationCode, branchId, doctorId, startDateTime, clientName, clientSurname, clientPatronymic, clientPhone } = req.body;
    // Проверка обязательных параметров
    if (!requestId || !verificationCode || !branchId || !doctorId || !startDateTime || !clientName || !clientPhone || !clientSurname) {
        res.status(400).json({ error: "Не указаны обязательные параметры" });
        return;
    }
    try {
        // Проверяем requestId и verificationCode
        await smsService.verifyCode(requestId, verificationCode);
        // Создание записи после успешной проверки
        const booking = await bookingService.createBooking(Number(branchId), Number(doctorId), startDateTime, clientName, clientSurname, clientPatronymic, clientPhone);
        res.status(201).json({
            message: "Запись успешно создана",
            booking,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Произошла неизвестная ошибка" });
        }
    }
};
exports.confirmBooking = confirmBooking;
