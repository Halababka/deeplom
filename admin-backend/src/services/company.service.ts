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

    async createCompany(data: Prisma.CompanyCreateInput) {
        return prisma.company.create({
            data,
        });
    }

    async updateCompany(id: number, data: Prisma.CompanyUpdateInput) {
        return prisma.company.update({
            where: { id },
            data,
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
