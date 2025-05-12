/**
 * Основной файл сервера
 * Отвечает за запуск Express приложения
 */
import app from "./app";

// Порт сервера, по умолчанию 3000
const PORT =  process.env.PORT || 3000;

/**
 * Запуск сервера на указанном порту
 * Выводит в консоль URL, по которому доступен сервер
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
