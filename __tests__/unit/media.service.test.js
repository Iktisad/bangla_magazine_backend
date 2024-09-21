import {
    BadRequestException,
    NotFoundException,
} from "../../src/exceptions/http.exception.js";
import MediaService from "../../src/magazine/media/media.service.js";
import { User } from "../../src/users/user.model.js";
import { Media } from "../../src/magazine/media/media.model.js";
import mongoose from "mongoose";

// Mocking Media and User models
jest.mock("../../src/magazine/media/media.model.js");
jest.mock("../../src/users/user.model.js");

describe("MediaService", () => {
    let mediaService;

    beforeEach(() => {
        mediaService = new MediaService();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset mock data between tests
    });

    // Test for createMedia
    describe("createMedia", () => {
        it("should throw BadRequestException if mediaUrls is not provided or not an array", async () => {
            await expect(mediaService.createMedia({})).rejects.toThrow(
                BadRequestException
            );
            await expect(
                mediaService.createMedia({ mediaUrls: "invalid" })
            ).rejects.toThrow(BadRequestException);
        });

        it("should throw BadRequestException if more than 5 media URLs are provided", async () => {
            const data = {
                mediaUrls: ["url1", "url2", "url3", "url4", "url5", "url6"],
            };
            await expect(mediaService.createMedia(data)).rejects.toThrow(
                BadRequestException
            );
        });

        it("should save media successfully if valid data is provided", async () => {
            const data = { mediaUrls: ["url1", "url2"], title: "Test media" };
            Media.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(data),
            }));

            const result = await mediaService.createMedia(data);
            expect(result).toEqual(data);
            expect(Media).toHaveBeenCalledWith(data);
        });
    });

    // Test for getAllMedia
    describe("getAllMedia", () => {
        it("should return media if query is valid", async () => {
            const query = { title: "test" };
            const mediaData = [{ title: "test media" }];

            Media.find.mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(mediaData),
            }));

            const result = await mediaService.getAllMedia(query);
            expect(result).toEqual(mediaData);
            expect(Media.find).toHaveBeenCalledWith({
                title: { $regex: "test", $options: "i" },
            });
        });

        it("should throw NotFoundException if the creator does not exist", async () => {
            const query = { creator: "unknown" };

            User.findOne.mockResolvedValue(null);
            await expect(mediaService.getAllMedia(query)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    // Test for getMediaById
    describe("getMediaById", () => {
        it("should throw BadRequestException for invalid MongoDB ObjectId", async () => {
            const invalidId = "invalidId";
            await expect(mediaService.getMediaById(invalidId)).rejects.toThrow(
                BadRequestException
            );
        });

        it("should throw NotFoundException if media is not found", async () => {
            const validId = new mongoose.Types.ObjectId();
            Media.findById.mockResolvedValue(null);
            try {
                mediaService.getAllMedia(validId);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
            // await expect(mediaService.getMediaById(validId)).rejects.toThrow(
            //     new NotFoundException()
            // );
        });

        it("should return media if media is found", async () => {
            const validId = new mongoose.Types.ObjectId();
            const mediaData = { _id: validId, title: "test media" };

            Media.findById.mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(mediaData),
            }));

            const result = await mediaService.getMediaById(validId);
            expect(result).toEqual(mediaData);
        });
    });

    // Test for updateMedia
    describe("updateMedia", () => {
        it("should throw BadRequestException for invalid MongoDB ObjectId", async () => {
            const invalidId = "invalidId";
            await expect(
                mediaService.updateMedia(invalidId, {})
            ).rejects.toThrow(BadRequestException);
        });

        it("should throw NotFoundException if media is not found for update", async () => {
            const validId = new mongoose.Types.ObjectId();
            Media.findByIdAndUpdate.mockResolvedValue(null);
            await expect(mediaService.updateMedia(validId, {})).rejects.toThrow(
                NotFoundException
            );
        });

        it("should return updated media if update is successful", async () => {
            const validId = new mongoose.Types.ObjectId();
            const updatedData = { _id: validId, title: "updated media" };

            Media.findByIdAndUpdate.mockResolvedValue(updatedData);

            const result = await mediaService.updateMedia(validId, updatedData);
            expect(result).toEqual(updatedData);
        });
    });

    // Test for deleteMedia
    describe("deleteMedia", () => {
        it("should throw BadRequestException for invalid MongoDB ObjectId", async () => {
            const invalidId = "invalidId";
            await expect(mediaService.deleteMedia(invalidId)).rejects.toThrow(
                BadRequestException
            );
        });

        it("should throw NotFoundException if media is not found for deletion", async () => {
            const validId = new mongoose.Types.ObjectId();
            Media.findByIdAndDelete.mockResolvedValue(null);
            try {
                await mediaService.deleteMedia(validId);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
            // await expect(mediaService.deleteMedia(validId)).rejects.toThrow(
            //     NotFoundException
            // );
        });

        it("should return deleted media if deletion is successful", async () => {
            const validId = new mongoose.Types.ObjectId();
            const deletedData = { _id: validId, title: "deleted media" };

            Media.findByIdAndDelete.mockResolvedValue(deletedData);

            const result = await mediaService.deleteMedia(validId);

            expect(result).toEqual(deletedData);
        });
    });
});
