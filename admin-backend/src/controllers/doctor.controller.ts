import {Request, Response} from "express";
import {DoctorService} from "../services/doctor.service";

const doctorService = new DoctorService();

export class DoctorController {
    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await doctorService.getAllDoctors();
            console.log(doctors)
            const formattedDoctors = doctors.map(doctor => ({
                ...doctor,
                educationPlaces: JSON.parse(<string>doctor.educationPlaces),
                courses: JSON.parse(<string>doctor.courses)
            }));
            await new Promise(resolve => setTimeout(resolve, 5000))
            res.json(formattedDoctors);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Failed to fetch doctors"});
        }
    }

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

    async deleteDoctor(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await doctorService.deleteDoctor(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({error: "Failed to delete doctor"});
        }
    }

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
