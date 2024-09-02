import { Category } from "../../src/magazine/category/category.model.js";
import CategoryService from "../../src/magazine/category/category.service.js";
import {
    BadRequestException,
    NotFoundException,
} from "../../src/exceptions/http.exception.js";
import mongoose from "mongoose";

// Mock the Category model
jest.mock("../../src/magazine/category/category.model.js");

describe("CategoryService", () => {
    let categoryService;

    beforeEach(() => {
        categoryService = new CategoryService();
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create and return new categories", async () => {
            const newCategory = "New Category";
            const mockId = new mongoose.Types.ObjectId();
            console.log(mockId);
            Category.find.mockResolvedValue([]);
            // Mock the creation and saving of a new Category instance
            const mockSave = jest.fn().mockResolvedValue({
                _id: mockId,
                name: newCategory,
            });

            Category.mockImplementation(() => ({
                save: mockSave,
            }));
            const result = await categoryService.create([newCategory]);
            expect(Category.find).toHaveBeenCalledWith({
                name: { $in: [newCategory] },
            });
            // Check that save was called on the new category instance
            expect(mockSave).toHaveBeenCalledTimes(1);
            // Check the structure and content of the returned result
            expect(result.newCategories).toEqual([
                { _id: mockId, name: newCategory },
            ]);
        });

        it("should throw ConflictException if all categories already exist", async () => {
            const existingCategory = {
                _id: new mongoose.Types.ObjectId(),
                name: "Existing Category",
            };
            Category.find.mockResolvedValue([existingCategory]);

            await expect(
                categoryService.create([existingCategory.name])
            ).rejects.toThrow(
                "No new categories were created. Existing categories: Existing Category"
            );
        });
    });

    describe("findById", () => {
        it("should return a category by ID", async () => {
            const category = { _id: "123", name: "Test Category" };
            Category.findById.mockResolvedValue(category);

            const result = await categoryService.findById("123");

            expect(Category.findById).toHaveBeenCalledWith("123");
            expect(result).toEqual(category);
        });

        it("should throw NotFoundException if category is not found", async () => {
            Category.findById.mockResolvedValue(null);

            await expect(categoryService.findById("123")).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe("findAll", () => {
        it("should return all categories", async () => {
            const categories = [{ name: "Category 1" }, { name: "Category 2" }];
            Category.find.mockResolvedValue(categories);

            const result = await categoryService.findAll();

            expect(Category.find).toHaveBeenCalledWith({});
            expect(result).toEqual(categories);
        });

        it("should return categories based on query", async () => {
            const categories = [{ name: "Category 1" }];
            const query = { name: "Category 1" };
            Category.find.mockResolvedValue(categories);

            const result = await categoryService.findAll(query);

            expect(Category.find).toHaveBeenCalledWith(query);
            expect(result).toEqual(categories);
        });
    });

    describe("update", () => {
        it("should update and return the updated category", async () => {
            const updatedCategory = { _id: "123", name: "Updated Category" };
            Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

            const result = await categoryService.update("123", {
                name: "Updated Category",
            });

            expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
                "123",
                { name: "Updated Category" },
                { new: true }
            );
            expect(result).toEqual(updatedCategory);
        });

        it("should throw NotFoundException if category to update is not found", async () => {
            Category.findByIdAndUpdate.mockResolvedValue(null);

            await expect(
                categoryService.update("123", { name: "Updated Category" })
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe("delete", () => {
        it("should delete and return the deleted category", async () => {
            const category = { _id: "123", name: "Category to Delete" };
            Category.findByIdAndDelete.mockResolvedValue(category);

            const result = await categoryService.delete("123");

            expect(Category.findByIdAndDelete).toHaveBeenCalledWith("123");
            expect(result).toEqual(category);
        });

        it("should throw NotFoundException if category to delete is not found", async () => {
            Category.findByIdAndDelete.mockResolvedValue(null);

            await expect(categoryService.delete("123")).rejects.toThrow(
                NotFoundException
            );
        });
    });
});
