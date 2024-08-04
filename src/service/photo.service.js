// import AWS from "aws-sdk";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { BadRequestException } from "../exceptions/http.exception.js";
import path from "path";
import fs from "fs";

dotenv.config();

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// });
// const storage = multer.memoryStorage();

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

export class PhotoService {
    uploadSingle() {
        return upload.single("photo");
    }

    // async uploadPhoto(file) {
    // const fileName = `${uuidv4()}-${file.originalname}`;
    // const params = {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: fileName,
    //     Body: file.buffer,
    //     ContentType: file.mimetype,
    //     ACL: "public-read",
    // };

    // const data = await s3.upload(params).promise();
    // return data.Location;
    // return `../../uploads/${fileName}`;
    // }
    localPhotoUpload(file) {
        return `${uploadsDir}/${file.filename}`;
    }
}
