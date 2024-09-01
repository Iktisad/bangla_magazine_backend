import mongoose from "mongoose";
// await appInstance.stop();
export default async () => {
    console.log("RUNNING JEST GLOBAL TEARDOWN");
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        await collections[key].deleteMany();
    }

    // Disconnect the application from the database
    await mongoose.disconnect();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
    // Stop the MongoMemoryServer instance
    if (global.__MONGOD__) {
        await global.__MONGOD__.stop();
    }
    // await mongoServer.stop();
    console.log("JEST GLOBAL TEARDOWN COMPLETED");
};
