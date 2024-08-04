import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        url: { type: String, required: true },
        platform: {
            type: String,
            enum: ["YouTube", "SoundCloud", "Instagram", "Facebook"],
            required: true,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryIds: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        ],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],

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

export const Podcast = mongoose.model("Podcast", podcastSchema);
