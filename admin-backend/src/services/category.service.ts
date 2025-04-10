import prisma from "../db";

export class CategoryService {
    async getAllCategories() {
        return prisma.category.findMany({
            include: {
                children: true,
                services: true,
                doctors: true
            }
        });
    }

    async getCategoryById(id: number) {
        return prisma.category.findUnique({
            where: {id},
            include: {
                children: true,
                parent: true,
                doctors: true
            }
        });
    }

    async createCategory(data: {
        name: string;
        parentId?: number;
        only?: boolean;
        services?: {id: number}[];
        doctorIds?: number[];
    }) {
        return prisma.category.create({
            data: {
                name: data.name,
                parentId: data.parentId,
                only: data.only,
                services: data.services && data.services.length > 0
                    ? {
                        connect: data.services.map(service => ({id: service.id}))
                    }
                    : undefined,
                doctors: data.doctorIds && data.doctorIds.length > 0
                    ? {
                        connect: data.doctorIds.map(id => ({id}))
                    }
                    : undefined
            },
            include: {
                services: true,
                children: true,
                doctors: true
            }
        });
    }

    async updateCategory(
        id: number,
        data: Partial<{name: string; parentId?: number; only?: boolean}>,
        services: {id: number}[] | null,
        doctorIds: number[] | null
    ) {
        return prisma.$transaction(async (prisma) => {
            const updatedCategory = await prisma.category.update({
                where: {id},
                data: {
                    ...data,
                    services: services === null
                        ? {set: []}
                        : services && services.length > 0
                            ? {
                                set: [],
                                connect: services.map(service => ({id: service.id}))
                            }
                            : undefined,
                    doctors: doctorIds === null
                        ? {set: []}
                        : doctorIds && doctorIds.length > 0
                            ? {
                                set: [],
                                connect: doctorIds.map(id => ({id}))
                            }
                            : undefined
                },
                include: {
                    services: true,
                    parent: true,
                    children: true,
                    doctors: true
                }
            });

            return updatedCategory;
        });
    }

    async deleteCategory(id: number) {
        return prisma.category.delete({
            where: { id },
        });
    }

    async deleteCategories(ids: number[]) {
        return prisma.category.deleteMany({
            where: {
                id: {
                    in: ids, // Указываем массив идентификаторов для удаления
                },
            },
        });
    }
}
