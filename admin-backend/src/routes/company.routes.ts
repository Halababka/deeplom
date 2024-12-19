import {Router} from 'express';
import {CompanyController} from '../controllers/company.controller';
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";

const companyController = new CompanyController();
const router = Router();

router.get('/', companyController.getAll.bind(companyController));
router.get('/:id', companyController.getById.bind(companyController));
router.post('/', authenticateJWT, checkAdmin, companyController.create.bind(companyController));
router.put('/:id', authenticateJWT, checkAdmin, companyController.update.bind(companyController));
router.delete('/:id', authenticateJWT, checkAdmin, companyController.delete.bind(companyController));
router.delete('/', authenticateJWT, checkAdmin, companyController.deleteMany.bind(companyController));

export default router;
