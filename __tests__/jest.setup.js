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
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        await collections[key].deleteMany();
    }

    jest.resetModules(); // Resets the module registry
});
