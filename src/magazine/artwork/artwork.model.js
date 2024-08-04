import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        description: { type: String },
        imageUrl: { type: String, required: true },
        categoryIds: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        ],
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Artwork = mongoose.model("Artwork", artworkSchema);
