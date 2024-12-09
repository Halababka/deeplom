"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.saveVerificationCode = exports.sendCallPassword = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../db");
const API_URL = "https://lcab.smsint.ru/json/v1.0/callpassword/send";
const X_TOKEN = process.env.X_TOKEN_SMSINT;
// Запуск Call Password сценария
const sendCallPassword = async (phoneNumber) => {
    try {
        const response = await axios_1.default.post(API_URL, { recipient: phoneNumber, validate: true }, // TODO: Сменить True на False для запуска в продакшн
        { headers: { "X-Token": X_TOKEN, "Content-Type": "application/json" } });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.error?.descr || "Ошибка при отправке Call Password");
    }
};
exports.sendCallPassword = sendCallPassword;
// Сохранение верификационного кода в БД
const saveVerificationCode = async (requestId, phoneNumber, verificationCode) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Код действителен 5 минут
    return db_1.prisma.smsVerification.create({
        data: {
            requestId: requestId,
            phoneNumber,
            verificationCode,
            expiresAt,
        },
    });
};
exports.saveVerificationCode = saveVerificationCode;
// Проверка кода подтверждения
const verifyCode = async (requestId, code) => {
    const verification = await db_1.prisma.smsVerification.findUnique({
        where: { requestId },
    });
    if (!verification) {
        throw new Error("Код подтверждения не найден");
    }
    if (verification.verificationCode !== code) {
        throw new Error("Неверный код подтверждения");
    }
    if (new Date() > verification.expiresAt) {
        throw new Error("Срок действия кода подтверждения истёк");
    }
    return verification;
};
exports.verifyCode = verifyCode;
