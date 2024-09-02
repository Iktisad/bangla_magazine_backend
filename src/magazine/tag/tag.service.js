import { Tag } from "./tag.model.js";
import GenericService from "../shared/generic.service.js";
import {
    BadRequestException,
    ConflictException,
} from "../../exceptions/http.exception.js";
import { isPlainObject } from "../../utils/helper.js";

export default class TagService extends GenericService {
    constructor() {
        super(Tag); // Pass the Tag model to the generic service
    }
    async create(tags) {
        
        // Step 1: Find all existing tags in one query
        const existingTags = await Tag.find({ name: { $in: tags } });
        const existingTagNames = existingTags.map((tag) => tag.name);

        // Step 2: Filter out the tags that already exist
        const newTagNames = tags.filter(
            (name) => !existingTagNames.includes(name)
        );

        // Step 3: Insert the new tags in bulk (if any)
        let newTags = [];
        if (newTagNames.length > 0) {
            // Creating new tags
            newTags = newTagNames.map((name) => ({ name }));
            newTags = await super.create(newTags);
            newTags = isPlainObject(newTags) ? [newTags] : newTags;
        } else {
            // Throw conflict exception if no new tags are created
            throw new ConflictException(
                `No new tags were created. Existing tags: ${existingTagNames.toString()}`
            );
        }

        return { existingTags, newTags }; // Return both arrays in an object
    }
    // Ensure tags exist method
    async ensureTagsExist(tags) {
        const tagIds = [];
        for (const tagName of tags) {
            let tag = await Tag.findOne({ name: tagName });
            if (!tag) {
                tag = await Tag.create({ name: tagName });
                // tag = new Tag({ name: tagName });
                // await tag.save();
            }
            tagIds.push(tag._id);
        }
        return tagIds;
    }
}
