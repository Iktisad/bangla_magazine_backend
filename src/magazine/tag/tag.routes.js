import express from "express";
import { validateHashtags } from "../shared/category.tag.validator.js";

const router = express.Router();

export default (tagController) => {
    router.post("/", validateHashtags, tagController.createTag);
    router.get("/", tagController.getAllTags);
    router.get("/:id", tagController.getTagById);
    router.put("/:id", tagController.updateTag);
    router.delete("/:id", tagController.deleteTag);

    return router;
};
