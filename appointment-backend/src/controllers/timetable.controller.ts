/**
 * Контроллер для работы с расписанием
 * Обрабатывает HTTP запросы, связанные с управлением расписанием врачей
 */
import { Request, Response } from "express";
import { saveTimeTable } from "../services/timetable.service";
import { TimeTablePayload } from "../types/timetable";

/**
 * Обработчик POST запроса для обновления расписания
 * @param req - Express запрос с данными расписания
 * @param res - Express ответ
 * 
 * Тело запроса должно содержать:
 * - branches: массив филиалов
 * - doctors: массив врачей
 * - intervals: массив временных интервалов
 * 
 * @returns 200 OK при успешном обновлении
 * @returns 500 при ошибке с сообщением об ошибке
 */
export const postTimeTableController = async (req: Request, res: Response) => {
    const { branches, doctors, intervals }: TimeTablePayload = req.body;

    try {
        await saveTimeTable({ branches, doctors, intervals });
        res.status(200).send("TimeTable uploaded successfully");
    } catch (error: any) {
        res.status(500).send("Error uploading timetable: " + error.message);
    }
};
