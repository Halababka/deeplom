/**
 * Контроллер аутентификации
 * Обрабатывает запросы на регистрацию и вход пользователей
 */
import { Request, Response } from 'express';
import prisma from "../db";
import {AuthService} from '../services/auth.service';

export class AuthController {
    /**
     * Регистрация нового пользователя
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Процесс:
     * 1. Проверяет существование пользователя
     * 2. Хэширует пароль
     * 3. Создает нового пользователя в базе данных
     */
    static async register(req: Request, res: Response) {
        try {
            const {username, password} = req.body;

            // Проверяем наличие пользователя
            const existingUser = await prisma.user.findUnique({where: {username}});
            if (existingUser) {
                res.status(400).json({message: 'Пользователь уже существует'});
                return
            }

            // Хэшируем пароль и создаем пользователя
            const hashedPassword = await AuthService.hashPassword(password);
            const user = await prisma.user.create({
                data: {username, password: hashedPassword, isAdmin: true},
            });

            res.status(201).json({message: 'Пользователь успешно зарегистрирован', user});
        } catch (error: any) {
            res.status(500).json({message: 'Ошибка сервера', error: error.message});
        }
    }

    /**
     * Авторизация пользователя
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Процесс:
     * 1. Проверяет существование пользователя
     * 2. Проверяет соответствие пароля
     * 3. Генерирует JWT токен
     * 4. Возвращает токен и информацию о пользователе
     */
    static async login(req: Request, res: Response) {
        try {
            const {username, password} = req.body;

            // Проверяем существование пользователя
            const user = await prisma.user.findUnique({where: {username}});
            if (!user || !(await AuthService.comparePasswords(password, user.password))) {
                res.status(401).json({message: 'Неверные имя пользователя или пароль'});
                return
            }

            // Генерируем JWT
            const token = AuthService.generateToken({
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
            });

            res.status(200).json({message: 'Успешный вход', token, user: {username: user.username}});
        } catch (error: any) {
            res.status(500).json({message: 'Ошибка сервера', error: error.message});
        }
    }

    /**
     * Смена пароля пользователя
     * @param req - Express запрос
     * @param res - Express ответ
     * 
     * Процесс:
     * 1. Проверяет текущий пароль
     * 2. Хэширует новый пароль
     * 3. Обновляет пароль в базе данных
     */
    static async changePassword(req: Request, res: Response) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ message: 'Пользователь не авторизован' });
                return;
            }

            // Получаем пользователя
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ message: 'Пользователь не найден' });
                return;
            }

            // Проверяем текущий пароль
            const isPasswordValid = await AuthService.comparePasswords(currentPassword, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Неверный текущий пароль' });
                return;
            }

            // Хэшируем новый пароль
            const hashedPassword = await AuthService.hashPassword(newPassword);

            // Обновляем пароль
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            res.status(200).json({ message: 'Пароль успешно изменен' });
        } catch (error: any) {
            res.status(500).json({ message: 'Ошибка сервера', error: error.message });
        }
    }
}
