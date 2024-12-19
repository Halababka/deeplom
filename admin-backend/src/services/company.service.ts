import { Prisma } from '@prisma/client';
import prisma from "../db";

export class CompanyService {
    async getCompanies() {
        return prisma.company.findMany({
            include: {
                photos: true,
                certificates: true,
            },
        });
    }

    async getCompanyById(id: number) {
        return prisma.company.findUnique({
            where: { id },
            include: {
                photos: true,
                certificates: true,
            },
        });
    }

    async createCompany(data: Prisma.CompanyCreateInput & {
        photoIds?: number[];
        certificateIds?: number[];
    }) {
        const { photoIds, certificateIds, ...rest } = data;
        console.log(data)
        return prisma.company.create({
            data: {
                ...rest,
                photos: photoIds ? { connect: photoIds.map((id) => ({ id })) } : undefined,
                certificates: certificateIds ? { connect: certificateIds.map((id) => ({ id })) } : undefined,
            },
            include: {
                photos: true,
                certificates: true,
            },
        });
    }

    async updateCompany(
        id: number,
        data: Prisma.CompanyUpdateInput & {
            photoIds?: number[] | null;
            certificateIds?: number[] | null;
        }
    ) {
        const { photoIds, certificateIds, ...rest } = data;

        return prisma.company.update({
            where: { id },
            data: {
                ...rest,
                photos: photoIds === null
                    ? { set: [] } // Очищает все связанные записи
                    : photoIds
                        ? { set: photoIds.map((id) => ({ id })) } // Обновляет список связанных записей
                        : undefined,
                certificates: certificateIds === null
                    ? { set: [] }
                    : certificateIds
                        ? { set: certificateIds.map((id) => ({ id })) }
                        : undefined,
            },
            include: {
                photos: true,
                certificates: true,
            },
        });
    }

    async deleteCompany(id: number) {
        return prisma.company.delete({
            where: { id },
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
