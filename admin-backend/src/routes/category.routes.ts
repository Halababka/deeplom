import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authenticateJWT, checkAdmin } from '../middleware/auth.middleware';

const categoryController = new CategoryController();
const router = Router();

router.get("/", authenticateJWT, (req, res) => categoryController.getAllCategories(req, res));
router.get("/:id", authenticateJWT, (req, res) => categoryController.getCategoryById(req, res));
router.post("/", authenticateJWT, checkAdmin, (req, res) => categoryController.createCategory(req, res));
router.put("/:id", authenticateJWT, checkAdmin, (req, res) => categoryController.updateCategory(req, res));
router.delete("/:id", authenticateJWT, checkAdmin, (req, res) => categoryController.deleteCategory(req, res));

export default router;
