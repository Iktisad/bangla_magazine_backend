export class PodcastController {
    constructor(podcastService) {
        this.podcastService = podcastService;
    }

    async createPodcast(req, res) {
        try {
            const podcast = await this.podcastService.createPodcast(req.body);
            res.status(201).json(podcast);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getPodcast(req, res) {
        try {
            const podcast = await this.podcastService.getPodcastById(
                req.params.id
            );
            res.status(200).json(podcast);
        } catch (error) {
            res.status(404).send("Podcast not found");
        }
    }

    async updatePodcast(req, res) {
        try {
            const updates = req.body;
            const podcast = await this.podcastService.updatePodcast(
                req.params.id,
                updates
            );
            res.status(200).json(podcast);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deletePodcast(req, res) {
        try {
            await this.podcastService.deletePodcast(req.params.id);
            res.status(200).send("Podcast deleted");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getAllPodcasts(req, res) {
        try {
            const podcasts = await this.podcastService.getAllPodcasts();
            res.status(200).json(podcasts);
        } catch (error) {
            res.status(500).send("Server error");
        }
    }
}
