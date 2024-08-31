import fs from "fs";
import nodemailer from "nodemailer";
// Initialize your global variables
global.token = null;
global.mockSendMail = null;
beforeAll(async () => {
    // Ensure nodemailer is properly mocked
    jest.mock("nodemailer");
    jest.mock("multer", () => {
        return jest.fn(() => {
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
    });
    // Mock `fs` methods to prevent actual file system operations
    jest.spyOn(fs, "existsSync").mockReturnValue(true); // Pretend the uploads directory exists
    // Mock `fs.existsSync` and `fs.mkdirSync` methods
    jest.spyOn(fs, "mkdirSync").mockImplementation(() => {}); // Prevent actual directory creation

    // Initialize the mockSendMail function and assign it globally
    global.mockSendMail = jest.fn().mockResolvedValue(true);

    nodemailer.createTransport = jest.fn().mockReturnValue(() => ({
        sendMail: global.mockSendMail,
    }));
});
beforeEach(async () => {
    jest.resetModules(); // Resets the module registry
});

afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
});

afterAll(async () => {
    // await appInstance.stop();
    // const collections = mongoose.connection.collections;
    // for (let key in collections) {
    //     await collections[key].deleteMany();
    // }
    // await appInstance.disconnectDatabase();
    // await mongoServer.stop();
});
