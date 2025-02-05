import {prisma} from "../db";

export class DoctorService {
    async getAllDoctors() {
        const currentDateTime = new Date(Date.now() + (3 * 60 * 60 * 1000)); // UTC+3 // Текущая дата и время

        // Получаем всех врачей
        const doctors = await prisma.iDENT_Doctors.findMany();

        // Для каждого врача находим ближайшую доступную дату
        const doctorsWithAvailableFrom = await Promise.all(
            doctors.map(async (doctor) => {
                // Находим ближайший доступный слот для врача
                const nearestSlot = await prisma.iDENT_Intervals.findFirst({
                    where: {
                        doctorId: doctor.id,
                        startDateTime: {
                            gte: currentDateTime, // Исключаем прошедшие даты
                        },
                        isBusy: false, // Только свободные слоты
                    },
                    orderBy: {
                        startDateTime: 'asc', // Сортируем по возрастанию даты
                    },
                    select: {
                        startDateTime: true, // Выбираем только дату начала
                    },
                });

                // Форматируем дату в формат dd.mm.yy
                const availableFrom = nearestSlot
                    ? nearestSlot.startDateTime.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                    : null;

                // Добавляем поле availableFrom
                return {
                    ...doctor,
                    availableFrom,
                };
            })
        );

        return doctorsWithAvailableFrom;
    }
}
