import {
    ConflictException,
    NotFoundException,
} from "../../exceptions/http.exception.js";
import logger from "../../service/logger.service.js";
export default class TagController {
    constructor(tagService) {
        this.tagService = tagService;

        // Binding methods to preserve 'this' context when passing them as callbacks
        this.createTag = this.createTag.bind(this);
        this.getAllTags = this.getAllTags.bind(this);
        this.getTagById = this.getTagById.bind(this);
        this.updateTag = this.updateTag.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
    }

    async createTag(req, res, next) {
        try {
            const tags = await this.tagService.create(req.body.hashtags);

            return res
                .status(201)
                .send(
                    `${
                        tags.existingTags.length > 0
                            ? "Existing Tags:" + tags.existingTags.toString()
                            : ""
                    } <br> ${
                        tags.newTags.length > 0
                            ? "New Tags Created: " + tags.newTags.toString()
                            : ""
                    }`
                );
        } catch (error) {
            if (error instanceof ConflictException) {
                logger.warn(error.message);
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            }
            next(error);
        }
    }

    async getAllTags(req, res, next) {
        try {
            const tags = await this.tagService.findAll(req.query);
            return res.status(200).json(tags);
        } catch (error) {
            next(error);
        }
    }

    async getTagById(req, res, next) {
        try {
            const tag = await this.tagService.findById(req.params.id);

            return res.status(200).json(tag);
        } catch (error) {
            if (error instanceof NotFoundException) {
                error.message = "Tag not found";
                logger.error(error.message);
                return res
                    .status(error.statusCode)
                    .json({ error: error.message });
            }
            next(error);
        }
    }

    async updateTag(req, res, next) {
        try {
            const tag = await this.tagService.update(req.params.id, req.body);

            return res.status(200).json(tag);
        } catch (error) {
            if (error instanceof NotFoundException) {
                error.message = "Tag not found";
                logger.error(error.message);
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }

    async deleteTag(req, res, next) {
        try {
            const tag = await this.tagService.delete(req.params.id);
            return res
                .status(200)
                .json({ message: "Tag deleted successfully", tag });
        } catch (error) {
            if (error instanceof NotFoundException) {
                error.message = "Tag not found";
                logger.error(error.message);
                return res.status(404).json({ error: error.message });
            }
            next(error);
        }
    }
}
