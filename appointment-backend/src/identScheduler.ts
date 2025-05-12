/**
 * Модуль для работы с системой IDENT
 * Обеспечивает синхронизацию данных и периодическую отправку расписания
 */
import {getTickets, postTimeTable} from "./services/identMock.service";
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Интерфейс для данных врача
 */
interface Doctor {
    id: number;
    name: string;
}

/**
 * Синхронизирует список врачей между API и базой данных
 * @param apiDoctors - Список врачей из API
 * @returns Promise с обновленным списком врачей из БД
 * 
 * Процесс:
 * 1. Удаляет врачей, которых нет в API
 * 2. Добавляет новых врачей из API
 * 3. Возвращает актуальный список врачей
 */
const syncDoctors = async (apiDoctors: Doctor[]) => {
    try {
        // Получаем всех врачей из БД
        const dbDoctors = await prisma.iDENT_Doctors.findMany();
        
        // Находим врачей, которых нет в API
        const doctorsToDelete = dbDoctors.filter(dbDoctor => 
            !apiDoctors.some(apiDoctor => apiDoctor.name === dbDoctor.name)
        );

        // Удаляем врачей, которых нет в API
        if (doctorsToDelete.length > 0) {
            console.log("[Ident] Удаление отсутствующих врачей");
            
            // Сначала удаляем все связанные записи в IDENT_Intervals
            await prisma.iDENT_Intervals.deleteMany({
                where: {
                    doctorId: {
                        in: doctorsToDelete.map(d => d.id)
                    }
                }
            });

            // Затем удаляем самих врачей
            await prisma.iDENT_Doctors.deleteMany({
                where: {
                    id: {
                        in: doctorsToDelete.map(d => d.id)
                    }
                }
            });
        }

        // Добавляем новых врачей в БД
        const doctorsToAdd = apiDoctors.filter(apiDoctor => 
            !dbDoctors.some(dbDoctor => dbDoctor.name === apiDoctor.name)
        );

        if (doctorsToAdd.length > 0) {
            console.log("[Ident] Добавление новых врачей:");
            await prisma.iDENT_Doctors.createMany({
                data: doctorsToAdd.map(doctor => ({
                    id: doctor.id,
                    name: doctor.name
                }))
            });
        }

        // Обновляем список врачей из БД
        return await prisma.iDENT_Doctors.findMany();
    } catch (error) {
        console.error("[Ident] Ошибка при синхронизации врачей:", error);
        throw error;
    }
};

/**
 * Запускает периодические запросы к системе
 * - Запрашивает заявки каждую минуту
 * - Отправляет расписание каждые 5 минут
 */
const scheduleIdentRequests = () => {
    // Пример временного диапазона для GetTickets
    const dateTimeFrom = new Date().toISOString();
    const dateTimeTo = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Завтра

    // Периодический запрос заявок
    setInterval(async () => {
        try {
            console.log("[Ident] Запрос заявок...");
            const tickets = await getTickets({dateTimeFrom, dateTimeTo});
            console.log("[Ident] Получены заявки");
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
    }, 300000); // Каждые 5 минут
};

/**
 * Генерирует данные расписания для отправки
 * @param daysCount - Количество дней для генерации расписания
 * @returns Promise с данными расписания
 * 
 * Процесс:
 * 1. Получает список врачей из API
 * 2. Синхронизирует врачей с БД
 * 3. Генерирует интервалы времени для каждого врача
 * 4. Возвращает структуру данных для IDENT
 */
const generateTimeTablePayload = async (daysCount: number) => {
    const branch = {id: 1, name: "Филиал в г. Волгодонск"};

    try {
        // Получаем список всех врачей через API
        const response = await axios.get(`${process.env.ADMIN_PANEL_API_URL}/doctors`);
        const apiDoctors: Doctor[] = response.data;
        
        // Синхронизируем врачей с БД
        const doctors = await syncDoctors(apiDoctors);
        
        // Создаем массив имен врачей
        const doctorNames = doctors.map(doctor => doctor.name);

        console.log("[Ident] Получены имена врачей");

        const intervals = [];
        const today = new Date(); // Сегодняшняя дата
        today.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня

        // Генерируем дни, начиная с сегодняшнего и добавляем daysCount дней вперед
        const days = Array.from({length: daysCount}, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            return date.toISOString().split('T')[0]; // Форматируем дату в YYYY-MM-DD
        });

        // Генерируем интервалы для каждого врача и дня
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