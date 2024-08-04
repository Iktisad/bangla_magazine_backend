import express from "express";
const router = express.Router();

export default (categoryController) => {
    router.post("/", (req, res) => categoryController.createCategory(req, res));
    router.get("/:id", (req, res) => categoryController.getCategory(req, res));
    router.put("/:id", (req, res) =>
        categoryController.updateCategory(req, res)
    );
    router.delete("/:id", (req, res) =>
        categoryController.deleteCategory(req, res)
    );
    router.get("/", (req, res) =>
        categoryController.getAllCategories(req, res)
    );
    return router;
};
