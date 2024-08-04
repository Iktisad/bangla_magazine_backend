import { UserService } from "./users/user.service.js";
import { UserController } from "./users/user.controller.js";
import { EmailService } from "./service/email.service.js";
import { PhotoService } from "./service/photo.service.js";
// import { ArticleService } from "./magazine/article/article.service.js";
// import { ArticleController } from "./magazine/article/article.controller.js";
// import { CategoryController } from "./magazine/category/category.controller.js";
// import { CategoryService } from "./magazine/category/category.service.js";
// import { ArtworkService } from "./magazine/artwork/artwork.service.js";
// import { ArtworkController } from "./magazine/artwork/artwork.controller.js";
// import { PodcastService } from "./podcast/podcast.service.js";
// import { PodcastController } from "./podcast/podcast.controller.js";

class DIContainer {
    constructor() {
        this.services = {};
        this.controllers = {};
        this.initServices();
        this.initControllers();
    }

    initServices() {
        this.services.emailService = new EmailService();
        this.services.photoService = new PhotoService();
        this.services.userService = new UserService();
        // this.services.articleService = new ArticleService();
        // this.services.categoryService = new CategoryService();
        // this.services.artworkService = new ArtworkService();
        // this.services.podcastService = new PodcastService();
    }

    initControllers() {
        this.controllers.userController = new UserController(
            this.services.userService,
            this.services.emailService,
            this.services.photoService
        );

        // this.controllers.articleController = new ArticleController(
        //     this.services.articleService
        // );
        // this.controllers.categoryController = new CategoryController(
        //     this.services.categoryService
        // );
        // this.controllers.artworkController = new ArtworkController(
        //     this.services.artworkService
        // );
        // this.controllers.podcastController = new PodcastController(
        //     this.podcastService
        // );
    }

    getService(serviceName) {
        return this.services[serviceName];
    }

    getController(controllerName) {
        return this.controllers[controllerName];
    }
}

export default new DIContainer();
