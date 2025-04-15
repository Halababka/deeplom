import express from 'express';
import {ServiceController} from '../controllers/service.controller';
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";

const router = express.Router();
const serviceController = new ServiceController();

router.get('/', serviceController.getAllServices);
router.get('/popular', serviceController.getPopularServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', authenticateJWT, checkAdmin, serviceController.createService);
router.put('/:id', authenticateJWT, checkAdmin, serviceController.updateService);
router.delete('/:id', authenticateJWT, checkAdmin, serviceController.deleteService);
router.delete('/', authenticateJWT, checkAdmin, serviceController.deleteServices);
export default router;