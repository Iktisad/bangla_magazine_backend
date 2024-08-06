import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import di_container from "./src/di_container.js";
import userRoutes from "./src/users/user.routes.js";
// import articleRoutes from "./src/magazine/article/article.routes.js";
// import categoryRoutes from "./src/magazine/category/category.routes.js";
// import podcastRoutes from "./src/podcast/podcast.routes.js";
import {
    errorLogger,
    requestLogger,
} from "./src/middleware/logger.middleware.js";

dotenv.config();

class App {
    constructor() {
        this.config = {
            PORT: process.env.PORT,
            DB_URL: process.env.DB_URL,
        };
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
        mongoose
            .connect(this.config.DB_URL)
            .then(() => console.log("MongoDB connected..."))
            .catch((err) => console.error(err));
    }
    main() {
        this.app.listen(this.config.PORT, () => {
            console.log(
                "Bangla Web Magazine is Alive On " + process.env.BASE_URL
            );
        });
    }
}

new App();
