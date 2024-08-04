import express from "express";
import {
    verifyToken,
    authorizeRoles,
} from "../../users/auth/auth.middleware.js";
const router = express.Router();

export default (artworkController) => {
    router.post(
        "/",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => artworkController.createArtwork(req, res)
    );
    router.get("/:id", (req, res) => artworkController.getArtwork(req, res));
    router.put(
        "/:id",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => artworkController.updateArtwork(req, res)
    );
    router.delete(
        "/:id",
        verifyToken,
        authorizeRoles("editor", "admin"),
        (req, res) => artworkController.deleteArtwork(req, res)
    );
    router.get("/", (req, res) => artworkController.getAllArtworks(req, res));
    return router;
};
