import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { BadRequestException } from "../exceptions/http.exception.js";
import path from "path";
import fs from "fs";

const uploadsDir = "uploads";

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${uploadsDir}/`);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
            file.originalname
        )}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            new BadRequestException(
                "File upload only supports the following filetypes - " +
                    filetypes
            )
        );
    },
});

export default class PhotoService {
    static uploadSingleOnDisc(req, res) {
        return new Promise((resolve, reject) => {
            upload.single("photo")(req, res, (err) => {
                if (err) {
                    return reject(err);
                }

                if (req.file) {
                    const imageUrl = `${uploadsDir}/${req.file.filename}`;
                    resolve(imageUrl);
                } else {
                    reject(
                        new BadRequestException(
                            "No file uploaded or invalid file type."
                        )
                    );
                }
            });
        });
    }

    // Multiple file upload
    static uploadMultipleOnDisc(req, res) {
        return new Promise((resolve, reject) => {
            upload.array("photos", 5)(req, res, (err) => {
                if (err) {
                    return reject(err);
                }

                if (req.files && req.files.length > 0) {
                    // Create an array of URLs for each uploaded file
                    const imageUrls = req.files.map((file) => {
                        return `${uploadsDir}/${file.filename}`;
                    });
                    resolve(imageUrls);
                } else {
                    reject(
                        new BadRequestException(
                            "No files uploaded or invalid file types."
                        )
                    );
                }
            });
        });
    }
}
