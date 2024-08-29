export default class GenericService {
    constructor(model) {
        this.model = model;
    }

    // Create a new document
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new Error("Error creating document: " + error.message);
        }
    }

    // Find a document by ID
    async findById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new Error("Error finding document: " + error.message);
        }
    }

    // Find all documents or filter by a query
    async findAll(query = {}) {
        try {
            return await this.model.find(query);
        } catch (error) {
            throw new Error("Error finding documents: " + error.message);
        }
    }

    // Update a document by ID
    async update(id, updateData) {
        try {
            return await this.model.findByIdAndUpdate(id, updateData, {
                new: true,
            });
        } catch (error) {
            throw new Error("Error updating document: " + error.message);
        }
    }

    // Delete a document by ID
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error deleting document: " + error.message);
        }
    }
}
