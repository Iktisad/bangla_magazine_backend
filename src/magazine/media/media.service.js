// /services/media.service.js
import {
    BadRequestException,
    NotFoundException,
} from "../../exceptions/http.exception.js";
import { Media } from "./media.model.js";
import mongoose from "mongoose";

export default class MediaService {
    async createMedia(data) {
        // Ensure mediaUrls is provided and is an array
        if (!data.mediaUrls || !Array.isArray(data.mediaUrls)) {
            throw new BadRequestException("mediaUrls must be an array of URLs");
        }

        // Enforce the limit of 5 media URLs
        if (data.mediaUrls.length > 5) {
            throw new BadRequestException(
                "You cannot upload more than 5 images for a single topic"
            );
        }

        // Create a new media entry
        const newMedia = new Media(data);
        return await newMedia.save();
    }

    async getAllMedia(query) {
        // Building the search criteria dynamically
        let searchCriteria = {};

        // If the query contains a title, we use a regex to search by title
        if (query.title) {
            searchCriteria.title = { $regex: query.title, $options: "i" }; // case-insensitive
        }

        // If the query contains a type (photo, artwork), we filter by type
        if (query.type) {
            searchCriteria.type = query.type;
        }

        // If searching by creator (user), we match the creator's ObjectId
        if (query.creator) {
            if (!mongoose.Types.ObjectId.isValid(query.creator)) {
                throw new BadRequestException("Invalid creator ID format");
            }
            searchCriteria.creator = query.creator;
        }

        // Query the database using the search criteria and populate the references
        return await Media.find(searchCriteria).populate(
            "creator categoryIds tags"
        );
    }

    async getMediaById(id) {
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid media ID format");
        }

        const media = await Media.findById(id).populate(
            "creator categoryIds tags"
        );

        // If no media is found, throw a "not found" error
        if (!media) {
            throw new NotFoundException("Media not found");
        }

        return media;
    }

    async updateMedia(id, data) {
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid media ID format");
        }

        const updatedMedia = await Media.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!updatedMedia) {
            throw new NotFoundException("Media not found for update");
        }

        return updatedMedia;
    }

    async deleteMedia(id) {
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException("Invalid media ID format");
        }

        const deletedMedia = await Media.findByIdAndDelete(id);

        if (!deletedMedia) {
            throw new NotFoundException("Media not found for deletion");
        }

        return deletedMedia;
    }
}
