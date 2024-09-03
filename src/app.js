import express from "express";
import mongoose from "mongoose";
import di_container from "./di_container.js";
import userRoutes from "./users/user.routes.js";
import tagRoutes from "./magazine/tag/tag.routes.js";
// import articleRoutes from './src/magazine/article/article.routes.js';
import categoryRoutes from "./magazine/category/category.routes.js";
// import podcastRoutes from './src/podcast/podcast.routes.js';
import { errorLogger, requestLogger } from "./middleware/logger.middleware.js";
import logger from "./service/logger.service.js";

export default class App {
    constructor() {
        this.app = express();
        this.initMiddleware();
        this.initRoutes();
    }

    initMiddleware() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    initRoutes() {
        this.app.use(requestLogger);
        this.app.use(
            "/api/users",
            userRoutes(di_container.getController("userController"))
        );
        // this.app.use(
        //     "/api/categories",
        //     userRoutes(di_container.getController("categoryController"))
        // );
        this.app.use(
            "/api/tags",
            tagRoutes(di_container.getController("tagController"))
        );
        this.app.use(
            "/api/category",
            categoryRoutes(di_container.getController("categoryController"))
        );
        // this.app.use(
        //     '/api/articles',
        //     articleRoutes(di_container.getController('articleController'))
        // );
        // this.app.use(
        //     '/api/podcast',
        //     podcastRoutes(di_container.getController('podcastController'))
        // );

        // Test route
        this.app.get("/", (req, res) => {
            res.send("<h1>Hello World!</h1>");
        });

        this.app.use(errorLogger);
    }

    async connectToDatabase(uri) {
        try {
            await mongoose.connect(uri);
            logger.info(`MongoDB Connected : ${uri}`);
        } catch (err) {
            logger.error(err.message, err);
            throw new Error("Failed to connect to database");
        }
    }
    async disconnectDatabase() {
        try {
            await mongoose.disconnect();
            logger.info(`MongoDB Disconnected`);
        } catch (err) {
            logger.error(err.message, err);
            throw new Error("Failed to Disonnect database");
        }
    }

    async start(port) {
        this.server = this.app.listen(port, () => {
            logger.info(`Bangla Web Magazine is alive on port: ${port}...`);
        });

        await new Promise((resolve) => this.server.once("listening", resolve));
    }

    async stop() {
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server.close((err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    }
}
