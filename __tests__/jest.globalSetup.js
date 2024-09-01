import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongoServer;
export default async () => {
    console.log("Running JEST GLOBAL SETUP");
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
        throw new Error("MongoDB connection failed");
    }
    global.__MONGOD__ = mongoServer;
};
