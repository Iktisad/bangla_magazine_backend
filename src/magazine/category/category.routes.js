import express from "express";
const router = express.Router();

export default (categoryController) => {
    router.post("/", categoryController.createCategory);
    router.get("/", categoryController.getAllCategories);
    router.get("/:id", categoryController.getCategoryById);
    router.put("/:id", categoryController.updateCategory);
    router.delete("/:id", categoryController.deleteCategory);

    return router;
};
