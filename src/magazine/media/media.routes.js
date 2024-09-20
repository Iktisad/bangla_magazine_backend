// /routes/media.routes.js
import express from "express";

const router = express.Router();
export default (mediaController) => {
    // Create new media (photo or artwork)
    router.post("/", mediaController.createMedia);

    // Get all media
    router.get("/", mediaController.getAllMedia);

    // Get media by ID
    router.get("/:id", mediaController.getMediaById);

    // Update media by ID
    router.put("/:id", mediaController.updateMedia);

    // Delete media by ID
    router.delete("/:id", mediaController.deleteMedia);

    return router;
};
