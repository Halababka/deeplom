/**
 * Маршруты для работы с врачами
 * Содержит CRUD операции для управления данными врачей
 */
import {Router} from "express";
import {DoctorController} from "../controllers/doctor.controller";
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";

const router = Router();
const doctorController = new DoctorController();

/**
 * GET /api/doctors
 * Получение списка всех врачей
 */
router.get("/", (req, res) => doctorController.getAllDoctors(req, res));

/**
 * GET /api/doctors/:id
 * Получение информации о конкретном враче по ID
 */
router.get("/:id", (req, res) => doctorController.getDoctorById(req, res));

/**
 * POST /api/doctors
 * Создание нового врача
 * Требует аутентификацию и права администратора
 */
router.post("/", authenticateJWT, checkAdmin, (req, res) => doctorController.createDoctor(req, res));

/**
 * PUT /api/doctors/:id
 * Обновление информации о враче
 * Требует аутентификацию и права администратора
 */
router.put("/:id", authenticateJWT, checkAdmin, (req, res) => doctorController.updateDoctor(req, res));

/**
 * DELETE /api/doctors/:id
 * Удаление конкретного врача
 * Требует аутентификацию и права администратора
 */
router.delete("/:id", authenticateJWT, checkAdmin, (req, res) => doctorController.deleteDoctor(req, res));

/**
 * DELETE /api/doctors
 * Массовое удаление врачей
 * Требует аутентификацию и права администратора
 */
router.delete("/", authenticateJWT, checkAdmin, (req, res) => doctorController.deleteDoctors(req, res));

export default router;
