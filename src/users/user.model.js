import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        dob: { type: Date },
        role: {
            type: String,
            default: "contributor",
            enum: ["admin", "social_manager", "editor", "contributor"],
        },
        profile: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            bio: { type: String },
            profilePicture: { type: String },
            contactEmail: [{ type: String, unique: true }],
            socialLinks: {
                linkedin: { type: String },
                twitter: { type: String },
                facebook: { type: String },
                instagram: { type: String },
            },
        },
        isActive: { type: Boolean, default: false },
        verificationToken: { type: String, default: null },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
