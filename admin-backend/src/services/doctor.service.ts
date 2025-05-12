/**
 * Сервис для работы с врачами
 * Обеспечивает взаимодействие с базой данных через Prisma
 */
import prisma from "../db";

export class DoctorService {
    /**
     * Получение списка всех врачей
     * @returns Promise с массивом врачей, включая связанные данные
     */
    async getAllDoctors() {
        return prisma.doctor.findMany({
            include: {
                avatar: true,
                photos: true,
                certificates: true,
                categories: true
            }
        });
    }

    /**
     * Получение врача по ID
     * @param id - ID врача
     * @returns Promise с данными врача, включая связанные данные
     */
    async getDoctorById(id: number) {
        return prisma.doctor.findUnique({
            where: {id},
            include: {
                avatar: true,
                photos: true,
                certificates: true,
                categories: true
            }
        });
    }

    /**
     * Создание нового врача
     * @param data - Данные для создания врача
     * @returns Promise с созданным врачом
     */
    async createDoctor(data: {
        name: string;
        specialty: string;
        experience?: number;
        avatarId?: number;
        education?: string;
        educationPlaces?: string;
        courses?: string;
        photoIds?: number[];
        certificateIds?: number[];
        categoryIds?: number[];
    }) {
        const {name, specialty, experience, education, educationPlaces, courses, avatarId, photoIds, certificateIds, categoryIds} = data;

        return prisma.doctor.create({
            data: {
                name,
                specialty,
                education,
                educationPlaces,
                courses,
                experience,
                avatar: avatarId ? {connect: {id: avatarId}} : undefined,
                photos: photoIds ? {connect: photoIds.map(id => ({id}))} : undefined,
                certificates: certificateIds ? {connect: certificateIds.map(id => ({id}))} : undefined,
                categories: categoryIds ? {connect: categoryIds.map(id => ({id}))} : undefined
            },
            include: {
                avatar: true,
                photos: true,
                certificates: true,
                categories: true
            }
        });
    }

    /**
     * Обновление данных врача
     * @param id - ID врача
     * @param data - Данные для обновления
     * @returns Promise с обновленным врачом
     */
    async updateDoctor(id: number, data: {
        name?: string;
        experience?: number;
        specialty?: string;
        education?: string;
        educationPlaces?: string;
        courses?: string;
        avatarId?: number | null;
        photoIds?: number[] | null;
        certificateIds?: number[] | null;
        categoryIds?: number[] | null;
    }) {
        const {name, experience, avatarId, education, educationPlaces, courses, specialty, photoIds, certificateIds, categoryIds} = data;

        return prisma.doctor.update({
            where: {id},
            data: {
                name,
                specialty,
                education,
                educationPlaces,
                courses,
                experience,
                // Обновление аватара
                avatar: avatarId === null
                    ? {disconnect: true}
                    : avatarId
                        ? {connect: {id: avatarId}}
                        : undefined,
                // Обновление фотографий
                photos: photoIds === null
                    ? {set: []}
                    : photoIds
                        ? {set: photoIds.map(id => ({id}))}
                        : undefined,
                // Обновление сертификатов
                certificates: certificateIds === null
                    ? {set: []}
                    : certificateIds
                        ? {set: certificateIds.map(id => ({id}))}
                        : undefined,
                // Обновление категорий
                categories: categoryIds === null
                    ? {set: []}
                    : categoryIds
                        ? {set: categoryIds.map(id => ({id}))}
                        : undefined
            },
            include: {
                avatar: true,
                photos: true,
                certificates: true,
                categories: true
            }
        });
    }

    /**
     * Удаление врача по ID
     * @param id - ID врача
     * @returns Promise с результатом удаления
     */
    async deleteDoctor(id: number) {
        return prisma.doctor.delete({where: {id}});
    }

    /**
     * Массовое удаление врачей
     * @param ids - Массив ID врачей
     * @returns Promise с результатом удаления
     */
    async deleteDoctors(ids: number[]) {
        return prisma.doctor.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
