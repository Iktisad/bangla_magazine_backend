import {
    BadRequestException,
    NotFoundException,
} from "../../exceptions/http.exception.js";

export default class GenericService {
    constructor(model) {
        this.model = model;
    }

    // Create a new document
    async create(data) {
        // Handle array input
        if (Array.isArray(data)) {
            if (data.length > 1) {
                // Ensure all elements are valid objects
                if (!data.every((item) => typeof item === "object")) {
                    throw new BadRequestException(
                        "Invalid data format in array."
                    );
                }
                return await this.model.insertMany(data);
            } else if (data.length === 1) {
                // Destructure single element array
                [data] = data;
            }
        }
        const document = new this.model(data);
        return await document.save();
    }

    // Find a document by ID
    async findById(id) {
        const document = await this.model.findById(id);
        if (!document) throw new NotFoundException();
        return document;
    }

    // Find all documents or filter by a query
    async findAll(query = {}) {
        const document = await this.model.find(query);
        if (!document) throw new NotFoundException();
        return document;
    }

    // Update a document by ID
    async update(id, updateData) {
        const document = await this.model.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!document) throw new NotFoundException();
        return document;
    }

    // Delete a document by ID
    async delete(id) {
        const document = await this.model.findByIdAndDelete(id);
        if (!document) throw new NotFoundException();
        return document;
    }
}
