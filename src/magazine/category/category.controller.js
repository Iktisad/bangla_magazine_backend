export class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    async createCategory(req, res) {
        try {
            const category = await this.categoryService.createCategory(
                req.body
            );
            res.status(201).json(category);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getCategory(req, res) {
        try {
            const category = await this.categoryService.getCategoryById(
                req.params.id
            );
            res.status(200).json(category);
        } catch (error) {
            res.status(404).send("Category not found");
        }
    }

    async updateCategory(req, res) {
        try {
            const updates = req.body;
            const category = await this.categoryService.updateCategory(
                req.params.id,
                updates
            );
            res.status(200).json(category);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deleteCategory(req, res) {
        try {
            await this.categoryService.deleteCategory(req.params.id);
            res.status(200).send("Category deleted");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).send("Server error");
        }
    }
}
