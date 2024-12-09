import { getTickets, postTimeTable } from "./services/identMock.service";

const scheduleIdentRequests = () => {
    // Пример временного диапазона для GetTickets
    const dateTimeFrom = new Date().toISOString();
    const dateTimeTo = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Завтра

    // Периодический запрос заявок
    setInterval(async () => {
        try {
            console.log("[Ident] Запрос заявок...");
            const tickets = await getTickets({ dateTimeFrom, dateTimeTo });
            console.log("[Ident] Полученные заявки:", tickets);
        } catch (error: any) {
            console.error("[Ident] Ошибка при запросе заявок:", error.message);
        }
    }, 60000); // Каждую минуту

    // Периодическая отправка расписания
    setInterval(async () => {
        try {
            console.log("[Ident] Отправка расписания...");
            // const payload = {
            //     branches: [{ id: 1, name: "Филиал в г. Санкт-Петербург" }],
            //     doctors: [{ id: 1, name: "Иванов Иван Иванович" }],
            //     intervals: [
            //         {
            //             branchId: 1,
            //             doctorId: 1,
            //             startDateTime: new Date().toISOString(),
            //             lengthInMinutes: 30,
            //             isBusy: false,
            //         },
            //     ],
            // };
            const payload = generateTimeTablePayload();
            await postTimeTable(payload);
            console.log("[Ident] Расписание успешно отправлено");
        } catch (error: any) {
            console.error("[Ident] Ошибка при отправке расписания:", error.message);
        }
    }, 300000); // Каждые 5 минут 300000
};

// Генерация расписания
const generateTimeTablePayload = () => {
    const branch = { id: 1, name: "Филиал в г. Волгодонск" };

    const doctors = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        name: `Доктор ${index + 1}`,
        specialty: `Специальность ${index + 1}`,
    }));

    const intervals = [];
    const days = ["2024-12-04", "2024-12-05", "2024-12-06", "2024-12-07", "2024-12-08", "2024-12-09"]; // Понедельник - Суббота

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

    return { branches: [branch], doctors, intervals };
};

export default scheduleIdentRequests;
