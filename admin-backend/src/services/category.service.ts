import prisma from "../db";

export class CategoryService {
    async getAllCategories() {
        return prisma.category.findMany({
            include: { children: true },
        });
    }

    async getCategoryById(id: number) {
        return prisma.category.findUnique({
            where: { id },
            include: { children: true, parent: true },
        });
    }

    async createCategory(data: { name: string; parentId?: number; only?: boolean }) {
        return prisma.category.create({
            data,
        });
    }

    async updateCategory(id: number, data: Partial<{ name: string; parentId?: number; only?: boolean }>) {
        return prisma.category.update({
            where: { id },
            data,
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
