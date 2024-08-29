import { Tag } from "./models/tag.js";
import GenericService from "../shared/generic.service.js";

export default class TagService extends GenericService {
    constructor() {
        super(Tag); // Pass the Tag model to the generic service
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
