import axios from "axios";
import { prisma } from "../db";

const API_URL = "https://lcab.smsint.ru/json/v1.0/callpassword/send";
const X_TOKEN = process.env.X_TOKEN_SMSINT;

interface CallPasswordResponse {
    success: boolean;
    error?: { code: number; descr: string };
    result?: { id: string; code: string };
}

// Запуск Call Password сценария
export const sendCallPassword = async (phoneNumber: string): Promise<CallPasswordResponse> => {
    try {
        const response = await axios.post<CallPasswordResponse>(
            API_URL,
            { recipient: phoneNumber, validate: true }, // TODO: Сменить True на False для запуска в продакшн
            { headers: { "X-Token": X_TOKEN, "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error?.descr || "Ошибка при отправке Call Password");
    }
};

// Сохранение верификационного кода в БД
export const saveVerificationCode = async (
    requestId: string,
    phoneNumber: string,
    verificationCode: string
) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Код действителен 5 минут
    return prisma.smsVerification.create({
        data: {
            requestId,
            phoneNumber,
            verificationCode,
            expiresAt,
        },
    });
};

// Проверка кода подтверждения
export const verifyCode = async (requestId: string, code: string) => {
    const verification = await prisma.smsVerification.findUnique({
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
