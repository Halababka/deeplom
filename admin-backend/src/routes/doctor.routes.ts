import {Router} from "express";
import {DoctorController} from "../controllers/doctor.controller";
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";

const router = Router();
const doctorController = new DoctorController();

router.get("/", (req, res) => doctorController.getAllDoctors(req, res));
router.get("/:id", (req, res) => doctorController.getDoctorById(req, res));
router.post("/", authenticateJWT, checkAdmin, (req, res) => doctorController.createDoctor(req, res));
router.put("/:id", authenticateJWT, checkAdmin, (req, res) => doctorController.updateDoctor(req, res));
router.delete("/:id", authenticateJWT, checkAdmin, (req, res) => doctorController.deleteDoctor(req, res));
router.delete("/", authenticateJWT, checkAdmin, (req, res) => doctorController.deleteDoctors(req, res));

export default router;
