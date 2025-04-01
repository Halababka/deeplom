import prisma from "../db"; // Импорт Prisma клиента
import fs from "fs";
import path from "path";

// Сервис для работы с файлами
export class FileService {
    // Метод для добавления нескольких файлов в базу данных
    static async addFiles(files: Express.Multer.File[]): Promise<any[]> {
        const filePromises = files.map(async (file) => {
            const fileUrl = `/uploads/${file.filename}`;
            const savedFile = await prisma.file.create({
                data: {
                    name: file.originalname, // Оригинальное имя файла
                    url: fileUrl,            // URL файла
                },
            });
            await setTimeout(()=>{}, 3000)
            return savedFile; // Возвращаем сохраненный файл
        });

        return await Promise.all(filePromises); // Возвращаем массив всех сохраненных файлов
    }

    // Метод для удаления файла по его ID
    static async deleteFileById(id: number): Promise<void> {
        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (file) {
            const filePath = path.join(__dirname, `../../uploads/${file.url.split("/uploads/")[1]}`);
            fs.unlinkSync(filePath); // Удаляем файл из файловой системы

            await prisma.file.delete({
                where: { id },
            });
        }
    }

    static async deleteFilesByIds(ids: number[]): Promise<void> {
        const files = await prisma.file.findMany({
            where: { id: { in: ids } },
        });

        for (const file of files) {
            const filePath = path.join(__dirname, `../../uploads/${file.url.split("/uploads/")[1]}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Удаляем файл из файловой системы
            }
        }

        await prisma.file.deleteMany({
            where: { id: { in: ids } },
        });
    }

    // Метод для получения всех файлов
    static async getAllFiles(): Promise<any[]> {
        return await prisma.file.findMany();
    }

    // Метод для обработки открепленных файлов
    static async handleDetachedFiles(oldFileIds: number[], newFileIds: number[]): Promise<void> {
        const detachedFileIds = oldFileIds.filter(id => !newFileIds.includes(id));
        await this.deleteFilesByIds(detachedFileIds);
    }
}
