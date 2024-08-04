export class ArtworkController {
    constructor(artworkService) {
        this.artworkService = artworkService;
    }

    async createArtwork(req, res) {
        try {
            const artwork = await this.artworkService.createArtwork(req.body);
            res.status(201).json(artwork);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getArtwork(req, res) {
        try {
            const artwork = await this.artworkService.getArtworkById(
                req.params.id
            );
            res.status(200).json(artwork);
        } catch (error) {
            res.status(404).send("Artwork not found");
        }
    }

    async updateArtwork(req, res) {
        try {
            const updates = req.body;
            const artwork = await this.artworkService.updateArtwork(
                req.params.id,
                updates
            );
            res.status(200).json(artwork);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deleteArtwork(req, res) {
        try {
            await this.artworkService.deleteArtwork(req.params.id);
            res.status(200).send("Artwork deleted");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getAllArtworks(req, res) {
        try {
            const artworks = await this.artworkService.getAllArtworks();
            res.status(200).json(artworks);
        } catch (error) {
            res.status(500).send("Server error");
        }
    }
}
