/**
 * Middleware для аутентификации и авторизации
 * Содержит функции для проверки JWT токенов и прав доступа
 */
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

/**
 * Middleware для проверки JWT токена
 * Проверяет наличие и валидность токена в заголовке Authorization
 * 
 * @param req - Express запрос
 * @param res - Express ответ
 * @param next - Функция для передачи управления следующему middleware
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        // Проверяем наличие заголовка Authorization и его формат
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Неавторизованный доступ' });
            return;
        }

        // Извлекаем токен из заголовка
        const token = authHeader.split(' ')[1];
        
        try {
            const user = AuthService.verifyToken(token);
            
            // Проверяем валидность токена
            if (!user) {
                res.status(403).json({ message: 'Неверный токен' });
                return;
            }

            req.user = user; // Присваиваем декодированного пользователя в req.user
            next(); // Передача управления следующему middleware
        } catch (error) {
            res.status(403).json({ message: 'Неверный токен' });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при проверке токена' });
        return;
    }
};

/**
 * Middleware для проверки прав администратора
 * Проверяет, имеет ли пользователь права администратора
 * 
 * @param req - Express запрос
 * @param res - Express ответ
 * @param next - Функция для передачи управления следующему middleware
 */
export const checkAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // Предполагается, что req.user уже установлен middleware authenticateJWT
    const user = req.user;

    // Проверяем наличие пользователя и его права администратора
    if (!user || !user.isAdmin) {
        res.status(403).json({ message: 'Доступ запрещен: требуется роль администратора' });
        return;
    }

    next(); // Передаём выполнение дальше, если проверка прошла
};
