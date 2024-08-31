// import App from "../src/app.js";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import seedUsers from "../seed/user.seed.js";
// import seedtags from "../seed/tags.seed.js";

// let mongoServer;
// let appInstance;

beforeAll(async () => {
    // mongoServer = await MongoMemoryServer.create();
    // const mongoUri = mongoServer.getUri();
    // // Override the MongoDB connection URL for testing
    // appInstance = new App();
    // global.app = appInstance.app;
    // await appInstance.connectToDatabase(mongoUri);
    // // Ensure the connection is established before proceeding
    // const isConnected = mongoose.connection.readyState === 1;
    // if (!isConnected) {
    //     throw new Error("MongoDB connection failed");
    // }
    // await seedUsers();
    // await seedtags();
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

beforeEach(async () => {});
