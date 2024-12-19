import {Router} from 'express';
import {CompanyController} from '../controllers/company.controller';
import {authenticateJWT, checkAdmin} from "../middleware/auth.middleware";

const companyController = new CompanyController();
const router = Router();

router.get('/', companyController.getAll);
router.get('/:id', companyController.getById);
router.post('/', authenticateJWT, checkAdmin, companyController.create);
router.put('/:id', authenticateJWT, checkAdmin, companyController.update);
router.delete('/:id', authenticateJWT, checkAdmin, companyController.delete);
router.delete('/', authenticateJWT, checkAdmin, companyController.deleteMany);

export default router;
