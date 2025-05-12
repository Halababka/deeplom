/**
 * Основной файл сервера, отвечающий за запуск приложения
 * Импортируем необходимые зависимости
 */
import app from './app';
import prisma from './db';

// Порт сервера, по умолчанию 8080
const PORT = process.env.PORT || 8080;

/**
 * Асинхронная функция для запуска сервера
 * Устанавливает соединение с базой данных и запускает Express сервер
 */
const startServer = async () => {
    try {
        // Подключаемся к базе данных через Prisma
        await prisma.$connect();
        console.log('Connected to the database');

        // Запускаем сервер на указанном порту
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        // В случае ошибки выводим её в консоль и завершаем процесс
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

// Запускаем сервер
startServer();
