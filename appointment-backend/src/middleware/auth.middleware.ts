import { Request, Response, NextFunction } from "express";

const IDENT_KEY = process.env.IDENT_KEY;

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const key = req.header("IDENT-Integration-Key");
    if (key !== IDENT_KEY) {
        res.status(401).send("Unauthorized: Invalid integration key");
        return; // Обязательно завершить выполнение, если запрос не авторизован
    }
    next(); // Переход к следующему middleware или обработчику
};
