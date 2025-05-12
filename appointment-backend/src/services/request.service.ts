/**
 * Сервис для работы с заявками
 * Обеспечивает взаимодействие с базой данных для получения заявок
 */
import { prisma } from "../db";
import { GetTicketsParams } from "../types/requests";

/**
 * Получение списка заявок с фильтрацией по дате и пагинацией
 * @param dateTimeFrom - Начальная дата/время для фильтрации
 * @param dateTimeTo - Конечная дата/время для фильтрации
 * @param limit - Максимальное количество заявок
 * @param offset - Смещение для пагинации
 * @returns Promise с массивом заявок
 */
export const getTickets = async ({ dateTimeFrom, dateTimeTo, limit, offset }: GetTicketsParams) => {
    return prisma.request.findMany({
        where: {
            dateAndTime: {
                gte: new Date(dateTimeFrom), // Больше или равно начальной даты
                lte: new Date(dateTimeTo),   // Меньше или равно конечной даты
            },
        },
        skip: offset,  // Пропускаем указанное количество записей
        take: limit,   // Берем указанное количество записей
    });
};
