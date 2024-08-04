import express from "express";
import { verifyToken, authorizeRoles } from "../users/auth/auth.middleware.js";
const router = express.Router();

export default (podcastController) => {
    router.post(
        "/",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => podcastController.createPodcast(req, res)
    );
    router.get("/:id", (req, res) => podcastController.getPodcast(req, res));
    router.put(
        "/:id",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => podcastController.updatePodcast(req, res)
    );
    router.delete(
        "/:id",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => podcastController.deletePodcast(req, res)
    );
    router.get("/", (req, res) => podcastController.getAllPodcasts(req, res));
    return router;
};
