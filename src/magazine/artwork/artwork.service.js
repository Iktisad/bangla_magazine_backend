import { Artwork } from "./artwork.model.js";

export class ArtworkService {
    async createArtwork({ title, artist, description, imageUrl, categoryIds }) {
        const tagIds = await this.ensureTagsExist(tags);
        const artwork = new Artwork({
            title,
            artist,
            description,
            imageUrl,
            categoryIds,
        });

        await artwork.save();
        return artwork;
    }

    async getArtworkById(artworkId) {
        return Artwork.findById(artworkId).populate("categoryIds", "name");
    }

    async updateArtwork(artworkId, updates) {
        updates.updatedAt = Date.now();
        return Artwork.findByIdAndUpdate(artworkId, updates, { new: true });
    }

    async deleteArtwork(artworkId) {
        return Artwork.findByIdAndDelete(artworkId);
    }

    async getAllArtworks() {
        return Artwork.find().populate("categoryIds", "name");
    }
    // Ensure tags exist method
    async ensureTagsExist(tags) {
        const tagIds = [];
        for (const tagName of tags) {
            let tag = await Tag.findOne({ name: tagName });
            if (!tag) {
                tag = new Tag({ name: tagName });
                await tag.save();
            }
            tagIds.push(tag._id);
        }
        return tagIds;
    }
}
