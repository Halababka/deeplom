/**
 * Контроллер для работы с заявками
 * Обрабатывает HTTP запросы, связанные с получением заявок
 */
import { Request, Response } from "express";
import { getTickets } from "../services/request.service";

/**
 * Обработчик GET запроса для получения списка заявок
 * @param req - Express запрос
 * @param res - Express ответ
 * 
 * Параметры запроса:
 * - dateTimeFrom: начальная дата/время
 * - dateTimeTo: конечная дата/время
 * - limit: максимальное количество заявок (по умолчанию 500)
 * - offset: смещение для пагинации (по умолчанию 0)
 */
export const getTicketsController = async (req: Request, res: Response) => {
    const { dateTimeFrom, dateTimeTo, limit = 500, offset = 0 } = req.query;

    try {
        const tickets = await getTickets({
            dateTimeFrom: dateTimeFrom as string,
            dateTimeTo: dateTimeTo as string,
            limit: Number(limit),
            offset: Number(offset),
        });
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).send("Error fetching tickets: " + error.message);
    }
};
