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

    async createTag(req, res) {
        try {
            const tag = await this.tagService.create(req.body);
            res.status(201).json(tag);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllTags(req, res) {
        try {
            const tags = await this.tagService.findAll();
            res.status(200).json(tags);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTagById(req, res) {
        try {
            const tag = await this.tagService.findById(req.params.id);
            if (!tag) {
                return res.status(404).json({ error: "Tag not found" });
            }
            res.status(200).json(tag);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateTag(req, res) {
        try {
            const tag = await this.tagService.update(req.params.id, req.body);
            if (!tag) {
                return res.status(404).json({ error: "Tag not found" });
            }
            res.status(200).json(tag);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteTag(req, res) {
        try {
            const tag = await this.tagService.delete(req.params.id);
            if (!tag) {
                return res.status(404).json({ error: "Tag not found" });
            }
            res.status(200).json({ message: "Tag deleted successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
