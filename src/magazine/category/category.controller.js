import {
    ConflictException,
    NotFoundException,
} from "../../exceptions/http.exception";

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

    async createCategory(req, res, next) {
        try {
            const category = await this.categoryService.create(
                req.body.category
            );
            return res.status(201).json(category);
        } catch (error) {
            if (error instanceof ConflictException)
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            next(error);
        }
    }

    async getAllCategories(req, res, next) {
        try {
            const categories = await this.categoryService.findAll();
            return res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const category = await this.categoryService.findById(req.params.id);

            return res.status(200).json(category);
        } catch (error) {
            if (error instanceof NotFoundException) {
                error.message = "Category not found";
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            }
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const category = await this.categoryService.update(
                req.params.id,
                req.body.category
            );

            return res.status(200).json(category);
        } catch (error) {
            if (error instanceof NotFoundException) {
                error.message = "Category not found";
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            }
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const category = await this.categoryService.delete(req.params.id);

            return res
                .status(200)
                .json({ message: "Category deleted successfully", category });
        } catch (error) {
            if (error instanceof NotFoundException) {
                error.message = "Category not found";
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            }
            next(error);
        }
    }
}
