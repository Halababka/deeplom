import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Регистрация
router.post(
    '/register',
    [
        body('username').isString().withMessage('Имя пользователя должно быть строкой'),
        body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
    ],
    AuthController.register
);

// Авторизация
router.post(
    '/login',
    [
        body('username').isString().withMessage('Имя пользователя должно быть строкой'),
        body('password').exists().withMessage('Пароль обязателен'),
    ],
    AuthController.login
);

// Защищённый маршрут
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Доступ разрешён', user: req.user });
});

export default router;
