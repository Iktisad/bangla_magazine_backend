import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["text", "image", "video", "quote", "code"],
        },
        data: mongoose.Schema.Types.Mixed, // Store any data type, allowing flexibility
    },
    { _id: false }
);

const articleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: [contentBlockSchema], // Array of content blocks
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryIds: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        ],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
        coverImage: { type: String },
        status: {
            type: String,
            default: "draft",
            enum: ["draft", "review", "published"],
        },
        views: { type: Number, default: 0 },
        seo: {
            metaTitle: { type: String },
            metaDescription: { type: String },
            keywords: [String],
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Article = mongoose.model("Article", articleSchema);
