import { Category } from "./category.model.js";
import GenericService from "../shared/generic.service.js";
import { isPlainObject } from "../../utils/helper.js";
import { ConflictException } from "../../exceptions/http.exception.js";

export default class CategoryService extends GenericService {
    constructor() {
        super(Category); // Pass the Category model to the generic service
    }

    // You can add Category-specific methods here if needed
    async create(category) {
        // Step 1: Find all existing tags in one query
        const existingCategories = await Category.find({
            name: { $in: category },
        });
        const existingCategoryNames = existingCategories.map(
            (category) => category.name
        );

        // Step 2: Filter out the category that already exist
        const newCategoryNames = category.filter(
            (name) => !existingCategoryNames.includes(name)
        );

        // Step 3: Insert the new category in bulk (if any)
        let newCategories = [];
        if (newCategoryNames.length > 0) {
            // Creating new category
            newCategories = newCategoryNames.map((name) => ({ name }));
            newCategories = await super.create(newCategories);
            newCategories = isPlainObject(newCategories)
                ? [newCategories]
                : newCategories;
        } else {
            // Throw conflict exception if no new category are created
            throw new ConflictException(
                `No new categories were created. Existing categories: ${existingCategoryNames.toString()}`
            );
        }

        return { existingCategories, newCategories }; // Return both arrays in an object
    }
}
