import express from "express";
import { validateCategory } from "../shared/category.tag.validator.js";
const router = express.Router();

export default (categoryController) => {
    router.post("/", validateCategory, categoryController.createCategory);
    router.get("/", categoryController.getAllCategories);
    router.get("/:id", categoryController.getCategoryById);
    router.put("/:id", categoryController.updateCategory);
    router.delete("/:id", categoryController.deleteCategory);

    return router;
};
