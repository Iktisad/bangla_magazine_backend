import mongoose from "mongoose";
import nodemailer from "nodemailer";
beforeAll(async () => {});
beforeEach(async () => {
    nodemailer.createTransport.mockClear();
});

afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
});

afterAll(async () => {
    // await appInstance.stop();
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        await collections[key].deleteMany();
    }
    // await appInstance.disconnectDatabase();
    // await mongoServer.stop();

    jest.resetModules(); // Resets the module registry
});
