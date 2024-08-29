import { Category } from "./category.model.js";
import GenericService from "../shared/generic.service.js";

export default class CategoryService extends GenericService {
    constructor() {
        super(Category); // Pass the Category model to the generic service
    }

    // You can add Category-specific methods here if needed
}
