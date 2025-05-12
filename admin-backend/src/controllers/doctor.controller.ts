/**
 * Контроллер для работы с врачами
 * Обрабатывает HTTP запросы и взаимодействует с сервисом врачей
 */
import {Request, Response} from "express";
import {DoctorService} from "../services/doctor.service";

const doctorService = new DoctorService();

export class DoctorController {
    /**
     * Получение списка всех врачей
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Преобразует JSON строки в объекты для educationPlaces и courses
     */
    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await doctorService.getAllDoctors();
            
            const formattedDoctors = doctors.map(doctor => ({
                ...doctor,
                educationPlaces: JSON.parse(<string>doctor.educationPlaces),
                courses: JSON.parse(<string>doctor.courses)
            }));
            // await new Promise(resolve => setTimeout(resolve, 5000))
            res.json(formattedDoctors);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Failed to fetch doctors"});
        }
    }

    /**
     * Получение информации о конкретном враче по ID
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Преобразует JSON строки в объекты для educationPlaces и courses
     */
    async getDoctorById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const doctor = await doctorService.getDoctorById(id);

            if (!doctor) {
                res.status(404).json({error: "Doctor not found"});
                return;
            }

            const formattedDoctor = {
                ...doctor,
                educationPlaces: JSON.parse(<string>doctor.educationPlaces),
                courses: JSON.parse(<string>doctor.courses)
            };

            res.json(formattedDoctor);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Failed to fetch doctor"});
        }
    }

    /**
     * Создание нового врача
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Преобразует объекты educationPlaces и courses в JSON строки для хранения
     */
    async createDoctor(req: Request, res: Response) {
        try {
            let {name, experience, avatarId, education, courses, specialty, photoIds, certificateIds, educationPlaces, categoryIds} = req.body;

            if (educationPlaces) educationPlaces = JSON.stringify(educationPlaces)
            if (courses) courses = JSON.stringify(courses)

            const newDoctor = await doctorService.createDoctor({
                name,
                experience,
                education,
                educationPlaces,
                courses,
                avatarId,
                specialty,
                photoIds,
                certificateIds,
                categoryIds
            });
            res.status(201).json(newDoctor);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Failed to create doctor"});
        }
    }

    /**
     * Обновление информации о враче
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Преобразует объекты educationPlaces и courses в JSON строки для хранения
     */
    async updateDoctor(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            let {name, experience, education, educationPlaces, courses, specialty, avatarId, photoIds, certificateIds, categoryIds} = req.body;

            if (educationPlaces) educationPlaces = JSON.stringify(educationPlaces)
            if (courses) courses = JSON.stringify(courses)

            const updatedDoctor = await doctorService.updateDoctor(id, {
                name,
                experience,
                specialty,
                education,
                educationPlaces,
                courses,
                avatarId,
                photoIds,
                certificateIds,
                categoryIds
            });
            res.json(updatedDoctor);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Failed to update doctor"});
        }
    }

    /**
     * Удаление врача по ID
     * @param req - Express запрос
     * @param res - Express ответ
     */
    async deleteDoctor(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await doctorService.deleteDoctor(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({error: "Failed to delete doctor"});
        }
    }

    /**
     * Массовое удаление врачей
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Ожидает массив ID врачей в теле запроса
     */
    async deleteDoctors(req: Request, res: Response) {
        const {ids} = req.body; // Ожидаем массив идентификаторов в теле запроса

        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({error: 'Invalid input: ids should be a non-empty array.'});
            return
        }

        try {
            const result = await doctorService.deleteDoctors(ids);
            res.status(200).json({message: 'Doctors deleted successfully', result});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to delete doctors'});
        }
    }
}
