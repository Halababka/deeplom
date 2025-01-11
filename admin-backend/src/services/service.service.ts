import {Service} from '@prisma/client';
import prisma from "../db";

export class ServiceService {
    async getAllServices(): Promise<Service[]> {
        return prisma.service.findMany({include: {category: true}});
    }

    async getServiceById(id: number): Promise<Service | null> {
        return prisma.service.findUnique({where: {id}});
    }

    async createService(data: Omit<Service, 'id'>): Promise<Service> {
        return prisma.service.create({data});
    }

    async updateService(id: number, data: Partial<Omit<Service, 'id'>>): Promise<Service> {
        return prisma.service.update({where: {id}, data});
    }

    async deleteService(id: number): Promise<Service> {
        return prisma.service.delete({where: {id}});
    }

    async deleteServices(ids: number[]) {
        return prisma.service.deleteMany({
            where: {
                id: {
                    in: ids, // Указываем массив идентификаторов для удаления
                },
            },
        });
    }
}