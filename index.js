import express from "express";
import mongoose from "mongoose";
import di_container from "./src/di_container.js";
import userRoutes from "./src/users/user.routes.js";
// import articleRoutes from "./src/magazine/article/article.routes.js";
// import categoryRoutes from "./src/magazine/category/category.routes.js";
// import podcastRoutes from "./src/podcast/podcast.routes.js";
import { db, port, NODE_ENV } from "./config/config.js";
import {
    errorLogger,
    requestLogger,
} from "./src/middleware/logger.middleware.js";
import logger from "./src/service/logger.service.js";

class App {
    constructor() {
        this.app = express();
        this.initMiddleware();
        this.initRoutes();
        this.connectToDatabase();
        this.main();
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
        //     "/api/articles",
        //     articleRoutes(di_container.getController("articleController"))
        // );
        // this.app.use(
        //     "/api/article-category",
        //     categoryRoutes(di_container.getController("categoryController"))
        // );
        // this.app.use(
        //     "/api/podcast",
        //     podcastRoutes(di_container.getController("podcastController"))
        // );

        //test route
        this.app.get("/", (req, res) => {
            console.log("Hello World!");
            res.send("<h1>Hello World!</h1>");
        });

        this.app.use(errorLogger);
    }
    connectToDatabase() {
        let url = `mongodb://${db.host}:${db.port}/${db.name}`;
        if (NODE_ENV !== "DEV") {
            url = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`;
        }
        mongoose
            .connect(url)
            .then(() =>
                NODE_ENV === "DEV"
                    ? console.log("MongoDB connected...")
                    : logger.info(`MongoDB Connected on port : ${db.port}`)
            )
            .catch((err) =>
                NODE_ENV === "DEV"
                    ? console.error(err)
                    : logger.error(err.message, err)
            );
    }
    main() {
        this.app.listen(port, () => {
            if (NODE_ENV === "DEV") {
                console.log(`Bangla Web Magazine is alive on port: ${port}...`);
                console.log(`Environment: ${NODE_ENV}`);
            } else {
                logger.info(`Bangla Web Magazine is alive on port: ${port}...`);
                logger.info(`Environment: ${NODE_ENV} mode`);
            }
        });
    }
}

new App();
