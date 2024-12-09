import {Request, Response} from "express";
import {DoctorService} from "../services/doctor.service";

const doctorService = new DoctorService();

export class DoctorController {
    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await doctorService.getAllDoctors();
            res.json(doctors);
        } catch (error) {
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
            res.json(doctor);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch doctor"});
        }
    }

    async createDoctor(req: Request, res: Response) {
        try {
            const {name, specialty} = req.body;
            const newDoctor = await doctorService.createDoctor({name, specialty});
            res.status(201).json(newDoctor);
        } catch (error) {
            res.status(500).json({error: "Failed to create doctor"});
        }
    }

    async updateDoctor(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const {name, specialty} = req.body;
            const updatedDoctor = await doctorService.updateDoctor(id, {name, specialty});
            res.json(updatedDoctor);
        } catch (error) {
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
}
