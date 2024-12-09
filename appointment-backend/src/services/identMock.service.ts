import axios from "axios";

const API_BASE_URL = `http://localhost:${process.env.PORT}/api/`;

// Заголовок авторизации для имитации сервиса IDENT
const IDENT_HEADERS = {
    "IDENT-Integration-Key": process.env.IDENT_KEY,
    "Content-Type": "application/json",
};

// Функция для получения заявок (GET /GetTickets)
export const getTickets = async (params: {
    dateTimeFrom: string;
    dateTimeTo: string;
    limit?: number;
    offset?: number;
}) => {
    const { dateTimeFrom, dateTimeTo, limit = 500, offset = 0 } = params;

    const response = await axios.get(`${API_BASE_URL}requests/GetTickets`, {
        params: { dateTimeFrom, dateTimeTo, limit, offset },
        headers: IDENT_HEADERS,
    });

    return response.data;
};

// Функция для отправки расписания (POST /PostTimeTable)
export const postTimeTable = async (payload: {
    branches: Array<{ id: number; name: string }>;
    doctors: Array<{ id: number; name: string; specialty?: string }>;
    intervals: Array<{
        branchId: number;
        doctorId: number;
        startDateTime: string;
        lengthInMinutes: number;
        isBusy: boolean;
    }>;
}) => {
    const response = await axios.post(`${API_BASE_URL}timetable/PostTimeTable`, payload, {
        headers: IDENT_HEADERS,
    });

    return response.data;
};
