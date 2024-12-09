import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Неавторизованный доступ' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const user = AuthService.verifyToken(token);

    if (!user) {
        res.status(403).json({ message: 'Неверный токен' });
        return;
    }

    req.user = user; // Присваиваем декодированного пользователя в req.user
    next(); // Передача управления следующему middleware
};

// Middleware для проверки, является ли пользователь администратором
export const checkAdmin = (req: Request, res: Response, next: NextFunction): void => {
    // Предполагается, что req.user уже установлен middleware authenticateJWT
    const user = req.user; // Типизируйте req.user через декларацию типов, см. ниже

    if (!user || !user.isAdmin) {
        res.status(403).json({ message: 'Доступ запрещен: требуется роль администратора' });
        return; // Завершаем выполнение
    }

    next(); // Передаём выполнение дальше, если проверка прошла
};
