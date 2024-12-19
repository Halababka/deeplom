import {Router} from "express";
import {SelfController} from "../controllers/self.controller";
import {authenticateJWT} from "../middleware/auth.middleware";

const selfController = new SelfController()
const router = Router();

router.get("/", authenticateJWT, selfController.myself)

export default router