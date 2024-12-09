"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const IDENT_KEY = process.env.IDENT_KEY;
const authMiddleware = (req, res, next) => {
    const key = req.header("IDENT-Integration-Key");
    if (key !== IDENT_KEY) {
        res.status(401).send("Unauthorized: Invalid integration key");
        return; // Обязательно завершить выполнение, если запрос не авторизован
    }
    next(); // Переход к следующему middleware или обработчику
};
exports.authMiddleware = authMiddleware;
