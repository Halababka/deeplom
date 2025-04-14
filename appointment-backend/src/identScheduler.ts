import {getTickets, postTimeTable} from "./services/identMock.service";
import axios from 'axios';

interface Doctor {
    id: number;
    name: string;
}

const scheduleIdentRequests = () => {
    // Пример временного диапазона для GetTickets
    const dateTimeFrom = new Date().toISOString();
    const dateTimeTo = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Завтра

    // Периодический запрос заявок
    setInterval(async () => {
        try {
            console.log("[Ident] Запрос заявок...");
            const tickets = await getTickets({dateTimeFrom, dateTimeTo});
            console.log("[Ident] Полученные заявки:", tickets);
        } catch (error: any) {
            console.error("[Ident] Ошибка при запросе заявок:", error.message);
        }
    }, 60000); // Каждую минуту

    // Периодическая отправка расписания
    setInterval(async () => {
        try {
            console.log("[Ident] Отправка расписания...");
            const payload = await generateTimeTablePayload(31);
            await postTimeTable(payload);
            console.log("[Ident] Расписание успешно отправлено");
        } catch (error: any) {
            console.error("[Ident] Ошибка при отправке расписания:", error.message);
        }
    }, 300000); // Каждые 5 минут 300000
};

// Генерация расписания
const generateTimeTablePayload = async (daysCount: number) => {
    const branch = {id: 1, name: "Филиал в г. Волгодонск"};

    try {
        // Получаем список всех врачей через API
        const response = await axios.get(`${process.env.ADMIN_PANEL_API_URL}/doctors`);
        const doctors: Doctor[] = response.data;
        
        // Создаем массив имен врачей
        const doctorNames = doctors.map((doctor: Doctor) => doctor.name);

        console.log("[Ident] Получены имена врачей:", doctorNames);

        const intervals = [];
        const today = new Date(); // Сегодняшняя дата
        today.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня

        // Генерируем дни, начиная с сегодняшнего и добавляем daysCount дней вперед
        const days = Array.from({length: daysCount}, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            return date.toISOString().split('T')[0]; // Форматируем дату в YYYY-MM-DD
        });

        for (const doctor of doctors) {
            for (const day of days) {
                let currentTime = new Date(`${day}T09:00:00`);
                const endTime = new Date(`${day}T19:00:00`);

                while (currentTime < endTime) {
                    const timeString = currentTime.toISOString();

                    // Пропускаем обед с 12:00 до 13:00
                    if (
                        currentTime.getHours() >= 12 &&
                        currentTime.getHours() < 13
                    ) {
                        currentTime.setMinutes(currentTime.getMinutes() + 30);
                        continue;
                    }

                    intervals.push({
                        branchId: branch.id,
                        doctorId: doctor.id,
                        startDateTime: timeString,
                        lengthInMinutes: 30,
                        isBusy: Math.random() < 0.3, // Примерно 30% интервалов заняты
                    });

                    // Увеличиваем время на 30 минут
                    currentTime.setMinutes(currentTime.getMinutes() + 30);
                }
            }
        }

        return {
            branches: [branch], // Массив филиалов
            doctors, // Массив врачей
            intervals, // Массив интервалов
        };
    } catch (error) {
        console.error("[Ident] Ошибка при получении списка врачей:", error);
        throw error;
    }
};

export default scheduleIdentRequests;