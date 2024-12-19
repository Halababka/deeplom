import { Request, Response } from "express";
import { FileService } from "../services/file.service";

export class FileController {
    // Метод для загрузки нескольких файлов
    static async uploadFiles(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files) {
                res.status(400).send({ message: "Файлы не найдены" });
                return;
            }

            const files = req.files as Express.Multer.File[];

            // Декодируем имена файлов
            const decodedFiles = files.map(file => {
                return {
                    ...file,
                    originalname: decodeURIComponent(file.originalname), // Декодируем имя файла
                    filename: decodeURIComponent(file.filename)
                };
            });

            const filesUpload = await FileService.addFiles(decodedFiles);

            res.status(200).send({ message: "Файлы загружены успешно", files: filesUpload });
        } catch (error: any) {
            res.status(500).send({ message: "Ошибка загрузки файлов", error: error.message });
        }
    }

    // Метод для удаления файла по ID
    static async deleteFile(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await FileService.deleteFileById(Number(id));

            res.status(200).send({ message: "Файл удален" });
        } catch (error: any) {
            res.status(500).send({ message: "Ошибка удаления файла", error: error.message });
        }
    }

    static async deleteMultipleFiles(req: Request, res: Response): Promise<void> {
        try {
            const { ids } = req.body; // Ожидаем массив ID в теле запроса
            if (!Array.isArray(ids)) {
                res.status(400).send({ message: "IDs должны быть массивом" });
                return;
            }

            await Promise.all(ids.map(id => FileService.deleteFileById(Number(id))));
            res.status(200).send({ message: "Файлы удалены" });
        } catch (error: any) {
            res.status(500).send({ message: "Ошибка удаления файлов", error: error.message });
        }
    }

    // Метод для получения списка всех файлов
    static async listFiles(req: Request, res: Response): Promise<void> {
        try {
            const files = await FileService.getAllFiles();
            res.status(200).send(files);
        } catch (error: any) {
            res.status(500).send({ message: "Ошибка получения списка файлов", error: error.message });
        }
    }
}
