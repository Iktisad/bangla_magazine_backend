import mongoose from "mongoose";
import nodemailer from "nodemailer";
beforeAll(async () => {
    console.log("RUNNING LOCAL JEST SETUP");
    // Ensure that the global connection is used in all test suites
    await mongoose.connect(global.mongoURI);
});
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
