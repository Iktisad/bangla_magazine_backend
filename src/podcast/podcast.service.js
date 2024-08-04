import { Podcast } from "./podcast.model.js";

export class PodcastService {
    async createPodcast({
        title,
        description,
        url,
        platform,
        authorId,
        categoryIds,
        tags,
        seo,
    }) {
        const podcast = new Podcast({
            title,
            description,
            url,
            platform,
            authorId,
            categoryIds,
            tags,
            seo,
        });

        await podcast.save();
        return podcast;
    }

    async getPodcastById(podcastId) {
        return Podcast.findById(podcastId)
            .populate("authorId", "username")
            .populate("categoryIds", "name");
    }

    async updatePodcast(podcastId, updates) {
        updates.updatedAt = Date.now();
        return Podcast.findByIdAndUpdate(podcastId, updates, { new: true });
    }

    async deletePodcast(podcastId) {
        return Podcast.findByIdAndDelete(podcastId);
    }

    async getAllPodcasts() {
        return Podcast.find()
            .populate("authorId", "username")
            .populate("categoryIds", "name");
    }
}
