import { BadRequestException } from "../../exceptions/http.exception";
import logger from "../../service/logger.service";
import PhotoService from "../../service/photo.service";

export default class MediaController {
    constructor(MediaService) {
        this.mediaService = new MediaService();
        this.createMedia = this.createMedia.bind(this);
        this.getAllMedia = this.getAllMedia.bind(this);
        this.getMediaById = this.getMediaById.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
    }

    async createMedia(req, res, next) {
        try {
            const mediaUrls = PhotoService.uploadMultipleOnDisc(req, res);
            req.body.mediaUrls = mediaUrls;
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
