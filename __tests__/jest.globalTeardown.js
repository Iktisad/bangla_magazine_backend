import mongoose from "mongoose";
// await appInstance.stop();

export default async () => {
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        await collections[key].deleteMany();
    }
    await global.appInstance.disconnectDatabase();
    await global.__MONGOD__.stop();
    // await mongoServer.stop();
};
