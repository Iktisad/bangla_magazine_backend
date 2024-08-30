import { Tag } from "../../src/magazine/tag/tag.model.js";
import TagService from "../../src/magazine/tag/tag.service.js";
import mongoose from "mongoose";
describe("TagService", () => {
    let tagService;

    beforeEach(() => {
        tagService = new TagService();
        jest.clearAllMocks(); // Clear mocks after each test to prevent interference between tests
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to prevent interference between tests
    });
    describe("ensureTagExists", () => {
        it("should create a new tag if it does not exist", async () => {
            const tagNames = ["javascript"];

            // Mock Tag.findOne to return null (tag doesn't exist)
            const findOneMock = jest
                .spyOn(Tag, "findOne")
                .mockResolvedValue(null);

            // Mock the save method on the Tag prototype using mockImplementation
            jest.spyOn(Tag, "create").mockResolvedValue({
                _id: "mocked_id_1",
                name: "javascript",
            });

            // Execute the method
            const tagIds = await tagService.ensureTagsExist(tagNames);

            // Assertions
            expect(findOneMock).toHaveBeenCalledWith({ name: "javascript" });
            expect(Tag.create).toHaveBeenCalled();
            expect(tagIds).toHaveLength(1);
            expect(tagIds[0]).toBe("mocked_id_1"); // Ensure the ID matches exactly
        });

        it("should return the existing tag ID if the tag already exists", async () => {
            const existingTag = { _id: "mocked_id_2", name: "nodejs" };

            // Mock Tag.findOne to return an existing tag
            jest.spyOn(Tag, "findOne").mockResolvedValue(existingTag);

            const tagIds = await tagService.ensureTagsExist(["nodejs"]);
            console.log(tagIds);
            expect(Tag.findOne).toHaveBeenCalledWith({ name: "nodejs" });
            expect(tagIds).toHaveLength(1);
            expect(tagIds[0]).toBe("mocked_id_2");
        });
        it("should create multiple new tags if they do not exist", async () => {
            const tagNames = ["react", "mongodb"];

            // Mock Tag.findOne to return null for each tag (tags don't exist)
            jest.spyOn(Tag, "findOne")
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            // Mock Tag.save to return saved tags with IDs
            const saveMock1 = jest
                .fn()
                .mockResolvedValue({ _id: "mocked_id_3", name: "react" });
            const saveMock2 = jest
                .fn()
                .mockResolvedValue({ _id: "mocked_id_4", name: "mongodb" });
            jest.spyOn(Tag, "create")
                .mockImplementationOnce(saveMock1)
                .mockImplementationOnce(saveMock2);

            const tagIds = await tagService.ensureTagsExist(tagNames);

            expect(Tag.findOne).toHaveBeenCalledWith({ name: "react" });
            expect(Tag.findOne).toHaveBeenCalledWith({ name: "mongodb" });
            expect(saveMock1).toHaveBeenCalled();
            expect(saveMock2).toHaveBeenCalled();
            expect(tagIds).toHaveLength(2);
            expect(tagIds).toContain("mocked_id_3");
            expect(tagIds).toContain("mocked_id_4");
        });
        it("should handle a mix of existing and new tags", async () => {
            const existingTag = { _id: "mocked_id_5", name: "express" };

            // Mock Tag.findOne to return an existing tag for "express", and null for "mongoose"
            jest.spyOn(Tag, "findOne")
                .mockResolvedValueOnce(existingTag)
                .mockResolvedValueOnce(null);

            // Mock Tag.save to return a saved tag for "mongoose" with an ID
            const saveMock = jest
                .fn()
                .mockResolvedValue({ _id: "mocked_id_6", name: "mongoose" });
            jest.spyOn(Tag, "create").mockImplementation(saveMock);

            const tagIds = await tagService.ensureTagsExist([
                "express",
                "mongoose",
            ]);

            expect(Tag.findOne).toHaveBeenCalledWith({ name: "express" });
            expect(Tag.findOne).toHaveBeenCalledWith({ name: "mongoose" });
            expect(saveMock).toHaveBeenCalled();
            expect(tagIds).toHaveLength(2);
            expect(tagIds).toContain("mocked_id_5");
            expect(tagIds).toContain("mocked_id_6");
        });
        it("should return tag IDs in the correct order", async () => {
            const tagNames = ["docker", "kubernetes"];

            // Mock Tag.findOne to return null (tags don't exist)
            jest.spyOn(Tag, "findOne")
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            // Mock Tag.save to return saved tags with IDs
            const saveMock1 = jest
                .fn()
                .mockResolvedValue({ _id: "mocked_id_7", name: "docker" });
            const saveMock2 = jest
                .fn()
                .mockResolvedValue({ _id: "mocked_id_8", name: "kubernetes" });
            jest.spyOn(Tag, "create")
                .mockImplementationOnce(saveMock1)
                .mockImplementationOnce(saveMock2);

            const tagIds = await tagService.ensureTagsExist(tagNames);

            expect(tagIds).toHaveLength(2);
            expect(tagIds[0]).toBe("mocked_id_7");
            expect(tagIds[1]).toBe("mocked_id_8");
        });
        it("should return an empty array if no tags are provided", async () => {
            const tagIds = await tagService.ensureTagsExist([]);

            expect(tagIds).toHaveLength(0);
        });
    });
    describe("create()", () => {
        it("should create a new document", async () => {
            const mockTagData = { name: "javascript" };
            const mockTagId = new mongoose.Types.ObjectId();

            jest.spyOn(Tag.prototype, "save").mockImplementation(function () {
                this._id = mockTagId;
                return Promise.resolve(this);
            });

            const result = await tagService.create(mockTagData);

            expect(result).toBeDefined();
            expect(result.name).toBe(mockTagData.name);
            expect(result._id).toBe(mockTagId);
        });

        it("should throw an error if create fails", async () => {
            const mockTagData = { name: "javascript" };

            jest.spyOn(Tag.prototype, "save").mockImplementation(() => {
                throw new Error("Save failed");
            });

            await expect(tagService.create(mockTagData)).rejects.toThrow(
                "Error creating document: Save failed"
            );
        });
    });

    describe("findById()", () => {
        it("should find a document by ID", async () => {
            const mockTagId = new mongoose.Types.ObjectId();
            const mockTag = { _id: mockTagId, name: "javascript" };

            jest.spyOn(Tag, "findById").mockResolvedValue(mockTag);

            const result = await tagService.findById(mockTagId);

            expect(result).toBeDefined();
            expect(result._id).toBe(mockTagId);
            expect(result.name).toBe(mockTag.name);
        });

        it("should throw an error if find by ID fails", async () => {
            const mockTagId = new mongoose.Types.ObjectId();

            jest.spyOn(Tag, "findById").mockImplementation(() => {
                throw new Error("Find by ID failed");
            });

            await expect(tagService.findById(mockTagId)).rejects.toThrow(
                "Error finding document: Find by ID failed"
            );
        });
    });

    describe("findAll()", () => {
        it("should find all documents or filter by a query", async () => {
            const mockTags = [
                { _id: new mongoose.Types.ObjectId(), name: "javascript" },
                { _id: new mongoose.Types.ObjectId(), name: "nodejs" },
            ];

            jest.spyOn(Tag, "find").mockResolvedValue(mockTags);

            const result = await tagService.findAll();

            expect(result).toHaveLength(mockTags.length);
            expect(result[0].name).toBe("javascript");
            expect(result[1].name).toBe("nodejs");
        });

        it("should throw an error if find fails", async () => {
            jest.spyOn(Tag, "find").mockImplementation(() => {
                throw new Error("Find failed");
            });

            await expect(tagService.findAll()).rejects.toThrow(
                "Error finding documents: Find failed"
            );
        });
    });

    describe("update()", () => {
        it("should update a document by ID", async () => {
            const mockTagId = new mongoose.Types.ObjectId();
            const updateData = { name: "typescript" };
            const mockUpdatedTag = { _id: mockTagId, name: "typescript" };

            jest.spyOn(Tag, "findByIdAndUpdate").mockResolvedValue(
                mockUpdatedTag
            );

            const result = await tagService.update(mockTagId, updateData);

            expect(result).toBeDefined();
            expect(result._id).toBe(mockTagId);
            expect(result.name).toBe(updateData.name);
        });

        it("should throw an error if update fails", async () => {
            const mockTagId = new mongoose.Types.ObjectId();
            const updateData = { name: "typescript" };

            jest.spyOn(Tag, "findByIdAndUpdate").mockImplementation(() => {
                throw new Error("Update failed");
            });

            await expect(
                tagService.update(mockTagId, updateData)
            ).rejects.toThrow("Error updating document: Update failed");
        });
    });

    describe("delete()", () => {
        it("should delete a document by ID", async () => {
            const mockTagId = new mongoose.Types.ObjectId();

            jest.spyOn(Tag, "findByIdAndDelete").mockResolvedValue({
                _id: mockTagId,
            });

            const result = await tagService.delete(mockTagId);

            expect(result).toBeDefined();
            expect(result._id).toBe(mockTagId);
        });

        it("should throw an error if delete fails", async () => {
            const mockTagId = new mongoose.Types.ObjectId();

            jest.spyOn(Tag, "findByIdAndDelete").mockImplementation(() => {
                throw new Error("Delete failed");
            });

            await expect(tagService.delete(mockTagId)).rejects.toThrow(
                "Error deleting document: Delete failed"
            );
        });
    });
});
