import {Request, Response} from "express";
import {DoctorService} from "../services/doctor.service";

const doctorService = new DoctorService();

export class DoctorController {
    async getAllDoctors(req: Request, res: Response) {
        try {
            const doctors = await doctorService.getAllDoctors();

            res.json(doctors);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: "Failed to fetch doctors"});
        }
    }

}
