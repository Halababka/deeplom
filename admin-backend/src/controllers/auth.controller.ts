import { Request, Response } from 'express';
import prisma from "../db";
import {AuthService} from '../services/auth.service';

export class AuthController {
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

            res.status(200).json({message: 'Успешный вход', token, user: {name: user.username}});
        } catch (error: any) {
            res.status(500).json({message: 'Ошибка сервера', error: error.message});
        }
    }
}
