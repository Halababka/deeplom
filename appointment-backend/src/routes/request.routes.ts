import { Router } from "express";
import { getTicketsController } from "../controllers/request.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/GetTickets", (req, res, next) => authMiddleware(req, res, next), getTicketsController);


export default router;
