import { Router } from "express";
import { postTimeTableController } from "../controllers/timetable.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/PostTimeTable", authMiddleware, postTimeTableController);

export default router;
