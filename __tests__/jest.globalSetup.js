import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export default async () => {
    console.log("Running JEST GLOBAL SETUP");
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // await mongoose.connect(mongoUri);
    // const isConnected = mongoose.connection.readyState === 1;
    // if (!isConnected) {
    //     throw new Error("MongoDB connection failed");
    // }
    global.__MONGOD__ = mongoServer;
    global.mongoURI = mongoUri;
};
