import { BadRequestException } from "../../exceptions/http.exception.js";
import logger from "../../service/logger.service.js";

export default class MediaController {
    constructor(MediaService, TagService) {
        this.mediaService = MediaService;
        this.tagService = TagService;
        this.createMedia = this.createMedia.bind(this);
        this.getAllMedia = this.getAllMedia.bind(this);
        this.getMediaById = this.getMediaById.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
    }

    async createMedia(req, res, next) {
        try {
            // Need to make sure the tags exist or create them
            console.log(req.files);
            // Get file urls
            if (!req.files || req.files.length === 0) {
                throw new BadRequestException("No photos were uploaded!");
            }
            const mediaUrls = req.files.map((file) => file.path);
            req.body.mediaUrls = mediaUrls;

            const tagIds = await this.tagService.ensureTagsExist(
                req.body.hashtags
            );
            req.body.hashtags = tagIds;
            const media = await this.mediaService.createMedia(req.body);
            return res.status(201).json(media);
        } catch (error) {
            if (error instanceof BadRequestException) {
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            }
            next(error);
        }
    }

    async getAllMedia(req, res, next) {
        try {
            const media = await this.mediaService.getAllMedia(req.query); // Pass query params to service
            return res.status(200).json(media);
        } catch (error) {
            // res.status(500).json({ error: error.message });
            next(error);
        }
    }

    async getMediaById(req, res, next) {
        try {
            const media = await this.mediaService.getMediaById(req.params.id);
            return res.status(200).json(media);
        } catch (error) {
            // res.status(500).json({ error: error.message });
            next(error);
        }
    }

    async updateMedia(req, res, next) {
        try {
            const updatedMedia = await this.mediaService.updateMedia(
                req.params.id,
                req.body
            );
            return res.status(200).json(updatedMedia);
        } catch (error) {
            // res.status(500).json({ error: error.message });
            next(error);
        }
    }

    async deleteMedia(req, res, next) {
        try {
            const deletedMedia = await this.mediaService.deleteMedia(
                req.params.id
            );
            return res
                .status(200)
                .json({ message: "Media deleted successfully" });
        } catch (error) {
            // res.status(500).json({ error: error.message });
            next(error);
        }
    }
}
