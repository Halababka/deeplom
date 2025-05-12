/**
 * Сервис аутентификации
 * Содержит методы для работы с паролями и JWT токенами
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Константы для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'uy456';  // Секретный ключ для подписи токенов
const JWT_EXPIRES_IN = '1h';  // Время жизни токена

export class AuthService {
    /**
     * Хэширует пароль с использованием bcrypt
     * @param password - Пароль для хэширования
     * @returns Promise<string> - Хэшированный пароль
     */
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Сравнивает пароль с хэшем
     * @param password - Пароль для проверки
     * @param hashedPassword - Хэшированный пароль
     * @returns Promise<boolean> - Результат сравнения
     */
    static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    /**
     * Генерирует JWT токен
     * @param payload - Данные для включения в токен
     * @returns string - Сгенерированный токен
     */
    static generateToken(payload: { id: number; username: string; isAdmin: boolean }): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    /**
     * Проверяет JWT токен
     * @param token - Токен для проверки
     * @returns { id: number; username: string; isAdmin: boolean } | null - Данные из токена или null при ошибке
     */
    static verifyToken(token: string): { id: number; username: string; isAdmin: boolean } | null {
        try {
            return jwt.verify(token, JWT_SECRET) as { id: number; username: string; isAdmin: boolean };
        } catch {
            return null;
        }
    }
}
