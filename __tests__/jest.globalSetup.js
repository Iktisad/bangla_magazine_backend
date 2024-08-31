import App from "../src/app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;
let appInstance;
export default async () => {
    console.log("Running JEST GLOBAL SETUP");
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    appInstance = new App();

    await appInstance.connectToDatabase(mongoUri);

    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
        throw new Error("MongoDB connection failed");
    }

    global.appInstance = appInstance;
    global.app = appInstance.app;
    global.__MONGOD__ = mongoServer;
};
