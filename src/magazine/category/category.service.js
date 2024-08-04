import { Category } from "./category.model.js";

export class CategoryService {
    async createCategory({ name, slug, description }) {
        const category = new Category({
            name,
            slug,
            description,
        });

        await category.save();
        return category;
    }

    async getCategoryById(categoryId) {
        return Category.findById(categoryId);
    }

    async getAllCategories() {
        return Category.find();
    }

    async updateCategory(categoryId, updates) {
        updates.updatedAt = Date.now();
        return Category.findByIdAndUpdate(categoryId, updates, { new: true });
    }

    async deleteCategory(categoryId) {
        return Category.findByIdAndDelete(categoryId);
    }
}
