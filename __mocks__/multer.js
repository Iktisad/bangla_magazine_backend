// src/__mocks__/multer.js

const multer = jest.fn(() => {
    return {
        single: jest.fn(() => (req, res, next) => {
            req.file = {
                filename: "mocked-image.jpg",
                originalname: "test-image.jpg",
                mimetype: "image/jpeg",
                size: 1024,
            };
            next();
        }),
    };
});

multer.diskStorage = jest.fn(() => {
    return {
        _handleFile: jest.fn((req, file, cb) => {
            cb(null, {
                path: "mocked-path/mocked-image.jpg",
                size: 1024,
            });
        }),
        _removeFile: jest.fn((req, file, cb) => {
            cb(null);
        }),
    };
});

export default multer;
