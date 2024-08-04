import express from "express";
import {
    verifyToken,
    authorizeRoles,
} from "../../users/auth/auth.middleware.js";
const router = express.Router();

export default (articleController) => {
    router.post(
        "/",
        verifyToken,
        authorizeRoles("author", "editor", "admin"),
        (req, res) => articleController.createArticle(req, res)
    );
    router.get("/:id", (req, res) => articleController.getArticle(req, res));
    router.put(
        "/:id",
        verifyToken,
        authorizeRoles("author", "editor", "admin"),
        (req, res) => articleController.updateArticle(req, res)
    );
    router.delete(
        "/:id",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => articleController.deleteArticle(req, res)
    );
    router.get("/", (req, res) => articleController.getAllArticles(req, res));
    return router;
};
