"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.createBooking = exports.getAvailableSlots = void 0;
const db_1 = require("../db");
// Получение доступных временных слотов
const getAvailableSlots = async (branchId, doctorId, date) => {
    return db_1.prisma.iDENT_Intervals.findMany({
        where: {
            branchId,
            doctorId,
            startDateTime: {
                gte: new Date(date),
            },
            isBusy: false,
        },
    });
};
exports.getAvailableSlots = getAvailableSlots;
// Сервис для создания заявки
const createBooking = async (branchId, doctorId, startDateTime, clientName, clientSurname, clientPatronymic, clientPhone) => {
    // Проверяем наличие слота
    const slot = await db_1.prisma.iDENT_Intervals.findUnique({
        where: {
            branchId_doctorId_startDateTime: {
                branchId,
                doctorId,
                startDateTime: new Date(startDateTime),
            },
        },
    });
    if (!slot || slot.isBusy) {
        throw new Error("Слот недоступен для записи");
    }
    // Создаем заявку
    const booking = await db_1.prisma.request.create({
        data: {
            dateAndTime: new Date(startDateTime),
            clientName,
            clientSurname,
            clientPatronymic,
            clientPhone,
            doctorId,
            // Здесь нужно указывать, если необходимо добавить дополнительные поля, например:
            // clientSurname, clientPatronymic и другие
        },
    });
    // Обновляем слот как занятый
    await db_1.prisma.iDENT_Intervals.update({
        where: {
            branchId_doctorId_startDateTime: {
                branchId,
                doctorId,
                startDateTime: new Date(startDateTime),
            },
        },
        data: {
            isBusy: true,
        },
    });
    return booking; // Возвращаем созданную запись
};
exports.createBooking = createBooking;
// Отмена записи
const cancelBooking = async (bookingId) => {
    // Находим заявку с информацией о враче и его слотах
    const booking = await db_1.prisma.request.findUnique({
        where: { id: bookingId },
        include: {
            doctor: {
                include: {
                    slots: true, // Получаем слоты врача
                },
            },
        },
    });
    // Проверка на наличие заявки и информации о враче
    if (!booking || !booking.doctor) {
        throw new Error("Запись не найдена или врач не указан");
    }
    // Тип для слота
    const doctorSlot = booking.doctor.slots.find((slot) => slot.startDateTime === booking.dateAndTime);
    // Если слот не найден
    if (!doctorSlot) {
        throw new Error("Слот не найден");
    }
    // Обновляем слот как свободный
    await db_1.prisma.iDENT_Intervals.update({
        where: {
            branchId_doctorId_startDateTime: {
                branchId: doctorSlot.branchId,
                doctorId: booking.doctorId,
                startDateTime: booking.dateAndTime,
            },
        },
        data: {
            isBusy: false,
        },
    });
    // Удаляем заявку
    await db_1.prisma.request.delete({
        where: { id: bookingId },
    });
    return { message: "Запись успешно отменена" };
};
exports.cancelBooking = cancelBooking;
