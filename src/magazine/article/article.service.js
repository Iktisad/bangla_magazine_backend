import Article from "./article.model.js";
import { Tag } from "../tags/tags.model.js";
export class ArticleService {
    async createArticle({
        title,
        slug,
        content,
        authorId,
        categoryIds,
        tags,
        coverImage,
    }) {
        const tagIds = await this.ensureTagsExist(tags);
        const article = new Article({
            title,
            slug,
            content,
            authorId,
            categoryIds,
            tags: tagIds,
            coverImage,
        });

        await article.save();
        return article;
    }

    async getArticleById(articleId) {
        return Article.findById(articleId)
            .populate("authorId", "username")
            .populate("categoryIds", "name");
    }

    async updateArticle(articleId, updates) {
        return Article.findByIdAndUpdate(articleId, updates, { new: true });
    }

    async deleteArticle(articleId) {
        return Article.findByIdAndDelete(articleId);
    }

    async getAllArticles() {
        return Article.find()
            .populate("authorId", "username")
            .populate("categoryIds", "name");
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
