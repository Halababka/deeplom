import multer from "multer";
import path from "path";


// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});

// Ограничение по типу файлов
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        // @ts-ignore
        cb(new Error("Только изображения разрешены!"), false);
    }
};

export const uploadMiddleware = multer({ storage, fileFilter });
