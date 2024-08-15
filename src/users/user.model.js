import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    
});

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true, index: true },
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
        resetPasswordToken: { type: String, default: null },
    },
    { timestamps: true }
);

// Compound index for frequent combination queries
userSchema.index({ username: 1, email: 1 });

export const User = mongoose.model("User", userSchema);
