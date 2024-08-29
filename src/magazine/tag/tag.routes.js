import express from "express";

const router = express.Router();

export default (tagController) => {
    router.post("/", tagController.createTag);
    router.get("/", tagController.getAllTags);
    router.get("/:id", tagController.getTagById);
    router.put("/:id", tagController.updateTag);
    router.delete("/:id", tagController.deleteTag);

    return router;
};
