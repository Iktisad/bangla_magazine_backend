export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;

        // Binding methods to preserve 'this' context when passing them as callbacks
        this.createCategory = this.createCategory.bind(this);
        this.getAllCategories = this.getAllCategories.bind(this);
        this.getCategoryById = this.getCategoryById.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    async createCategory(req, res) {
        try {
            const category = await this.categoryService.create(
                req.body.category
            );
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await this.categoryService.findAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await this.categoryService.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await this.categoryService.update(
                req.params.id,
                req.body
            );
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const category = await this.categoryService.delete(req.params.id);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
