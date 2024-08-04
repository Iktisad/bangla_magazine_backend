export class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }

    async createArticle(req, res) {
        try {
            const article = await this.articleService.createArticle(req.body);
            res.status(201).json(article);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getArticle(req, res) {
        try {
            const article = await this.articleService.getArticleById(
                req.params.id
            );
            res.status(200).json(article);
        } catch (error) {
            res.status(404).send("Article not found");
        }
    }

    async updateArticle(req, res) {
        try {
            const updates = req.body;
            const article = await this.articleService.updateArticle(
                req.params.id,
                updates
            );
            res.status(200).json(article);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async deleteArticle(req, res) {
        try {
            await this.articleService.deleteArticle(req.params.id);
            res.status(200).send("Article deleted");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async getAllArticles(req, res) {
        try {
            const articles = await this.articleService.getAllArticles();
            res.status(200).json(articles);
        } catch (error) {
            res.status(500).send("Server error");
        }
    }
}
