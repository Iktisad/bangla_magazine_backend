import TagService from "./tag.service.js";
import { Tag } from "./models/tag.js";

jest.mock("./models/tag.js");

describe("TagService", () => {
    let tagService;

    beforeEach(() => {
        tagService = new TagService();
        jest.clearAllMocks();
    });

    describe("ensureTagsExist", () => {
        it("should create tags that do not exist and return their IDs", async () => {
            const mockTagIds = ["1", "2", "3"];
            const tags = ["JavaScript", "Node.js", "MongoDB"];

            Tag.findOne.mockImplementation((query) => {
                const tag = tags.find((name) => name === query.name);
                return tag
                    ? { _id: mockTagIds[tags.indexOf(tag)], ...query }
                    : null;
            });
            Tag.prototype.save.mockResolvedValue({ _id: "3", name: "MongoDB" });

            const tagIds = await tagService.ensureTagsExist(tags);

            expect(tagIds).toHaveLength(3);
            expect(Tag.findOne).toHaveBeenCalledTimes(3);
            expect(Tag.prototype.save).toHaveBeenCalledTimes(1);
        });

        it("should return existing tags without creating duplicates", async () => {
            const mockTag = { _id: "1", name: "JavaScript" };
            Tag.findOne
                .mockResolvedValueOnce(mockTag)
                .mockResolvedValueOnce(null);
            Tag.prototype.save.mockResolvedValue({ _id: "2", name: "Node.js" });

            const tags = ["JavaScript", "Node.js"];
            const tagIds = await tagService.ensureTagsExist(tags);

            expect(tagIds).toHaveLength(2);
            expect(tagIds).toEqual(["1", "2"]);
            expect(Tag.findOne).toHaveBeenCalledTimes(2);
            expect(Tag.prototype.save).toHaveBeenCalledTimes(1);
        });

        it("should return an empty array when given an empty array", async () => {
            const tagIds = await tagService.ensureTagsExist([]);
            expect(tagIds).toHaveLength(0);
        });

        it("should handle duplicate tag names in the input array", async () => {
            const mockTag = { _id: "1", name: "JavaScript" };
            Tag.findOne.mockResolvedValue(mockTag);

            const tags = ["JavaScript", "JavaScript"];
            const tagIds = await tagService.ensureTagsExist(tags);

            expect(tagIds).toHaveLength(1);
            expect(Tag.findOne).toHaveBeenCalledTimes(2);
            expect(Tag.prototype.save).toHaveBeenCalledTimes(0);
        });

        it("should throw an error if non-string values are passed", async () => {
            const tags = [123, true, {}];
            await expect(tagService.ensureTagsExist(tags)).rejects.toThrow();
        });

        it("should throw an error if null or undefined values are passed", async () => {
            const tags = [null, undefined];
            await expect(tagService.ensureTagsExist(tags)).rejects.toThrow();
        });
    });

    describe("GenericService methods", () => {
        it("should create a new tag", async () => {
            const newTag = { _id: "1", name: "Express.js" };
            Tag.prototype.save.mockResolvedValue(newTag);

            const createdTag = await tagService.create({ name: "Express.js" });

            expect(createdTag).toEqual(newTag);
            expect(Tag.prototype.save).toHaveBeenCalledTimes(1);
        });

        it("should throw an error when trying to create a tag with missing required fields", async () => {
            Tag.prototype.save.mockRejectedValue(new Error("Validation error"));
            await expect(tagService.create({})).rejects.toThrow(
                "Validation error"
            );
        });

        it("should throw an error when trying to create a duplicate tag", async () => {
            Tag.prototype.save.mockRejectedValue(
                new Error("Duplicate key error")
            );
            await expect(
                tagService.create({ name: "DuplicateTag" })
            ).rejects.toThrow("Duplicate key error");
        });

        it("should find a tag by ID", async () => {
            const mockTag = { _id: "1", name: "React.js" };
            Tag.findById.mockResolvedValue(mockTag);

            const foundTag = await tagService.findById("1");

            expect(foundTag).toEqual(mockTag);
            expect(Tag.findById).toHaveBeenCalledWith("1");
        });

        it("should throw an error when provided an invalid ID format", async () => {
            Tag.findById.mockRejectedValue(
                new Error("Cast to ObjectId failed")
            );
            await expect(tagService.findById("invalid-id")).rejects.toThrow(
                "Cast to ObjectId failed"
            );
        });

        it("should return null when searching for a non-existent ID", async () => {
            Tag.findById.mockResolvedValue(null);

            const foundTag = await tagService.findById("non-existent-id");
            expect(foundTag).toBeNull();
        });

        it("should find all tags", async () => {
            const mockTags = [
                { _id: "1", name: "Vue.js" },
                { _id: "2", name: "Angular" },
            ];
            Tag.find.mockResolvedValue(mockTags);

            const foundTags = await tagService.findAll();
            expect(foundTags).toEqual(mockTags);
            expect(Tag.find).toHaveBeenCalledWith({});
        });

        it("should return tags that match a complex query", async () => {
            const mockTags = [{ _id: "1", name: "React.js" }];
            Tag.find.mockResolvedValue(mockTags);

            const foundTags = await tagService.findAll({ name: /react/i });
            expect(foundTags).toEqual(mockTags);
            expect(Tag.find).toHaveBeenCalledWith({ name: /react/i });
        });

        it("should update a tag by ID", async () => {
            const mockTag = { _id: "1", name: "Svelte" };
            Tag.findByIdAndUpdate.mockResolvedValue(mockTag);

            const updatedTag = await tagService.update("1", { name: "Svelte" });

            expect(updatedTag).toEqual(mockTag);
            expect(Tag.findByIdAndUpdate).toHaveBeenCalledWith(
                "1",
                { name: "Svelte" },
                { new: true }
            );
        });

        it("should throw an error when trying to update with an invalid ID format", async () => {
            Tag.findByIdAndUpdate.mockRejectedValue(
                new Error("Cast to ObjectId failed")
            );
            await expect(
                tagService.update("invalid-id", { name: "NewName" })
            ).rejects.toThrow("Cast to ObjectId failed");
        });

        it("should return null when trying to update a non-existent ID", async () => {
            Tag.findByIdAndUpdate.mockResolvedValue(null);

            const updatedTag = await tagService.update("non-existent-id", {
                name: "NewName",
            });
            expect(updatedTag).toBeNull();
        });

        it("should throw an error when trying to update with invalid data", async () => {
            Tag.findByIdAndUpdate.mockRejectedValue(
                new Error("Validation error")
            );
            await expect(
                tagService.update("1", { name: null })
            ).rejects.toThrow("Validation error");
        });

        it("should delete a tag by ID", async () => {
            const mockTag = { _id: "1", name: "Backbone.js" };
            Tag.findByIdAndDelete.mockResolvedValue(mockTag);

            const deletedTag = await tagService.delete("1");

            expect(deletedTag).toEqual(mockTag);
            expect(Tag.findByIdAndDelete).toHaveBeenCalledWith("1");
        });

        it("should throw an error when trying to delete with an invalid ID format", async () => {
            Tag.findByIdAndDelete.mockRejectedValue(
                new Error("Cast to ObjectId failed")
            );
            await expect(tagService.delete("invalid-id")).rejects.toThrow(
                "Cast to ObjectId failed"
            );
        });

        it("should return null when trying to delete a non-existent ID", async () => {
            Tag.findByIdAndDelete.mockResolvedValue(null);

            const deletedTag = await tagService.delete("non-existent-id");
            expect(deletedTag).toBeNull();
        });
    });
});
