/**
 * Контроллер для работы с бронированиями
 * Обрабатывает HTTP запросы, связанные с управлением записями к врачам
 */
import {Request, Response} from "express";
import * as bookingService from "../services/booking.service";
import * as smsService from "../services/sms.service";

/**
 * Получение доступных временных слотов для записи
 * @param req - Express запрос с параметрами branchId и doctorId
 * @param res - Express ответ
 * 
 * Параметры запроса:
 * - branchId: ID филиала (обязательный)
 * - doctorId: ID врача (обязательный)
 * 
 * @returns 200 OK с массивом доступных слотов
 * @returns 400 Bad Request если не указаны обязательные параметры
 * @returns 500 Internal Server Error при ошибке сервера
 */
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

/**
 * Запрос на подтверждение бронирования через SMS
 * @param req - Express запрос с номером телефона клиента
 * @param res - Express ответ
 * 
 * Тело запроса:
 * - clientPhone: номер телефона клиента (обязательный)
 * 
 * Процесс:
 * 1. Отправляет запрос на звонок с кодом подтверждения
 * 2. Сохраняет код подтверждения в базе данных
 * 3. Возвращает requestId для последующей верификации
 * 
 * @returns 200 OK с requestId при успешной отправке
 * @returns 400 Bad Request если не указан номер телефона
 * @returns 500 Internal Server Error при ошибке отправки
 */
export const requestBookingConfirmation = async (req: Request, res: Response) => {
    console.log("Получен запрос на подтверждение записи на прием")
    const {clientPhone} = req.body;
    
    if (!clientPhone) {
        res.status(400).json({error: "Не указан номер телефона"});
        return;
    }

    console.log("Получен номер телефона")
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

        console.log("Получен ответ от Call Password")

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

/**
 * Отмена существующей записи
 * @param req - Express запрос с ID записи
 * @param res - Express ответ
 * 
 * Параметры URL:
 * - bookingId: ID записи для отмены
 * 
 * @returns 200 OK при успешной отмене
 * @returns 500 Internal Server Error при ошибке
 */
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

/**
 * Подтверждение и создание записи после верификации кода
 * @param req - Express запрос с данными записи и кодом подтверждения
 * @param res - Express ответ
 * 
 * Тело запроса:
 * - requestId: ID запроса на подтверждение (обязательный)
 * - verificationCode: код подтверждения (обязательный)
 * - branchId: ID филиала (обязательный)
 * - doctorId: ID врача (обязательный)
 * - doctorName: имя врача
 * - startDateTime: дата и время приема (обязательный)
 * - clientFullName: ФИО клиента (обязательный)
 * - clientPhone: телефон клиента (обязательный)
 * - planStart: план начала приема
 * - comment: комментарий к записи
 * 
 * Процесс:
 * 1. Проверяет код подтверждения
 * 2. Создает запись в базе данных
 * 
 * @returns 201 Created при успешном создании записи
 * @returns 400 Bad Request если не указаны обязательные параметры
 * @returns 500 Internal Server Error при ошибке
 */
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

