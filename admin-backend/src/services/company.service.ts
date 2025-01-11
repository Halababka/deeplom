import {Prisma} from '@prisma/client';
import prisma from "../db";

export class CompanyService {
    async getCompanies() {
        return prisma.company.findMany({
            include: {
                mainPhoto: true,
                photos: true,
                certificates: true,
            },
        });
    }

    async getCompanyById(id: number) {
        return prisma.company.findUnique({
            where: {id},
            include: {
                mainPhoto: true,
                photos: true,
                certificates: true,
            },
        });
    }

    async createCompany(data: Prisma.CompanyCreateInput & {
        photoIds?: number[];
        certificateIds?: number[];
        mainPhotoId?: number;
    }) {
        const {photoIds, certificateIds, mainPhotoId, ...rest} = data;

        return prisma.company.create({
            data: {
                ...rest,
                mainPhoto: mainPhotoId ? {connect: {id: mainPhotoId}} : undefined,
                photos: photoIds ? {connect: photoIds.map((id) => ({id}))} : undefined,
                certificates: certificateIds ? {connect: certificateIds.map((id) => ({id}))} : undefined,
            },
            include: {
                mainPhoto: true,
                photos: true,
                certificates: true,
            },
        });
    }

    async updateCompany(
        id: number,
        data: Prisma.CompanyUpdateInput & {
            mainPhotoId?: number | null
            photoIds?: number[] | null;
            certificateIds?: number[] | null;
        }
    ) {
        const {photoIds, certificateIds, mainPhotoId, ...rest} = data;

        return prisma.company.update({
            where: {id},
            data: {
                ...rest,
                mainPhoto: mainPhotoId === null
                    ? {disconnect: true} // Очищает связь, если mainPhotoId равно null
                    : mainPhotoId
                        ? {connect: {id: mainPhotoId}} // Обновляет связь, если mainPhotoId предоставлен
                        : undefined, // Не изменяет связь, если mainPhotoId не предоставлен
                photos: photoIds === null
                    ? {set: []} // Очищает все связанные записи
                    : photoIds
                        ? {set: photoIds.map((id) => ({id}))} // Обновляет список связанных записей
                        : undefined,
                certificates: certificateIds === null
                    ? {set: []}
                    : certificateIds
                        ? {set: certificateIds.map((id) => ({id}))}
                        : undefined,
            },
            include: {
                mainPhoto: true,
                photos: true,
                certificates: true,
            },
        });
    }

    async deleteCompany(id: number) {
        return prisma.company.delete({
            where: {id},
        });
    }

    async deleteCompanies(ids: number[]) {
        return prisma.company.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
