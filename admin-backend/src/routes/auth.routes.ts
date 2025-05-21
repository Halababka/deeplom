/**
 * Маршруты аутентификации
 * Содержит эндпоинты для регистрации, входа и проверки защищенных маршрутов
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

/**
 * Маршрут регистрации нового пользователя
 * POST /api/auth/register
 * 
 * Валидация:
 * - username: должно быть строкой
 * - password: минимум 6 символов
 */
router.post(
    '/register',
    [
        body('username').isString().withMessage('Имя пользователя должно быть строкой'),
        body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
    ],
    AuthController.register
);

/**
 * Маршрут авторизации пользователя
 * POST /api/auth/login
 * 
 * Валидация:
 * - username: должно быть строкой
 * - password: обязательное поле
 */
router.post(
    '/login',
    [
        body('username').isString().withMessage('Имя пользователя должно быть строкой'),
        body('password').exists().withMessage('Пароль обязателен'),
    ],
    AuthController.login
);

/**
 * Защищённый маршрут для проверки JWT токена
 * GET /api/auth/protected
 * 
 * Требует валидный JWT токен в заголовке Authorization
 * Возвращает информацию о текущем пользователе
 */
router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Доступ разрешён', user: req.user });
});

// Защищенные маршруты
router.post('/change-password', authenticateJWT, AuthController.changePassword);

export default router;
