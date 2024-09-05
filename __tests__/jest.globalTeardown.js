import mongoose from "mongoose";
// await appInstance.stop();
export default async () => {
    console.log("RUNNING JEST GLOBAL TEARDOWN");
    // const collections = global.__MONGOOSE_CONNECTION.connection.collections;
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        if (collections.hasOwnProperty(key)) {
            await collections[key].deleteMany();
        }
    }

    // Disconnect the application from the database

    // if (mongoose.connection.readyState !== 0) {
    console.log("Closing all mongoose connections...");
    await mongoose.disconnect();
    await mongoose.connection.close();
    // await global.__MONGOOSE_CONECTION__.connection.close();
    // }
    // Stop the MongoMemoryServer instance
    if (global.__MONGOD__) {
        console.log("Closing mongodb-memory-server...");
        await global.__MONGOD__.stop();
    }
    console.log("JEST GLOBAL TEARDOWN COMPLETED");
};
