import {Router} from "express";
import {DoctorController} from "../controllers/doctor.controller";

const router = Router();
const doctorController = new DoctorController();

router.get("/", (req, res) => doctorController.getAllDoctors(req, res));

export default router;
