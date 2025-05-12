/**
 * Сервис для работы с расписанием
 * Обеспечивает сохранение и обновление данных расписания в базе данных
 */
import { prisma } from "../db";
import { TimeTablePayload } from "../types/timetable";

/**
 * Сохраняет или обновляет данные расписания в базе данных
 * @param branches - Массив филиалов
 * @param doctors - Массив врачей
 * @param intervals - Массив временных интервалов
 * 
 * Процесс:
 * 1. Удаляет все существующие интервалы
 * 2. Обновляет или создает филиалы
 * 3. Обновляет или создает врачей
 * 4. Создает новые интервалы
 */
export const saveTimeTable = async ({ branches, doctors, intervals }: TimeTablePayload) => {
    // Удаляем все существующие интервалы
    await prisma.iDENT_Intervals.deleteMany()

    // Обновляем или создаем филиалы
    for (const branch of branches) {
        await prisma.iDENT_Branches.upsert({
            where: { id: branch.id },
            update: { name: branch.name },
            create: { id: branch.id, name: branch.name },
        });
    }

    // Обновляем или создаем врачей
    for (const doctor of doctors) {
        await prisma.iDENT_Doctors.upsert({
            where: { id: doctor.id },
            update: { name: doctor.name },
            create: { id: doctor.id, name: doctor.name },
        });
    }

    // Создаем новые интервалы
    for (const interval of intervals) {
        await prisma.iDENT_Intervals.upsert({
            where: {
                branchId_doctorId_startDateTime: {
                    branchId: interval.branchId,
                    doctorId: interval.doctorId,
                    startDateTime: new Date(interval.startDateTime),
                },
            },
            update: { lengthInMinutes: interval.lengthInMinutes, isBusy: interval.isBusy },
            create: {
                branchId: interval.branchId,
                doctorId: interval.doctorId,
                startDateTime: new Date(interval.startDateTime),
                lengthInMinutes: interval.lengthInMinutes,
                isBusy: interval.isBusy,
            },
        });
    }
};
