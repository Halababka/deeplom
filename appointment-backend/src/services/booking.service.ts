import { prisma } from "../db";

// Получение доступных временных слотов
export const getAvailableSlots = async (
    branchId: number,
    doctorId: number,
) => {
    const currentDateTime = new Date(Date.now() + (3 * 60 * 60 * 1000)); // UTC+3 // Текущая дата и время
    console.log(currentDateTime)
    // Получаем доступные слоты, начиная с текущего момента
    const slots = await prisma.iDENT_Intervals.findMany({
        where: {
            branchId,
            doctorId,
            isBusy: false,
            startDateTime: {
                gte: currentDateTime, // Фильтр: слоты, которые начинаются после текущего момента
            },
        },
        orderBy: {
            startDateTime: 'asc', // Сортировка по возрастанию времени начала
        },
    });

    // Группируем слоты по датам
    const groupedSlots = slots.reduce((acc, slot) => {
        const date = slot.startDateTime.toISOString().split('T')[0]; // Получаем дату в формате YYYY-MM-DD

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push({
            startDateTime: slot.startDateTime,
            lengthInMinutes: slot.lengthInMinutes,
        });

        return acc;
    }, {} as Record<string, { startDateTime: Date; lengthInMinutes: number }[]>);

    return groupedSlots;
};

// Сервис для создания заявки
export const createBooking = async (
    branchId: number,
    doctorId: number,
    startDateTime: string,
    clientFullName: string,
    clientPhone: string,
    comment: string,
    planStart: string,
    doctorName: string
) => {
    // Проверяем наличие слота
    const slot = await prisma.iDENT_Intervals.findUnique({
        where: {
            branchId_doctorId_startDateTime: {
                branchId,
                doctorId,
                startDateTime: new Date(startDateTime),
            },
        },
    });

    if (!slot || slot.isBusy) {
        throw new Error("Выбранное время недоступно для записи. Попробуйте другое время");
    }

    // Создаем заявку
    const booking = await prisma.request.create({
        data: {
            dateAndTime: new Date(startDateTime),
            clientName: clientFullName,
            clientSurname: '',
            clientPatronymic: '',
            clientPhone,
            doctorId,
            doctorName,
            comment,
            planStart
        },
    });

    // Обновляем слот как занятый
    await prisma.iDENT_Intervals.update({
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

    return booking;
};


// Отмена записи
export const cancelBooking = async (bookingId: string) => {
    // Находим заявку с информацией о враче и его слотах
    const booking = await prisma.request.findUnique({
        where: { id: bookingId },
        include: {
            doctor: {  // Получаем информацию о враче
                include: {
                    slots: true,  // Получаем слоты врача
                },
            },
        },
    });

    // Проверка на наличие заявки и информации о враче
    if (!booking || !booking.doctor) {
        throw new Error("Запись не найдена или врач не указан");
    }

    // Тип для слота
    const doctorSlot = booking.doctor.slots.find(
        (slot) => slot.startDateTime === booking.dateAndTime
    );

    // Если слот не найден
    if (!doctorSlot) {
        throw new Error("Слот не найден");
    }

    // Обновляем слот как свободный
    await prisma.iDENT_Intervals.update({
        where: {
            branchId_doctorId_startDateTime: {
                branchId: doctorSlot.branchId,
                doctorId: booking.doctorId!,
                startDateTime: booking.dateAndTime!,
            },
        },
        data: {
            isBusy: false,
        },
    });

    // Удаляем заявку
    await prisma.request.delete({
        where: { id: bookingId },
    });

    return { message: "Запись успешно отменена" };
};

