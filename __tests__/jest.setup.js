import App from "../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import seedUsers from "../seed/user.seed.js";

let mongoServer;
let appInstance;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Override the MongoDB connection URL for testing

    appInstance = new App();
    global.app = appInstance.app;
    await appInstance.connectToDatabase(mongoUri);
    await seedUsers();
});

afterAll(async () => {
    // await appInstance.stop();
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        await collections[key].deleteMany();
    }
    await appInstance.disconnectDatabase();
    await mongoServer.stop();
});

beforeEach(async () => {});
