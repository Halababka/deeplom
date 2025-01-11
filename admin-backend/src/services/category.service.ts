import prisma from "../db";

export class CategoryService {
    async getAllCategories() {
        return prisma.category.findMany({
            include: { children: true, services: true },
        });
    }

    async getCategoryById(id: number) {
        return prisma.category.findUnique({
            where: { id },
            include: { children: true, parent: true },
        });
    }

    async createCategory(data: {
        name: string;
        parentId?: number;
        only?: boolean;
        services?: { id: number }[];
    }) {
        return prisma.category.create({
            data: {
                name: data.name,
                parentId: data.parentId,
                only: data.only,
                services: data.services && data.services.length > 0
                    ? {
                        connect: data.services.map(service => ({ id: service.id }))
                    }
                    : undefined
            },
            include: {
                services: true,
                children: true
            }
        });
    }

    async updateCategory(
        id: number,
        data: Partial<{ name: string; parentId?: number; only?: boolean }>,
        services: { id: number }[] | null
    ) {
        return prisma.$transaction(async (prisma) => {
            // Обновляем категорию
            const updatedCategory = await prisma.category.update({
                where: { id },
                data: {
                    ...data,
                    services: services === null
                        ? { set: [] } // Отвязываем все услуги
                        : services && services.length > 0
                            ? {
                                set: [], // Сначала отвязываем все
                                connect: services.map(service => ({ id: service.id })) // Затем привязываем нужные
                            }
                            : undefined // Не изменяем связи, если services не передан
                },
                include: {
                    services: true,
                    parent: true,
                    children: true
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
