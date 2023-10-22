import fs from "fs";
import multer from "multer";

const UPLOAD_DIRECTORY = "uploads/";

if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_DIRECTORY);
}

const multerStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, UPLOAD_DIRECTORY);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split(".").pop();
        const originalFilename = file.originalname.split(".")[0];
        const filename = `${originalFilename}-${uniqueSuffix}.${fileExtension}`;
        cb(null, filename);
    },
});

const uploadFile = multer({
    storage: multerStorage,
});

export default uploadFile;
