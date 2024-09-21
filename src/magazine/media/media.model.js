// /models/media.model.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        mediaUrls: {
            type: [String], // Array of URLs
            validate: [arrayLimit, "{PATH} exceeds the limit of 5"], // Custom validation for 5 images
            required: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        hashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    },
    { timestamps: true }
);

// Custom validation function to limit the number of images
function arrayLimit(val) {
    return val.length <= 5;
}

export const Media = mongoose.model("Media", mediaSchema);
