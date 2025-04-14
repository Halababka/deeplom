import {Request, Response} from "express";
import * as bookingService from "../services/booking.service";
import * as smsService from "../services/sms.service";

// Получение доступных временных слотов
export const getAvailableSlots = async (req: Request, res: Response) => {
    const {branchId, doctorId} = req.query;

    if (!branchId || !doctorId) {
        res.status(400).json({error: "Не указаны обязательные параметры"});
        return
    }

    try {
        const slots = await bookingService.getAvailableSlots(
            Number(branchId),
            Number(doctorId),
        );
        res.json(slots);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error: "Произошла неизвестная ошибка"});
        }
    }
};

export const requestBookingConfirmation = async (req: Request, res: Response) => {
    console.log("Получен запрос на подтверждение записи на прием")
    const {clientPhone} = req.body;
    
    if (!clientPhone) {
        res.status(400).json({error: "Не указан номер телефона"});
        return;
    }

    console.log("Получен номер телефона",clientPhone)
    try {
        // Отправка Call Password запроса
        const response = await smsService.sendCallPassword(clientPhone);

        if (!response.success) {
            res.status(500).json({
                error: "Ошибка при отправке вызова",
                details: response.error,
            });
            return
        }

        console.log("Получен ответ от Call Password", response)

        await smsService.saveVerificationCode(
            response.result!.id,
            clientPhone,
            response.result!.code
        );

        console.log("Сохранен код подтверждения в базу данных")

        // Возвращаем requestId клиенту
        const requestId = response.result?.id;

        res.status(200).json({
            message: "Подтверждение отправлено. Ожидайте звонка.",
            requestId: requestId,
        });
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};

// Отмена записи
export const cancelBooking = async (req: Request, res: Response) => {
    const {bookingId} = req.params;

    try {
        const result = await bookingService.cancelBooking(bookingId);
        res.json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error: "Произошла неизвестная ошибка"});
        }
    }
};

export const confirmBooking = async (req: Request, res: Response) => {
    console.log("Получен запрос на верификацию кода подтверждения")

    const {
        requestId,
        verificationCode,
        branchId,
        doctorId,
        doctorName,
        startDateTime,
        clientFullName,
        clientPhone,
        planStart,
        comment
    } = req.body;

    // Проверка обязательных параметров
    if (!requestId || !verificationCode || !branchId || !doctorId || !startDateTime || !clientFullName || !clientPhone) {
        res.status(400).json({error: "Не указаны обязательные параметры"});
        return;
    }

    try {
        // Проверяем requestId и verificationCode
        console.log("Проверяем requestId и verificationCode")
        await smsService.verifyCode(requestId, verificationCode, clientPhone);

        console.log("Код подтверждения проверен, создаем запись")
        // Создание записи после успешной проверки
        const booking = await bookingService.createBooking(
            Number(branchId),
            Number(doctorId),
            startDateTime,
            clientFullName,
            clientPhone,
            comment,
            planStart,
            doctorName
        );

        res.status(201).json({
            message: "Вы успешно записались на прием. Ждем вас в клинику!",
            booking,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error: "Произошла неизвестная ошибка"});
        }
    }
};

